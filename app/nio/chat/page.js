"use client";

import { useEffect, useRef, useState } from "react";

export default function NioChatPage() {
  const [messages, setMessages] = useState([
    { id: "m1", role: "assistant", content: "Hi, I'm Nio. How can I help today?" },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [threads] = useState([
    { id: "t1", title: "Welcome session" },
    { id: "t2", title: "Marketing ideas" },
    { id: "t3", title: "Content plan" },
  ]);

  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setBusy(true);
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: text }]);
    setInput("");

    // Placeholder response (wire to /api/nio/chat later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Noted. This is a placeholder response. Once the API is connected, Nio will reply intelligently.",
        },
      ]);
      setBusy(false);
    }, 400);
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* Topbar */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d12]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">Nio — Chat</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Status:</span>
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Ready
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar: threads */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/10 px-4 py-3 text-sm font-medium text-white/80">
              Sessions
            </div>
            <ul className="max-h-[60vh] overflow-auto p-2">
              {threads.map((t) => (
                <li
                  key={t.id}
                  className="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-white/[0.04] cursor-pointer"
                >
                  <span className="truncate text-sm text-white/90">{t.title}</span>
                  <span className="opacity-0 group-hover:opacity-100 text-white/40">›</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-white/10 p-3">
              <button
                className="w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm hover:bg-white/[0.06] transition"
                onClick={() =>
                  alert("New session placeholder. Wire this to /api/nio/history later.")
                }
              >
                + New Session
              </button>
            </div>
          </div>
        </aside>

        {/* Chat area */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-9">
          <div className="flex h-[70vh] min-h-[480px] flex-col rounded-lg border border-white/10 bg-white/[0.02]">
            {/* Messages */}
            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="flex gap-3">
                  <div
                    className={`mt-1 h-7 w-7 shrink-0 rounded-full ${
                      m.role === "assistant" ? "bg-indigo-500/40" : "bg-white/10"
                    } border border-white/10`}
                  />
                  <div className="flex-1">
                    <div className="mb-1 text-xs uppercase tracking-wide text-white/50">
                      {m.role === "assistant" ? "Nio" : "You"}
                    </div>
                    <div className="whitespace-pre-wrap rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm leading-6">
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-white/40 [animation-delay:240ms]" />
                  <span>Thinking…</span>
                </div>
              )}
            </div>

            {/* Composer */}
            <form onSubmit={handleSend} className="border-t border-white/10 p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  className="min-h-[44px] max-h-40 flex-1 resize-y rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 text-sm outline-none ring-0 placeholder:text-white/30 focus:border-white/20"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="rounded-md border border-white/10 bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/30 disabled:opacity-50 disabled:hover:bg-indigo-500/20 transition"
                >
                  Send
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                <div>Shift+Enter for newline</div>
                <button
                  type="button"
                  className="rounded border border-white/10 bg-white/[0.02] px-2 py-1 hover:bg-white/[0.06] transition"
                  onClick={() =>
                    alert("Attach placeholder. Wire to uploads later.")
                  }
                >
                  Attach
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
