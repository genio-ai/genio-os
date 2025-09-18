// pages/index.js
import { useState, useEffect } from "react";
import Header from "../components/header";
import Hero from "../components/hero";
import siteConfig from "../config/site";

export default function Home() {
  const [lang, setLang] = useState("en");

  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <main className="min-h-screen bg-[#0A0F1F] text-white">
      {/* Header with language toggle */}
      <Header lang={lang} toggleLang={toggleLang} />

      {/* Hero section */}
      <Hero lang={lang} content={siteConfig.hero[lang]} />
    </main>
  );
}
