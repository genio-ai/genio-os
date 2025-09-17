// pages/index.js
import {useMemo, useState} from "react";

/**
 * Genio Twin Studio – Single-file MVP (Landing + Mini Onboarding + Sandbox)
 * - All code here (no extra deps, no i18n libs)
 * - Clean structure, clear naming, bilingual (EN/AR) with instant toggle
 * - No API calls yet (runtime demo only)
 */

export default function Home() {
  // Locale management (no external i18n; just local dictionaries)
  const [locale, setLocale] = useState("en"); // "en" | "ar"

  const t = useMemo(() => {
    const en = {
      dir: "ltr",
      langToggle: "العربية",
      nav_brand: "Genio Twin Studio",
      hero_title: "Create your smart twin… a better version of you",
      hero_sub: "It writes, speaks, appears, and responds for you — 24/7.",
      hero_cta: "✨ Create My Twin",
      steps_title: "Create your twin in 3 steps",
      step1_title: "Style Seeds",
      step1_desc: "Paste 3–5 short lines that sound like you.",
      step2_title: "Voice Sample",
      step2_desc: "Record or upload a 5–10 min clear voice sample.",
      step3_title: "Generate Twin (Demo)",
      step3_desc: "We’ll simulate your twin for a quick test.",
      generate_btn: "Generate Twin (Demo)",
      sandbox_title: "Try your twin (Demo)",
      sandbox_placeholder: "Ask your twin something…",
      sandbox_send: "Send",
      trust_title: "Why trust Genio Twin?",
      trust_p1: "No stock faces. No generic posts. Your voice, your rules.",
      trust_p2: "Review-First by default: nothing publishes without approval.",
      trust_p3: "Brand guardrails: tone, templates, and visual system enforced.",
      footer_cta: "Start Now",
      footer_note: "Your twin. Your presence. 24/7.",
      // Minimal toasts/messages
      toast_generated: "Demo twin is ready.",
      toast_needSeeds: "Please add at least 1 style line.",
      toast_needVoice: "Voice sample is optional for the demo.",
    };

    const ar = {
      dir: "rtl",
      langToggle: "ENGLISH",
      nav_brand: "Genio Twin Studio",
      hero_title: "اصنع توأمك الذكي… نسخة محسّنة منك",
      hero_sub: "يكتب، يتكلم، يظهر، ويجيب عنك — على مدار الساعة.",
      hero_cta: "✨ أنشئ توأمي",
      steps_title: "أنشئ توأمك بثلاث خطوات",
      step1_title: "بذور الأسلوب",
      step1_desc: "الصق 3–5 جُمل قصيرة تعبّر عن أسلوبك.",
      step2_title: "عينة صوت",
      step2_desc: "سجّل أو ارفع 5–10 دقائق بصوت واضح.",
      step3_title: "ولّد التوأم (تجريبي)",
      step3_desc: "ننشئ محاكاة سريعة لتجربة التوأم.",
      generate_btn: "ولّد التوأم (تجريبي)",
      sandbox_title: "جرّب توأمك (تجريبي)",
      sandbox_placeholder: "اسأل توأمك سؤالًا…",
      sandbox_send: "إرسال",
      trust_title: "لماذا تثق بـ Genio Twin؟",
      trust_p1: "بدون وجوه ستوك. بدون قوالب عامة. صوتك وقواعدك أنت.",
      trust_p2: "وضع المراجعة أولًا: لا يُنشر شيء دون موافقتك.",
      trust_p3: "حماية العلامة: نبرة، قوالب، ونظام بصري مُلزم.",
      footer_cta: "ابدأ الآن",
      footer_note: "توأمك. حضورك. طوال الوقت.",
      toast_generated: "تم تجهيز التوأم التجريبي.",
      toast_needSeeds: "رجاءً أضف سطرًا واحدًا على الأقل كبذور أسلوب.",
      toast_needVoice: "عينة الصوت اختيارية للتجربة.",
    };

    return locale === "ar" ? ar : en;
  }, [locale]);

  // Mini-onboarding state (all client-side; no backend yet)
  const [styleSeeds, setStyleSeeds] = useState(""); // textarea
  const [voiceFileName, setVoiceFileName] = useState(""); // file input name
  const [twinReady, setTwinReady] = useState(false);

  // Sandbox chat state (demo only)
  const [chatInput, setChatInput] = useState("");
  const [chat, setChat] = useState([
    {
      role: "system",
      content:
        locale === "ar"
          ? "مرحبًا! هذا وضع تجريبي للتوأم. أجب بإيجاز وبأسلوب واثق."
          : "Hi! This is a demo twin mode. Reply briefly with a confident tone.",
    },
  ]);

  // Simple demo reply: mirrors style seeds keywords; no AI call
  const handleSend = () => {
    const q = chatInput.trim();
    if (!q) return;
    setChat((c) => [...c, {role: "user", content: q}]);

    // Small deterministic reply using the first seed line as style cue
    const seed = styleSeeds.split("\n").map((s) => s.trim()).filter(Boolean)[0] || "";
    const reply =
      locale === "ar"
        ? `فهمت سؤالك: “${q}”. ${
            seed ? `أقولها بأسلوبي: ${seed}` : "سأجيب بإيجاز وبشكل مباشر."
          }`
        : `Got it: “${q}”. ${
            seed ? `Here’s the vibe: ${seed}` : "Replying briefly and directly."
          }`;

    setTimeout(() => {
      setChat((c) => [...c, {role: "assistant", content: reply}]);
    }, 250);
    setChatInput("");
  };

  const handleGenerate = () => {
    if (!styleSeeds.trim()) {
      alert(t.toast_needSeeds);
      return;
    }
    // voice is optional for demo; we still acknowledge the filename
    if (voiceFileName) {
      // no-op, just UI feedback
    }
    setTwinReady(true);
    alert(t.toast_generated);
  };

  // Styles: utility classes only; rely on globals.css for base resets/colors if any
  return (
    <div dir={t.dir}>
      {/* Top nav (brand + language toggle) */}
      <header
        className="w-full border-b border-[#14243f] bg-[#0b1d3a] text-white"
        style={{position: "sticky", top: 0, zIndex: 20}}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-wide">{t.nav_brand}</div>
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="px-3 py-1 rounded-md bg-[#1b2c4d] hover:bg-[#21355b] text-sm"
            aria-label="toggle language"
          >
            {t.langToggle}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#0b1d3a] text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              {t.hero_title}
            </h1>
            <p className="mt-4 text-lg opacity-90">{t.hero_sub}</p>
            <div className="mt-6">
              <a
                href="#onboarding"
                className="inline-flex items-center gap-2 rounded-lg bg-[#ffd54a] px-5 py-3 font-semibold text-[#0b1d3a] hover:brightness-95"
              >
                {t.hero_cta}
              </a>
            </div>
          </div>
          <div className="relative">
            <div
              className="aspect-[4/3] w-full rounded-2xl"
              style={{
                background:
                  "radial-gradient(60% 100% at 50% 0%, rgba(255,213,74,0.25), transparent 60%), linear-gradient(135deg, #0f2447, #0b1d3a)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Steps (Mini Onboarding) */}
      <section id="onboarding" className="bg-[#0e2140] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-bold">{t.steps_title}</h2>

          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="rounded-xl border border-[#1a2b4a] bg-[#0b1d3a]/60 p-5">
              <h3 className="font-semibold">{t.step1_title}</h3>
              <p className="mt-1 text-sm opacity-80">{t.step1_desc}</p>
              <textarea
                placeholder={
                  locale === "ar"
                    ? "اكتب كل سطر في جملة قصيرة…"
                    : "One short line per style cue…"
                }
                className="mt-3 w-full h-36 rounded-md bg-[#09162e] border border-[#1a2b4a] p-3 text-sm"
                value={styleSeeds}
                onChange={(e) => setStyleSeeds(e.target.value)}
              />
            </div>

            {/* Step 2 */}
            <div className="rounded-xl border border-[#1a2b4a] bg-[#0b1d3a]/60 p-5">
              <h3 className="font-semibold">{t.step2_title}</h3>
              <p className="mt-1 text-sm opacity-80">{t.step2_desc}</p>
              <label
                className="mt-3 block w-full cursor-pointer rounded-md bg-[#09162e] border border-[#1a2b4a] p-3 text-sm"
              >
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => setVoiceFileName(e.target.files?.[0]?.name || "")}
                />
                <span>
                  {voiceFileName
                    ? (locale === "ar" ? "تم اختيار الملف: " : "Selected: ") +
                      voiceFileName
                    : locale === "ar"
                    ? "اختر ملف صوتي (اختياري للتجربة)"
                    : "Choose audio file (optional for demo)"}
                </span>
              </label>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-[#1a2b4a] bg-[#0b1d3a]/60 p-5">
              <h3 className="font-semibold">{t.step3_title}</h3>
              <p className="mt-1 text-sm opacity-80">{t.step3_desc}</p>
              <button
                onClick={handleGenerate}
                className="mt-3 w-full rounded-md bg-[#ffd54a] px-4 py-3 font-semibold text-[#0b1d3a] hover:brightness-95"
              >
                {t.generate_btn}
              </button>
              {twinReady && (
                <p className="mt-3 text-sm text-green-300">
                  {t.toast_generated}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sandbox (Demo chat) */}
      <section className="bg-[#09162e] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-bold">{t.sandbox_title}</h2>

          <div className="mt-6 rounded-xl border border-[#1a2b4a] bg-[#0b1d3a]/60 p-4">
            <div
              className="h-60 overflow-y-auto rounded-md bg-[#0b1d3a] p-3 border border-[#1a2b4a]"
              style={{scrollbarWidth: "thin"}}
            >
              {chat
                .filter((m) => m.role !== "system")
                .map((m, i) => (
                  <div
                    key={i}
                    className={`mb-2 flex ${
                      (t.dir === "rtl" ? m.role === "user" : m.role !== "user")
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                        m.role === "user"
                          ? "bg-[#1b2c4d]"
                          : "bg-[#11223f] border border-[#1a2b4a]"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-md bg-[#0b1d3a] border border-[#1a2b4a] px-3 py-2 text-sm"
                placeholder={t.sandbox_placeholder}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
              <button
                onClick={handleSend}
                className="rounded-md bg-[#ffd54a] px-4 py-2 font-semibold text-[#0b1d3a] hover:brightness-95"
              >
                {t.sandbox_send}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-[#0e2140] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-bold">{t.trust_title}</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {[t.trust_p1, t.trust_p2, t.trust_p3].map((item, idx) => (
              <li
                key={idx}
                className="rounded-xl border border-[#1a2b4a] bg-[#0b1d3a]/60 p-5 text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-[#0b1d3a] text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <div className="text-lg opacity-90">{t.footer_note}</div>
          <a
            href="#onboarding"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#ffd54a] px-6 py-3 font-semibold text-[#0b1d3a] hover:brightness-95"
          >
            {t.footer_cta}
          </a>
        </div>
      </footer>
    </div>
  );
}
