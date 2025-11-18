"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const TEXT = {
  en: {
    brand: "Link Chain",
    tagline: "One link → instant income",
    heroTitle: "Get a ready affiliate link. Start earning today.",
    heroSub:
      "No network signups, no setup. We provide a high-converting link + plug-and-post kit — copy, share, earn.",
    btnGetLink: "Get My Link",
    btnContact: "Contact Us",
    how: "How it works",
    trustedTitle: "Trusted by creators & partners",
    trustedSub: "Proven offers. Real payouts. Scalable.",
    contactTitle: "Contact Link Chain",
    contactName: "Your name",
    contactEmail: "Your email",
    contactMsg: "Message (short)",
    send: "Send Message",
    sending: "Sending...",
    sent: "Message sent successfully!",
    footer: "© Link Chain • All rights reserved",
  },
  ar: {
    brand: "لينك تشين",
    tagline: "رابط واحد → دخل فوري",
    heroTitle: "احصل على رابط أفلييت جاهز. ابدأ بالربح اليوم.",
    heroSub:
      "بدون تسجيلات في شبكات، ولا إعدادات معقّدة. نوفر لك رابطاً ناجحاً + أدوات نشر جاهزة — انسخ، شارك، واربح.",
    btnGetLink: "احصل على رابط",
    btnContact: "تواصل معنا",
    how: "كيف تعمل",
    trustedTitle: "موثوق من المبدعين والشركاء",
    trustedSub: "عروض مجرّبة. دفعات حقيقية. قابلية للتوسع.",
    contactTitle: "تواصل مع لينك تشين",
    contactName: "اسمك",
    contactEmail: "بريدك",
    contactMsg: "رسالتك (موجز)",
    send: "إرسال الرسالة",
    sending: "جاري الإرسال...",
    sent: "تم إرسال الرسالة بنجاح!",
    footer: "© لينك تشين • جميع الحقوق محفوظة",
  },
};

export default function Page() {
  const [lang, setLang] = useState("en");
  const t = TEXT[lang];

  const [contactOpen, setContactOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const l = localStorage.getItem("lc_lang");
    if (l) setLang(l);
  }, []);

  useEffect(() => {
    localStorage.setItem("lc_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  async function sendForm() {
    if (!form.email || !form.message) {
      alert(lang === "ar" ? "أدخل بريدك ورسالتك" : "Please enter email and message");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lang }),
      });

      const data = await res.json();

      if (data.success) {
        alert(t.sent);
        setForm({ name: "", email: "", message: "" });
        setContactOpen(false);
      } else {
        alert(data.message);
      }
    } catch (e) {
      alert(lang === "ar" ? "حدث خطأ أثناء الإرسال" : "Error sending message");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold rounded-md">
              LC
            </div>
            <div>
              <div className="text-sm font-semibold">{t.brand}</div>
              <div className="text-xs text-gray-500">{t.tagline}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/get-link" className="hidden sm:inline-block text-sm hover:underline">
              {t.btnGetLink}
            </Link>
            <Link href="/how" className="hidden sm:inline-block text-sm hover:underline">
              {t.how}
            </Link>

            <button
              onClick={() => setContactOpen(true)}
              className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
            >
              {t.btnContact}
            </button>

            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="px-3 py-1 border rounded text-sm"
            >
              {lang === "en" ? "عربي" : "EN"}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* TEXT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {t.heroTitle}
            </h1>

            <p className="mt-6 text-gray-600 max-w-xl">
              {t.heroSub}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/get-link"
                className="px-6 py-3 bg-indigo-600 text-white rounded shadow font-medium"
              >
                {t.btnGetLink}
              </Link>

              <button
                onClick={() => setContactOpen(true)}
                className="px-6 py-3 border rounded font-medium bg-white"
              >
                {t.btnContact}
              </button>
            </div>
          </div>

          {/* SIDE BOX */}
          <div className="bg-white shadow p-6 rounded-xl">
            <div className="text-sm text-gray-500 mb-3">{lang === "en" ? "Why Link Chain?" : "لماذا لينك تشين؟"}</div>
            <div className="space-y-3 text-sm">
              <div>• {lang === "en" ? "High-converting offers" : "عروض ذات تحويل عالي"}</div>
              <div>• {lang === "en" ? "Plug-and-post media kit" : "عدة نشر جاهزة"}</div>
              <div>• {lang === "en" ? "Instant link delivery" : "رابط جاهز فوراً"}</div>
              <div>• {lang === "en" ? "No sign-ups needed" : "بدون اشتراكات أو تسجيلات"}</div>
            </div>
          </div>

        </div>
      </section>

      {/* TRUST */}
      <section className="py-10 border-t bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-lg font-bold">{t.trustedTitle}</h3>
          <p className="text-sm text-gray-500 mt-1">{t.trustedSub}</p>

          <div className="flex gap-4 mt-6">
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-6 flex justify-between text-sm text-gray-600">
          <div>{t.footer}</div>
          <button
            onClick={() => setContactOpen(true)}
            className="hover:underline"
          >
            {t.btnContact}
          </button>
        </div>
      </footer>

      {/* CONTACT MODAL */}
      {contactOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{t.contactTitle}</h3>
              <button onClick={() => setContactOpen(false)}>✕</button>
            </div>

            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder={t.contactName}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="w-full border px-3 py-2 rounded"
                placeholder={t.contactEmail}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <textarea
                className="w-full border px-3 py-2 rounded h-24"
                placeholder={t.contactMsg}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <div className="mt-5 flex justify-between items-center">
              <button onClick={() => setContactOpen(false)} className="px-4 py-2 border rounded">
                {lang === "en" ? "Cancel" : "إلغاء"}
              </button>

              <button
                onClick={sendForm}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                {loading ? t.sending : t.send}
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
