// pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";

/** ========= Locale (EN/AR) ========= */
const LOCALE = {
  en: {
    dir: "ltr",
    brand: "Genio AI Studio",
    nav: { home: "Home", about: "About", support: "Support", chat: "Chat", login: "Login", signup: "Signup" },
    switch: "AR",
    hero: {
      title: "Genio AI Studio",
      tagline: "Build, train, and launch your AI twins at scale.",
      cta1: "Launch a Twin",
      cta2: "View Demos",
      windowTitle: "Twin Studio • Preview",
      modules: ["Twin Lab", "Vision ID", "Flows", "Deploy"],
      canvas: "Canvas",
      version: "v1.0",
      layoutNote: "Studio layout preview",
    },
  },
  ar: {
    dir: "rtl",
    brand: "Genio AI Studio",
    nav: { home: "الرئيسية", about: "حول", support: "الدعم", chat: "الدردشة", login: "تسجيل الدخول", signup: "إنشاء حساب" },
    switch: "EN",
    hero: {
      title: "Genio AI Studio",
      tagline: "ابنِ ودرّب وأطلق توائمك الذكية على نطاق واسع.",
      cta1: "إطلاق توأم",
      cta2: "عرض النماذج",
      windowTitle: "استوديو التوأم • معاينة",
      modules: ["مختبر التوأم", "هوية الرؤية", "التدفقات", "الإطلاق"],
      canvas: "اللوحة",
      version: "الإصدار 1.0",
      layoutNote: "معاينة واجهة الاستوديو",
    },
  },
};

/** ========= Header (inline) ========= */
function Header({ t, onToggleLang }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0F1F]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-teal-300" />
          <span className="truncate text-base font-semibold tracking-tight">{t.brand}</span>
        </div>

        {/* Nav + Switch */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:opacity-100 opacity-90">{t.nav.home}</Link>
          <Link href="/about" className="hover:opacity-100 opacity-90">{t.nav.about}</Link>
          <Link href="/support" className="hover:opacity-100 opacity-90">{t.nav.support}</Link>
          <Link href="/chat" className="hover:opacity-100 opacity-90">{t.nav.chat}</Link>
          <Link href="/login" className="hover:opacity-100 opacity-90">{t.nav.login}</Link>
          <Link href="/signup" className="hover:opacity-100 opacity-90">{t.nav.signup}</Link>

          <button
            onClick={onToggleLang}
            className="rounded-md border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10 transition"
            aria-label="Toggle Language"
          >
            {t.switch}
          </button>
        </div>
      </div>
    </header>
  );
}

/** ========= Hero (inline) ========= */
function Hero({ t }) {
  return (
    <section className="relative overflow-hidden bg-[#0A0F1F] text-white">
      {/* subtle background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),rgba(45,212,191,0.10),transparent)]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
        {/* Copy */}
        <div>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">{t.hero.title}</h1>
          <p className="mt-4 max-w-xl text-base opacity-80 sm:text-lg">{t.hero.tagline}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#" className="rounded-lg border border-teal-400/30 bg-teal-400/10 px-5 py-2 text-sm font-medium hover:bg-teal-400/20">
              {t.hero.cta1}
            </a>
            <a href="#" className="rounded-lg border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium hover:bg-white/10">
              {t.hero.cta2}
            </a>
          </div>
        </div>

        {/* Clean studio mockup (no childish circles) */}
        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -inset-6 blur-3xl opacity-60">
            <div className="h-full w-full rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-sky-400/10 to-emerald-400/10" />
          </div>

          <div className="relative rounded-2xl border border-white/12 bg-white/[0.03] shadow-xl backdrop-blur">
            {/* window bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              </div>
              <div className="text-xs opacity-70">{t.hero.windowTitle}</div>
              <div className="text-xs opacity-0">•</div>
            </div>

            {/* workspace */}
            <div className="grid grid-cols-3 gap-3 p-4">
              {/* left menu */}
              <div className="col-span-1 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="text-xs opacity-70 mb-2">Modules</div>
                <ul className="space-y-2 text-xs">
                  {t.hero.modules.map((m, i) => (
                    <li key={i} className={`rounded-md px-2 py-1 ${i === 0 ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"}`}>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* center canvas */}
              <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="mb-2 flex items-center justify-between text-xs opacity-70">
                  <span>{t.hero.canvas}</span>
                  <span>{t.hero.version}</span>
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

          <div className="mt-3 text-center text-xs opacity-60">{t.hero.layoutNote}</div>
        </div>
      </div>
    </section>
  );
}

/** ========= Page ========= */
export default function Home() {
  const [lang, setLang] = useState("en");
  const t = LOCALE[lang];

  // set document direction
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = t.dir;
    }
  }, [t.dir]);

  return (
    <main className="min-h-screen bg-[#0A0F1F] text-white">
      <Header t={t} onToggleLang={() => setLang((p) => (p === "en" ? "ar" : "en"))} />
      <Hero t={t} />
    </main>
  );
}
