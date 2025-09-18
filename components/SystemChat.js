// components/SystemChat.js
import { useEffect, useRef, useState } from "react";

export default function SystemChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState(() => [
    {
      role: "assistant",
      text:
        "Hi, I’m the System Brain. I’ll help you understand Genio and build your Twin. Ask me anything — or use a quick action below.",
    },
  ]);

  const sessionIdRef = useRef(null);
  useEffect(() => {
    // simple ephemeral session id
    sessionIdRef.current =
      sessionIdRef.current ||
      `sess_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  }, []);

  // quick actions shown under the welcome message
  const quick = [
    { k: "What is a Twin?", v: "What is a Twin?" },
    { k: "Privacy & data", v: "How do you handle privacy and data?" },
    { k: "Voice & video", v: "How do voice and video work?" },
    { k: "Start signup", v: "How do I start the signup?" },
  ];

  async function send(text) {
    if (!text.trim() || busy) return;
    const userMsg = { role: "user", text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat/brain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          sessionId: sessionIdRef.current,
        }),
      });
      const data = await r.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply || "…" },
      ]);
      if (Array.isArray(data.suggestions) && data.suggestions.length) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text:
              "You can also ask:",
            suggestions: data.suggestions,
          },
        ]);
      }
      if (data.cta === "signup") window.location.href = "/auth/signup";
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text:
            "I couldn’t reach the server right now. Please try again or refresh.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
        aria-controls="system-chat"
        className="launcher"
      >
        {open ? "Close" : "Need help?"}
      </button>

      {/* Panel */}
      {open && (
        <div id="system-chat" className="panel" role="dialog" aria-label="System Brain Chat">
          <header className="panelHeader">
            <div className="title">System Brain</div>
            <button onClick={() => setOpen(false)} className="close" aria-label="Close">×</button>
          </header>

          <div className="body">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                <p>{m.text}</p>
                {m.suggestions && (
                  <div className="sugs">
                    {m.suggestions.map((s, idx) => (
                      <button key={idx} onClick={() => send(s)}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Quick actions (first screen) */}
            {messages.length === 1 && (
              <div className="sugs first">
                {quick.map((q) => (
                  <button key={q.k} onClick={() => send(q.v)}>
                    {q.k}
                  </button>
                ))}
              </div>
            )}
          </div>

          <footer className="footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              onKeyDown={(e) => {
                if (e.key === "Enter") send(input);
              }}
              disabled={busy}
            />
            <button onClick={() => send(input)} disabled={busy || !input.trim()}>
              {busy ? "…" : "Send"}
            </button>
          </footer>
        </div>
      )}

      <style jsx>{`
        .launcher {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 60;
          padding: 12px 14px;
          border-radius: 999px;
          border: 0;
          background: #ffd54d;
          color: #0b132b;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
        }
        .panel {
          position: fixed;
          right: 16px;
          bottom: 72px;
          width: 360px;
          max-height: 70vh;
          display: flex;
          flex-direction: column;
          background: #0f1b33;
          color: #e9eefc;
          border: 1px solid #22304a;
          border-radius: 14px;
          overflow: hidden;
          z-index: 70;
        }
        .panelHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 12px;
          background: #0b162a;
          border-bottom: 1px solid #1c2942;
        }
        .title {
          font-weight: 700;
          letter-spacing: 0.3px;
        }
        .close {
          background: transparent;
          border: 0;
          color: #cfe1ff;
          font-size: 20px;
          cursor: pointer;
        }
        .body {
          padding: 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .msg {
          max-width: 85%;
          padding: 10px 12px;
          border-radius: 12px;
          white-space: pre-wrap;
          line-height: 1.45;
        }
        .msg.user {
          align-self: flex-end;
          background: #193154;
        }
        .msg.assistant {
          align-self: flex-start;
          background: #101f3c;
          border: 1px solid #22304a;
        }
        .sugs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .sugs button {
          border: 1px solid #2b3c5e;
          background: #0f1b33;
          color: #e9eefc;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 12px;
          cursor: pointer;
        }
        .sugs.first {
          padding: 4px 2px 8px;
        }
        .footer {
          display: flex;
          gap: 8px;
          padding: 10px;
          border-top: 1px solid #1c2942;
          background: #0b162a;
        }
        .footer input {
          flex: 1;
          background: #0a1630;
          border: 1px solid #253a61;
          color: #e9eefc;
          border-radius: 10px;
          padding: 10px 12px;
          outline: none;
        }
        .footer button {
          background: #ffd54d;
          border: 0;
          color: #101010;
          font-weight: 700;
          border-radius: 10px;
          padding: 10px 12px;
          cursor: pointer;
        }
        @media (max-width: 420px) {
          .panel { width: calc(100vw - 24px); right: 12px; }
        }
      `}</style>
    </>
  );
}
