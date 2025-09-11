// pages/index.js
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Genio KYC OS — The Operating System of Trust</title>
        <meta
          name="description"
          content="Genio KYC OS builds the trust layer for banks and fintechs: multi-layer identity verification, AML screening, anti-fraud intelligence, and compliant integrations."
        />
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="en" />
      </Head>

      <main className="min-h-screen bg-[#0B1D3A] text-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0E2344]/80 backdrop-blur border-b border-white/10">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <div className="font-extrabold tracking-wide">
              Genio <span className="opacity-80">KYC OS</span>
            </div>
            <ul className="flex gap-6 text-sm">
              <li><Link className="opacity-80 hover:opacity-100" href="/">Home</Link></li>
              <li><Link className="opacity-80 hover:opacity-100" href="/kyc">KYC</Link></li>
              <li><Link className="opacity-80 hover:opacity-100" href="/dashboard">Dashboard</Link></li>
              <li><Link className="opacity-80 hover:opacity-100" href="/login">Login</Link></li>
            </ul>
          </nav>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-14">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#102A55] to-[#0A1936] p-8 shadow-xl">
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              The Operating System of <span className="opacity-80">Trust.</span>
            </h1>
            <p className="text-lg opacity-90 max-w-2xl">
              <strong>Genio KYC OS</strong> provides bank-grade identity verification,
              sanctions & PEP screening, fraud detection, and a developer-friendly API.
              Build compliance into your products with speed and confidence.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/kyc"
                className="rounded-xl px-4 py-2 font-semibold text-black bg-gradient-to-r from-[#27E38A] to-[#27D4F0]"
              >
                Begin Verification
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl px-4 py-2 font-semibold border border-white/15 bg-white/10"
              >
                View KYC Status
              </Link>
              <a
                href="#how-it-works"
                className="rounded-xl px-4 py-2 font-semibold border border-white/10 bg-white/5"
              >
                See How KYC OS Works
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {["Sanctions (UN/EU/OFAC)", "PEP & Adverse Media", "OCR & Liveness", "Risk Scoring"].map((t) => (
                <div key={t} className="rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-center opacity-90">
                  {t}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Genio KYC OS */}
        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              t: "Bank-grade Compliance",
              d: "End-to-end KYC/AML workflows with full audit trails and regulator-ready reporting.",
            },
            {
              t: "Adaptive Verification",
              d: "Dynamic checks: documents, selfie with ID, liveness, address — based on risk level.",
            },
            {
              t: "Developer-first",
              d: "Clear APIs and webhooks. Start small and scale across providers and countries.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-xl font-bold mb-2">{c.t}</h3>
              <p className="opacity-80">{c.d}</p>
            </div>
          ))}
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-6 text-center opacity-70 text-sm">
          © {new Date().getFullYear()} Genio KYC OS — The Operating System of Trust
        </footer>
      </main>
    </>
  );
}
