// pages/api/attest.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { attestationHash, network } = req.body || {};
    if (!attestationHash) {
      return res.status(400).json({ error: 'attestationHash is required' });
    }

    // توليد txid تجريبي
    const rand = Math.random().toString(16).slice(2, 10);
    const txid = `0xtx_${Date.now().toString(16)}${rand}`;

    return res.status(200).json({
      ok: true,
      txid,
      network: network || 'sepolia',
    });
  } catch (e) {
    return res.status(500).json({ error: 'Server error' });
  }
}
