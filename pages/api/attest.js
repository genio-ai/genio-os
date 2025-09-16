// pages/api/attest.js
import crypto from "crypto";

// stable stringify
function stableStringify(obj) {
  if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
  if (Array.isArray(obj)) return "[" + obj.map(stableStringify).join(",") + "]";
  const keys = Object.keys(obj).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + stableStringify(obj[k])).join(",") + "}";
}
const sha256Hex = (s) => crypto.createHash("sha256").update(s).digest("hex");
const randomSalt = (n = 32) => crypto.randomBytes(n / 2).toString("hex");
const fakeTx = () => "0x" + crypto.randomBytes(32).toString("hex");

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId_required" });

  // حساب الـhash على السيرفر (بدون DB الآن)
  const record = { sessionId, decision: "unknown", checks: {}, timestamp: new Date().toISOString() };
  const canonical = stableStringify(record);
  const salt = randomSalt(32);
  const hash = sha256Hex(salt + canonical);

  const network = process.env.ATTEST_NETWORK || "testnet";
  const txid = fakeTx();

  return res.status(200).json({ attestationHash: hash, network, txid });
}
