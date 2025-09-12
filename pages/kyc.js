// pages/api/kyc.js — minimal server endpoint
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const p = req.body || {};
    if (!p.fullName || !p.dob || !p.country) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const requestId = `${Date.now().toString(36)}-${Math.random().toString(16).slice(2,8)}`;

    // TODO: connect DB / provider; for now just log
    console.log("[KYC] request", requestId, {
      fullName: p.fullName, dob: p.dob, country: p.country,
      idType: p.idType, email: p.email || null, phoneMasked: p.phoneMasked || null,
      submittedAt: new Date().toISOString(),
    });

    return res.status(200).json({ ok: true, requestId });
  } catch (e) {
    console.error("KYC API error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
