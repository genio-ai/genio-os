// /pages/api/check-key.js
export default function handler(req, res) {
  if (process.env.OPENAI_API_KEY) {
    res.status(200).json({ status: "✅ Key موجود", length: process.env.OPENAI_API_KEY.length });
  } else {
    res.status(500).json({ status: "❌ Key مش موجود" });
  }
}
