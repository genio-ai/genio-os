// pages/index.js
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

/**
 * Genio AI Studio — Single-file Landing (Enterprise-grade)
 * - English only, LTR
 * - Responsive header with mobile menu
 * - Hero with human-like twin SVG (no childish circles)
 * - Value strip + Trust bar + Features grid + Footer
 * - Primary CTA → /signup
 * Requires TailwindCSS (globals already in your project)
 */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  // lock to LTR always
  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.dir = "ltr";
  }, []);

  return (
    <>
      <Head>
        <title>Genio AI Studio — Create Your AI Twin</title>
        <meta
          name="description"
          content="Create your AI twin — your higher self, faster. Always-on voice control like Siri, runs your socials, manages your accounts, and works 24/7 so you enjoy life."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        <meta property="og:title" content="Genio AI Studio — Create Your AI Twin" />
        <meta
          property="og:description"
          content="Scale your life with an AI twin that handles media, messages, and ops—so you focus on living."
        />
        <meta property="og:type" content="website" />
      </Head>

      <main className="min-h-screen bg-[#0A0F1F] text-white">
        {/* ===== Header ===== */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0F1F]/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-teal-300" aria-hidden="true" />
              <span className="text-base font-semibold tracking-tight">Genio AI Studio</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link className="hover:opacity-100 opacity-90" href="/">Home</Link>
              <Link className="hover:opacity-100 opacity-90" href="/about">About</Link>
              <Link className="hover:opacity-100 opacity-90" href="/support">Support</Link>
              <Link className="hover:opacity-100 opacity-90" href="/chat">Chat</Link>
              <Link className="hover:opacity-100 opacity-90" href="/login">Login</Link>
              <Link className="hover:opacity-100 opacity-90" href="/signup">Signup</Link>
            </nav>

            {/* Mobile toggle */}
            <button
              aria-label="Open menu"
              className="md:hidden rounded-md border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10 transition"
              onClick={() => setMenuOpen((v) => !v)}
            >
              Menu
            </button>
          </div>

          {/* Mobile drawer */}
          {menuOpen && (
            <div className="border-t border-white/10 bg-[#0A0F1F] md:hidden">
              <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 text-sm font-medium">
                <Link className="hover:opacity-100 opacity-90" href="/" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link className="hover:opacity-100 opacity-90" href="/about" onClick={() => setMenuOpen(false)}>About</Link>
                <Link className="hover:opacity-100 opacity-90" href="/support" onClick={() => setMenuOpen(false)}>Support</Link>
                <Link className="hover:opacity-100 opacity-90" href="/chat" onClick={() => setMenuOpen(false)}>Chat</Link>
                <Link className="hover:opacity-100 opacity-90" href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link className="hover:opacity-100 opacity-90" href="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
              </nav>
            </div>
          )}
        </header>

        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden">
          {/* soft radial glow */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),rgba(45,212,191,0.10),transparent)]" />
          </div>

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
            {/* Copy */}
            <div>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
                Create Your AI Twin
              </h1>

              <p className="mt-4 max-w-xl text-base opacity-80 sm:text-lg">
                Your higher self—faster. Never tired. Works 24/7. You just enjoy life; it does the job.
              </p>

              {/* Value strip */}
              <ul className="mt-6 space-y-2 text-sm opacity-95">
                <li>• <span className="font-medium">One-tap voice control</span> — talk to it like Siri.</li>
                <li>• <span className="font-medium">Runs your socials</span> — posts, replies, DMs, scheduling.</li>
                <li>• <span className="font-medium">Manages your accounts</span> — email, calendar, tasks, follow-ups.</li>
                <li>• <span className="font-medium">Always on</span> — learns your style and improves daily.</li>
              </ul>

              {/* CTA */}
              <div className="mt-8">
                <Link
                  href="/signup"
                  className="inline-block rounded-lg border border-teal-400/30 bg-teal-400/10 px-5 py-2 text-sm font-medium hover:bg-teal-400/20"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Human-like twin visual (SVG, clean & professional) */}
            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="absolute -inset-6 blur-3xl opacity-60">
                <div className="h-full w-full rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-sky-400/10 to-emerald-400/10" />
              </div>

              <div className="relative flex items-end justify-center rounded-2xl border border-white/12 bg-white/[0.03] p-8 shadow-xl backdrop-blur">
                <TwinSVG className="h-72 w-full max-w-[520px]" />
              </div>
              <p className="mt-3 text-center text-xs opacity-60">AI Twin preview</p>
            </div>
          </div>
        </section>

        {/* ===== Trust bar ===== */}
        <section aria-label="Trusted by" className="border-t border-white/10 bg-white/[0.02]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-6 py-8 opacity-70">
            <span className="text-xs">Trusted by creators and teams</span>
            <div className="h-5 w-20 rounded-md bg-white/10" />
            <div className="h-5 w-20 rounded-md bg-white/10" />
            <div className="h-5 w-20 rounded-md bg-white/10" />
            <div className="h-5 w-20 rounded-md bg-white/10" />
          </div>
        </section>

        {/* ===== Features grid ===== */}
        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard title="Voice-first Control" desc="One tap to talk. Ask, delegate, and review—hands-free." />
            <FeatureCard title="Socials Automation" desc="Posts, replies, DMs, scheduling—your tone, your rules." />
            <FeatureCard title="Ops & Accounts" desc="Email, calendar, tasks, follow-ups—done on time, every time." />
            <FeatureCard title="Always On" desc="Learns your style, improves daily, and never sleeps." />
          </div>
        </section>

        {/* ===== Footer ===== */}
        <footer className="border-t border-white/10 py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-xs opacity-70 md:flex-row">
            <div>© {new Date().getFullYear()} Genio — All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link className="hover:opacity-100 opacity-80" href="/support">Support</Link>
              <Link className="hover:opacity-100 opacity-80" href="/about">About</Link>
              <Link className="hover:opacity-100 opacity-80" href="/login">Login</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

/* ===== Reusable pieces (kept inline for single-file delivery) ===== */

function FeatureCard({ title, desc }) {
  return (
    <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20">
      <div className="text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm opacity-75">{desc}</p>
      <div className="mt-4 text-xs opacity-60">Learn more →</div>
    </div>
  );
}

/**
 * TwinSVG — human-like mirrored silhouettes with subtle gradients,
 * purposefully abstract but clearly "two human twins" (no childish circles).
 */
function TwinSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 640 360" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#34D399" />
        </linearGradient>
      </defs>

      {/* base glow */}
      <ellipse cx="320" cy="320" rx="240" ry="20" fill="url(#body)" opacity="0.15" />

      {/* left silhouette */}
      <g opacity="0.95">
        <circle cx="220" cy="120" r="40" fill="url(#body)" />
        <rect x="190" y="160" width="60" height="110" rx="28" fill="url(#body)" />
        <rect x="170" y="200" width="30" height="90" rx="12" fill="url(#body)" />
        <rect x="250" y="200" width="30" height="90" rx="12" fill="url(#body)" />
        {/* arm gesture */}
        <path d="M190 190 C180 180, 160 170, 150 185" stroke="url(#body)" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* right silhouette (mirrored twin) */}
      <g opacity="0.95" transform="translate(200,0)">
        <circle cx="220" cy="120" r="40" fill="url(#body)" />
        <rect x="190" y="160" width="60" height="110" rx="28" fill="url(#body)" />
        <rect x="170" y="200" width="30" height="90" rx="12" fill="url(#body)" />
        <rect x="250" y="200" width="30" height="90" rx="12" fill="url(#body)" />
        {/* arm gesture (mirrored) */}
        <path d="M250 190 C260 180, 280 170, 290 185" stroke="url(#body)" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* subtle link between twins */}
      <rect x="300" y="200" width="40" height="16" rx="8" fill="url(#body)" opacity="0.8" />
    </svg>
  );
}
