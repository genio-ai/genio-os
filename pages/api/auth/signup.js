// POST /api/auth/signup
// Creates a new user in the mock DB with basic validation + password hashing.

import { insertUser, findUserByEmail } from "../../../lib/mockDb";

// Minimal SHA-256 hashing (no external deps). For production, use a stronger KDF (e.g., argon2id/bcrypt).
async function hashPassword(plain) {
  const enc = new TextEncoder();
  const data = enc.encode(plain);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhoneE164(phone) {
  // Example: +15551234567  (keep it simple for now)
  return /^\+?[0-9]{8,15}$/.test(phone);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { fullName, email, phone, password } = req.body || {};

    // Required fields
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    // Basic validation
    if (!isValidEmail(email)) {
      return res.status(400).json({ ok: false, error: "Invalid email address" });
    }
    if (!isValidPhoneE164(phone)) {
      return res.status(400).json({ ok: false, error: "Invalid phone number" });
    }
    if (password.length < 8) {
      return res.status(400).json({ ok: false, error: "Password must be at least 8 characters" });
    }

    // Duplicate check
    if (findUserByEmail(email)) {
      return res.status(409).json({ ok: false, error: "Email already registered" });
    }

    // Hash & store
    const passwordHash = await hashPassword(password);
    const user = insertUser({
      id: `usr_${Date.now()}`,
      fullName,
      email,
      phone,
      passwordHash,
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      ok: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("SIGNUP_ERROR", err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
