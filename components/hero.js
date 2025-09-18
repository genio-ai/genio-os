// components/hero.js
import Link from "next/link";

export default function Hero({ lang = "en", content }) {
  const fallback = {
    en: {
      title: "Genio AI Studio",
      tagline: "Build, train, and launch your AI twins at scale.",
      cta1: "Launch a Twin",
      cta2: "View Demos",
    },
    ar: {
      title: "Genio AI Studio",
      tagline: "ابنِ ودرّب واطلق توائمك الذكية على نطاق واسع.",
      cta1: "إطلاق توأم",
      cta2: "عرض النماذج",
    },
  }[lang];

  const t = content || fallback;

  return (
    <section className="relative overflow-hidden bg-[#0A0F1F] text-white">
      {/* soft gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),rgba(45,212,191,0.10),transparent)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
        {/* text */}
        <div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-xl text-base opacity-80 sm:text-lg">
            {t.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#"
              className="rounded-lg border border-teal-400/30 bg-teal-400/10 px-5 py-2 text-sm font-medium hover:bg-teal-400/20"
            >
              {t.cta1}
            </Link>
            <Link
              href="#"
              className="rounded-lg border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium hover:bg-white/10"
            >
              {t.cta2}
            </Link>
          </div>
        </div>

        {/* studio mockup (clean, enterprise) */}
        <div className="relative mx-auto w-full max-w-[520px]">
          <div className="absolute -inset-6 blur-3xl opacity-60">
            <div className="h-full w-full rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-sky-400/10 to-emerald-400/10" />
          </div>

          <div className="relative rounded-2xl border border-white/12 bg-white/[0.03] p-4 shadow-xl backdrop-blur">
            {/* window top bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              </div>
              <div className="text-xs opacity-70">Twin Studio • Preview</div>
              <div className="text-xs opacity-0">•</div>
            </div>

            {/* mock workspace */}
            <div className="grid grid-cols-3 gap-3 p-3">
              {/* left column: menu */}
              <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="text-xs opacity-70 mb-2">Modules</div>
                <ul className="space-y-2 text-xs">
                  <li className="rounded-md bg-white/[0.06] px-2 py-1">Twin Lab</li>
                  <li className="rounded-md px-2 py-1 hover:bg-white/[0.04]">Vision ID</li>
                  <li className="rounded-md px-2 py-1 hover:bg-white/[0.04]">Flows</li>
                  <li className="rounded-md px-2 py-1 hover:bg-white/[0.04]">Deploy</li>
                </ul>
              </div>

              {/* center: canvas */}
              <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="mb-2 flex items-center justify-between text-xs opacity-70">
                  <span>Canvas</span>
                  <span>v1.0</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-24 rounded-lg border border-white/10 bg-white/[0.04]" />
                  <div className="h-24 rounded-lg border border-white/10 bg-white/[0.04]" />
                  <div className="h-24 rounded-lg border border-white/10 bg-white/[0.04]" />
                  <div className="h-24 rounded-lg border border-white/10 bg-white/[0.04]" />
                </div>
                <div className="mt-3 h-8 rounded-md border border-white/10 bg-white/[0.04]" />
              </div>
            </div>
          </div>

          <div className="mt-3 text-center text-xs opacity-60">
            {lang === "en" ? "Studio layout preview" : "معاينة واجهة الستوديو"}
          </div>
        </div>
      </div>
    </section>
  );
}
