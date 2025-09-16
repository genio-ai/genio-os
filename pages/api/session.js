// pages/api/session.js

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    // generate a simple unique sessionId
    const sessionId =
      Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 10);

    // here we just return it; later you could save it to DB if needed
    return res.status(200).json({ sessionId });
  } catch (e) {
    return res.status(500).json({ error: "internal_error", details: e.message });
  }
}
