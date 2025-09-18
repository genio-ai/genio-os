// components/Header.js
import { useState, useEffect } from "react";
import Link from "next/link";

// site text dictionary
const LOCALE = {
  en: {
    dir: "ltr",
    brand: "Genio AI Studio",
    nav: {
      home: "Home",
      about: "About",
      support: "Support",
      chat: "Chat",
      login: "Login",
      signup: "Signup",
    },
    langSwitch: "AR",
  },
  ar: {
    dir: "rtl",
    brand: "Genio AI Studio",
    nav: {
      home: "الرئيسية",
      about: "حول",
      support: "الدعم",
      chat: "الدردشة",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
    },
    langSwitch: "EN",
  },
};

export default function Header() {
  const [lang, setLang] = useState("en");
  const t = LOCALE[lang];

  useEffect(() => {
    document.documentElement.dir = t.dir;
  }, [t.dir]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0F1F]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 whitespace-nowrap">
        {/* Logo + Brand */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-teal-300" />
          <span className="truncate text-sm sm:text-base font-semibold tracking-tight">
            {t.brand}
          </span>
        </div>

        {/* Nav + Language Switch */}
        <div className="flex items-center gap-4 text-xs sm:text-sm opacity-90">
          <Link href="/">{t.nav.home}</Link>
          <Link href="/about">{t.nav.about}</Link>
          <Link href="/support">{t.nav.support}</Link>
          <Link href="/chat">{t.nav.chat}</Link>
          <Link href="/login">{t.nav.login}</Link>
          <Link href="/signup">{t.nav.signup}</Link>

          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="rounded-md border border-white/20 px-3 py-1.5 hover:bg-white/10 transition"
          >
            {t.langSwitch}
          </button>
        </div>
      </div>
    </header>
  );
}
