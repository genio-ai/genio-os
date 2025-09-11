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
          content="Genio KYC OS — نظام تشغيل الثقة: تحقق هوية، AML، وذكاء مكافحة الاحتيال للبنوك والفنتك."
        />
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
              <strong>Genio KYC OS</strong> يبني طبقة الثقة للبنوك والفنتك:
              تحقق هوية متعدد الطبقات، فحص عقوبات وPEP، ذكاء مضاد للاحتيال،
              وواجهة برمجية تربط مزوّدي الدفع المرخّصين — ضمن التزام كامل بالقوانين.
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
              d: "KYC/AML مع تدقيق سجلات وعرض قرارات واضح. جاهز للتكامل مع مزودين مرخّصين.",
            },
            {
              t: "Adaptive Verification",
              d: "التحقق يتكيّف مع المخاطر: وثائق + سيلفي حامل الهوية + Liveness + عنوان عند الحاجة.",
            },
            {
              t: "Developer-first",
              d: "APIs وWebhooks واضحة. ابدأ بالـMVP اليوم، وتوسّع لاحقاً لشركاء ودول متعددة.",
            },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-xl font-bold mb-2">{c.t}</h3>
              <p className="opacity-80">{c.d}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-2xl font-extrabold mb-1">Ready to power trust?</div>
              <p className="opacity-80 text-sm">
                ابدأ التحقق الآن. ربط مزودات الدفع يتم فقط عبر شركاء مرخّصين وتبعاً للقوانين.
              </p>
            </div>
            <Link
              href="/kyc"
              className="rounded-xl px-4 py-2 font-semibold text-black bg-gradient-to-r from-[#27E38A] to-[#27D4F0]"
            >
              Begin Verification
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/10 py-6 text-center opacity-70 text-sm">
          © {new Date().getFullYear()} Genio KYC OS — The Operating System of Trust
        </footer>
      </main>
    </>
  );
}
