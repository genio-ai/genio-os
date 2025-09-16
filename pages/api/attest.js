// pages/api/attest.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const { sessionId } = req.body || {};
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId_required" });
  }

  return res.status(200).json({
    attestationHash: Math.random().toString(36).substring(2, 15),
    network: "testnet",
    txid: "0x" + Math.random().toString(16).substring(2).padEnd(64, "0"),
  });
}
