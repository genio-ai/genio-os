// pages/index.js
import { useMemo, useState } from "react";

export default function Home() {
  const [locale, setLocale] = useState("en");

  const t = useMemo(() => {
    const en = {
      dir: "ltr",
      brand: "Genio Twin Studio",
      langToggle: "العربية",
      hero_title: "Create your smart twin… a better version of you",
      hero_sub: "It writes, speaks, appears, and responds for you — 24/7.",
      hero_cta: "✨ Create My Twin",
      steps_title: "Create your twin in 3 steps",
      step1_title: "Your Style",
      step1_desc: "Write 3–5 short lines that capture how you speak.",
      step2_title: "Voice Sample",
      step2_desc: "Record or upload a 5–10 min clear voice sample.",
      step3_title: "Generate Twin (Demo)",
      step3_desc: "We’ll simulate your twin for a quick test.",
      generate_btn: "Generate Twin (Demo)",
      sandbox_title: "Try your twin (Demo)",
      sandbox_placeholder: "Ask your twin something…",
      sandbox_send: "Send",
      trust_title: "Why trust Genio Twin?",
      trust_b1: "No stock faces. No generic posts. Your voice, your rules.",
      trust_b2: "Review-First by default: nothing publishes without approval.",
      trust_b3: "Brand guardrails: tone, templates, and visual system enforced.",
      footer_note: "Your twin. Your presence. 24/7.",
      footer_cta: "Start Now",
      toast_generated: "Demo twin is ready.",
      toast_needSeeds: "Please add at least 1 style line.",
      nav_about: "About",
      nav_support: "Support",
      nav_login: "Login",
      nav_chat: "Chat",
      disclaimer_title: "Disclaimer",
      disclaimer_text:
        "This is a demo experience. AI may be inaccurate. Nothing is posted or sent without explicit approval.",
      disclaimer_close: "Close",
      footer_rights: "© 2025 Genio Systems. All rights reserved.",
      footer_privacy: "Privacy",
      footer_terms: "Terms",
      footer_disclaimer: "Disclaimer",
    };

    const ar = {
      dir: "rtl",
      brand: "Genio Twin Studio",
      langToggle: "ENGLISH",
      hero_title: "اصنع توأمك الذكي… نسخة محسّنة منك",
      hero_sub: "يكتب، يتكلم، يظهر، ويرد عنك — على مدار الساعة.",
      hero_cta: "✨ أنشئ توأمي",
      steps_title: "أنشئ توأمك بثلاث خطوات",
      step1_title: "أسلوبك",
      step1_desc: "اكتب ٣–٥ جمل قصيرة تعبّر عن طريقتك بالكلام.",
      step2_title: "عينة صوت",
      step2_desc: "سجّل أو ارفع 5–10 دقائق بصوت واضح.",
      step3_title: "أنشئ التوأم (تجريبي)",
      step3_desc: "ننشئ محاكاة سريعة لتجربة التوأم.",
      generate_btn: "أنشئ التوأم (تجريبي)",
      sandbox_title: "جرّب توأمك (تجريبي)",
      sandbox_placeholder: "اسأل توأمك سؤالًا…",
      sandbox_send: "إرسال",
      trust_title: "لماذا تثق بـ Genio Twin؟",
      trust_b1: "بدون وجوه ستوك. بدون قوالب عامة. صوتك وقواعدك أنت.",
      trust_b2: "وضع المراجعة أولًا: لا يُنشر شيء دون موافقتك.",
      trust_b3: "حماية العلامة: نبرة، قوالب، ونظام بصري مُلزم.",
      footer_note: "توأمك. حضورك. طوال الوقت.",
      footer_cta: "ابدأ الآن",
      toast_generated: "تم تجهيز التوأم التجريبي.",
      toast_needSeeds: "رجاءً أضف سطرًا واحدًا على الأقل.",
      nav_about: "من نحن",
      nav_support: "الدعم",
      nav_login: "تسجيل الدخول",
      nav_chat: "المحادثة",
      disclaimer_title: "تنبيه",
      disclaimer_text:
        "هذه تجربة تجريبية. قد تحتوي ردود الذكاء الاصطناعي على أخطاء. لا يتم نشر أو إرسال أي شيء دون موافقة صريحة.",
      disclaimer_close: "إغلاق",
      footer_rights: "© 2025 Genio Systems. جميع الحقوق محفوظة.",
      footer_privacy: "الخصوصية",
      footer_terms: "الشروط",
      footer_disclaimer: "إخلاء مسؤولية",
    };

    return locale === "ar" ? ar : en;
  }, [locale]);

  const [styleSeeds, setStyleSeeds] = useState("");
  const [voiceFileName, setVoiceFileName] = useState("");
  const [twinReady, setTwinReady] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleGenerate = () => {
    if (!styleSeeds.trim()) {
      alert(t.toast_needSeeds);
      return;
    }
    setTwinReady(true);
    alert(t.toast_generated);
  };

  const handleSend = async () => {
    const q = chatInput.trim();
    if (!q) return;
    setChat((c) => [...c, { role: "user", content: q }]);
    setChatInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: q,
          locale,
          style: styleSeeds,
        }),
      });
      const data = await res.json();
      const reply =
        data?.reply ||
        (locale === "ar" ? "تعذّر توليد رد." : "No reply available.");
      setChat((c) => [...c, { role: "assistant", content: reply }]);
    } catch {
      setChat((c) => [
        ...c,
        {
          role: "assistant",
          content:
            locale === "ar"
              ? "حدث خطأ غير متوقع."
              : "An unexpected error occurred.",
        },
      ]);
    }
  };

  return (
    <div dir={t.dir}>
      {/* NAVBAR */}
      <header className="topbar">
        <div className="container row">
          <a className="brand" href="/">{t.brand}</a>
          <nav className="navlinks">
            <a href="/about">{t.nav_about}</a>
            <a href="/support">{t.nav_support}</a>
            <a href="/login">{t.nav_login}</a>
            <a href="/chat">{t.nav_chat}</a>
            <button
              className="lang"
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              aria-label="toggle language"
            >
              {t.langToggle}
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container grid2">
          <div>
            <h1 className="title">{t.hero_title}</h1>
            <p className="subtitle">{t.hero_sub}</p>
            <a href="#onboarding" className="cta">{t.hero_cta}</a>
          </div>
          <div className="heroCard" aria-hidden="true" />
        </div>
      </section>

      {/* STEPS (UNCHANGED VISUALS) */}
      <section id="onboarding" className="section">
        <div className="container">
          <h2 className="h2">{t.steps_title}</h2>
          <div className="cards">
            <div className="card">
              <h3 className="h3">{t.step1_title}</h3>
              <p className="muted">{t.step1_desc}</p>
              <textarea
                className="inputArea"
                placeholder={
                  locale === "ar"
                    ? "اكتب كل سطر كجملة قصيرة…"
                    : "One short line per style cue…"
                }
                value={styleSeeds}
                onChange={(e) => setStyleSeeds(e.target.value)}
              />
            </div>

            <div className="card">
              <h3 className="h3">{t.step2_title}</h3>
              <p className="muted">{t.step2_desc}</p>
              <label className="fileBox">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) =>
                    setVoiceFileName(e.target.files?.[0]?.name || "")
                  }
                />
                <span>
                  {voiceFileName
                    ? (locale === "ar" ? "تم اختيار: " : "Selected: ") +
                      voiceFileName
                    : locale === "ar"
                    ? "اختر ملف صوتي (اختياري للتجربة)"
                    : "Choose audio file (optional for demo)"}
                </span>
              </label>
            </div>

            <div className="card">
              <h3 className="h3">{t.step3_title}</h3>
              <p className="muted">{t.step3_desc}</p>
              <button className="cta full" onClick={handleGenerate}>
                {t.generate_btn}
              </button>
              {twinReady && <p className="ok">{t.toast_generated}</p>}
            </div>
          </div>
        </div>
      </section>

      {/* SANDBOX CHAT (same spot) */}
      <section className="section alt">
        <div className="container">
          <h2 className="h2">{t.sandbox_title}</h2>
          <div className="chatBox">
            <div className="chatScroll">
              {chat.map((m, i) => (
                <div key={i} className={`bubble ${m.role === "user" ? "you" : "bot"}`}>
                  {m.content}
                </div>
              ))}
            </div>
            <div className="chatInputRow">
              <input
                type="text"
                className="inputText"
                placeholder={t.sandbox_placeholder}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className="cta small" onClick={handleSend}>
                {t.sandbox_send}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section">
        <div className="container">
          <h2 className="h2">{t.trust_title}</h2>
          <div className="trustGrid">
            <div className="trustCard">{t.trust_b1}</div>
            <div className="trustCard">{t.trust_b2}</div>
            <div className="trustCard">{t.trust_b3}</div>
          </div>
        </div>
      </section>

      {/* FOOTER + DISCLAIMER */}
      <footer className="footer">
        <div className="container footGrid">
          <div className="muted">{t.footer_rights}</div>
          <div className="footLinks">
            <a href="/about">{t.nav_about}</a>
            <a href="/support">{t.nav_support}</a>
            <a onClick={() => setShowDisclaimer(true)} href="#" aria-label="disclaimer">
              {t.footer_disclaimer}
            </a>
            <a href="/privacy">{t.footer_privacy}</a>
            <a href="/terms">{t.footer_terms}</a>
          </div>
        </div>
      </footer>

      {showDisclaimer && (
        <div className="modalBackdrop" onClick={() => setShowDisclaimer(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="h3">{t.disclaimer_title}</h3>
            <p className="muted">{t.disclaimer_text}</p>
            <button className="cta small" onClick={() => setShowDisclaimer(false)}>
              {t.disclaimer_close}
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        :root{
          --bg:#0b1d3a; --bg2:#0e2140; --panel2:#09162e;
          --border:rgba(255,255,255,.08); --text:#fff; --muted:rgba(255,255,255,.8);
          --gold:#ffd54a; --ok:#7dd38c;
        }
        *{box-sizing:border-box}
        html,body{margin:0;background:var(--bg);color:var(--text);
          font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
        a{text-decoration:none;color:inherit}
        .container{max-width:1120px;margin:0 auto;padding:0 16px}
        .row{display:flex;align-items:center;justify-content:space-between}
        .topbar{position:sticky;top:0;z-index:20;background:var(--bg);border-bottom:1px solid var(--border);padding:10px 0}
        .brand{font-weight:800;letter-spacing:.4px}
        .navlinks{display:flex;gap:14px;align-items:center}
        .navlinks a{opacity:.9}
        .navlinks a:hover{opacity:1}
        .lang{background:#1b2c4d;border:1px solid var(--border);color:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
        .hero{background:var(--bg);padding:56px 0}
        .grid2{display:grid;grid-template-columns:1fr;gap:24px}
        @media(min-width:900px){.grid2{grid-template-columns:1.2fr .8fr}}
        .title{font-size:34px;line-height:1.2;font-weight:900}
        @media(min-width:700px){.title{font-size:48px}}
        .subtitle{margin-top:12px;font-size:18px;color:var(--muted)}
        .cta{display:inline-flex;align-items:center;justify-content:center;background:var(--gold);color:#102244;font-weight:700;padding:12px 18px;border-radius:12px;box-shadow:0 6px 20px rgba(255,213,74,.25)}
        .cta:hover{filter:brightness(.97)}
        .cta.full{width:100%}.cta.small{padding:10px 14px}
        .heroCard{height:260px;border-radius:18px;border:1px solid var(--border);
          background: radial-gradient(60% 100% at 50% 0%, rgba(255,213,74,.25), transparent 60%), linear-gradient(135deg,#0f2447,var(--bg));
        }
        .section{padding:56px 0;background:var(--bg2)}
        .section.alt{background:var(--panel2)}
        .h2{font-size:26px;font-weight:800}.h3{margin:6px 0 6px;font-size:16px;font-weight:700}
        .muted{color:var(--muted);font-size:14px}
        .cards{display:grid;grid-template-columns:1fr;gap:16px;margin-top:18px}
        @media(min-width:900px){.cards{grid-template-columns:repeat(3,1fr)}}
        .card{background:rgba(11,29,58,.6);border:1px solid var(--border);border-radius:14px;padding:16px}
        .inputArea{width:100%;height:140px;border-radius:10px;border:1px solid var(--border);background:#0a1a35;color:#fff;padding:10px;font-size:14px}
        .fileBox{display:block;border:1px dashed var(--border);background:#0a1a35;color:#fff;border-radius:10px;padding:12px;margin-top:10px;cursor:pointer}
        .fileBox input{display:none}
        .ok{margin-top:10px;color:var(--ok);font-size:14px}
        .chatBox{margin-top:16px;border:1px solid var(--border);border-radius:14px;background:rgba(11,29,58,.6);padding:12px}
        .chatScroll{height:240px;overflow:auto;border:1px solid var(--border);border-radius:10px;padding:10px;background:#0b1d3a}
        .bubble{max-width:75%;padding:10px 12px;border-radius:12px;margin:6px 0;font-size:14px;line-height:1.35}
        .you{background:#1b2c4d;margin-inline-start:auto}.bot{background:#11223f;border:1px solid var(--border)}
        .chatInputRow{display:flex;gap:8px;margin-top:10px}
        .inputText{flex:1;border:1px solid var(--border);border-radius:10px;background:#0b1d3a;color:#fff;padding:10px;font-size:14px}
        .trustGrid{display:grid;grid-template-columns:1fr;gap:12px;margin-top:16px}
        @media(min-width:900px){.trustGrid{grid-template-columns:repeat(3,1fr)}}
        .trustCard{background:rgba(11,29,58,.6);border:1px solid var(--border);border-radius:14px;padding:16px;font-size:14px}
        .footer{background:var(--bg);padding:18px 0;border-top:1px solid var(--border)}
        .footGrid{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
        .footLinks{display:flex;gap:14px}
        .modalBackdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:50}
        .modal{background:#0b1d3a;border:1px solid var(--border);border-radius:14px;max-width:520px;padding:18px}
      `}</style>
    </div>
  );
}
