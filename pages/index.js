// pages/index.js
import { useState } from "react";
import Link from "next/link";
import TwinModal from "../components/TwinModal";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#0b1c2c] text-white">
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight">
            Build your AI Twin — a sharper, tireless version of you
          </h1>
          <p className="mt-6 text-lg opacity-80">
            Your Twin writes, replies, books, summarizes, and handles routine work —
            in your style, 24/7. Private by default.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-2 rounded-md border border-white/20 hover:border-white/40"
            >
              What is a Twin?
            </button>

            <Link
              href="/twin"
              className="px-5 py-2.5 rounded-md bg-[#ffd152] text-[#13293d] font-semibold hover:brightness-95"
            >
              Create my Twin
            </Link>
          </div>

          <p className="mt-4 text-sm opacity-60">
            By continuing you accept the Terms and Responsible-Use Policy.
          </p>
        </div>

        {/* Minimal “why” strip */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6 opacity-90">
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="font-semibold mb-1">Your voice & style</h3>
            <p className="text-sm opacity-80">Trained from your tone, habits, and preferences.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="font-semibold mb-1">Private by default</h3>
            <p className="text-sm opacity-80">Raw media stored internally — no third-party sharing.</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <h3 className="font-semibold mb-1">Works for you</h3>
            <p className="text-sm opacity-80">Replies, emails, drafts, and scheduling — 24/7.</p>
          </div>
        </div>
      </section>

      <TwinModal open={open} onClose={() => setOpen(false)} />
    </main>
  );
}
