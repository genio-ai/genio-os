// pages/api/auth/signup.js
// Production-ready skeleton: validates input, rate-limits, hashes password,
// and stores to an in-memory registry (replace with a real DB later).

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 30;                   // max signups per IP per window
const ipBuckets = new Map();           // { ip: { count, resetAt } }

const registry = new Map();            // TEMP storage: key = phone, value = user record

function rateLimited(ip) {
  const now = Date.now();
  const bucket = ipBuckets.get(ip) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > bucket.resetAt) {
    bucket.count = 0;
    bucket.resetAt = now + RATE_WINDOW_MS;
  }
  bucket.count += 1;
  ipBuckets.set(ip, bucket);
  return bucket.count > RATE_MAX;
}

function isEmail(v) {
  if (!v) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isStrongPassword(pw) {
  return typeof pw === "string" && pw.length >= 8;
}

function normalizePhone(countryDial, local) {
  const d = String(countryDial || "").replace(/[^\d]/g, "");
  const l = String(local || "").replace(/[^\d]/g, "");
  if (!d || !l) return null;
  return `+${d}${l}`;
}

function hashPassword(password) {
  const salt = randomBytes(16); // 128-bit salt
  const hash = scryptSync(password, salt, 64); // 512-bit hash
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export default async function handler(req, res) {
  // Basic CORS for browser calls (adjust origins as needed)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "0.0.0.0";

  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "Too many requests. Please try again later." });
  }

  try {
    const {
      fullName,
      email,                 // optional
      countryCode,           // e.g., "962" (digits only) or "+962"
      phoneLocal,            // e.g., "79XXXXXX"
      password,
      passwordConfirm,
      acceptsTerms,          // boolean
      acceptsPolicy,         // boolean
    } = (req.body || {});

    // Validate
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return res.status(400).json({ ok: false, field: "fullName", error: "Full name is required." });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ ok: false, field: "email", error: "Invalid email." });
    }
    const phone = normalizePhone(countryCode, phoneLocal);
    if (!phone) {
      return res.status(400).json({ ok: false, field: "phone", error: "Valid phone is required." });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ ok: false, field: "password", error: "Password must be at least 8 characters." });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ ok: false, field: "passwordConfirm", error: "Passwords do not match." });
    }
    if (!acceptsTerms || !acceptsPolicy) {
      return res.status(400).json({ ok: false, field: "consents", error: "You must accept the Terms and the Responsible-Use Policy." });
    }

    // Uniqueness (by phone for now)
    if (registry.has(phone)) {
      return res.status(409).json({ ok: false, field: "phone", error: "An account with this phone already exists." });
    }

    const userId = `usr_${randomBytes(10).toString("hex")}`;
    const passwordHash = hashPassword(password);

    const record = {
      id: userId,
      fullName: fullName.trim(),
      email: email?.trim() || null,
      phone,
      countryCode: String(countryCode || "").replace(/[^\d]/g, ""),
      createdAt: new Date().toISOString(),
      passwordHash,       // never return this to the client
      consents: {
        terms: !!acceptsTerms,
        policy: !!acceptsPolicy,
      },
      // place for future flags: whatsappLinked, kycStatus, etc.
    };

    // TEMP persistence: memory only (replace with DB later)
    registry.set(phone, record);

    // Minimal session cookie stub (HTTP-only would require NextAuth or custom auth)
    // Here we only return the user payload; frontend can route to /auth/verify for OTP.
    return res.status(201).json({
      ok: true,
      user: {
        id: record.id,
        fullName: record.fullName,
        email: record.email,
        phone: record.phone,
        createdAt: record.createdAt,
      },
      next: { verifyOtp: true }, // frontend can navigate to /auth/verify
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
}
