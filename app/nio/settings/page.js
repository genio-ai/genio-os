"use client";

import { useState } from "react";

export default function NioSettingsPage() {
  const [form, setForm] = useState({
    displayName: "Nio",
    voiceProvider: "openai",
    voiceModel: "alloy",
    language: "en",
    privacy: "personal-only",
    watermark: true,
    notifications: true,
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function onSave() {
    setBusy(true);
    setSaved(false);
    // Wire to POST /api/nio/settings/update later
    await new Promise((r) => setTimeout(r, 500));
    setBusy(false);
    setSaved(true);
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d12]/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">Nio — Settings</h1>
          <div className="flex items-center gap-2 text-sm text-white/60">
            {saved ? <span className="text-emerald-300">Saved</span> : <span>Unsaved changes</span>}
            <span className={`h-1.5 w-1.5 rounded-full ${saved ? "bg-emerald-400" : "bg-amber-400"}`} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* Identity */}
        <section className="rounded-lg border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-5 py-3 text-sm font-medium text-white/80">
            Identity
          </div>
          <div className="p-5 grid gap-5 sm:grid-cols-2">
            <Field
              label="Display name"
              hint="Shown in chat and content."
              value={form.displayName}
              onChange={(v) => update("displayName", v)}
            />
          </div>
        </section>

        {/* Voice */}
        <section className="rounded-lg border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-5 py-3 text-sm font-medium text-white/80">
            Voice
          </div>
          <div className="p-5 grid gap-5 sm:grid-cols-2">
            <Select
              label="Provider"
              value={form.voiceProvider}
              onChange={(v) => update("voiceProvider", v)}
              options={[
                { value: "openai", label: "OpenAI TTS" },
                { value: "elevenlabs", label: "ElevenLabs" },
                { value: "fallback", label: "Auto (cheapest/available)" },
              ]}
            />
            <Select
              label="Model"
              value={form.voiceModel}
              onChange={(v) => update("voiceModel", v)}
              options={[
                { value: "alloy", label: "Alloy" },
                { value: "verse", label: "Verse" },
                { value: "custom", label: "Custom (cloned)" },
              ]}
            />
            <Select
              label="Language"
              value={form.language}
              onChange={(v) => update("language", v)}
              options={[
                { value: "en", label: "English" },
                { value: "ar", label: "Arabic" },
                { value: "fr", label: "French" },
                { value: "pt", label: "Portuguese" },
              ]}
            />
          </div>
        </section>

        {/* Privacy & Security */}
        <section className="rounded-lg border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-5 py-3 text-sm font-medium text-white/80">
            Privacy & Security
          </div>
          <div className="p-5 grid gap-5 sm:grid-cols-2">
            <Select
              label="Voice scope"
              value={form.privacy}
              onChange={(v) => update("privacy", v)}
              options={[
                { value: "personal-only", label: "Personal only (no export)" },
                { value: "team", label: "Team-limited" },
                { value: "export-by-approval", label: "Export requires approval" },
              ]}
            />
            <Toggle
              label="Watermark on exports"
              checked={form.watermark}
              onChange={(v) => update("watermark", v)}
            />
            <Toggle
              label="Email notifications"
              checked={form.notifications}
              onChange={(v) => update("notifications", v)}
            />
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center justify-end">
          <button
            disabled={busy}
            onClick={onSave}
            className="rounded-md border border-indigo-500/30 bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/30 disabled:opacity-50 transition"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </main>
    </div>
  );
}

function Field({ label, hint, value, onChange }) {
  return (
    <label className="block">
      <div className="text-sm text-white/80">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 text-sm outline-none placeholder:text-white/30 focus:border-white/20"
        placeholder=""
      />
      {hint ? <div className="mt-1 text-xs text-white/40">{hint}</div> : null}
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="text-sm text-white/80">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 text-sm outline-none focus:border-white/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.02] px-4 py-3">
      <span className="text-sm text-white/80">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full border border-white/10 transition ${
          checked ? "bg-emerald-500/30" : "bg-white/[0.06]"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white/90 transition ${
            checked ? "left-6" : "left-1.5"
          }`}
        />
      </button>
    </label>
  );
}
