// pages/api/chat.js
// Minimal, production-ready chat endpoint for Next.js (Pages Router)

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 30; // requests per IP per window
const ipBuckets = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = ipBuckets.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_LIMIT_WINDOW_MS;
  }
  bucket.count += 1;
  ipBuckets.set(ip, bucket);
  return bucket.count > RATE_LIMIT_MAX;
}

export default async function handler(req, res) {
  // CORS (safe defaults)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  // Basic per-IP rate limit
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
  }

  try {
    const { message, history } = req.body || {};
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Invalid 'message' (string required)." });
    }

    // Build messages for Chat Completions
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful, professional assistant. Be concise, clear, and friendly. Avoid overpromising. If unsure, ask a short clarifying question.",
      },
      ...(Array.isArray(history) ? history : []), // optional [{role:"user"|"assistant", content:"..."}]
      { role: "user", content: message.trim() },
    ];

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-2024-07-18",
        messages,
        temperature: 0.6,
        max_tokens: 300,
      }),
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      return res
        .status(502)
        .json({ error: "Upstream error", details: errText.slice(0, 500) });
    }

    const data = await r.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Sorry, I couldn't generate a response.";

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: String(err).slice(0, 300) });
  }
}
