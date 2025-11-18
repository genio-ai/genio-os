// app/get-link/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const translations = {
  en: {
    title: "Get your ready affiliate link",
    desc: "Enter a nickname (optional) and press generate. Copy the plug-and-post kit and start sharing.",
    placeholder: "Enter nickname (e.g. ali007) — optional",
    generate: "Generate My Link",
    yourLink: "Your Link",
    plugKit: "Plug & Post Kit",
    note: "In production this calls /api/generate-link to create a sub-id and save the client record.",
  },
  ar: {
    title: "احصل على رابط الأفلييت الجاهز",
    desc: "أدخل اسمًا مستعارًا (اختياري) ثم اضغط توليد. انسخ أدوات النشر وابدأ بالمشاركة.",
    placeholder: "أدخل اسمًا مستعارًا (مثال: ali007) — اختياري",
    generate: "ولّد رابط",
    yourLink: "رابطك",
    plugKit: "أدوات النشر الجاهزة",
    note: "في الإنتاج يتم استدعاء /api/generate-link لحفظ العميل وتوليد sub-id.",
  },
};

export default function Page() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const [subId, setSubId] = useState("");
  const [generated, setGenerated] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("lc_lang");
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  async function generate() {
    const id = subId.trim() || `user${Math.floor(Math.random() * 9000) + 100}`;
    const link = `https://offer.example.com/?ref=YOUR_MASTER&subid=${encodeURIComponent(id)}`;
    setGenerated({ id, link });

    // Save client record (production: replace with real API)
    try {
      await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subId: id }),
      });
    } catch (e) {
      // fallback silent
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">← {lang === "en" ? "Back to Home" : "عودة"}</Link>

        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="mt-2 text-gray-600">{t.desc}</p>

          <div className="mt-6 grid gap-3">
            <input
              value={subId}
              onChange={(e) => setSubId(e.target.value)}
              placeholder={t.placeholder}
              className="w-full border px-3 py-2 rounded"
            />
            <button onClick={generate} className="w-full bg-indigo-600 text-white px-4 py-2 rounded">{t.generate}</button>
          </div>

          {generated && (
            <div className="mt-6 p-4 bg-gray-50 rounded border">
              <div className="text-sm text-gray-500">{t.yourLink}</div>
              <div className="mt-2 flex items-center gap-3">
                <input readOnly value={generated.link} className="flex-1 px-3 py-2 border rounded font-mono text-sm" />
                <button onClick={() => navigator.clipboard.writeText(generated.link)} className="px-3 py-2 bg-indigo-600 text-white rounded">{lang === "en" ? "Copy" : "انسخ"}</button>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-500">{t.plugKit}</div>
                <div className="mt-2 space-y-2 text-sm">
                  <div>- {lang === "en" ? `Ready caption: "Tested & working — click here: ${generated.link}"` : `نص جاهز: "مضمون ويعمل — اضغط هنا: ${generated.link}"`}</div>
                  <div>- {lang === "en" ? "Best channels: WhatsApp, TikTok, Snapchat" : "أفضل قنوات: واتساب، تيك توك، سناب"}</div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">{t.note}</div>
            </div>
          )}
        </div>
      </div>no
    </main>
  );
}
