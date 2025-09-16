import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    // اقرأ ملف decision.json
    const configPath = path.join(process.cwd(), "config", "decision.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    const { faceMatch, liveness, quality, docValid, expiryValid } = req.body || {};

    let reasons = [];
    let risk = 100;

    // Face rules
    if (faceMatch < config.FACE_REVIEW_MIN) {
      reasons.push("face_match_low");
      risk -= 30;
    } else if (faceMatch < config.FACE_PASS) {
      reasons.push("face_match_borderline");
      risk -= 15;
    }

    // Liveness rules
    if (liveness < config.LIVENESS_REVIEW_MIN) {
      reasons.push("liveness_low");
      risk -= 25;
    } else if (liveness < config.LIVENESS_PASS) {
      reasons.push("liveness_borderline");
      risk -= 10;
    }

    // Quality
    if (quality < config.QUALITY_MIN) {
      reasons.push("poor_quality");
      risk -= 10;
    }

    // Document validity
    if (!docValid) {
      reasons.push("document_invalid");
      risk -= 40;
    }
    if (!expiryValid) {
      reasons.push("document_expired");
      risk -= 40;
    }

    // Final decision
    let decision = "approved";
    if (risk < config.RISK_THRESHOLDS.REVIEW) {
      decision = "rejected";
    } else if (risk < config.RISK_THRESHOLDS.APPROVED) {
      decision = "manual_review";
    }

    res.status(200).json({
      decision,
      risk_score: risk,
      reasons
    });
  } catch (err) {
    res.status(500).json({ error: "internal_error", details: err.message });
  }
}
