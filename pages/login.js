import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

const USERS_KEY = "users_db";   // mock DB local
const AUTH_KEY  = "auth_user";  // mock session

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const hint = JSON.parse(localStorage.getItem("auth_hint") || "{}");
      if (hint.email) setEmail(hint.email);
    } catch {}
  }, []);

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
  }
  function setUsers(arr) {
    try { localStorage.setItem(USERS_KEY, JSON.stringify(arr)); } catch {}
  }

  async function sha256(text) {
    // why: we store only a hash for password (mock security)
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,"0")).join("");
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");

    if (!validateEmail(email)) return setErr("Enter a valid email.");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");

    setBusy(true);
    try {
      const users = getUsers();
      const lower = email.trim().toLowerCase();
      const idx = users.findIndex(u => u.email === lower);

      if (idx === -1) {
        setErr("Account not found. Create an account first.");
        return;
      }

      const u = users[idx];
      const ph = await sha256(password);

      if (!u.pwd) {
        // First login for legacy users: set password now.
        users[idx] = { ...u, pwd: ph, pwdSetAt: Date.now() };
        setUsers(users);
        setMsg("Password set for this account.");
      } else if (u.pwd !== ph) {
        setErr("Incorrect email or password.");
        return;
      }

      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ id: u.id, email: u.email, name: u.name }));
        if (remember) localStorage.setItem("auth_hint", JSON.stringify({ email: u.email }));
      } catch {}

      window.location.href = "/dashboard";
    } catch {
      setErr("Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login — genio os</title>
        <meta name="description" content="Sign in to manage and train your digital twin." />
      </Head>

      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand"><span className="brand-neon">genio os</span></Link>
          <nav className="links"><Link href="/signup">Create account</Link></nav>
        </div>
      </header>

      <main className="container">
        <form className="card form" onSubmit={onSubmit} noValidate>
          <h1>Welcome back</h1>
          <p className="sub">Sign in to access your twin and dashboard.</p>

          {msg && <div className="note">{msg}</div>}
          {err && <div className="alert">{err}</div>}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <div className="pw">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
              <button type="button" className="toggle" onClick={()=>setShow(s=>!s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="row">
            <label className="check">
              <input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <Link className="forgot" href="/reset">Forgot password?</Link>
          </div>

          <div className="actions">
            <Link className="btn ghost" href="/">Cancel</Link>
            <button className="btn btn-neon" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Login"}
            </button>
          </div>

          <p className="tos">New here? <Link href="/signup">Create an account</Link>.</p>
        </form>
      </main>

      <style jsx>{`
        :root{
          --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
        }
        .container{width:min(640px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}
        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; border-bottom:1px solid #1b2840}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0}
        .brand-neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 8px rgba(111,195,255,.35),0 0 18px rgba(32,227,178,.22);
          font-weight:800;
        }
        .form h1{margin:0 0 6px; font-size:clamp(24px,5vw,32px); background:linear-gradient(180deg,#f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;}
        .sub{color:#c0d0e2; margin:0 0 12px}
        .card{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:14px; padding:16px}
        .field{display:flex; flex-direction:column; gap:6px; margin:10px 0}
        input{background:#0f1828; color:#edf3ff; border:1px solid #223145; border-radius:10px; padding:10px 12px; width:100%}
        .pw{display:flex; align-items:stretch; gap:8px}
        .pw input{flex:1}
        .toggle{border:1px dashed #2a3a56; background:#0f1b2d; color:#cfe6ff; border-radius:10px; padding:0 12px; cursor:pointer}
        .row{display:flex; justify-content:space-between; align-items:center; margin:6px 0}
        .check{display:flex; align-items:center; gap:10px}
        .forgot{color:#cfe0ff}
        .actions{display:flex; gap:10px; justify-content:flex-end; margin-top:12px}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.ghost{background:#0f1828; border-style:dashed}
        .alert{border:1px solid #5b2330; background:#1a0f14; color:#ffd6df; padding:10px 12px; border-radius:10px; margin:8px 0}
        .note{border:1px solid #23485b; background:#0f1a20; color:#d6f2ff; padding:10px 12px; border-radius:10px; margin:8px 0}
        .tos{color:#9fb5d1; font-size:12px; margin-top:10px}
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
