// pages/api/kyc/biometrics.js
export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId_required" });

  return res.status(200).json({
    sessionId,
    selfieId: "selfie_" + Date.now(),
    livenessScore: Math.random().toFixed(2), // رقم عشوائي 0.00–1.00
  });
}
