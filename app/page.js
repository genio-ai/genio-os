// app/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Link Chain — Landing (Smart Get Link + Samples + Contact)
 * - Smart login: uses localStorage 'lc_token' to detect session
 * - If not present: opens modal to register minimal client (email/name)
 * - Calls POST /api/clients with { name, email, lang } and expects { success, token, subId }
 * - Contact posts to POST /api/contact { name, email, message, lang }
 *
 * Notes:
 * - Provide /api endpoints server-side later (I can send code).
 * - Place sample images under /public/offers/ (appboost.jpg, vpnsecure.jpg, finpay.jpg)
 */

const COPY = {
  en: {
    brandTitle: "Share to earn",
    subtitle: "Get a ready affiliate link — start earning now.",
    heroText:
      "No network signups, no setup. We provide a high-converting link + media kit — copy, share, earn.",
    getLink: "Get My Link",
    how: "How it works",
    contact: "Contact Us",
    samplesTitle: "Real offers — sample links",
    preview: "Preview Link",
    copyLink: "Copy link",
    copyDone: "Copied!",
    loginTitle: "Quick signup to get your link",
    loginNote: "We only need a name & email. No complicated approvals.",
    submit: "Create my link",
    sending: "Please wait…",
    contactTitle: "Contact Link Chain",
    contactSend: "Send Message",
    contactSent: "Message sent — we'll reply soon.",
    dashboardRedirect: "Opening your dashboard…",
    sampleKit: "Plug & Post Kit",
    sampleCaption: 'Ready caption: "Tested & working — click: {link}"',
  },
  ar: {
    brandTitle: "شارك واربح",
    subtitle: "احصل على رابط جاهز — وابدأ بالربح فورًا.",
    heroText:
      "بدون تسجيلات في شبكات، لا إعدادات معقدة. نوفر رابطًا ناجحًا + أدوات نشر — انسخ، شارك، واربح.",
    getLink: "احصل على رابط",
    how: "كيف تعمل",
    contact: "تواصل معنا",
    samplesTitle: "عروض حقيقية — عينات روابط",
    preview: "عرض الرابط",
    copyLink: "انسخ الرابط",
    copyDone: "تم النسخ!",
    loginTitle: "تسجيل سريع للحصول على رابطك",
    loginNote: "نحتاج فقط اسم وبريد. بدون موافقات معقدة.",
    submit: "انشئ رابطى",
    sending: "يرجى الانتظار…",
    contactTitle: "تواصل مع لينك تشين",
    contactSend: "أرسل الرسالة",
    contactSent: "تم إرسال الرسالة — سنرد قريبًا.",
    dashboardRedirect: "نحو لوحة التحكم…",
    sampleKit: "أدوات النشر الجاهزة",
    sampleCaption: 'نص جاهز: "مضمون ويعمل — اضغط: {link}"',
  },
};

const SAMPLES = [
  {
    id: "sample_1",
    title: "AppBoost Pro — Mobile Growth",
    geo: "UAE / KSA",
    epc: "$2.10",
    conv: "6.2%",
    img: "/offers/appboost.jpg",
    link: "https://offer.example.com/?ref=MASTER&subid=sample_1",
  },
  {
    id: "sample_2",
    title: "VPN Secure+ — Lifetime deal",
    geo: "Global",
    epc: "$1.45",
    conv: "4.1%",
    img: "/offers/vpnsecure.jpg",
    link: "https://offer.example.com/?ref=MASTER&subid=sample_2",
  },
  {
    id: "sample_3",
    title: "FinPay — Microloans App",
    geo: "EG / JO / LB",
    epc: "$3.20",
    conv: "8.8%",
    img: "/offers/finpay.jpg",
    link: "https://offer.example.com/?ref=MASTER&subid=sample_3",
  },
];

export default function Page() {
  const [lang, setLang] = useState("en");
  const t = COPY[lang];

  // UI state
  const [contactOpen, setContactOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [sampleOpen, setSampleOpen] = useState(null); // sample object or null
  const [toast, setToast] = useState(null);

  // Form states
  const [loginForm, setLoginForm] = useState({ name: "", email: "" });
  const [loginLoading, setLoginLoading] = useState(false);

  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lc_lang");
    if (saved === "ar") setLang("ar");
    document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    localStorage.setItem("lc_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  /* ---------- Smart Get Link flow ---------- */
  function hasSession() {
    // Basic check — backend should validate token on protected endpoints
    return !!localStorage.getItem("lc_token");
  }

  function onGetLinkClick() {
    if (hasSession()) {
      // already logged-in -> go to dashboard
      setToast(t.dashboardRedirect);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 700);
      return;
    }
    // open quick signup modal
    setLoginOpen(true);
  }

  async function handleCreateClient() {
    if (!loginForm.email) {
      alert(lang === "ar" ? "أدخل بريدك" : "Please enter email");
      return;
    }
    setLoginLoading(true);

    try {
      // production: POST to /api/clients -> returns { success, token, subId }
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...loginForm, lang }),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        // store token locally and redirect /dashboard (or show link immediately)
        if (json.token) localStorage.setItem("lc_token", json.token);
        if (json.subId) localStorage.setItem("lc_subid", json.subId);

        setToast(lang === "ar" ? "تم إنشاء حسابك — جاري التوجيه" : "Account created — redirecting");
        setLoginOpen(false);
        setTimeout(() => (window.location.href = "/dashboard"), 700);
      } else {
        alert(json.message || (lang === "ar" ? "فشل الإنشاء" : "Failed to create"));
      }
    } catch (e) {
      console.error(e);
      alert(lang === "ar" ? "فشل الاتصال" : "Network error");
    }

    setLoginLoading(false);
  }

  /* ---------- Contact ---------- */
  async function handleContactSubmit() {
    if (!contactForm.email || !contactForm.message) {
      alert(lang === "ar" ? "أدخل بريدك ورسالتك" : "Enter email and message");
      return;
    }
    setContactLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contactForm, lang }),
      });
      const j = await res.json();
      if (res.ok && j.success) {
        setToast(t.contactSent);
        setContactForm({ name: "", email: "", message: "" });
        setContactOpen(false);
      } else {
        alert(j.message || (lang === "ar" ? "فشل الإرسال" : "Failed to send"));
      }
    } catch (e) {
      console.error(e);
      alert(lang === "ar" ? "فشل الاتصال" : "Network error");
    }
    setContactLoading(false);
  }

  /* ---------- Samples / preview ---------- */
  function openSample(sample) {
    setSampleOpen(sample);
  }
  function closeSample() {
    setSampleOpen(null);
  }
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      setToast(t.copyDone);
      setTimeout(() => setToast(null), 1200);
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">LC</div>
            <div>
              <div className="font-semibold">{t.brandTitle}</div>
              <div className="text-xs text-gray-500">{t.subtitle}</div>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")} className="px-3 py-1 border rounded text-sm">
              {lang === "en" ? "عربي" : "EN"}
            </button>

            <button onClick={() => setContactOpen(true)} className="px-3 py-1 border rounded text-sm hidden sm:inline">
              {t.contact}
            </button>

            <Link href="/login" className="px-3 py-1 text-sm hidden sm:inline">Login</Link>

            <button onClick={onGetLinkClick} className="ml-2 px-5 py-2 bg-indigo-600 text-white rounded-md shadow">
              {t.getLink}
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{t.brandTitle}</h1>
            <p className="mt-4 text-gray-700 max-w-xl">{t.heroText}</p>

            <div className="mt-8 flex gap-3">
              <button onClick={onGetLinkClick} className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow">
                {t.getLink}
              </button>
              <a href="#how" className="px-6 py-3 border rounded-md">{t.how}</a>
            </div>
          </div>

          <aside className="bg-white rounded-xl shadow p-6">
            <div className="text-sm text-gray-500">Your Link (demo)</div>
            <div className="mt-3 flex items-center gap-3">
              <div className="rounded bg-gray-100 px-3 py-2 font-mono text-sm flex-1 break-all">https://offer.example.com/?ref=MASTER&subid=you123</div>
              <button onClick={() => copyToClipboard("https://offer.example.com/?ref=MASTER&subid=you123")} className="px-3 py-2 bg-indigo-600 text-white rounded">Copy</button>
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

            <div className="mt-3 text-xs text-gray-400">Updated in real-time</div>
          </aside>
        </div>
      </section>

      {/* Samples / Marketplace */}
      <section id="samples" className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t.samplesTitle}</h2>
          <div className="text-sm text-gray-500">Live samples to build trust</div>
        </div>

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLES.map((s) => (
            <div key={s.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-40 bg-gray-100">
                <img src={s.img} alt={s.title} className="object-cover w-full h-full" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-gray-500">{s.geo}</div>
                </div>

                <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                  <div className="px-2 py-1 bg-gray-50 rounded">EPC {s.epc}</div>
                  <div className="px-2 py-1 bg-gray-50 rounded">Conv {s.conv}</div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button onClick={() => openSample(s)} className="px-3 py-2 bg-indigo-600 text-white rounded">{t.preview}</button>
                  <a href={s.link} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded text-sm">Visit</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-7xl mx-auto px-6 py-10">
        <h3 className="text-xl font-semibold"> {lang === "en" ? "How it works" : "كيف تعمل"}</h3>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded shadow text-center">
            <div className="text-lg font-semibold">1 — {lang === "en" ? "Get link" : "الحصول على رابط"}</div>
            <div className="text-sm text-gray-600 mt-2">{lang === "en" ? "Generate your sub-id link instantly." : "توليد رابطك الخاص فوراً."}</div>
          </div>
          <div className="p-4 bg-white rounded shadow text-center">
            <div className="text-lg font-semibold">2 — {lang === "en" ? "Share" : "المشاركة"}</div>
            <div className="text-sm text-gray-600 mt-2">{lang === "en" ? "Use captions, images, and short clips to post." : "استخدم نصوص وصور جاهزة للنشر."}</div>
          </div>
          <div className="p-4 bg-white rounded shadow text-center">
            <div className="text-lg font-semibold">3 — {lang === "en" ? "Earn" : "الربح"}</div>
            <div className="text-sm text-gray-600 mt-2">{lang === "en" ? "Track results and request payouts." : "تابع النتائج واطلب سحوباتك."}</div>
          </div>
        </div>
      </section>

      {/* Contact block */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-semibold">{lang === "en" ? "Talk to the Link Chain team" : "تواصل مع فريق لينك تشين"}</h4>
            <p className="text-sm text-gray-600 mt-1">{lang === "en" ? "Have a big audience or agency? Let's discuss custom deals." : "عندك جمهور كبير أو وكالة؟ نتكلم عن عروض خاصة."}</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setContactOpen(true)} className="px-5 py-3 bg-indigo-600 text-white rounded">{t.contact}</button>
            <a href="mailto:hello@genio.systems" className="px-4 py-3 border rounded text-sm">hello@genio.systems</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <div className="font-semibold">{lang === "en" ? "Link Chain" : "لينك تشين"}</div>
            <div className="text-sm text-gray-500 mt-1">{t.subtitle}</div>
          </div>

          <div className="flex gap-8">
            <div>
              <div className="text-sm font-semibold">{lang === "en" ? "Company" : "الشركة"}</div>
              <div className="text-sm text-gray-600 mt-2">About · Terms · Payouts</div>
            </div>

            <div>
              <div className="text-sm font-semibold">{lang === "en" ? "Contact" : "تواصل"}</div>
              <div className="text-sm text-gray-600 mt-2">hello@genio.systems</div>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== Modals ===== */}

      {/* Login / Smart Signup Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t.loginTitle}</h3>
              <button onClick={() => setLoginOpen(false)} className="text-gray-500">✕</button>
            </div>

            <p className="text-sm text-gray-600 mt-2">{t.loginNote}</p>

            <div className="mt-4 space-y-3">
              <input placeholder={lang === "en" ? "Your name (optional)" : "اسمك (اختياري)"} value={loginForm.name} onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input placeholder={lang === "en" ? "Your email" : "بريدك"} value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} className="w-full border px-3 py-2 rounded" />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setLoginOpen(false)} className="px-4 py-2 border rounded">{lang === "en" ? "Cancel" : "إلغاء"}</button>
              <button onClick={handleCreateClient} disabled={loginLoading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loginLoading ? t.sending : t.submit}</button>
            </div>
          </div>
        </div>
      )}

      {/* Sample Preview Modal */}
      {sampleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="w-32 h-32 bg-gray-100 overflow-hidden rounded">
                <img src={sampleOpen.img} alt={sampleOpen.title} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold">{sampleOpen.title}</h4>
                <div className="text-sm text-gray-600 mt-1">{sampleOpen.geo} · EPC {sampleOpen.epc} · Conv {sampleOpen.conv}</div>

                <div className="mt-4">
                  <div className="text-sm text-gray-500 mb-1">{t.sampleKit}</div>
                  <div className="text-sm bg-gray-50 p-3 rounded break-words font-mono">{sampleOpen.link}</div>

                  <div className="mt-3 flex gap-3">
                    <button onClick={() => copyToClipboard(sampleOpen.link)} className="px-3 py-2 bg-indigo-600 text-white rounded">{t.copyLink}</button>
                    <a href={sampleOpen.link} target="_blank" rel="noreferrer" className="px-3 py-2 border rounded">Open</a>
                  </div>
                </div>
              </div>

              <div className="ml-4">
                <button onClick={closeSample} className="text-gray-500">✕</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t.contactTitle}</h3>
              <button onClick={() => setContactOpen(false)} className="text-gray-500">✕</button>
            </div>

            <div className="mt-3 space-y-3">
              <input placeholder={lang === "en" ? "Your name" : "اسمك"} value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <input placeholder={lang === "en" ? "Your email" : "بريدك"} value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full border px-3 py-2 rounded" />
              <textarea placeholder={lang === "en" ? "Message" : "رسالتك"} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} className="w-full border px-3 py-2 rounded h-28" />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setContactOpen(false)} className="px-4 py-2 border rounded">{lang === "en" ? "Cancel" : "إلغاء"}</button>
              <button onClick={handleContactSubmit} disabled={contactLoading} className="px-4 py-2 bg-indigo-600 text-white rounded">{contactLoading ? t.sending : t.contactSend}</button>
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
