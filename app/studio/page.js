"use client";

import { useMemo, useState } from "react";

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState(seedTemplates());
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const tabs = [
    { id: "templates", label: "Templates" },
    { id: "planner", label: "Planner" },
    { id: "queue", label: "Queue" },
  ];

  const queue = useMemo(
    () =>
      (templates || [])
        .flatMap((t) => t.scheduled || [])
        .sort((a, b) => new Date(a.when) - new Date(b.when)),
    [templates]
  );

  function onUseTemplate(t) {
    setSelected(t.id);
    setDraft(t.example || "");
    setActiveTab("planner");
  }

  async function schedulePost() {
    if (!draft.trim()) return;
    setBusy(true);
    await new Promise((r) => setTimeout(r, 450)); // wire to /api/studio/publish
    const when = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // +1h
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === selected
          ? { ...t, scheduled: [...(t.scheduled || []), { id: crypto.randomUUID(), when, text: draft }] }
          : t
      )
    );
    setDraft("");
    setBusy(false);
    setActiveTab("queue");
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d12]/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">Content Studio</h1>
          <span className="text-sm text-white/60">Create • Plan • Publish</span>
        </div>
      </header>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-4 py-6">
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
          {activeTab === "templates" && (
            <TemplatesPanel templates={templates} onUse={onUseTemplate} />
          )}

          {activeTab === "planner" && (
            <PlannerPanel
              template={templates.find((t) => t.id === selected)}
              draft={draft}
              setDraft={setDraft}
              busy={busy}
              onSchedule={schedulePost}
              onBack={() => setActiveTab("templates")}
            />
          )}

          {activeTab === "queue" && <QueuePanel items={queue} />}
        </div>
      </div>
    </div>
  );
}

function TemplatesPanel({ templates, onUse }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((t) => (
        <div
          key={t.id}
          className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-white/90 font-semibold">{t.title}</h3>
            <span className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs text-white/60">
              {t.channel}
            </span>
          </div>
          <p className="mt-2 text-sm text-white/60 line-clamp-3">{t.description}</p>
          <button
            onClick={() => onUse(t)}
            className="mt-3 w-full rounded-md border border-indigo-500/30 bg-indigo-500/20 px-3 py-2 text-sm text-indigo-200 hover:bg-indigo-500/30 transition"
          >
            Use template
          </button>
        </div>
      ))}
    </div>
  );
}

function PlannerPanel({ template, draft, setDraft, busy, onSchedule, onBack }) {
  if (!template) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6 text-sm text-white/60">
        Pick a template first.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-5 py-3 text-sm font-medium text-white/80">
            Editor — {template.title}
          </div>
          <div className="p-5">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[260px] w-full resize-y rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:border-white/20"
              placeholder="Write or paste your content…"
            />
            <div className="mt-3 flex items-center justify-between text-xs text-white/40">
              <span>Tip: Keep it concise and actionable.</span>
              <span>{draft.length} chars</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={onBack}
            className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2 text-sm hover:bg-white/[0.08]"
          >
            Back
          </button>
          <button
            disabled={busy || !draft.trim()}
            onClick={onSchedule}
            className="rounded-md border border-emerald-500/30 bg-emerald-500/20 px-4 py-2 text-sm text-emerald-200 hover:bg-emerald-500/30 disabled:opacity-50"
          >
            {busy ? "Scheduling…" : "Schedule +1h"}
          </button>
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-5 py-3 text-sm font-medium text-white/80">
            Preview
          </div>
          <div className="p-5">
            <PostPreview channel={template.channel} text={draft} />
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.02] p-5 text-sm text-white/70">
          <div className="font-medium text-white/80">Template guidance</div>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {template.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function QueuePanel({ items }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="border-b border-white/10 px-5 py-3 text-sm font-medium text-white/80">
        Scheduled queue
      </div>
      <ul className="divide-y divide-white/10">
        {items.length === 0 && (
          <li className="p-6 text-sm text-white/60">No scheduled content yet.</li>
        )}
        {items.map((it) => (
          <li key={it.id} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm text-white/80">{formatTime(it.when)}</div>
                <p className="mt-1 text-sm text-white/60 break-words">{it.text}</p>
              </div>
              <button
                className="shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs hover:bg-white/[0.08]"
                onClick={() => alert("Cancel placeholder. Wire to /api/studio/publish cancel.")}
              >
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PostPreview({ channel, text }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between text-xs text-white/50">
        <span>Channel: {channel}</span>
        <span>Live preview</span>
      </div>
      <div className="rounded-md border border-white/10 bg-[#0b0d12] p-3 text-sm leading-6 whitespace-pre-wrap">
        {text || "Your content will appear here…"}
      </div>
    </div>
  );
}

function seedTemplates() {
  return [
    {
      id: "t_linkedin_announce",
      title: "LinkedIn — Product Announcement",
      channel: "LinkedIn",
      description: "Announce a new feature or milestone with a clear CTA.",
      example:
        "We just launched Nio — your AI twin with audio-first workflows and Siri integration. Early access is open today. Join us.",
      tips: ["Lead with value", "Add a crisp CTA", "Tag relevant accounts"],
      scheduled: [],
    },
    {
      id: "t_x_thread",
      title: "X — Thread (3–5 tweets)",
      channel: "X",
      description: "Short thread introducing a concept or feature.",
      example:
        "1/ Meet Nio: an AI twin that talks in your voice.\n2/ Audio-first via Siri Shortcut.\n3/ Strong privacy guardrails.\n4/ Join the waitlist.",
      tips: ["Keep each tweet < 280 chars", "Use a hook", "End with CTA"],
      scheduled: [],
    },
    {
      id: "t_email_update",
      title: "Email — Product Update",
      channel: "Email",
      description: "Concise product update for early adopters.",
      example:
        "Subject: Your twin is ready\n\nHi there — quick update on Nio. Audio-first is live. Reply if you want early access today.",
      tips: ["Short subject", "One clear ask", "Avoid fluff"],
      scheduled: [],
    },
  ];
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}
