// pages/api/chat.js
/**
 * Genio Twin Studio — Chat API (Next.js)
 * Expects:  POST { message: string, locale?: "en" | "ar", style?: string }
 * Returns:  { reply: string }
 *
 * Notes:
 * - Uses OpenAI Chat Completions (no extra deps).
 * - Set OPENAI_API_KEY in Vercel → Project → Settings → Environment Variables.
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
  }

  try {
    const { message, locale = "en", style = "" } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required" });
    }

    // System guardrails + language & style control
    const lang = locale === "ar" ? "Arabic" : "English";
    const styleNote = style
      ? `Write in the user's style cues:\n${style}\n\n`
      : "";
    const systemPrompt = `
You are "Genio Twin" — a trustworthy AI twin.
- Language: ${lang}.
- Review-First: do not promise actions; say "I'll route this for review" for any sensitive requests.
- Brand guardrails: be clear, helpful, and concise.
${styleNote}If user asks general questions, answer briefly and to the point.
    `.trim();

    // Call OpenAI Chat Completions (stable endpoint)
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // fast & affordable. You can change later.
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await safeText(resp);
      return res.status(resp.status).json({ error: `OpenAI error: ${text}` });
    }

    const data = await resp.json();
    const reply =
      data?.choices?.[0]?.message?.content?.toString().trim() || "";

    if (!reply) {
      return res.status(200).json({
        reply:
          locale === "ar"
            ? "تعذر توليد ردّ. حاول مرة أخرى."
            : "I couldn’t generate a reply. Please try again.",
      });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({
      error: "Server error",
      reply:
        (req.body?.locale === "ar"
          ? "حدث خطأ غير متوقع. حاول لاحقًا."
          : "Unexpected error. Please try again later."),
    });
  }
}

async function safeText(resp) {
  try {
    return await resp.text();
  } catch {
    return "<no body>";
  }
}
