// pages/api/session.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  return res.status(200).json({
    sessionId: "sess_" + Date.now(),
    status: "created",
  });
}
