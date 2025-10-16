// File: pages/index.js
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://genio.systems";
const OG_TITLE = "Genio OS — Gaza Relief";
const OG_DESC =
  "Donate securely via PayPal to deliver direct humanitarian aid for families in Gaza.";

const PAYPAL_LINK = process.env.NEXT_PUBLIC_PAYPAL_LINK || "";

// Optional: default hero & inner images (you can replace with /public files)
const HERO_IMG =
  "https://images.pexels.com/photos/13100143/pexels-photo-13100143.jpeg?auto=compress&cs=tinysrgb&h=1100";
const IMG_WHY =
  "https://images.pexels.com/photos/13100133/pexels-photo-13100133.jpeg?auto=compress&cs=tinysrgb&h=720";
const IMG_TRUST =
  "https://images.pexels.com/photos/13100140/pexels-photo-13100140.jpeg?auto=compress&cs=tinysrgb&h=720";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState("ar"); // 'ar' | 'en'
  const [amount, setAmount] = useState(25);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const menuBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const t = useMemo(() => {
    const copy = {
      ar: {
        navContact: "اتصل بنا",
        navEmail: "البريد",
        switchAr: "عربي",
        switchEn: "English",
        heroTitle: "غزة تنزف… لكنها ما زالت صامدة",
        heroDesc:
          "تبرّعك اليوم ينقذ عائلة. سنرسل لك على واتساب وإيميل تحديثات موثّقة أين ذهب تبرعك وماذا أنجزنا.",
        donateNow: "تبرّع الآن",
        formTitle: "اكمل بياناتك قبل التبرّع",
        name: "الاسم (إلزامي)",
        whatsapp: "رقم واتساب (اختياري بصيغة دولية +971…)",
        email: "الإيميل (اختياري)",
        chooseAmount: "اختر المبلغ",
        otherAmount: "مبلغ آخر",
        agree:
          "أوافق على استلام التحديثات عبر واتساب/الإيميل حول تبرعي والمشاريع.",
        saveAndPay: "إرسال وحفظ ثم الدفع",
        whyTitle: "لماذا هذه الحملة؟",
        whyText:
          "آلاف العائلات في غزة فقدت منازلها ومصدر رزقها. هدفنا توصيل مساعدات إنسانية مباشرة وشفافة (غذاء، ماء، أدوية، مساكن مؤقتة) عبر تبرعات آمنة من PayPal.",
        trustTitle: "الشفافية أولاً",
        trustBullets: [
          "100% من التبرعات تُخصص للمساعدات الإنسانية.",
          "توثيق بالصور والفيديو للتسليم والتأثير.",
          "تقارير مبسّطة بالمبالغ والإنفاق.",
        ],
        contactTitle: "للتواصل",
        contactLine: "info@genio.systems · WhatsApp: +972-000-000-000",
        footer:
          "معًا نبني الأمل — تبرعك اليوم قد يغيّر يومًا كاملًا لعائلة في غزة.",
        errName: "الاسم مطلوب.",
        errAmount: "حدد مبلغ صحيح (≥ 1).",
        errGeneric: "حدث خطأ غير متوقع. سنكمل فتح PayPal.",
        okSaved: "تم حفظ بياناتك، سيتم فتح PayPal الآن…",
      },
      en: {
        navContact: "Contact Us",
        navEmail: "Email",
        switchAr: "عربي",
        switchEn: "English",
        heroTitle: "Gaza is bleeding… yet still standing",
        heroDesc:
          "Your donation helps a family today. We’ll send verified WhatsApp & email updates showing where your money goes and what we accomplish.",
        donateNow: "Donate Now",
        formTitle: "Complete your details before donating",
        name: "Name (required)",
        whatsapp: "WhatsApp (optional, international format +971…)",
        email: "Email (optional)",
        chooseAmount: "Choose an amount",
        otherAmount: "Custom amount",
        agree:
          "I agree to receive WhatsApp/Email updates about my donation and the project.",
        saveAndPay: "Save & Pay",
        whyTitle: "Why this campaign?",
        whyText:
          "Thousands of families in Gaza have lost their homes and income. Our goal is to deliver direct, transparent aid (food, water, medicine, temporary shelter) through secure PayPal donations.",
        trustTitle: "Transparency First",
        trustBullets: [
          "100% of donations go to humanitarian aid.",
          "Every distribution is documented with photos/videos.",
          "Simple reports of amounts received and spent.",
        ],
        contactTitle: "Contact",
        contactLine: "info@genio.systems · WhatsApp: +972-000-000-000",
        footer:
          "Together we rebuild hope — your donation today can change a family’s day in Gaza.",
        errName: "Name is required.",
        errAmount: "Please choose a valid amount (≥ 1).",
        errGeneric: "Unexpected error. We will proceed to PayPal.",
        okSaved: "Saved. Opening PayPal…",
      },
    };
    return copy[lang];
  }, [lang]);

  const preset = [10, 25, 50, 100];

  function openPayPal(finalAmount) {
    const amt = Math.max(1, Number(finalAmount || amount) || 1);

    if (PAYPAL_LINK) {
      const base = PAYPAL_LINK.replace(/\/+$/, "");
      const url = `${base}/${amt}`;
      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    // Fallback to your server checkout route
    const params = new URLSearchParams({
      amount: String(amt),
      currency: "USD",
      ref: "gaza",
    });
    window.location.href = `/api/payments/checkout?${params.toString()}`;
  }

  async function saveAndDonate() {
    try {
      setErr("");
      setOk("");
      if (!name.trim()) {
        setErr(t.errName);
        return;
      }
      const amt = Math.max(1, Number(amount) || 0);
      if (!amt || amt < 1) {
        setErr(t.errAmount);
        return;
      }

      setBusy(true);

      // Save donor (optional WhatsApp/email)
      const payload = {
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim(),
        amount: amt,
        lang,
        ref: "gaza",
      };

      let saved = false;
      try {
        const r = await fetch("/api/donors/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        saved = r.ok;
      } catch {
        saved = false;
      }

      if (saved) setOk(t.okSaved);
      else setErr(t.errGeneric);

      // Always proceed to PayPal (do not lose the donation)
      setTimeout(() => {
        openPayPal(amt);
        setBusy(false);
      }, 400);
    } catch {
      setErr(t.errGeneric);
      openPayPal(amount);
      setBusy(false);
    }
  }

  return (
    <div className={inter.className}>
      <Head>
        <title>{OG_TITLE}</title>
        <meta name="description" content={OG_DESC} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${SITE_URL}/`} />
        <meta name="theme-color" content="#0b111a" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta property="og:title" content={OG_TITLE} />
        <meta property="og:description" content={OG_DESC} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={OG_TITLE} />
        <meta name="twitter:description" content={OG_DESC} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />
      </Head>

      {/* Header */}
      <header
        ref={headerRef}
        className={scrolled ? "hdr scrolled" : "hdr"}
        aria-label="Site header"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        <div className="container nav">
          <Link href="/" className="brand" aria-label="Genio OS">
            {/* Nio logo + eyes + voice ripple */}
            <div className="nio-logo-wrap">
              <img src="/logo-nio.svg" alt="Nio logo" className="logo" />
              <div className="nio-eyes">
                <span className="eye eye-left" />
                <span className="eye eye-right" />
              </div>
              <div className="nio-voice" aria-hidden />
            </div>
            <span className="brand-name brand-name--neon">Genio OS</span>
          </Link>

          <div className="actions">
            <Link className="btn btn-outline" href="/contact">
              {t.navContact}
            </Link>
            <a className="btn btn-outline" href="mailto:info@genio.systems">
              {t.navEmail}
            </a>

            {/* Language switch */}
            <div className="lang">
              <button
                className={lang === "ar" ? "lang-btn active" : "lang-btn"}
                onClick={() => setLang("ar")}
                aria-label="Arabic"
              >
                {t.switchAr}
              </button>
              <button
                className={lang === "en" ? "lang-btn active" : "lang-btn"}
                onClick={() => setLang("en")}
                aria-label="English"
              >
                {t.switchEn}
              </button>
            </div>

            <button
              ref={menuBtnRef}
              className="menu-chip"
              onClick={() => setMenuOpen(true)}
            >
              ☰ Menu
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div id="mobile-drawer" className="sheet" role="dialog">
          <div className="backdrop" onClick={() => setMenuOpen(false)} />
          <aside className="panel" ref={panelRef}>
            <div className="panel-head">
              <span className="brand-name brand-name--neon">Genio OS</span>
              <button
                ref={closeBtnRef}
                className="close"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="panel-links">
              <Link href="/chat">Chat</Link>
              <Link href="/
