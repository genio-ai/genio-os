// File: app/twin/page.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TwinDashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState(null);       // { built, language, provider }
  const [usage, setUsage] = useState(null);         // { remaining_minutes, plan }
  const [sessions, setSessions] = useState([]);     // [{id, ts, lang, duration_s, provider}]

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setErr("");
        const [sRes, uRes, lRes] = await Promise.all([
          fetch("/api/twin/status"),
          fetch("/api/twin/usage"),
          fetch("/api/twin/sessions?limit=5"),
        ]);
        if (!sRes.ok || !uRes.ok || !lRes.ok) throw new Error("Failed to load twin data");
        const [s, u, l] = await Promise.all([sRes.json(), uRes.json(), lRes.json()]);
        if (!isMounted) return;
        setStatus(s || {});
        setUsage(u || {});
        setSessions(l?.items || []);
      } catch (e) {
        if (!isMounted) return;
        setErr(e?.message || "Failed to load");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const built = !!status?.built;
  const minutes = usage?.remaining_minutes ?? 0;
  const lowMinutes = minutes <= 10;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your Genio Twin</h1>
          <p className="mt-2 text-gray-300">
            Manage voice twin settings, Travel Mode, and recent activity.
          </p>
        </header>

        {err ? <Banner kind="error" msg={err} /> : null}
        {loading ? <Skeleton /> : (
          <>
            {/* Top cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card
                title="Twin Status"
                value={built ? "Built" : "Pending"}
                hint={built ? `Provider: ${status?.provider || "—"} · Lang: ${status?.language || "—"}` : "Complete onboarding to build your twin."}
                actionLabel={built ? "Rebuild" : "Create"}
                href={built ? "/twin/create" : "/twin/create"}
              />
              <Card
                title="Minutes"
                value={`${minutes} min`}
                hint={`Plan: ${usage?.plan || "—"}`}
                actionLabel={lowMinutes ? "Top up" : "Manage"}
                href="/twin/settings"
                danger={lowMinutes}
              />
              <Card
                title="Travel Mode"
                value="Hands-free"
                hint="Live translation in your voice"
                actionLabel="Open"
                href="/twin/travel"
              />
            </div>

            {/* Quick actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="btn" href="/twin/create">Create / Update Twin</Link>
              <Link className="btn" href="/twin/settings">Settings</Link>
              <Link className="btn" href="/admin">Admin</Link>
            </div>

            {/* Recent sessions */}
            <section className="mt-10">
              <h2 className="text-xl font-semibold">Recent Sessions</h2>
              {sessions.length === 0 ? (
                <p className="mt-3 text-sm text-gray-400">No sessions yet.</p>
              ) : (
                <ul className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10">
                  {sessions.map((s) => (
                    <li key={s.id} className="p-4 grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      <span className="text-gray-300">{fmtDate(s.ts)}</span>
                      <span className="text-gray-200">{s.lang?.toUpperCase() || "—"}</span>
                      <span className="text-gray-200">{formatDur(s.duration_s)}</span>
                      <span className="text-gray-400 md:col-span-2">Provider: {s.provider || "—"}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </section>

      <style jsx>{`
        .btn {
          border: 1px solid rgba(255,255,255,0.2);
          padding: 0.5rem 0.875rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          background: rgba(255,255,255,0.06);
        }
        .btn:hover { background: rgba(255,255,255,0.12); }
      `}</style>
    </main>
  );
}

function Card({ title, value, hint, href, actionLabel, danger }) {
  return (
    <div className={`rounded-xl border p-5 ${danger ? "border-red-500/40 bg-red-500/10" : "border-white/10 bg-white/5"}`}>
      <h3 className="text-sm text-gray-300">{title}</h3>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      <p className="mt-1 text-sm text-gray-400">{hint}</p>
      {href ? (
        <Link href={href} className={`mt-4 inline-block text-sm px-4 py-2 rounded-lg border ${danger ? "border-red-400/60" : "border-white/20"} hover:bg-white/10`}>
          {actionLabel || "Open"}
        </Link>
      ) : null}
    </div>
  );
}

function Banner({ kind = "info", msg }) {
  const cls = kind === "error"
    ? "bg-red-900/40 text-red-200 border-red-700"
    : "bg-gray-800 text-gray-100 border-gray-600";
  return (
    <div className={`mb-6 border px-3 py-2 rounded ${cls}`}>
      <span className="text-sm">{msg}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-3 animate-pulse">
      {[0,1,2].map((i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="h-4 w-24 bg-white/10 rounded" />
          <div className="mt-3 h-6 w-32 bg-white/10 rounded" />
          <div className="mt-3 h-4 w-40 bg-white/10 rounded" />
          <div className="mt-4 h-8 w-24 bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}

function fmtDate(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleString();
  } catch {
    return String(ts || "—");
  }
}
function formatDur(s = 0) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")} min`;
}
