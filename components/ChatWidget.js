// components/ChatWidget.js
import { useEffect, useRef, useState } from "react";

export default function ChatWidget({ initialGreeting = "Hi, I'm your AI Twin. I'm here to help. Ask me anything before you sign up." }) {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: initialGreeting, id: "greet" },
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text) return;
    const userMsg = { role: "user", content: text, id: `u-${Date.now()}` };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // Try backend first; fall back to a local smart reply if backend is unavailable
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 8000);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });
      clearTimeout(t);

      let replyText = "";
      if (res.ok) {
        const data = await res.json();
        // Accept multiple common shapes
        replyText =
          data.reply ||
          data.message ||
          data?.choices?.[0]?.message?.content ||
          "Thanks — noted.";
      } else {
        replyText = smartLocalReply(text);
      }

      setMessages((m) => [
        ...m,
        { role: "assistant", content: replyText, id: `a-${Date.now()}` },
      ]);
    } catch {
      const replyText = smartLocalReply(text);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: replyText, id: `a-${Date.now()}` },
      ]);
    }
  }

  function smartLocalReply(text) {
    const s = text.toLowerCase();
    if (s.includes("price") || s.includes("cost")) {
      return "We’ll share pricing after sign up. Create your account to see plans and usage details.";
    }
    if (s.includes("how") && s.includes("work")) {
      return "Your Twin mirrors your tone and routines. Start by writing your style, add a short voice clip, and we’ll simulate it locally. Nothing is shared outside our system.";
    }
    if (s.includes("privacy") || s.includes("data")) {
      return "Your raw data stays inside Genio. We don’t share phone numbers or media. You control consents in your dashboard.";
    }
    if (s.includes("create") || s.includes("start")) {
      return "Tap “Create My Twin” to begin. I’ll guide you step-by-step.";
    }
    return "Got it. Would you like me to walk you through creating your Twin now?";
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating toggle button (mobile-friendly) */}
      <button
        type="button"
        aria-label="Open assistant"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          right: 20,
          bottom: 20,
          zIndex: 60,
          padding: "10px 14px",
          borderRadius: 999,
          background: "#facc15", // yellow
          border: "none",
          boxShadow: "0 8px 24px rgba(0,0,0,.18)",
          fontWeight: 600,
        }}
      >
        {open ? "Hide assistant" : "Need help?"}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            right: 20,
            bottom: 80,
            width: 360,
            maxWidth: "92vw",
            height: 420,
            maxHeight: "60vh",
            background: "#0f172a", // dark
            color: "#e5e7eb",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 16,
            boxShadow: "0 12px 32px rgba(0,0,0,.35)",
            display: "flex",
            flexDirection: "column",
            zIndex: 59,
          }}
        >
          <div style={{ padding: 12, borderBottom: "1px solid rgba(255,255,255,.06)", fontWeight: 700 }}>
            Genio Assistant
          </div>

          <div
            ref={listRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 12,
              gap: 8,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? "#1d4ed8" : "rgba(255,255,255,.06)",
                  color: "#fff",
                  padding: "10px 12px",
                  borderRadius: 12,
                  maxWidth: "85%",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.35,
                }}
              >
                {m.content}
              </div>
            ))}
          </div>

          <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,.06)", display: "flex", gap: 8 }}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type your message…"
              style={{
                flex: 1,
                resize: "none",
                height: 44,
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.12)",
                background: "rgba(255,255,255,.03)",
                color: "#e5e7eb",
              }}
            />
            <button
              type="button"
              onClick={sendMessage}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background: "#facc15",
                color: "#111827",
                fontWeight: 700,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
