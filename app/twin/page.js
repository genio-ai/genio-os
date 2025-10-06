// File: app/twin/page.js

import Link from "next/link";

export const metadata = {
  title: "Genio Twin — Landing",
  description: "Create your digital twin: voice, tone, languages, and more.",
};

export default function TwinLanding() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Another you — your Genio Twin
          </h1>
          <p className="mt-4 text-lg text-gray-300">
            Build a voice clone, set your tone and languages, and go hands-free with Travel Mode.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <Card
            title="Create a Twin"
            desc="5-step wizard: consent, voice sample, provider, settings, payment."
            href="/twin/create"
            cta="Start"
          />
          <Card
            title="Settings"
            desc="Switch voice provider, language, and safety options."
            href="/twin/settings"
            cta="Open"
          />
          <Card
            title="Travel Mode"
            desc="Hands-free live translation in your own voice."
            href="/twin/travel"
            cta="Try"
          />
        </div>

        <footer className="mt-16 text-sm text-gray-400">
          <p>Need admin analytics? <Link href="/admin" className="underline">Open Admin</Link></p>
        </footer>
      </section>
    </main>
  );
}

function Card({ title, desc, href, cta }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-gray-300">{desc}</p>
      <Link
        href={href}
        className="mt-4 inline-block rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/10"
      >
        {cta}
      </Link>
    </div>
  );
}
