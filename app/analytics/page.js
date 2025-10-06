"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    minutes: 0,
    twins: 0,
    approvals: 0,
  });
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    // Placeholder — connect to /api/nio/analytics/summary later
    setTimeout(() => {
      setStats({
        users: 142,
        messages: 1085,
        minutes: 2120,
        twins: 47,
        approvals: 5,
      });
      setTrend([
        { label: "Mon", val: 40 },
        { label: "Tue", val: 52 },
        { label: "Wed", val: 48 },
        { label: "Thu", val: 55 },
        { label: "Fri", val: 61 },
        { label: "Sat", val: 45 },
        { label: "Sun", val: 58 },
      ]);
    }, 300);
  }, []);

  const cards = [
    { title: "Users", value: stats.users, color: "bg-indigo-500/30" },
    { title: "Messages", value: stats.messages, color: "bg-sky-500/30" },
    { title: "Minutes Used", value: stats.minutes, color: "bg-amber-500/30" },
    { title: "Active Twins", value: stats.twins, color: "bg-emerald-500/30" },
    { title: "Approvals Pending", value: stats.approvals, color: "bg-rose-500/30" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d12]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">Analytics</h1>
          <span className="text-sm text-white/60">Performance Overview</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 space-y-10">
        {/* Metrics */}
        <section>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((c) => (
              <div
                key={c.title}
                className={`rounded-lg border border-white/10 ${c.color} p-5 text-center`}
              >
                <div className="text-sm uppercase tracking-wide text-white/60">{c.title}</div>
                <div className="mt-2 text-3xl font-semibold">{c.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Trend */}
        <section>
          <h2 className="text-base font-semibold text-white/80 mb-3">
            Weekly Messages Trend
          </h2>
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-end gap-4 h-40">
              {trend.map((t) => (
                <div key={t.label} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-8 rounded-t-md bg-indigo-500/40"
                    style={{ height: `${t.val * 2.5}px` }}
                  />
                  <span className="mt-2 text-xs text-white/60">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* System Logs */}
        <section>
          <h2 className="text-base font-semibold text-white/80 mb-3">
            System Activity
          </h2>
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70">
            <ul className="divide-y divide-white/10">
              <li className="py-2 flex justify-between">
                <span>User <strong>manar@genio.systems</strong> created new twin</span>
                <span className="text-white/40">2m ago</span>
              </li>
              <li className="py-2 flex justify-between">
                <span>Payment received — <strong>$49 Pro Plan</strong></span>
                <span className="text-white/40">1h ago</span>
              </li>
              <li className="py-2 flex justify-between">
                <span>Voice export approved for <strong>Jane</strong></span>
                <span className="text-white/40">3h ago</span>
              </li>
              <li className="py-2 flex justify-between">
                <span>Server usage alert resolved</span>
                <span className="text-white/40">5h ago</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
