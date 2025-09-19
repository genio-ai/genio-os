import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Reset() {
  const r = useRouter();
  const [mode, setMode] = useState("request"); // 'request' | 'reset'
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const t = r.query.token;
    if (typeof t === "string" && t.length > 0) {
      setMode("reset");
      setToken(t);
    } else {
      setMode("request");
    }
  }, [r.query.token]);

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  async function submitRequest(e) {
    e.preventDefault();
    setErr("");
    if (!validateEmail(email)) return setErr("Enter a valid email.");
    try {
      setBusy(true);
      // TODO: call your API: POST /api/auth/reset/request { email }
      await new Promise((res) => setTimeout(res, 700)); // mock
      setMsg("If this email exists, a reset link has been sent.");
    } catch {
      setErr("Could not send reset email. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitReset(e) {
    e.preventDefault();
    setErr("");
    if (!token) return setErr("Invalid or expired link.");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");
    if (password !== confirm) return setErr("Passwords do not match.");
    try {
      setBusy(true);
      // TODO: call your API: POST /api/auth/reset/confirm { token, password }
      await new Promise((res) => setTimeout(res, 700)); // mock
      setMsg("Password updated. Redirecting to login…");
      setTimeout(() => (window.location.href = "/login"), 900);
    } catch {
      setErr("Reset failed. Request a new link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Head>
        <title>{mode === "request" ? "Reset your password" : "Set a new password"} — genio os</title>
        <meta name="description" content="Reset your genio os account password securely." />
      </Head>

      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand"><span className="brand-neon">genio os</span></Link>
          <nav className="links">
            <Link href="/login">Login</Link>
            <Link href="/signup">Create account</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        {mode === "request" ? (
          <form className="card form" onSubmit={submitRequest} noValidate>
            <h1>Reset your password</h1>
            <p className="sub">Enter your email and we’ll send you a secure link to set a new password.</p>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            {err && <div className="alert">{err}</div>}
            {msg && <div className="note">{msg}</div>}

            <div className="actions">
              <Link className="btn ghost" href="/login">Cancel</Link>
              <button className="btn btn-neon" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </div>
          </form>
        ) : (
          <form className="card form" onSubmit={submitReset} noValidate>
            <h1>Set a new password</h1>
            <p className="sub">Create a strong password you haven’t used before.</p>

            <label className="field">
              <span>New password</span>
              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </label>

            <label className="field">
              <span>Confirm password</span>
              <input
                type="password"
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                placeholder="Re-enter password"
                required
              />
            </label>

            {err && <div className="alert">{err}</div>}
            {msg && <div className="note">{msg}</div>}

            <div className="actions">
              <Link className="btn ghost" href="/login">Back to login</Link>
              <button className="btn btn-neon" type="submit" disabled={busy}>
                {busy ? "Saving…" : "Update password"}
              </button>
            </div>
          </form>
        )}
      </main>

      <style jsx>{`
        :root{
          --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
        }
        .container{width:min(640px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}

        /* Header */
        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; border-bottom:1px solid #1b2840}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0}
        .brand-neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 8px rgba(111,195,255,.35),0 0 18px rgba(32,227,178,.22);
          font-weight:800;
        }
        .links a{opacity:.9}
        .links a:hover{opacity:1}

        /* Main */
        main{padding:24px 0 56px}
        .card{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:14px; padding:16px}
        .form h1{margin:0 0 6px; font-size:clamp(24px,5vw,32px); background:linear-gradient(180deg,#f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;}
        .sub{color:#c0d0e2; margin:0 0 12px}
        .field{display:flex; flex-direction:column; gap:6px; margin:10px 0}
        input{background:#0f1828; color:#edf3ff; border:1px solid #223145; border-radius:10px; padding:10px 12px; width:100%}

        .actions{display:flex; gap:10px; justify-content:flex-end; margin-top:12px}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.ghost{background:#0f1828; border-style:dashed}

        .alert{border:1px solid #5b2330; background:#1a0f14; color:#ffd6df; padding:10px 12px; border-radius:10px; margin:8px 0}
        .note{border:1px solid #23485b; background:#0f1a20; color:#d6f2ff; padding:10px 12px; border-radius:10px; margin:8px 0}
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
