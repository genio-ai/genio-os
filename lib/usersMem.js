// In-memory user registry shared by signup/login APIs.
// NOTE: This resets on every redeploy. Swap with a real DB later.
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const usersById = new Map();            // id -> user
const usersByEmail = new Map();         // lower(email) -> id
const usersByPhone = new Map();         // E.164 phone -> id

export function genId() {
  return `usr_${randomBytes(10).toString("hex")}`;
}

export function toE164(phone) {
  // very light normalization (expect +XXXXXXXX)
  const s = String(phone || "").replace(/\s+/g, "");
  if (!/^\+\d{6,16}$/.test(s)) return null;
  return s;
}

// -------- password hashing/verification (scrypt) ----------
export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(password, stored) {
  try {
    const [saltHex, hashHex] = String(stored).split(":");
    const salt = Buffer.from(saltHex, "hex");
    const hash = Buffer.from(hashHex, "hex");
    const test = scryptSync(password, salt, 64);
    return timingSafeEqual(hash, test);
  } catch {
    return false;
  }
}

// --------------- CRUD -----------------
export function createUser({ fullName, email, phone, password }) {
  const id = genId();
  const now = new Date().toISOString();
  const emailKey = email ? String(email).toLowerCase() : null;
  const phoneKey = toE164(phone);

  const user = {
    id,
    fullName: String(fullName).trim(),
    email: emailKey,
    phone: phoneKey,
    passwordHash: hashPassword(password),
    createdAt: now,
    updatedAt: now,
    active: true,
  };

  usersById.set(id, user);
  if (emailKey) usersByEmail.set(emailKey, id);
  if (phoneKey) usersByPhone.set(phoneKey, id);

  return user;
}

export function findByEmailOrPhone({ email, phone }) {
  if (email) {
    const id = usersByEmail.get(String(email).toLowerCase());
    if (id) return usersById.get(id) || null;
  }
  if (phone) {
    const id = usersByPhone.get(toE164(phone));
    if (id) return usersById.get(id) || null;
  }
  return null;
}
