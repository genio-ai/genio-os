// pages/api/status.js
export default function handler(req, res) {
  res.status(200).json({
    status: "Pending",
    scores: { face: 0.76, liveness: 0.82 },
    tx: "0xtx_demo123456789abcdef",
    updatedAt: new Date().toISOString()
  });
}
