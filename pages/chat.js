// pages/chat.js
import { useState, useEffect, useRef } from "react";

/**
 * Public Chat — Talk to my Twin
 * - Minimal, reliable, production-ready UI
 * - Calls /api/chat (works out-of-the-box with your current API)
 * - Keeps a local sessionId (for future analytics/rate-limit if needed)
 * - No external deps, responsive, accessible
 */

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Manar’s AI twin. How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [locale] = useState("en"); // keep EN for this page; you can wire a toggle later
  const [styleSeed] = useState(""); // optional: pass style seeds if you want
  const [sessionId, setSessionId] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem("genio_public_chat_sid") || genId();
    localStorage.setItem("genio_public_chat_sid", id);
    setSessionId(id);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom on new message
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    const q = input.trim();
    if (!q || sending) return;

    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: decoratePrompt(q, sessionId),
          locale,         // "en"
          style: styleSeed,
        }),
      });

      const data = await res.json();
      const reply =
        data?.reply?.toString().trim() ||
        "I couldn’t generate a reply. Please try again.";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Unexpected error. Please try again later." },
      ]);
    } finally {
      setSending(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Talk to my Twin</h1>
        <p style={styles.subtitle}>
          Ask about services, pricing, roadmap, or anything. Replies are AI-generated in real time.
        </p>
      </header>

      <main style={styles.main}>
        <div style={styles.chatBox}>
          <div ref={scrollRef} style={styles.scroll}>
            {messages.map((m, i) => (
              <MessageBubble key={i} role={m.role} content={m.content} />
            ))}
          </div>

          <div style={styles.inputRow}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Type your message…"
              rows={2}
              style={styles.input}
            />
            <button
              onClick={send}
              disabled={sending || !input.trim()}
              style={{ ...styles.sendBtn, opacity: sending || !input.trim() ? 0.7 : 1 }}
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </div>

        <p style={styles.note}>
          AI may be inaccurate. Sensitive actions are always reviewed by a human first.
        </p>
      </main>

      <footer style={styles.footer}>
        <a href="/" style={styles.linkLight}>← Back to Home</a>
        <p style={styles.footerText}>© 2025 Genio Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  return (
    <div
      style={{
        ...styles.bubble,
        ...(isUser ? styles.bubbleUser : styles.bubbleBot),
      }}
    >
      {!isUser && <span style={styles.badge}>Twin</span>}
      <div>{content}</div>
    </div>
  );
}

function genId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "sess_" + Math.random().toString(36).slice(2);
}

function decoratePrompt(q, sid) {
  // Minimal, safe prompt wrapper (helps context/routing later if needed)
  return `Session: ${sid}\nUser: ${q}`;
}

const styles = {
  page: {
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    background: "#0B1D3A",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "24px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  title: { margin: 0, fontSize: 28, fontWeight: 800 },
  subtitle: { marginTop: 8, color: "rgba(255,255,255,0.85)" },
  main: { flex: 1, padding: "20px 16px", maxWidth: 880, margin: "0 auto" },

  chatBox: {
    background: "rgba(11,29,58,.6)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 14,
    padding: 12,
  },
  scroll: {
    height: 460,
    overflow: "auto",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 10,
    padding: 10,
    background: "#0b1d3a",
  },
  bubble: {
    maxWidth: "78%",
    padding: "10px 12px",
    borderRadius: 12,
    margin: "6px 0",
    fontSize: 15,
    lineHeight: 1.45,
    position: "relative",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  },
  bubbleUser: {
    background: "#1b2c4d",
    marginLeft: "auto",
  },
  bubbleBot: {
    background: "#11223f",
    border: "1px solid rgba(255,255,255,.08)",
  },
  badge: {
    position: "absolute",
    top: -8,
    left: 10,
    fontSize: 10,
    opacity: 0.8,
    background: "#223862",
    border: "1px solid rgba(255,255,255,.12)",
    padding: "2px 6px",
    borderRadius: 999,
  },
  inputRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
  },
  input: {
    flex: 1,
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 10,
    background: "#0a1a35",
    color: "#fff",
    padding: 12,
    fontSize: 15,
    outline: "none",
  },
  sendBtn: {
    background: "#FFD54A",
    color: "#102244",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
    minWidth: 110,
  },
  note: {
    marginTop: 10,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
  },
  footer: {
    padding: 16,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  },
  linkLight: { color: "#FFD54A", textDecoration: "none" },
  footerText: { fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 8 },
};
