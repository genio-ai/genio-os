"use client";

import { useState } from "react";

export default function NioDockPage() {
  const [activeTab, setActiveTab] = useState("actions");

  const tabs = [
    { id: "actions", label: "Actions" },
    { id: "uploads", label: "Uploads" },
    { id: "snippets", label: "Snippets" },
    { id: "shortcuts", label: "Shortcuts" },
  ];

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d12]/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">Nio — Dock</h1>
          <span className="text-sm text-white/60">Quick control center</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-2 border-b border-white/10">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === t.id
                  ? "border-b-2 border-indigo-400 text-indigo-300"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panels */}
        <div className="mt-6">
          {activeTab === "actions" && <ActionsPanel />}
          {activeTab === "uploads" && <UploadsPanel />}
          {activeTab === "snippets" && <SnippetsPanel />}
          {activeTab === "shortcuts" && <ShortcutsPanel />}
        </div>
      </div>
    </div>
  );
}

function ActionsPanel() {
  const actions = [
    { id: 1, name: "Summarize Document", desc: "Upload a doc and get a summary instantly." },
    { id: 2, name: "Create Content Plan", desc: "Generate a 30-day posting schedule." },
    { id: 3, name: "Send Email Draft", desc: "Ask Nio to write and send via approval flow." },
  ];

  return (
    <div className="space-y-4">
      {actions.map((a) => (
        <div
          key={a.id}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition"
        >
          <div className="font-medium text-white/90">{a.name}</div>
          <div className="text-sm text-white/50 mt-1">{a.desc}</div>
          <button
            onClick={() => alert(`Action '${a.name}' placeholder`)}
            className="mt-3 rounded-md border border-indigo-500/30 bg-indigo-500/20 px-3 py-1.5 text-sm text-indigo-200 hover:bg-indigo-500/30 transition"
          >
            Run
          </button>
        </div>
      ))}
    </div>
  );
}

function UploadsPanel() {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-white/70">
      <p>No uploads yet.</p>
      <button
        className="mt-3 rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 hover:bg-white/[0.08] transition"
        onClick={() => alert("Upload placeholder. Connect storage later.")}
      >
        Upload File
      </button>
    </div>
  );
}

function SnippetsPanel() {
  const snippets = [
    { id: 1, title: "Product Pitch", text: "Our AI system saves hours daily..." },
    { id: 2, title: "Thank-You Email", text: "Thank you for your time today..." },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {snippets.map((s) => (
        <div
          key={s.id}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition"
        >
          <div className="font-medium text-white/90">{s.title}</div>
          <p className="text-sm text-white/60 mt-1">{s.text}</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs hover:bg-white/[0.08]">
              Copy
            </button>
            <button className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs hover:bg-white/[0.08]">
              Edit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShortcutsPanel() {
  const shortcuts = [
    { key: "Ctrl + K", desc: "Quick Search" },
    { key: "Ctrl + Shift + N", desc: "New Session" },
    { key: "Ctrl + Enter", desc: "Send Message" },
  ];

  return (
    <div className="space-y-3">
      {shortcuts.map((s) => (
        <div
          key={s.key}
          className="flex justify-between rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm"
        >
          <span className="text-white/80">{s.desc}</span>
          <span className="font-mono text-white/50">{s.key}</span>
        </div>
      ))}
    </div>
  );
}
