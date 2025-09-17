// pages/api/chat.js

/**
 * Genio Twin Studio — Chat API (Next.js)
 * - Method: POST
 * - Body: { message: string, locale?: "en"|"ar", style?: string }
 * - Response: { reply: string }
 *
 * Notes:
 * - Set OPENAI_API_KEY in your environment (e.g., .env.local)
 * - This endpoint is intentionally minimal: no DB, no auth (add later).
 */

export default async function handler(req, res) {
  // Enforce POST only
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Basic validation
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server misconfigured: missing OPENAI_API_KEY." });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: "Invalid JSON body." });
  }

  const message = (body?.message || "").toString().trim();
  const locale = (body?.locale || "en").toLowerCase() === "ar" ? "ar" : "en";
  const style = (body?.style || "").toString().trim(); // Optional “Your Style” seed

  if (!message) {
    return res.status(400).json({ error: "Missing 'message'." });
  }

  // System prompt (kept short & safe). Uses optional style seed.
  const systemPrompt =
    locale === "ar"
      ? [
          "أنت مساعد ذكي يمثل Genio Twin.",
          "أجب بإيجاز ووضوح وابتعد عن الوعود غير الواقعية.",
          "حافظ على نبرة واثقة ومحترمة.",
          style ? `اتّبع هذا الأسلوب عند الصياغة: ${style}` : null,
        ]
          .filter(Boolean)
          .join("\n")
      : [
          "You are a smart assistant representing Genio Twin.",
          "Reply briefly and clearly; avoid unrealistic claims.",
          "Keep a confident, professional tone.",
          style ? `Adopt this style when phrasing: ${style}` : null,
        ]
          .filter(Boolean)
          .join("\n");

  // Compose messages for Chat Completions
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: message },
  ];

  try {
    // Call OpenAI Chat Completions (no streaming here — simple & robust).
    // You can switch model names later; this is a reasonable default.
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.4,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      return res.status(response.status).json({
        error: "Upstream error from OpenAI.",
        details: safeSlice(errText, 1000),
      });
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.toString().trim() ||
      (locale === "ar" ? "لم أتمكّن من توليد رد." : "I couldn’t generate a response.");

    // Minimal success response
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      error: "Unexpected server error.",
      details: err?.message || String(err),
    });
  }
}

// Small helper to prevent huge error payloads
function safeSlice(str, max = 500) {
  try {
    return (str || "").slice(0, max);
  } catch {
    return "";
  }
}
