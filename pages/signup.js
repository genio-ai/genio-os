import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

const USERS_KEY = "users_db";   // why: local mock DB until backend
const AUTH_KEY  = "auth_user";  // why: mock session

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [useWA, setUseWA] = useState(true);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [exists, setExists] = useState(false);

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
  };
  const setUsers = (arr) => {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(arr)); } catch {}
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setExists(false);

    if (!fullName.trim()) return setErr("Full name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErr("Valid email is required.");
    if (!phone || !isValidPhoneNumber(phone)) return setErr("Valid phone number is required.");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords do not match.");

    setBusy(true);
    try {
      const users = getUsers();
      const lower = email.trim().toLowerCase();
      const found = users.find((u) => u.email === lower);

      if (found) {
        setExists(true);
        return;
      }

      const user = {
        id: cryptoRandomId(),        // why: stable local id
        name: fullName.trim(),
        email: lower,
        phone,
        wa: !!useWA,
        createdAt: Date.now()
      };
      users.push(user);
      setUsers(users);

      try { localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id, email: user.email, name: user.name })); } catch {}

      // init empty twin draft for this user if not exists
      const DRAFT_KEY = "twin_ob_draft";
      try {
        const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
        if (!draft || typeof draft !== "object") {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({ owner: user.id }));
        }
      } catch {}

      window.location.href = "/onboarding/personality";
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create your account — genio os</title>
        <meta name="description" content="One account for everything: build and manage your Twin securely." />
      </Head>

      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand"><span className="brand-neon">genio os</span></Link>
          <nav className="links"><Link href="/login">Login</Link></nav>
        </div>
      </header>

      <main className="container">
        <form className="card form" onSubmit={onSubmit} noValidate>
          <h1>Create your account</h1>
          <p className="sub">One account for everything: build your Twin, manage data and consents, and keep full control.</p>

          {exists && (
            <div className="note">
              This email is already registered. <Link href="/login">Go to login</Link>.
            </div>
          )}

          <label className="field">
            <span>Full name <b>*</b></span>
            <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)} placeholder="Your full name" required />
          </label>

          <label className="field">
            <span>Email <b>*</b></span>
            <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required />
            <small className="hint">Used for receipts and account recovery.</small>
          </label>

          <label className="field">
            <span>Phone (for OTP & WhatsApp) <b>*</b></span>
            <div className="phone-wrap">
              <PhoneInput
                placeholder="Enter phone number"
                value={phone}
                onChange={setPhone}
                defaultCountry="US"
                international
                withCountryCallingCode
              />
            </div>
            <small className="hint">Stored securely. Never shared with third parties.</small>
          </label>

          <div className="grid">
            <label className="field">
              <span>Password <b>*</b></span>
              <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="At least 8 characters" required />
            </label>
            <label className="field">
              <span>Confirm password <b>*</b></span>
              <input type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Re-enter password" required />
            </label>
          </div>

          <label className="check">
            <input type="checkbox" checked={useWA} onChange={(e)=>setUseWA(e.target.checked)} />
            <span>Use WhatsApp for notifications (optional)</span>
          </label>

          {err && <div className="alert">{err}</div>}

          <div className="actions">
            <Link className="btn ghost" href="/">Cancel</Link>
            <button className="btn btn-neon" type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create account"}
            </button>
          </div>

          <p className="tos">By continuing, you agree to our <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a>.</p>
        </form>
      </main>

      <style jsx>{`
        :root{
          --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
        }
        .container{width:min(860px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}
        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; border-bottom:1px solid #1b2840}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0}
        .brand-neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 8px rgba(111,195,255,.35),0 0 18px rgba(32,227,178,.22);
          font-weight:800;
        }
        main{padding:24px 0 56px}
        .card{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:14px; padding:16px}
        .form h1{margin:0 0 6px; font-size:clamp(24px,5vw,36px); background:linear-gradient(180deg,#f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;}
        .sub{color:#c0d0e2; margin:0 0 12px}
        .note{border:1px solid #23485b; background:#0f1a20; color:#d6f2ff; padding:10px 12px; border-radius:10px; margin:8px 0}
        .field{display:flex; flex-direction:column; gap:6px; margin:10px 0}
        input{background:#0f1828; color:#edf3ff; border:1px solid #223145; border-radius:10px; padding:10px 12px}
        .hint{color:#9fb5d1; font-size:12px}
        .grid{display:grid; grid-template-columns:1fr 1fr; gap:12px}
        @media (max-width:720px){ .grid{grid-template-columns:1fr} }
        .check{display:flex; align-items:center; gap:10px; margin:8px 0}
        .actions{display:flex; gap:10px; justify-content:flex-end; margin-top:12px}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.ghost{background:#0f1828; border-style:dashed}
        .alert{border:1px solid #5b2330; background:#1a0f14; color:#ffd6df; padding:10px 12px; border-radius:10px; margin:8px 0}
        .tos{color:#9fb5d1; font-size:12px; margin-top:10px}
        .phone-wrap :global(.PhoneInput){background:#0f1828;border:1px solid #223145;border-radius:10px;padding:4px 8px}
        .phone-wrap :global(.PhoneInput input){background:transparent;border:none;outline:none;color:#edf3ff;padding:8px}
        .phone-wrap :global(.PhoneInputCountry){margin:4px 6px 4px 4px}
        .phone-wrap :global(.PhoneInputCountrySelect){background:#0f1828;color:#edf3ff}
      `}</style>

      <style jsx global>{`
        body{
          margin:0; font:16px/1.55 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color:#edf3ff; background:radial-gradient(1200px 600px at 80% -10%, #14263d 0%, #0b111a 60%), #0b111a;
        }
      `}</style>
    </>
  );
}

function cryptoRandomId() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const a = new Uint32Array(4); crypto.getRandomValues(a);
    return [...a].map((n)=>n.toString(16).padStart(8,"0")).join("");
  }
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
