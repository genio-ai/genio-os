// lib/brain/faq.js
const KB = [
  {
    k: ["what is a twin", "twin", "genio"],
    a:
      "A Twin is your always-on assistant that mirrors your tone, habits, and preferences. It can reply, draft, summarize, and coordinate — in your style.",
    s: ["Privacy & data", "Voice & video", "Start signup"],
  },
  {
    k: ["privacy", "data", "security"],
    a:
      "Privacy-first: raw media (voice/video) is stored internally only. We don’t share raw files with third parties. If you opt in, we may send text-only prompts to AI for assistance.",
    s: ["How do voice and video work?", "Start signup"],
  },
  {
    k: ["voice", "audio", "microphone"],
    a:
      "You can upload or record a 2–5 minute voice sample. It’s used to learn your tone and style. The raw file stays internal.",
    s: ["Video capture details", "Start signup"],
  },
  {
    k: ["video", "camera", "3d"],
    a:
      "Record a short 10–20s clip (front-facing camera). Look left/right and speak naturally. We’ll use it later to improve your visual presence. Raw video remains internal.",
    s: ["Privacy & data", "Start signup"],
  },
  {
    k: ["start signup", "sign up", "create account", "get started"],
    a:
      "Great — we’ll guide you through a quick sign up (name, email, phone, password) and required consents. Ready?",
    cta: "signup",
    s: ["What is a Twin?", "Privacy & data"],
  },
  {
    k: ["pricing", "price", "cost", "subscription"],
    a:
      "Plans vary by usage. You can start free, then upgrade when your Twin is active daily. Contact support for current pricing.",
    s: ["Start signup", "Privacy & data"],
  },
  {
    k: ["whatsapp", "sms", "phone otp"],
    a:
      "Phone is required to verify your account and optionally connect WhatsApp notifications. We’ll send an OTP during signup.",
    s: ["Start signup", "Privacy & data"],
  },
];

function find(q) {
  const lower = q.toLowerCase();
  let best = KB[0];
  for (const item of KB) {
    if (item.k.some((key) => lower.includes(key))) {
      best = item;
      break;
    }
  }
  return best;
}

export function answer(q) {
  const item = find(q);
  return { reply: item.a, cta: item.cta || null };
}

export function suggestionsFor(q) {
  const item = find(q);
  return item.s || ["What is a Twin?", "Privacy & data", "Start signup"];
}
