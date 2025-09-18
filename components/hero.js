// components/Hero.js
import Link from "next/link";

export default function Hero({ lang = "en" }) {
  const content = {
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

  return (
    <section className="relative overflow-hidden bg-[#0A0F1F] text-white">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.2),rgba(45,212,191,0.12),transparent)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
        {/* text side */}
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
            {content.title}
          </h1>
          <p className="mt-4 max-w-xl text-base opacity-80 sm:text-lg">
            {content.tagline}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#"
              className="rounded-lg border border-teal-400/30 bg-teal-400/10 px-5 py-2 text-sm font-medium hover:bg-teal-400/20"
            >
              {content.cta1}
            </Link>
            <Link
              href="#"
              className="rounded-lg border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium hover:bg-white/10"
            >
              {content.cta2}
            </Link>
          </div>
        </div>

        {/* visual twin placeholder */}
        <div className="relative mx-auto w-full max-w-[480px]">
          <div className="absolute -inset-6 blur-3xl opacity-60">
            <div className="h-full w-full rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-sky-400/10 to-emerald-400/10" />
          </div>
          <div className="relative rounded-3xl border border-white/15 bg-white/[0.03] p-8 backdrop-blur">
            <div className="flex justify-center">
              <svg
                className="h-40 w-40"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="70" cy="100" r="45" fill="url(#grad1)" opacity="0.9" />
                <circle cx="130" cy="100" r="45" fill="url(#grad1)" opacity="0.9" />
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#60A5FA" />
                    <stop offset="100%" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="mt-4 text-center text-sm opacity-70">
              {lang === "en"
                ? "Twin visual prototype"
                : "تصوّر مبدئي للتوأم"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
