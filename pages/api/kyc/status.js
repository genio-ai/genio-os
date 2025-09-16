// pages/api/kyc/status.js
import { USE_MOCK } from "../../../lib/config";

export default async function handler(req, res) {
  try {
    if (USE_MOCK) {
      // --- MOCK RESPONSE ---
      return res.status(200).json({
        sessionId: "sess_demo_001",
        kycStatus: "Pending",           // "Pass" | "Fail" | "Review"
        livenessScore: 0.82,
        faceMatchScore: 0.76,
        txid: null,
        activity: [
          { date: "2025-09-15", action: "KYC Submission", status: "Pending" },
          { date: "2025-09-10", action: "API /attest (test)", status: "Success" }
        ]
      });
    }

    // --- REAL INTEGRATION (placeholder) ---
    // Example: fetch from your KYC microservice or vendor SDK
    // const r = await fetch(process.env.KYC_BACKEND + "/status", { headers: { Authorization: `Bearer ${process.env.KYC_TOKEN}` }});
    // const data = await r.json();
    // return res.status(200).json(data);

    // For now, return a minimal shape so the UI doesn't break
    return res.status(200).json({
      sessionId: "sess_real_placeholder",
      kycStatus: "Review",
      livenessScore: 0.0,
      faceMatchScore: 0.0,
      txid: null,
      activity: []
    });
  } catch (e) {
    console.error("status error", e);
    return res.status(500).json({ error: "internal_error" });
  }
}
