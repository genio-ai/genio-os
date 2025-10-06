"use client";

import { useEffect, useState } from "react";

export default function NioOverviewPage() {
  const [summary, setSummary] = useState({
    status: "Ready",
    sessions: 3,
    scheduled: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    // Placeholder — later connect to /api/nio/analytics/summary
    setTimeout(() => {
      setSummary({ status: "Ready", sessions: 5, scheduled: 2, pendingApprovals: 1 });
    }, 250);
  }, []);

  const cards = [
    { label: "Sessions", value: summary.sessions },
    { label: "Scheduled", value: summary.scheduled },
    { label: "Pending Approvals", value: summary.pendingApprovals },
  ];

  const quickLinks = [
    { href: "/nio/chat", label: "Open Chat" },
    { href: "/nio/dock", label: "Open Dock" },
    { href: "/studio", label: "Content Studio" },
    { href: "/admin/approvals", label: "Approvals (Admin)" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* Topbar */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d12]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">Nio — Overview</h1>
          <span className="inline-flex items-center gap-2 text-sm text-white/70">
            <span className="opacity-70">Status:</span>
            <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {summary.status}
            </span>
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-10">
        {/* Intro */}
        <section className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-base font-semibold text-white/90">Welcome to Nio</h2>
          <p className="mt-2 text-sm text-white/70">
            Your AI twin for chat, content, and voice tasks. Start a conversation, run quick actions,
            or schedule content with approvals when needed.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {quickLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 text-sm hover:bg-white/[0.08] transition"
              >
                {l.label}
              </a>
            ))}
          </div>
        </section>

        {/* Cards */}
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <div
                key={c.label}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-5 text-center"
              >
                <div className="text-sm uppercase tracking-wide text-white/60">{c.label}</div>
                <div className="mt-2 text-3xl font-semibold">{c.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Next steps */}
        <section className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-white/80">Next steps</h3>
          <ol className="mt-3 list-decimal pl-5 text-sm text-white/70 space-y-2">
            <li>Go to <code className="rounded bg-white/10 px-1.5 py-0.5">/nio/chat</code> and send a test prompt.</li>
            <li>Use <code className="rounded bg-white/10 px-1.5 py-0.5">/nio/dock</code> to trigger a quick action.</li>
            <li>Create a post in <code className="rounded bg-white/10 px-1.5 py-0.5">/studio</code> and schedule it.</li>
            <li>If the action is sensitive, review it in <code className="rounded bg-white/10 px-1.5 py-0.5">/admin/approvals</code>.</li>
          </ol>
        </section>
      </main>
    </div>
  );
}
