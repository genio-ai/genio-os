// app/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Share to earn — Main Landing Page
 * - Minimal professional layout
 * - Header: Payouts link before Get My Link
 * - Single CTA (Get My Link) with smart demo signup (frontend-only)
 * - Minimum payout shown: 100 USD
 * - Contact via mailto (no backend)
 * - Bilingual (EN / AR) with RTL support
 *
 * Paste this file to: /app/page.js
 * Requires Tailwind (already set up in your project).
 */

const COPY = {
  en: {
    title: "Share to earn",
    subtitle: "Get a ready affiliate link — start earning today.",
    heroDesc: "No network signups — one link, media kit, clear tracking.",
    cta: "Get My Link",
    payouts: "Payouts",
    how: "How it works",
    contact: "Contact Us",
    minLabel: "Minimum payout",
    minValue: "100 USD",
    features: [
      { title: "Instant access", desc: "Get a link in seconds" },
      { title: "High-converting offers", desc: "Handpicked performance offers" },
      { title: "Transparent payouts", desc: "Weekly payouts when you reach $100" },
    ],
    loginTitle: "Quick signup — get your link",
    loginNote: "We only need name & email (demo).",
    createBtn: "Create my link",
    contactMail: "hello@genio.systems",
    contactSubject: "Contact from Share to earn",
  },
  ar: {
    title: "شارك لتربح",
    subtitle: "احصل على رابط جاهز — ابدأ بالربح اليوم.",
    heroDesc: "بدون تسجيل في شبكات — رابط واحد، أدوات نشر، وتتبع واضح.",
    cta: "احصل على رابط",
    payouts: "السحوبات",
    how: "كيف تعمل",
    contact: "تواصل معنا",
    minLabel: "الحد الأدنى للسحب",
    minValue: "100$",
    features: [
      { title: "وصول فوري", desc: "احصل على رابط خلال ثوان" },
      { title: "عروض تحويل عالية", desc: "عروض مختارة بأداء مثبت" },
      { title: "دفعات شفافة", desc: "دفعات أسبوعية عند بلوغ ١٠٠$" },
    ],
    loginTitle: "تسجيل سريع — احصل على رابطك",
    loginNote: "نحتاج اسم وبريد فقط (وضع عرض).",
    createBtn: "انشئ رابطى",
    contactMail: "hello@genio.systems",
    contactSubject: "تواصل من Share to earn",
  },
};

export default function Page() {
  const [lang, setLang] = useState("en");
  const t = COPY[lang];

  // UI state
  const [loginOpen, setLoginOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // forms
  const [client, setClient] = useState({ name: "", email: "" });

  useEffect(() => {
    const saved = localStorage.getItem("lc_lang");
    if (saved === "ar") setLang("ar");
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    localStorage.setItem("lc_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // demo session check
  function hasSession() {
    return !!localStorage.getItem("lc_demo_token");
  }

  function onGetLink() {
    if (hasSession()) {
      setToast(lang === "ar" ? "نحو لوحة التحكم…" : "Opening dashboard…");
      setTimeout(() => (window.location.href = "/dashboard"), 700);
      return;
    }
    setLoginOpen(true);
  }

  function createDemoClient() {
    if (!client.email) {
      alert(lang === "ar" ? "أدخل بريدك" : "Please enter your email");
      return;
    }
    const token = "demo_" + Math.random().toString(36).slice(2, 10);
    const subId = "demo_" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem("lc_demo_token", token);
    localStorage.setItem("lc_demo_subid", subId);
    setToast(lang === "ar" ? "تم الإنشاء — جاري التوجيه" : "Account created — redirecting");
    setLoginOpen(false);
    setTimeout(() => (window.location.href = "/dashboard"), 700);
  }

  function openPayouts() {
    window.location.href = "/payouts";
  }

  function openContactMail() {
    const subject = encodeURIComponent(t.contactSubject);
    const body = encodeURIComponent(`${lang === "ar" ? "الاسم" : "Name"}:\n\n${lang === "ar" ? "الرسالة" : "Message"}:\n`);
    window.location.href = `mailto:${t.contactMail}?subject=${subject}&body=${body}`;
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">{t.title}</div>
            <div className="text-sm text-gray-500 hidden sm:block">{t.subtitle}</div>
          </div>

          <nav className="flex items-center gap-3">
            <button onClick={openPayouts} className="text-sm hover:underline">
              {t.payouts}
            </button>
            <a href="#how" className="text-sm hidden sm:inline hover:underline">
              {t.how}
            </a>
            <button onClick={() => setContactOpen(true)} className="text-sm hidden sm:inline hover:underline">
              {t.contact}
            </button>

            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="px-3 py-1 border rounded text-sm">
              {lang === "en" ? "عربي" : "EN"}
            </button>

            <button onClick={onGetLink} className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow">
              {t.cta}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{t.title}</h1>
            <p className="mt-4 text-gray-700 max-w-xl">{t.heroDesc}</p>

            <div className="mt-6 flex items-center gap-3">
              <button onClick={onGetLink} className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow">
                {t.cta}
              </button>
              <a href="#how" className="px-5 py-3 border rounded-md text-sm">
                {t.how}
              </a>
            </div>

            <div className="mt-6 inline-flex items-center gap-4 text-sm text-gray-700">
              <div className="px-3 py-2 bg-gray-100 rounded">
                <div className="text-xs text-gray-500">{t.minLabel}</div>
                <div className="font-semibold">{t.minValue}</div>
              </div>
              <div className="text-sm text-gray-500">·</div>
              <div className="text-sm text-gray-500">{lang === "en" ? "Weekly payouts" : "دفعات أسبوعية"}</div>
            </div>
          </div>

          <aside className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500">{lang === "en" ? "Overview" : "نظرة عامة"}</div>

            <div className="mt-3 flex items-center gap-3">
              <div className="rounded bg-gray-100 px-3 py-2 font-mono text-sm flex-1 break-words">https://offer.example.com/?ref=MASTER&subid=you123</div>
              <button onClick={() => { navigator.clipboard.writeText("https://offer.example.com/?ref=MASTER&subid=you123"); setToast(lang === "ar" ? "تم النسخ!" : "Copied!"); setTimeout(() => setToast(null), 1200); }} className="px-3 py-2 bg-indigo-600 text-white rounded">
                Copy
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-500">Clicks</div>
                <div className="font-semibold">1,243</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-500">Conversions</div>
                <div className="font-semibold">87</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-500">Earnings</div>
                <div className="font-semibold">$1,240</div>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-400">{lang === "en" ? "Updated in real-time" : "مُحدثة بشكل فوري"}</div>
          </aside>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid sm:grid-cols-3 gap-6">
          {t.features.map((f, idx) => (
            <div key={idx} className="bg-white p-4 rounded shadow-sm">
              <div className="font-semibold">{f.title}</div>
              <div className="text-sm text-gray-600 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-8">
        <h3 className="text-xl font-semibold">{lang === "en" ? "How it works" : "كيف تعمل"}</h3>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded shadow text-center">
            <div className="font-semibold">1 — {lang === "en" ? "Get link" : "احصل على رابط"}</div>
            <div className="text-sm text-gray-600 mt-2">{lang === "en" ? "Quick signup & immediate sub-id" : "تسجيل سريع ورابط فوري"}</div>
          </div>
          <div className="p-4 bg-white rounded shadow text-center">
            <div className="font-semibold">2 — {lang === "en" ? "Share" : "شارك"}</div>
            <div className="text-sm text-gray-600 mt-2">{lang === "en" ? "Use captions & images provided" : "استخدم النصوص والصور الجاهزة"}</div>
          </div>
          <div className="p-4 bg-white rounded shadow text-center">
            <div className="font-semibold">3 — {lang === "en" ? "Earn" : "اربح"}</div>
            <div className="text-sm text-gray-600 mt-2">{lang === "en" ? "Reach $100 → request payout" : "عند بلوغ ١٠٠$ → اطلب سحب"}</div>
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <footer className="bg-white border-t mt-10">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <div className="text-lg font-semibold">{t.title}</div>
            <div className="text-sm text-gray-500 mt-1">{t.subtitle}</div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="bg-gray-50 p-5 rounded">
              <div className="font-semibold mb-2">{lang === "en" ? "Contact us" : "تواصل معنا"}</div>
              <div className="text-sm text-gray-600 mb-3">Email: <a href={`mailto:${t.contactMail}`} className="text-indigo-600">{t.contactMail}</a></div>
              <div className="text-sm text-gray-600">Or open your email client:</div>

              <div className="mt-3 space-y-2">
                <input placeholder={lang === "en" ? "Your name" : "اسمك"} value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full border px-3 py-2 rounded" />
                <input placeholder={lang === "en" ? "Your email" : "بريدك"} value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} className="w-full border px-3 py-2 rounded" />
                <textarea placeholder={lang === "en" ? "Message" : "رسالتك"} className="w-full border px-3 py-2 rounded h-24"></textarea>

                <div className="flex items-center justify-end gap-3 mt-2">
                  <button onClick={openContactMail} className="px-4 py-2 border rounded">{lang === "en" ? "Open email" : "افتح البريد"}</button>
                  <button onClick={() => { setToast(lang === "ar" ? "تم الإرسال (تجريبي)" : "Sent (demo)"); setTimeout(() => setToast(null), 1500); }} className="px-4 py-2 bg-indigo-600 text-white rounded">{lang === "en" ? "Send message" : "أرسل الرسالة"}</button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-6 pb-8 text-sm text-gray-500">© {new Date().getFullYear()} {t.title} — {lang === "en" ? "All rights reserved" : "جميع الحقوق محفوظة"}</div>
      </footer>

      {/* Login modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t.loginTitle}</h3>
              <button onClick={() => setLoginOpen(false)} className="text-gray-500">✕</button>
            </div>

            <p className="text-sm text-gray-600 mt-2">{t.loginNote}</p>

            <div className="mt-4 space-y-3">
              <input placeholder={lang === "en" ? "Name (optional)" : "الاسم (اختياري)"} value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input placeholder={lang === "en" ? "Email" : "البريد"} value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} className="w-full border px-3 py-2 rounded" />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setLoginOpen(false)} className="px-4 py-2 border rounded">{lang === "en" ? "Cancel" : "إلغاء"}</button>
              <button onClick={createDemoClient} className="px-4 py-2 bg-indigo-600 text-white rounded">{t.createBtn}</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-8 z-50">
          <div className="bg-black/90 text-white px-4 py-2 rounded">{toast}</div>
        </div>
      )}
    </main>
  );
}
