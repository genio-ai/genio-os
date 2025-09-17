export default function handler(req, res) {
  res.status(200).json({
    env: process.env.VERCEL_ENV || "local",
    allKeys: Object.keys(process.env)   // اطبع كل أسماء المتغيرات الموجودة
  });
}
