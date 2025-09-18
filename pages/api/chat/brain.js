// pages/api/chat/brain.js
import { answer, suggestionsFor } from "../../../lib/brain/faq.js";
import { track } from "../../../lib/analytics.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ reply: "Method not allowed" });
  }

  try {
    const { message, sessionId } = req.body || {};
    const q = String(message || "").trim();

    // track lightweight event (no PII)
    track("chat_message", { sessionId, len: q.length });

    if (!q) {
      return res.status(200).json({
        reply:
          "Ask me anything about Genio, your Twin, privacy, voice/video capture, or how to start.",
        suggestions: suggestionsFor(""),
      });
    }

    const { reply, cta } = answer(q);
    return res.status(200).json({
      reply,
      suggestions: suggestionsFor(q),
      cta: cta || null,
    });
  } catch (e) {
    console.error("brain_error", e);
    return res.status(200).json({
      reply:
        "Something went wrong on our side. Please try again in a moment or refresh the page.",
      suggestions: ["What is a Twin?", "Privacy & data", "Start signup"],
    });
  }
}
