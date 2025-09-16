// pages/api/documents.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const { sessionId, type } = req.body || {};
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId_required" });
  }

  return res.status(200).json({
    sessionId,
    docId: "doc_" + Date.now(),
    type: type || "passport",
    faceCropId: "face_" + Date.now(),
  });
}
