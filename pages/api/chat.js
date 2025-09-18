// pages/api/chat.js
// Production-grade chat endpoint for Genio Systems

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX = 20; // max requests per IP per window
const ipBuckets = new Map();

/** Simple per-IP rate limiter (memory only; resets per serverless cold start). */
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
  // CORS (allow calling from your site/app)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "OPENAI_API_KEY is missing." });
  }

  // Basic rate limit
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";
  if (isRateLimited(ip)) {
    return res
      .status(429)
      .json({ ok: false, error: "Too many requests. Please try again later." });
  }

  try {
    // Accept message via GET ?msg=... or POST { message: "..." }
    const userMessage =
      (req.method === "GET" ? req.query.msg : req.body?.message) ?? "";

    const message = String(userMessage).trim().slice(0, 2000); // sanitize & cap
    if (!message) {
      return res.status(400).json({ ok: false, error: "Message is required." });
    }

    // Build Chat Completions request
    const payload = {
      model: "gpt-4o-mini-2024-07-18",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            "You are Genio's professional assistant. Always reply clearly, concisely, and helpfully. Use a friendly, professional tone. If the user asks for actions that require safety or policy constraints, explain limits and offer safe alternatives."
        },
        { role: "user", content: message }
      ]
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      const text = await r.text();
      return res
        .status(502)
        .json({ ok: false, error: "Upstream error from OpenAI.", details: text });
    }

    const data = await r.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I'm here and ready to help. How can I assist you?";

    // Minimal usage info if available
    const usage = data?.usage
      ? {
          prompt_tokens: data.usage.prompt_tokens,
          completion_tokens: data.usage.completion_tokens,
          total_tokens: data.usage.total_tokens
        }
      : undefined;

    return res.status(200).json({ ok: true, reply, usage });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Unexpected server error.",
      details: err instanceof Error ? err.message : String(err)
    });
  }
}

// Ensure body parsing for POST
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb"
    }
  }
};
