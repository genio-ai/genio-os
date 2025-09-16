export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { attestationHash = "0x" + Math.random().toString(16).slice(2), network = "sepolia" } = req.body || {};
  const txid = "0xtx_" + Math.random().toString(16).slice(2).padEnd(32, "0");
  res.status(200).json({ network, txid, hash: attestationHash });
}
