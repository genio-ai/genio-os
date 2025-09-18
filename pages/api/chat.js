// pages/api/chat.js
export default async function handler(req, res) {
  // CORS (optional if you'll call it from a browser/frontend)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 1) Read user message: GET ?msg=... or POST { "message": "..." }
    const message =
      (req.method === "GET" ? req.query.msg : req.body?.message) || "";

    if (!message || typeof message !== "string" || !message.trim()) {
      return res
        .status(400)
        .json({ error: "Missing 'message'. Use ?msg=... or POST {message}." });
    }
    if (message.length > 1000) {
      return res.status(413).json({ error: "Message too long (max 1000 chars)." });
    }

    // 2) Call OpenAI
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // fast & cost-effective
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are a helpful, concise assistant. Answer professionally and clearly.",
          },
          { role: "user", content: message.trim() },
        ],
      }),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      return res.status(502).json({ error: "OpenAI request failed", details: err });
    }

    const data = await r.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "";

    if (!reply) return res.status(500).json({ error: "Empty reply from model." });

    // 3) Respond
    return res.status(200).json({
      reply,
      model: data?.model,
      usage: data?.usage,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Server error" });
  }
}
