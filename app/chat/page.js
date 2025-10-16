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

  // Fetch minimal user context (if signed in)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { supabase } = await import("../../lib/supabase"); // ✅ FIXED PATH
        const { data: { user } } = await supabase.auth.getUser();
        if (!mounted || !user) return;

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

        if (messages.length === 1 && messages[0].role === "assistant" && (appUser?.name || user.user_metadata?.name)) {
          setMessages([
            { role: "assistant", content: `Hi ${appUser?.name || user.user_metadata?.name}, I’m Nio — your Genio assistant. How can I help today?` },
          ]);
        }
      } catch {
        // ignore if unauthenticated
      }
    })();
    return () => { mounted = false; };
  }, []); // eslint-disable-line

  // Auto-scroll to bottom on update
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  // Focus input after send
  useEffect(() => {
    const el = inputRef.current;
    if (el) el.setSelectionRange(el.value.length, el.value.length);
  }, [busy]);

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  }

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    setError("");
    setBusy(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.filter((m) => m.role !== "system"),
          user: userCtx || undefined,
          source: "nio",
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Request failed");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? "" }]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  const placeholder = useMemo(() => (busy ? "Nio is typing…" : "Type your message…"), [busy]);

  return (
    <div className="nio-wrap">
      <header className="nio-bar">
        <button className="nio-back" onClick={goBack}>←</button>
        <div className="nio-title">
          <span className="nio-title-neon">Nio</span>
          <span className="nio-title-muted"> · Genio assistant</span>
        </div>
      </header>

      <main className="nio-thread" ref={threadRef}>
        {messages.map((m, i) => (
          <div key={i} className={`nio-bubble ${m.role === "user" ? "is-user" : "is-assistant"}`}>
            {m.content}
          </div>
        ))}
        {busy && <div className="nio-bubble is-assistant">Typing…</div>}
      </main>

      <form className="nio-composer" onSubmit={sendMessage}>
        <input
          ref={inputRef}
         
