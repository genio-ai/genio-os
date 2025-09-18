// pages/api/auth/sign.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      name,
      email, // optional
      phone, // E.164 required (e.g. +9627XXXXXXX)
      country,
      allowWhatsapp = true,
      allowMarketing = false,
      consents = {},
      client = {},
    } = req.body || {};

    // Basic validation
    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ error: "Invalid name" });
    }
    if (!phone || !/^\+\d{6,16}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone (E.164 required)" });
    }
    if (!country || String(country).length < 2) {
      return res.status(400).json({ error: "Invalid country" });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (
      !consents ||
      !consents.terms ||
      !consents.privacy ||
      !consents.responsibleUse
    ) {
      return res.status(400).json({ error: "All required consents must be accepted" });
    }

    // Create a lightweight user record (stub - replace with DB later)
    const userId = safeUUID();
    const now = new Date().toISOString();

    const userRecord = {
      id: userId,
      name: String(name).trim(),
      email: email ? String(email).trim().toLowerCase() : null,
      phone,
      country,
      allowWhatsapp: !!allowWhatsapp,
      allowMarketing: !!allowMarketing,
      consents: {
        terms: !!consents.terms,
        privacy: !!consents.privacy,
        responsibleUse: !!consents.responsibleUse,
        ts: now,
        ip: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || null,
      },
      clientInfo: {
        tz: client?.tz || null,
        locale: client?.locale || null,
        ua: client?.ua ? sanitizeUA(client.ua) : null,
        ref: client?.ref || null,
      },
      createdAt: now,
      updatedAt: now,
      // status flags
      otpVerified: true, // set true for now; plug real OTP later
      active: true,
    };

    // Audit log (stdout only; replace with DB/audit table later)
    console.log("[audit] user_signed_up", {
      id: userRecord.id,
      phone: obfuscate(phone),
      email: userRecord.email ? obfuscateEmail(userRecord.email) : null,
      country: userRecord.country,
      ts: now,
    });

    // Minimal session cookie (non-sensitive; replace with proper auth later)
    // genio.auth=1 → used by client to enable gated buttons
    // genio.uid=<id> → non-secret identifier for UX (do NOT rely on this for security)
    res.setHeader("Set-Cookie", [
      `genio.auth=1; Path=/; Max-Age=2592000; SameSite=Lax`,
      `genio.uid=${encodeURIComponent(userId)}; Path=/; Max-Age=2592000; SameSite=Lax`,
    ]);

    return res.status(200).json({
      ok: true,
      userId,
      message: "Account created",
    });
  } catch (e) {
    console.error("signup_error", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/* Helpers */

function safeUUID() {
  try {
    return crypto.randomUUID();
  } catch {
    return "u_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

function obfuscate(v) {
  if (!v) return v;
  return v.slice(0, 3) + "***" + v.slice(-2);
}

function obfuscateEmail(v) {
  const [u, d] = String(v).split("@");
  const uu = u.length <= 2 ? u[0] + "*" : u.slice(0, 2) + "***";
  return `${uu}@${d}`;
}

function sanitizeUA(ua) {
  // keep short; avoid storing full fingerprint
  return String(ua).slice(0, 160);
}
