export default function handler(req, res) {
  res.status(200).json({
    env: process.env.VERCEL_ENV || "local",
    hasKey: !!process.env.OPENAI_API_KEY,   // يرجع true/false
    keyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
  });
}
