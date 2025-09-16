// pages/api/decision.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    // Load thresholds from config
    const configPath = path.join(process.cwd(), "config", "decision.json");
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    // Read payload
    const {
      faceMatch = 0,
      liveness = 0,
      quality = 0,
      docValid = false,
      expiryValid = false,
    } = req.body || {};

    let reasons = [];
    let risk = 100;

    // Face match rules
    if (typeof faceMatch !== "number" || isNaN(faceMatch)) {
      reasons.push("invalid_face_match");
      return res.status(400).json({ error: "invalid_input", reasons });
    }
    if (faceMatch < config.FACE_REVIEW_MIN) {
      reasons.push("face_match_low");
      risk -= 30;
    } else if (faceMatch < config.FACE_PASS) {
      reasons.push("face_match_borderline");
      risk -= 15;
    }

    // Liveness rules
    if (typeof liveness !== "number" || isNaN(liveness)) {
      reasons.push("invalid_liveness");
      return res.status(400).json({ error: "invalid_input", reasons });
    }
    if (liveness < config.LIVENESS_REVIEW_MIN) {
      reasons.push("liveness_low");
      risk -= 25;
    } else if (liveness < config.LIVENESS_PASS) {
      reasons.push("liveness_borderline");
      risk -= 10;
    }

    // Image quality
    if (typeof quality !== "number" || isNaN(quality)) {
      reasons.push("invalid_quality");
      return res.status(400).json({ error: "invalid_input", reasons });
    }
    if (quality < config.QUALITY_MIN) {
      reasons.push("poor_quality");
      risk -= 10;
    }

    // Document checks
    if (!docValid) {
      reasons.push("document_invalid");
      risk -= 40;
    }
    if (!expiryValid) {
      reasons.push("document_expired");
      risk -= 40;
    }

    // Final decision from risk thresholds
    let decision = "approved";
    if (risk < config.RISK_THRESHOLDS.REVIEW) {
      decision = "rejected";
    } else if (risk < config.RISK_THRESHOLDS.APPROVED) {
      decision = "manual_review";
    }

    return res.status(200).json({
      decision,
      risk_score: Math.max(0, Math.min(100, Math.round(risk))),
      reasons,
      echo: { faceMatch, liveness, quality, docValid, expiryValid },
    });
  } catch (e) {
    return res.status(500).json({ error: "internal_error", details: e.message });
  }
}
