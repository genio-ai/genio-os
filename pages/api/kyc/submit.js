export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  // منطق تجريبي: لو القيمتين > 0.8 نعتبر Pass
  const { faceMatch = 0.76, liveness = 0.82 } = req.body || {};
  const decision = faceMatch > 0.8 && liveness > 0.8 ? "Pass" : "Pending";
  res.status(200).json({ decision, faceMatch, liveness, review: decision === "Pending" });
}
