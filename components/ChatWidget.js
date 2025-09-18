// components/ChatWidget.js
import { useState } from "react";
import styles from "../styles/hero.module.css";

export default function ChatWidget({ welcome = "How can I help?" }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "assistant", content: welcome }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!input.trim() || busy) return;
    const userMsg = { role: "user", content: input.trim() };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await r.json();
      const reply =
        data.reply ||
        data?.choices?.[0]?.message?.content ||
        "I'm here to help.";
      setMsgs((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMsgs((m) => [
        ...m,
        { role: "assistant", content: "Sorry—something went wrong." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {!open && (
        <button className={styles.helpFab} onClick={() => setOpen(true)}>
          Need help?
        </button>
      )}

      {open && (
        <div className={styles.chatPanel}>
          <div className={styles.chatHead}>
            <strong>Genio Assistant</strong>
            <button onClick={() => setOpen(false)} className={styles.xBtn}>
              ×
            </button>
          </div>
          <div className={styles.chatBody}>
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "assistant" ? styles.bubbleAI : styles.bubbleUser
                }
              >
                {m.content}
              </div>
            ))}
          </div>
          <div className={styles.chatInputRow}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button onClick={send} disabled={busy}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
