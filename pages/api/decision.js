// pages/api/decision.js
import fs from "fs";
import path from "path";

/**
 * Weighted KYC decision engine:
 * - Reads weights/thresholds from config/decision.json
 * - Computes a 0..100 risk score (higher = better)
 * - Returns decision + reasons + per-signal breakdown
 * - Supports quick "preset" testing: approved | review | rejected
 */

const loadConfig = () => {
  const cfgPath = path.join(process.cwd(), "config", "decision.json");
  return JSON.parse(fs.readFileSync(cfgPath, "utf8"));
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const cfg = loadConfig();

    // --- 1) Build payload (support presets for easy testing) ---
    let {
      preset,          // optional: "approved" | "review" | "rejected"
      faceMatch,
      liveness,
      quality,
      docValid,
      expiryValid
    } = req.body || {};

    if (preset === "approved") {
      faceMatch = 0.90; liveness = 0.90; quality = 0.85; docValid = true;  expiryValid = true;
    } else if (preset === "review") {
      faceMatch = 0.73; liveness = 0.72; quality = 0.62; docValid = true;  expiryValid = true;
    } else if (preset === "rejected") {
      faceMatch = 0.55; liveness = 0.50; quality = 0.52; docValid = false; expiryValid = false;
    }

    // Basic validation
    const reasons = [];
    const badNum = (x) => typeof x !== "number" || Number.isNaN(x);

    if (badNum(faceMatch) || badNum(liveness) || badNum(quality) ||
        typeof docValid !== "boolean" || typeof expiryValid !== "boolean") {
      return res.status(400).json({ error: "invalid_input", reason: cfg.reasonText.bad_input });
    }

    // --- 2) Normalize 0..1 inputs ---
    faceMatch = clamp01(faceMatch);
    liveness  = clamp01(liveness);
    quality   = clamp01(quality);

    // --- 3) Score each signal by weight ---
    const W = cfg.weights;
    let score =
      faceMatch * W.faceMatch +
      liveness  * W.liveness  +
      quality   * W.quality   +
      (docValid    ? W.docValid    : 0) +
      (expiryValid ? W.expiryValid : 0);

    // --- 4) Reasons based on thresholds ---
    const T = cfg.thresholds;

    if (faceMatch < T.faceMatch.review) {
      reasons.push(cfg.reasonText.face_low);
    } else if (faceMatch < T.faceMatch.pass) {
      reasons.push(cfg.reasonText.face_borderline);
    }

    if (liveness < T.liveness.review) {
      reasons.push(cfg.reasonText.live_low);
    } else if (liveness < T.liveness.pass) {
      reasons.push(cfg.reasonText.live_borderline);
    }

    if (quality < T.quality.review) {
      reasons.push(cfg.reasonText.qual_low);
    }

    if (!docValid) reasons.push(cfg.reasonText.doc_invalid);
    if (!expiryValid) reasons.push(cfg.reasonText.doc_expired);

    // --- 5) Final banding ---
    const finalScore = Math.round(Math.max(0, Math.min(100, score)));
    let decision = "approved";
    if (finalScore < cfg.bands.review) {
      decision = "rejected";
    } else if (finalScore < cfg.bands.approved) {
      decision = "manual_review";
    }

    // --- 6) Response with breakdown (great for UI + audits) ---
    const breakdown = {
      weights: { ...W },
      inputs: { faceMatch, liveness, quality, docValid, expiryValid },
      partial: {
        faceMatch: +(faceMatch * W.faceMatch).toFixed(2),
        liveness:  +(liveness  * W.liveness ).toFixed(2),
        quality:   +(quality   * W.quality  ).toFixed(2),
        docValid:    docValid    ? W.docValid    : 0,
        expiryValid: expiryValid ? W.expiryValid : 0
      }
    };

    return res.status(200).json({
      decision,
      risk_score: finalScore,
      reasons,
      breakdown
    });

  } catch (e) {
    return res.status(500).json({ error: "internal_error", details: e.message });
  }
}
