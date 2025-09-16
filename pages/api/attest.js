// pages/api/attest.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { attestationHash, network = 'sepolia' } = req.body || {};

  if (!attestationHash || typeof attestationHash !== 'string') {
    return res.status(400).json({ error: 'attestationHash (string) is required' });
  }

  // محاكاة عملة تثبيت على السلسلة (تزوير txid)
  const txid = `0xtx_${Math.random().toString(16).slice(2)}${Date.now().toString(16)}`;

  return res.status(200).json({
    ok: true,
    network,
    txid,
    receivedHash: attestationHash,
    anchoredAt: new Date().toISOString(),
  });
}
