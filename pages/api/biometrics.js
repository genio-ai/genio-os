// pages/api/biometrics.js
// Mock endpoint: accepts { selfieBase64 } and returns a fake embedding
// plus pseudo faceMatch & liveness scores for testing.

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { selfieBase64 } = req.body || {};
  if (!selfieBase64 || typeof selfieBase64 !== "string") {
    return res.status(400).json({ error: "Missing selfieBase64" });
  }

  // simple deterministic-ish numbers from the input length
  const seed = selfieBase64.length;
  const faceMatch = +(0.72 + (seed % 20) / 100).toFixed(2);   // ~0.72 → 0.92
  const liveness  = +(0.75 + ((seed * 7) % 20) / 100).toFixed(2); // ~0.75 → 0.95

  // mock embedding string
  const embedding =
    "emb_" +
    Buffer.from(String(seed)).toString("hex") +
    "_" +
    Date.now().toString(16);

  return res.status(200).json({ embedding, faceMatch, liveness });
}
