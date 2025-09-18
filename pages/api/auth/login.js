// pages/api/auth/login.js
// Email or Phone + Password → verifies against shared in-memory registry,
// sets an HttpOnly session cookie, returns a light user payload.

import { findByEmailOrPhone, verifyPassword } from "../../../lib/usersMem";
import { randomBytes, createHmac } from "crypto";

const COOKIE_NAME = "genio_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function signToken(payload, secret) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const { email, phone, password } = req.body || {};
  if ((!email && !phone) || !password) {
    return res.status(400).json({ ok: false, error: "Email or phone and password are required" });
  }

  const user = findByEmailOrPhone({ email, phone });
  if (!user) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  const ok = verifyPassword(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ ok: false, error: "Invalid credentials" });
  }

  const secret = process.env.SESSION_SECRET || "dev-secret-change-me";
  const token = signToken(
    {
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + COOKIE_MAX_AGE,
      v: 1,
      nonce: randomBytes(8).toString("hex"),
    },
    secret
  );

  // Secure cookie (HttpOnly). In production use `Secure; SameSite=Lax/Strict` as appropriate.
  res.setHeader("Set-Cookie", [
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`,
  ]);

  return res.status(200).json({
    ok: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  });
}
