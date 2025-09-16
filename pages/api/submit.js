// pages/api/submit.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const { sessionId } = req.body || {};
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId_required" });
  }

  return res.status(200).json({
    decision: "Pending",
    faceMatch: 0.76,
    liveness: 0.82,
    review: true,
  });
}
