"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setSent(false);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setBusy(true);
    // Wire to /api/contact/send later
    await new Promise((r) => setTimeout(r, 600));
    setBusy(false);
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0d12]/80 backdrop-blur">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">Contact & Support</h1>
          <span className="text-sm text-white/60">We’re here to help</span>
        </div>
      </header>

      {/* Form */}
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6 sm:p-10">
          <h2 className="text-base font-semibold text-white/80 mb-4">
            Send us a message
          </h2>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-white/70">Name</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 text-sm outline-none focus:border-white/20"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="mt-1 w-full rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 text-sm outline-none focus:border-white/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="mt-1 min-h-[120px] w-full resize-y rounded-md border border-white/10 bg-[#0b0d12] px-3 py-2 text-sm outline-none focus:border-white/20"
                placeholder="How can we help?"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={busy}
                className="rounded-md border border-indigo-500/30 bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-200 hover:bg-indigo-500/30 disabled:opacity-50 transition"
              >
                {busy ? "Sending…" : "Send Message"}
              </button>
              {sent && (
                <span className="text-sm text-emerald-400">
                  Message sent successfully ✅
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Extra Info */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-sm font-semibold text-white/80 mb-2">
              Business Inquiries
            </h3>
            <p className="text-sm text-white/60">
              For partnerships, media, or enterprise requests, contact:
              <br />
              <a
                href="mailto:partners@genio.systems"
                className="text-indigo-300 hover:text-indigo-200"
              >
                partners@genio.systems
              </a>
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
            <h3 className="text-sm font-semibold text-white/80 mb-2">Support Hours</h3>
            <p className="text-sm text-white/60">
              Monday–Friday: 9am – 6pm  
              <br />
              Saturday–Sunday: Closed  
              <br />
              Response time: within 24 hours.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
