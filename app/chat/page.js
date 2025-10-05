// File: app/chat/page.js
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NioChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState(() => [
    { role: "assistant", content: "Hi, I’m Nio — your Genio assistant. How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [userCtx, setUserCtx] = useState(null);
  const threadRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    document.title = "Nio — Genio assistant";
  }, []);

  // Fetch minimal user context (if signed in) without breaking if not available
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { supabase } = await import("@/lib/supabase");
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted || !user) return;
        // Optional: fetch display name from your app_users table
        const { data: appUser } = await supabase
          .from("app_users")
          .select("name")
          .eq("id", user.id)
          .single();
        if (!mounted) return;
        setUserCtx({
          id: user.id,
          email: user.email || "",
          name: appUser?.name || user.user_metadata?.name || "",
        });
        // If you want to greet by name on first load (non-destructive):
        if (messages.length === 1 && messages[0].role === "assistant" && (appUser?.name || user.user_metadata?.name)) {
          setMessages((prev) => [
            { role: "assistant", content: `Hi ${appUser?.name || user.user_metadata?.name}, I’m Nio — your Genio assistant. How can I help today?` },
          ]);
        }
      } catch {
        // ignore if unauth or supabase not ready on client
      }
    })();
    return () => { mounted = false; };
  }, []); // eslint-disable-line

  // Auto-scroll to bottom on update
  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  // Improve mobile typing UX
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    // Place caret at end when focusing after send
    el.setSelectionRange(el.value.length, el.value.length);
  }, [busy]);

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    setError("");
    setBusy(true);

    // optimistic UI
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.filter((m) => m.role !== "system"),
          user: userCtx || undefined,   // pass minimal context if available
          source: "nio",                // identify Nio client
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Request failed");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "" },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  const placeholder = useMemo(
    () => (busy ? "Nio is typing…" : "Type your message…"),
    [busy]
  );

  return (
    <div className="nio-wrap">
      {/* Top bar */}
      <header className="nio-bar">
        <button className="nio-back" onClick={goBack} aria-label="Go back">←</button>
        <div className="nio-title">
          <span className="nio-title-neon">Nio</span>
          <span className="nio-title-muted"> · Genio assistant</span>
        </div>
      </header>

      {/* Thread */}
      <main className="nio-thread" ref={threadRef}>
        {messages.map((m, i) => (
          <div key={i} className={`nio-bubble ${m.role === "user" ? "is-user" : "is-assistant"}`}>
            {m.content}
          </div>
        ))}
        {busy && <div className="nio-bubble is-assistant">Typing…</div>}
      </main>

      {/* Composer */}
      <form className="nio-composer" onSubmit={sendMessage}>
        <input
          ref={inputRef}
          className="nio-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={busy}
          autoFocus
          autoComplete="off"
          inputMode="text"
        />
        <button className="nio-send" type="submit" disabled={busy || !input.trim()}>
          Send
        </button>
      </form>

      {error && <div className="nio-error">Error: {error}</div>}

      <style jsx>{`
        .nio-wrap {
          min-height: 100vh;
          background: #0d1b2a;
          color: #e6f0ff;
          display: grid;
          grid-template-rows: auto 1fr auto;
        }

        /* Top bar */
        .nio-bar {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 12px;
          background: rgba(8, 16, 28, 0.85);
          backdrop-filter: saturate(140%) blur(10px);
          border-bottom: 1px solid #1f2c44;
        }
        .nio-back {
          appearance: none;
          background: #0f1828;
          border: 1px solid #223145;
          color: #d7e7ff;
          border-radius: 10px;
          padding: 8px 10px;
          cursor: pointer;
        }
        .nio-title {
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nio-title-neon {
          background: linear-gradient(135deg, #20e3b2, #6fc3ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(111,195,255,.35);
        }
        .nio-title-muted { color: #a7b7c8; font-weight: 600; }

        /* Thread */
        .nio-thread {
          padding: 14px 12px 8px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .nio-bubble {
          padding: 10px 12px;
          border-radius: 12px;
          line-height: 1.4;
          white-space: pre-wrap;
          word-break: break-word;
          max-width: 90%;
          border: 1px solid #223145;
        }
        .is-assistant {
          align-self: flex-start;
          background: #0f1b33;
        }
        .is-user {
          align-self: flex-end;
          background: #1f6feb;
          border-color: #1a57c9;
        }

        /* Composer */
        .nio-composer {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px;
          padding: 10px 12px 14px;
          border-top: 1px solid #1f2c44;
          background: #0b1526;
          position: sticky;
          bottom: 0;
        }
        .nio-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #334155;
          background: #101b30;
          color: #e6f0ff;
          outline: none;
        }
        .nio-input::placeholder {
          color: #99aac4;
        }
        .nio-input:focus {
          border-color: #3f86ff;
          box-shadow: 0 0 0 3px #3f86ff33;
        }
        .nio-send {
          padding: 12px 16px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #20e3b2, #6fc3ff);
          color: #071018;
          font-weight: 800;
          cursor: pointer;
        }
        .nio-send:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* Error */
        .nio-error {
          margin: 8px 12px 12px;
          color: #fecaca;
          font-size: 14px;
        }

        /* Mobile tweaks */
        @media (max-width: 560px) {
          .nio-bubble { max-width: 92%; }
          .nio-send { padding: 12px 14px; }
        }
      `}</style>
    </div>
  );
}
