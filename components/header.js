// components/header.js
import Link from "next/link";

export default function Header({ lang = "en", toggleLang }) {
  const labels = {
    en: {
      brand: "Genio AI Studio",
      home: "Home",
      about: "About",
      support: "Support",
      chat: "Chat",
      login: "Login",
      signup: "Signup",
      switch: "AR",
    },
    ar: {
      brand: "Genio AI Studio",
      home: "الرئيسية",
      about: "حول",
      support: "الدعم",
      chat: "الدردشة",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      switch: "EN",
    },
  };

  const t = labels[lang];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0A0F1F]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-teal-300" />
          <span className="text-base font-semibold tracking-tight">
            {t.brand}
          </span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/">{t.home}</Link>
          <Link href="/about">{t.about}</Link>
          <Link href="/support">{t.support}</Link>
          <Link href="/chat">{t.chat}</Link>
          <Link href="/login">{t.login}</Link>
          <Link href="/signup">{t.signup}</Link>
        </nav>

        {/* Language Toggle */}
        <button
          onClick={toggleLang}
          className="ml-4 rounded-md border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10 transition"
        >
          {t.switch}
        </button>
      </div>
    </header>
  );
}
