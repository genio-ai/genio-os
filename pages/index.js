// pages/index.js
import {useMemo, useState} from "react";

/**
 * Genio Twin Studio — Single-file MVP
 * - Pure React + CSS-in-file (no Tailwind, no extra deps)
 * - Bilingual EN/AR with instant toggle and automatic RTL/LTR
 * - Landing + Mini Onboarding + Demo Sandbox in one page
 */

export default function Home() {
  const [locale, setLocale] = useState("en"); // "en" | "ar"

  const t = useMemo(() => {
    const en = {
      dir: "ltr",
      langToggle: "العربية",
      brand: "Genio Twin Studio",
      hero_title: "Create your smart twin… a better version of you",
      hero_sub: "It writes, speaks, appears, and responds for you — 24/7.",
      hero_cta: "✨ Create My Twin",
      steps_title: "Create your twin in 3 steps",
      // CHANGED ↓
      step1_title: "Your Style",
      step1_desc: "Write 3–5 short lines that capture how you speak.",
      // END CHANGE
      step2_title: "Voice Sample",
      step2_desc: "Record or upload a 5–10 min clear voice sample.",
      // CHANGED ↓ (keep same English label, only AR changed)
      step3_title: "Generate Twin (Demo)",
      step3_desc: "We’ll simulate your twin for a quick test.",
      generate_btn: "Generate Twin (Demo)",
      // END CHANGE
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
      toast_needSeeds: "Please add at least 1 style line."
    };

    const ar = {
      dir: "rtl",
      langToggle: "ENGLISH",
      brand: "Genio Twin Studio",
      hero_title: "اصنع توأمك الذكي… نسخة محسّنة منك",
      hero_sub: "يكتب، يتكلم، يظهر، ويجيب عنك — على مدار الساعة.",
      hero_cta: "✨ أنشئ توأمي",
      steps_title: "أنشئ توأمك بثلاث خطوات",
      // CHANGED ↓
      step1_title: "أسلوبك",
      step1_desc: "اكتب ٣–٥ جمل قصيرة تعبّر عن طريقتك بالكلام.",
      // END CHANGE
      step2_title: "عينة صوت",
      step2_desc: "سجّل أو ارفع 5–10 دقائق بصوت واضح.",
      // CHANGED ↓ (AR wording)
      step3_title: "أنشئ التوأم (تجريبي)",
      step3_desc: "ننشئ محاكاة سريعة لتجربة التوأم.",
      generate_btn: "أنشئ التوأم (تجريبي)",
      // END CHANGE
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
      toast_needSeeds: "رجاءً أضف سطرًا واحدًا على الأقل كبذور أسلوب."
    };

    return locale === "ar" ? ar : en;
  }, [locale]);

  // Onboarding state
  const [styleSeeds, setStyleSeeds] = useState("");
  const [voiceFileName, setVoiceFileName] = useState("");
  const [twinReady, setTwinReady] = useState(false);

  // Demo chat
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState([]);

  const handleGenerate = () => {
    if (!styleSeeds.trim()) {
      alert(t.toast_needSeeds);
      return;
    }
    setTwinReady(true);
    alert(t.toast_generated);
  };

  const handleSend = () => {
    const q = chatInput.trim();
    if (!q) return;
    setChat((c) => [...c, {role: "user", content: q}]);
    const seed =
      styleSeeds
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)[0] || "";
    const reply =
      locale === "ar"
        ? `فهمت: “${q}”. ${seed ? `أسلوب الرد: ${seed}` : "سأجيب بإيجاز وبشكل مباشر."}`
        : `Got it: “${q}”. ${seed ? `Reply vibe: ${seed}` : "Replying briefly and directly."}`;
    setTimeout(() => {
      setChat((c) => [...c, {role: "assistant", content: reply}]);
    }, 200);
    setChatInput("");
  };

  return (
    <div dir={t.dir}>
      <header className="topbar">
        <div className="container row">
          <div className="brand">{t.brand}</div>
          <button
            className="lang"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            aria-label="toggle language"
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container grid2">
          <div>
            <h1 className="title">{t.hero_title}</h1>
            <p className="subtitle">{t.hero_sub}</p>
            <a href="#onboarding" className="cta">
              {t.hero_cta}
            </a>
          </div>
          <div className="heroCard" aria-hidden="true" />
        </div>
      </section>

      {/* STEPS */}
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
                  onChange={(e) => setVoiceFileName(e.target.files?.[0]?.name || "")}
                />
                <span>
                  {voiceFileName
                    ? (locale === "ar" ? "تم اختيار: " : "Selected: ") + voiceFileName
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

      {/* SANDBOX */}
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

      {/* FOOTER */}
      <footer className="footer">
        <div className="container center">
          <div className="muted">{t.footer_note}</div>
          <a href="#onboarding" className="cta">
            {t.footer_cta}
          </a>
        </div>
      </footer>

      {/* Styles */}
      <style jsx global>{`
        :root{
          --bg:#0b1d3a;
          --bg2:#0e2140;
          --panel:#102544;
          --panel2:#09162e;
          --border:rgba(255,255,255,.08);
          --text:#ffffff;
          --muted:rgba(255,255,255,.8);
          --gold:#ffd54a;
          --ok:#7dd38c;
        }
        *{box-sizing:border-box}
        html,body{padding:0;margin:0;background:var(--bg);color:var(--text);font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
        a{text-decoration:none;color:inherit}
        .container{max-width:1120px;margin:0 auto;padding:0 16px}
        .row{display:flex;align-items:center;justify-content:space-between}
        .center{text-align:center}
        .topbar{position:sticky;top:0;z-index:20;background:var(--bg);border-bottom:1px solid var(--border)}
        .brand{font-weight:700;letter-spacing:.4px}
        .lang{background:#1b2c4d;border:1px solid var(--border);color:#fff;padding:8px 12px;border-radius:10px;cursor:pointer}
        .lang:hover{background:#223862}
        .hero{background:var(--bg);padding:56px 0}
        .grid2{display:grid;grid-template-columns:1fr;gap:24px}
        @media(min-width:900px){.grid2{grid-template-columns:1.2fr .8fr}}
        .title{font-size:34px;line-height:1.2;font-weight:900}
        @media(min-width:700px){.title{font-size:48px}}
        .subtitle{margin-top:12px;font-size:18px;color:var(--muted)}
        .cta{display:inline-flex;align-items:center;justify-content:center;background:var(--gold);color:#102244;font-weight:700;padding:12px 18px;border-radius:12px;box-shadow:0 6px 20px rgba(255,213,74,.25)}
        .cta:hover{filter:brightness(.97)}
        .cta.full{width:100%}
        .cta.small{padding:10px 14px}
        .heroCard{height:260px;border-radius:18px;border:1px solid var(--border);
          background:
            radial-gradient(60% 100% at 50% 0%, rgba(255,213,74,.25), transparent 60%),
            linear-gradient(135deg,#0f2447,var(--bg));
        }
        .section{padding:56px 0;background:var(--bg2)}
        .section.alt{background:var(--panel2)}
        .h2{font-size:26px;font-weight:800}
        .h3{margin:6px 0 6px;font-size:16px;font-weight:700}
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
        .you{background:#1b2c4d;margin-inline-start:auto}
        .bot{background:#11223f;border:1px solid var(--border)}
        .chatInputRow{display:flex;gap:8px;margin-top:10px}
        .inputText{flex:1;border:1px solid var(--border);border-radius:10px;background:#0b1d3a;color:#fff;padding:10px;font-size:14px}
        .trustGrid{display:grid;grid-template-columns:1fr;gap:12px;margin-top:16px}
        @media(min-width:900px){.trustGrid{grid-template-columns:repeat(3,1fr)}}
        .trustCard{background:rgba(11,29,58,.6);border:1px solid var(--border);border-radius:14px;padding:16px;font-size:14px}
        .footer{background:var(--bg);padding:40px 0;border-top:1px solid var(--border)}
      `}</style>
    </div>
  );
}
