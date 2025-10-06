"use client";

import { useEffect, useMemo, useState } from "react";

const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export default function AdminApprovalsPage() {
  const [items, setItems] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [filter, setFilter] = useState(STATUS.PENDING);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Placeholder fetch — wire to /api/nio/approvals later
    const demo = [
      {
        id: "ap_001",
        type: "post",
        title: "Schedule LinkedIn post",
        requestedBy: "manar@genio.systems",
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: STATUS.PENDING,
        payload: {
          channel: "LinkedIn",
          when: "2025-10-08 10:00",
          text: "Announcing Genio Twin v1 — audio-first, Siri-ready.",
        },
      },
      {
        id: "ap_002",
        type: "email",
        title: "Send promo email",
        requestedBy: "ops@genio.systems",
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: STATUS.PENDING,
        payload: {
          to: "list: early-adopters",
          subject: "Your Twin is ready",
          preview: "Spin up your voice in 2 minutes.",
        },
      },
      {
        id: "ap_003",
        type: "export",
        title: "Voice model export",
        requestedBy: "jane@genio.systems",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: STATUS.APPROVED,
        payload: { scope: "personal-only", ttl: "7 days" },
      },
    ];
    setItems(demo);
  }, []);

  const filtered = useMemo(() => {
    return items
      .filter((it) => (filter ? it.status === filter : true))
      .filter((it) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          it.id.toLowerCase().includes(q) ||
          it.title.toLowerCase().includes(q) ||
          it.requestedBy.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [items, filter, query]);

  async function decide(id, decision) {
    // Wire to POST /api/nio/approvals/decision later
    setBusyId(id);
    await new Promise((r) => setTimeout(r, 500));
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, status: decision === "approve" ? STATUS.APPROVED : STATUS.REJECTED } : it
      )
    );
    setBusyId(null);
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* Topbar */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d12]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">Approvals</h1>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <span>Admin only</span>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
          </div>
        </div>
      </header>

      {/* Controls */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <FilterButton label="Pending" value={STATUS.PENDING} active={filter === STATUS.PENDING} onClick={setFilter} />
            <FilterButton label="Approved" value={STATUS.APPROVED} active={filter === STATUS.APPROVED} onClick={setFilter} />
            <FilterButton label="Rejected" value={STATUS.REJECTED} active={filter === STATUS.REJECTED} onClick={setFilter} />
            <button
              onClick={() => setFilter("")}
              className={`rounded-md border border-white/10 px-3 py-1.5 text-sm ${
                filter === "" ? "bg-white/[0.12]" : "bg-white/[0.04] hover:bg-white/[0.08]"
              }`}
            >
              All
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search approvals…"
              className="rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 text-sm outline-none placeholder:text-white/30"
            />
            <button
              onClick={() => alert("Connect to /api/nio/approvals/request")}
              className="rounded-md border border-indigo-500/30 bg-indigo-500/20 px-3 py-2 text-sm text-indigo-200 hover:bg-indigo-500/30"
            >
              New Request
            </button>
          </div>
        </div>

        {/* List */}
        <div className="mt-5 divide-y divide-white/10 rounded-lg border border-white/10 bg-white/[0.02]">
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-white/50">No approvals to show.</div>
          )}

          {filtered.map((it) => (
            <div key={it.id} className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <TypeBadge type={it.type} />
                    <h3 className="truncate text-base font-semibold text-white/90">{it.title}</h3>
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    <span className="mr-3">ID: {it.id}</span>
                    <span className="mr-3">By: {it.requestedBy}</span>
                    <span>At: {formatAgo(it.createdAt)}</span>
                  </div>

                  {/* Payload preview */}
                  <div className="mt-3 grid gap-2 text-sm text-white/70">
                    {Object.entries(it.payload || {}).map(([k, v]) => (
                      <div key={k} className="grid grid-cols-12 gap-2">
                        <div className="col-span-4 sm:col-span-3 text-white/50">{k}</div>
                        <div className="col-span-8 sm:col-span-9 break-words">
                          {typeof v === "string" ? v : JSON.stringify(v)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <StatusPill status={it.status} />
                  <button
                    disabled={busyId === it.id || it.status !== STATUS.PENDING}
                    onClick={() => decide(it.id, "approve")}
                    className="rounded-md border border-emerald-500/30 bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    disabled={busyId === it.id || it.status !== STATUS.PENDING}
                    onClick={() => decide(it.id, "reject")}
                    className="rounded-md border border-rose-500/30 bg-rose-500/20 px-3 py-1.5 text-sm text-rose-200 hover:bg-rose-500/30 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function FilterButton({ label, value, active, onClick }) {
  return (
    <button
      onClick={() => onClick(value)}
      className={`rounded-md border border-white/10 px-3 py-1.5 text-sm ${
        active ? "bg-white/[0.12]" : "bg-white/[0.04] hover:bg-white/[0.08]"
      }`}
    >
      {label}
    </button>
  );
}

function TypeBadge({ type }) {
  const map = {
    post: { text: "Post", cls: "bg-sky-500/20 text-sky-200 border-sky-500/30" },
    email: { text: "Email", cls: "bg-indigo-500/20 text-indigo-200 border-indigo-500/30" },
    export: { text: "Export", cls: "bg-amber-500/20 text-amber-200 border-amber-500/30" },
  };
  const meta = map[type] || { text: type, cls: "bg-white/10 text-white/70 border-white/20" };
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${meta.cls}`}>
      {meta.text}
    </span>
  );
}

function StatusPill({ status }) {
  const map = {
    [STATUS.PENDING]: { text: "Pending", dot: "bg-amber-400", cls: "bg-amber-500/10 text-amber-200 border-amber-500/30" },
    [STATUS.APPROVED]: { text: "Approved", dot: "bg-emerald-400", cls: "bg-emerald-500/10 text-emerald-200 border-emerald-500/30" },
    [STATUS.REJECTED]: { text: "Rejected", dot: "bg-rose-400", cls: "bg-rose-500/10 text-rose-200 border-rose-500/30" },
  };
  const meta = map[status] || map[STATUS.PENDING];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs ${meta.cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.text}
    </span>
  );
}

function formatAgo(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return `${Math.floor(s)}s ago`;
  const m = s / 60;
  if (m < 60) return `${Math.floor(m)}m ago`;
  const h = m / 60;
  if (h < 24) return `${Math.floor(h)}h ago`;
  const d = h / 24;
  return `${Math.floor(d)}d ago`;
}
