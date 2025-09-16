// pages/api/attest.js
import { getSession, updateSession, addAudit, nowIso } from "../../lib/db";
import { stableStringify } from "../../lib/stableJson";
import crypto from "crypto";

function sha256Hex(s) { return crypto.createHash("sha256").update(s).digest("hex"); }
function randomSalt(len = 32) { return crypto.randomBytes(len / 2).toString("hex"); }
function fakeTx() { return "0x" + crypto.randomBytes(32).toString("hex"); }

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const { sessionId } = req.body || {};
  if (!sessionId) return res.status(400).json({ error: "sessionId_required" });

  const s = getSession(sessionId);
  if (!s) return res.status(404).json({ error: "session_not_found" });
  if (!s.decision) return res.status(400).json({ error: "no_decision" });

  const record = { sessionId, decision: s.decision, checks: {}, timestamp: nowIso() };
  const canonical = stableStringify(record);
  const salt = randomSalt(32);
  const hash = sha256Hex(salt + canonical);

  const network = process.env.ATTEST_NETWORK || "testnet";
  const txid = fakeTx();

  updateSession(sessionId, { txid });
  addAudit(sessionId, "ATTEST", { hash, network, txid });

  return res.status(200).json({ attestationHash: hash, network, txid });
}
