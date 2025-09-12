// pages/api/kyc.js — minimal server endpoint (metadata only)
// Later: store to DB and upload files to S3 (we send only metadata here).

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const p = req.body || {};
    if (!p.fullName || !p.dob || !p.countryOfResidence || !p.citizenship) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const requestId = `${Date.now().toString(36)}-${Math.random().toString(16).slice(2,8)}`;

    // TODO: connect DB or provider; log for now
    console.log("[KYC] request", requestId, {
      fullName: p.fullName,
      dob: p.dob,
      residence: p.countryOfResidence,
      citizenship: p.citizenship,
      idType: p.idType,
      email: p.email || null,
      phoneMasked: p.phoneMasked || null,
      files: p.files || {},
      submittedAt: new Date().toISOString(),
    });

    return res.status(200).json({ ok: true, requestId });
  } catch (e) {
    console.error("KYC API error:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
