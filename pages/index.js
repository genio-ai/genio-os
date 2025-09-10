// pages/index.tsx
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Genio OS — Route payments smartly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Send & accept payments globally — faster, cheaper, smarter."
        />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#0b1530] to-[#0f1f48] text-white">
        {/* Header */}
        <header className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-wide">Genio OS</div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-300">
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#security" className="hover:text-white">Security</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-6 pb-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 sm:p-10">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                Route payments <span className="text-emerald-300">smartly</span>.
              </h1>
              <p className="mt-3 text-slate-300">
                Send & accept payments globally — faster, cheaper, smarter.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {/* Gradient Button */}
                <Link
                  href="#get-started"
                  className="inline-flex items-center justify-center rounded-lg 
                             bg-gradient-to-r from-[#00ff94] to-[#00d4ff] 
                             px-5 py-3 font-medium text-black shadow-md 
                             hover:opacity-90 transition"
                >
                  Get Started
                </Link>
                <a
                  href="#dashboard"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 px-5 py-3 font-medium hover:bg-white/10 transition"
                >
                  Open Dashboard
                </a>
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Send Money", href: "#send" },
                { label: "Receive Money", href: "#receive" },
                { label: "Create Payment Link", href: "#link" },
                { label: "Open Dashboard", href: "#dashboard" },
              ].map((b) => (
                <a
                  key={b.label}
                  href={b.href}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-center text-sm font-semibold hover:bg-white/10 transition"
                >
                  {b.label}
                </a>
              ))}
            </div>

            {/* Providers */}
            <div className="mt-10">
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Powered by
              </p>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Wise", "Flutterwave", "PayGate", "Stripe"].map((p) => (
                  <div
                    key={p}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm text-slate-200"
                  >
                    {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl px-4 py-10">
          <h2 className="text-xl font-semibold">How it works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {[
              {
                t: "1) Connect",
                d: "Link your preferred providers. No custody — Genio only routes.",
              },
              {
                t: "2) Smart routing",
                d: "We pick the best route for price, speed, and success rate.",
              },
              {
                t: "3) Track & reconcile",
                d: "Live status, webhooks, and simple exports for your finance team.",
              },
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="text-emerald-300 font-semibold">{item.t}</div>
                <p className="mt-2 text-sm text-slate-300">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Compliance */}
        <section id="security" className="mx-auto max-w-6xl px-4 pb-14">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold">Security & Compliance</h3>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-1">
              <li>KYC tiers and AML screening via connected providers.</li>
              <li>Genio OS is a routing layer — we do not hold customer funds.</li>
              <li>Audit logs, role-based access, and provider webhooks.</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer
          id="contact"
          className="border-t border-white/10 bg-black/20 py-8 text-slate-300"
        >
          <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm">© {new Date().getFullYear()} Genio OS</div>
            <div className="flex items-center gap-5 text-sm">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
