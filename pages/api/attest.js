// pages/api/attest.js
import { USE_MOCK, DEFAULT_NETWORK } from "../../lib/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { attestationHash } = req.body || {};
    const network = req.body?.network || DEFAULT_NETWORK;

    if (USE_MOCK) {
      // --- MOCK TX ---
      const txid =
        "0xtx_" + Date.now().toString(16) + Math.random().toString(16).slice(2, 10);
      return res.status(200).json({ network, txid, hash: attestationHash || "0xmock" });
    }

    // --- REAL INTEGRATION (placeholder) ---
    // Example: call your on-chain attestation service
    // const r = await fetch(process.env.ATTEST_BACKEND + "/attest", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.ATTEST_TOKEN}` },
    //   body: JSON.stringify({ attestationHash, network }),
    // });
    // const data = await r.json();
    // return res.status(200).json(data);

    // Temporary safe fallback
    return res.status(200).json({ network, txid: "0xtx_placeholder", hash: attestationHash || "0x" });
  } catch (e) {
    console.error("attest error", e);
    return res.status(500).json({ error: "internal_error" });
  }
}
