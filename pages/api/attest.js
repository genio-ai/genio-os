// pages/api/attest.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const attestationHash =
    body.attestationHash || "0x" + Math.random().toString(16).slice(2);
  const network = body.network || "sepolia";

  // Mock transaction id
  const txid =
    "0xtx_" + Date.now().toString(16) + Math.random().toString(16).slice(2, 10);

  return res.status(200).json({ network, txid, hash: attestationHash });
}
