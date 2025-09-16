export default function handler(req, res) {
  res.status(200).json({
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
