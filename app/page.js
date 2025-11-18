// app/page.js
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Link Chain — Landing (Bilingual AR/EN)
 * - Language toggle stored in localStorage
 * - Direction (ltr/rtl) handled per language
 */

const translations = {
  en: {
    title: "Link Chain",
    tagline: "One link → instant income",
    heroTitle: "Grab a ready affiliate link. Start earning today.",
    heroDesc:
      "No network signup. No setup. We provide a high-converting link + plug-and-post kit — copy, share, earn.",
    getLink: "Get My Link",
    how: "How it works",
    plansTitle: "Pick a plan",
    planBasic: "Basic",
    planPro: "Pro",
    planVIP: "VIP",
    planBasicText: "One guaranteed link + post kit",
    planProText: "Two links + monthly update",
    planVIPText: "Three links + priority support",
    priceBasic: "29 AED",
    pricePro: "49 AED",
    priceVIP: "79 AED",
    footerNote:
      "Payments via Stripe/PayPal. After purchase you'll be redirected to generate your sub-id link.",
  },
  ar: {
    title: "لينك تشين",
    tagline: "رابط واحد → دخل فوري",
    heroTitle: "احصل على رابط أفلييت جاهز. ابدأ بالربح اليوم.",
    heroDesc:
      "لا تسجيل في شبكات. لا إعدادات معقّدة. نوفر رابط ناجح + أدوات نشر جاهزة — انسخ، شارك، واربح.",
    getLink: "احصل على رابط",
    how: "كيف تعمل",
    plansTitle: "اختر الباقة",
    planBasic: "أساسي",
    planPro: "برو",
    planVIP: "في أي بي",
    planBasicText: "رابط مضمون واحد + أدوات نشر",
    planProText: "رابطان + تحديث شهري",
    planVIPText: "ثلاثة روابط + دعم أولوية",
    priceBasic: "٢٩ درهم",
    pricePro: "٤٩ درهم",
    priceVIP: "٧٩ درهم",
    footerNote:
      "الدفع عبر Stripe/PayPal. بعد الشراء سيتم توجيهك لتوليد رابطك الخاص.",
  },
};

export default function Page() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  useEffect(() => {
    const saved = localStorage.getItem("lc_lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("lc_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              LC
            </div>
            <div>
              <h1 className="text-lg font-semibold">{t.title}</h1>
              <p className="text-xs text-gray-500">{t.tagline}</p>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link href="/get-link" className="text-sm hover:underline">
              {t.getLink}
            </Link>
            <Link href="/dashboard" className="text-sm hover:underline">
              {t.how}
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="px-3 py-1 border rounded text-sm"
                aria-label="Toggle language"
              >
                {lang === "en" ? "عربى" : "EN"}
              </button>
              <Link
                href="/admin"
                className="px-4 py-2 bg-indigo-600 text-white rounded text-sm"
              >
                Admin
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-extrabold leading-tight">
              {t.heroTitle}
            </h2>
            <p className="mt-6 text-gray-600">{t.heroDesc}</p>

            <div className="mt-8 flex gap-3">
              <Link
                href="/get-link"
                className="inline-block bg-indigo-600 text-white px-5 py-3 rounded-md shadow"
              >
                {t.getLink}
              </Link>
              <Link
                href="/dashboard"
                className="inline-block px-5 py-3 rounded-md border border-gray-200"
              >
                {t.how}
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="text-gray-500">{lang === "en" ? "No registration" : "بدون تسجيل"}</div>
                <div className="font-semibold">{lang === "en" ? "Start in 1 minute" : "ابدأ خلال دقيقة"}</div>
              </div>
              <div className="bg-white p-4 rounded shadow-sm">
                <div className="text-gray-500">{lang === "en" ? "Proven offers" : "عروض مجرّبة"}</div>
                <div className="font-semibold">{lang === "en" ? "High conversion" : "معدلات تحويل عالية"}</div>
              </div>
            </div>
          </div>

          <aside>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">{t.plansTitle}</h3>
              <p className="text-xs text-gray-500 mt-1">{lang === "en" ? "Choose one and get a working link immediately." : "اختر باقة واحصل على رابط يعمل فورًا."}</p>

              <div className="mt-6 space-y-4">
                <PlanCard name={t.planBasic} desc={t.planBasicText} price={t.priceBasic} />
                <PlanCard name={t.planPro} desc={t.planProText} price={t.pricePro} />
                <PlanCard name={t.planVIP} desc={t.planVIPText} price={t.priceVIP} />
              </div>

              <div className="mt-6 text-sm text-gray-500">
                {t.footerNote}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function PlanCard({ name, desc, price }) {
  return (
    <div className="flex items-center justify-between p-4 border rounded">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
      <div className="text-indigo-600 font-semibold">{price}</div>
    </div>
  );
}
