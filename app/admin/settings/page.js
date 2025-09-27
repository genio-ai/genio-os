"use client";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded border border-white/10 p-4">
          <h2 className="font-semibold mb-2">Billing</h2>
          <p className="opacity-80 text-sm">Pricing per minute and daily caps.</p>
          <button className="mt-3 text-sm bg-white/10 hover:bg-white/15 border border-white/10 rounded px-3 py-1">
            Edit
          </button>
        </div>
        <div className="rounded border border-white/10 p-4">
          <h2 className="font-semibold mb-2">Abuse Controls</h2>
          <p className="opacity-80 text-sm">Blocklist, rate limiting, alerts.</p>
          <button className="mt-3 text-sm bg-white/10 hover:bg-white/15 border border-white/10 rounded px-3 py-1">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
}
