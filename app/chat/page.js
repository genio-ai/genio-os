"use client";

import { useState } from "react";

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your AI assistant. How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setError("");
    setBusy(true);

    // optimistic UI: add user bubble
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");

    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.filter((m) => m.role !== "system"),
        }),
      });

      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Request failed");

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.chat}>
        <h1 style={styles.title}>Chat</h1>

        <div style={styles.thread}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{ ...styles.bubble, ...(m.role === "user" ? styles.user : styles.assistant) }}
            >
              {m.content}
            </div>
          ))}
          {busy && <div style={{ ...styles.bubble, ...styles.assistant }}>Typing…</div>}
        </div>

        <form onSubmit={sendMessage} style={styles.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message…"
            style={styles.input}
            disabled={busy}
          />
          <button type="submit" disabled={busy || !input.trim()} style={styles.button}>
            Send
          </button>
        </form>

        {error && <div style={styles.error}>Error: {error}</div>}
        <div style={styles.note}>AI may be inaccurate. Review sensitive actions with a human first.</div>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    background: "#0d1b2a",
    color: "white",
    display: "flex",
    justifyContent: "center",
    padding: "32px 16px",
  },
  chat: { width: "100%", maxWidth: 720 },
  title: { margin: "0 0 16px 0", fontSize: 24, fontWeight: 700 },
  thread: {
    background: "#14213d",
    borderRadius: 12,
    padding: 16,
    minHeight: 360,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  bubble: {
    padding: "10px 12px",
    borderRadius: 10,
    lineHeight: 1.35,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxWidth: "90%",
  },
  user: { alignSelf: "flex-end", background: "#1f6feb" },
  assistant: { alignSelf: "flex-start", background: "#2d3748" },
  form: { display: "flex", gap: 8, marginTop: 12 },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #334155",
    outline: "none",
  },
  button: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#fbbf24",
    color: "#111827",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: { marginTop: 8, color: "#fecaca" },
  note: { marginTop: 8, fontSize: 12, opacity: 0.7 },
};
