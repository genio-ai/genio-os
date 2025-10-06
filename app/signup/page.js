"use client";

import "./signup.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const USERS_KEY = "users_db";
const AUTH_KEY = "auth_user";
const DRAFT_KEY = "signup_draft";
const TWIN_DRAFT_KEY = "twin_ob_draft";

function isValidPhone(p) {
  if (!p) return false;
  const v = String(p).trim();
  return /^\+?[1-9]\d{7,14}$/.test(v);
}
function safeGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function safeSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}
function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const a = new Uint32Array(4);
    crypto.getRandomValues(a);
    return [...a].map((n) => n.toString(16).padStart(8, "0")).join("");
  }
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
function stepToPath(step) {
  switch (step) {
    case "plan": return "/twin/create/plan";
    case "consent": return "/twin/create/consent";
    case "voice": return "/twin/create/voice";
    case "build": return "/twin/create/build";
    case "finish": return "/twin/create/finish";
    default: return "/twin/create/plan";
  }
}

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [useWA, setUseWA] = useState(true);

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [exists, setExists] = useState(false);
  const [resumePath, setResumePath] = useState("");
  const [canResume, setCanResume] = useState(false);

  const saveTimer = useRef(null);

  // 🔹 check if user already logged in
  useEffect(() => {
    const auth = safeGet(AUTH_KEY, null);
    if (auth?.id) {
      router.replace("/twin/create/plan");
      return;
    }

    document.title = "Create your account — Genio OS";
    const s = safeGet(DRAFT_KEY, null);
    if (s) {
      if (s.fullName) setFullName(s.fullName);
      if (s.email) setEmail(s.email);
      if (s.phone) setPhone(s.phone);
      if (typeof s.useWA === "boolean") setUseWA(s.useWA);
    }

    const twinDraft = safeGet(TWIN_DRAFT_KEY, null);
    if (auth && twinDraft) {
      const path = stepToPath(twinDraft._lastStep || "plan");
      setResumePath(path);
      setCanResume(true);
    }
  }, []);

  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      safeSet(DRAFT_KEY, { fullName, email, phone, useWA });
    }, 400);
    return () => clearTimeout(saveTimer.current);
  }, [fullName, email, phone, useWA]);

  const getUsers = () => safeGet(USERS_KEY, []);
  const setUsers = (arr) => safeSet(USERS_KEY, arr);

  const onResume = () => {
    const twinDraft = safeGet(TWIN_DRAFT_KEY, null);
    const path = stepToPath(twinDraft?._lastStep || "plan");
    router.push(path);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setExists(false);

    if (!fullName.trim()) return setErr("Full name is required.");
    const lower = (email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)) return setErr("Valid email is required.");
    if (!isValidPhone(phone))
      return setErr("Valid phone number is required. Use international format, e.g. +27123456789");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords do not match.");

    setBusy(true);
    try {
      const users = getUsers();
      const found = users.find((u) => u.email === lower);
      if (found) {
        const twinDraft = safeGet(TWIN_DRAFT_KEY, null);
        const path = stepToPath(twinDraft?._lastStep || "plan");
        setResumePath(path);
        setExists(true);
        setCanResume(true);
        return;
      }

      const user = {
        id: cryptoRandomId(),
        name: fullName.trim(),
        email: lower,
        phone,
        wa: !!useWA,
        createdAt: Date.now(),
      };
      users.push(user);
      setUsers(users);
      safeSet(AUTH_KEY, { id: user.id, email: user.email, name: user.name });

      safeSet(TWIN_DRAFT_KEY, { owner: user.id, _lastStep: "plan" });

      try { localStorage.removeItem(DRAFT_KEY); } catch {}

      router.replace("/twin/create/plan");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="signup-page">
      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand"><span className="brand-neon">genio os</span></Link>
          <nav className="links">
            <Link href="/" className="btn ghost">Go Back</Link>
            <Link href="/login">Login</Link>
          </nav>
        </div>
      </header>

      <section className="container">
        {canResume && (
          <div className="resume">
            <div className="resume-text">You have an unfinished setup.</div>
            <button className="btn btn-neon small" onClick={onResume}>Resume onboarding</button>
          </div>
        )}

        <form className="card form" onSubmit={onSubmit} noValidate>
          <h1>Create your account</h1>
          <p className="sub">
            One account for everything: build your Twin, manage voice data, and control usage.
          </p>

          {exists && (
            <div className="note">
              This email is already registered.
              <div className="note-actions">
                <Link className="btn ghost small" href="/login">Go to login</Link>
                <button type="button" className="btn btn-neon small" onClick={onResume}>Resume onboarding</button>
              </div>
            </div>
          )}

          <label className="field">
            <span>Full name *</span>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required />
          </label>

          <label className="field">
            <span>Email *</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            <small className="hint">Used for account recovery.</small>
          </label>

          <label className="field">
            <span>Phone *</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+27 123 456 789" required />
            <small className="hint">Use international format with country code.</small>
          </label>

          <div className="grid">
            <label className="field">
              <span>Password *</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" required />
            </label>
            <label className="field">
              <span>Confirm password *</span>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password" required />
            </label>
          </div>

          <label className="check">
            <input type="checkbox" checked={useWA} onChange={(e) => setUseWA(e.target.checked)} />
            <span>Use WhatsApp for notifications</span>
          </label>

          {err && <div className="alert">{err}</div>}

          <div className="actions">
            <Link className="btn ghost" href="/">Go Back</Link>
            <button className="btn btn-neon" type="submit" disabled={busy}>
              {busy ? "Creating…" : "Start my twin"}
            </button>
          </div>

          <p className="tos">
            By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.
          </p>
        </form>
      </section>
    </main>
  );
}
