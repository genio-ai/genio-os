// pages/auth/login.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // E.164 like +9627XXXXXXXX
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  async function onSubmit(e) {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if ((!email && !phone) || !password) {
      setMsg({ type: "error", text: "Please enter email or phone and your password." });
      return;
    }

    try {
      setLoading(true);
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || null,
          phone: phone || null,
          password,
        }),
      });
      const data = await r.json();
      if (!data.ok) {
        setMsg({ type: "error", text: data.error || "Login failed." });
      } else {
        setMsg({ type: "success", text: "Logged in. Redirecting…" });
        setTimeout(() => Router.push("/twin"), 600);
      }
    } catch {
      setMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Log in · Genio</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="wrap">
        <header className="header">
          <Link href="/" className="brand">Genio</Link>
          <nav className="nav">
            <Link href="/auth/signup" className="ghost">Sign up</Link>
          </nav>
        </header>

        <section className="card">
          <h1>Welcome back</h1>
          <p className="sub">Use your email or phone with your password.</p>

          <form onSubmit={onSubmit} noValidate>
            <div className="grid">
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <small className="hint">Leave empty if you will log in with phone.</small>
              </div>

              <div className="field">
                <label>Phone (E.164)</label>
                <input
                  type="tel"
                  placeholder="+96279XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <small className="hint">Leave empty if you will log in with email.</small>
              </div>

              <div className="field">
                <label>Password</label>
                <div className="pwd">
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowPwd((s) => !s)}>
                    {showPwd ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {msg.text ? (
              <div className={`alert ${msg.type === "error" ? "error" : "ok"}`}>
                {msg.text}
              </div>
            ) : null}

            <button className="primary" type="submit" disabled={loading}>
              {loading ? "Logging in…" : "Log in"}
            </button>

            <p className="foot">
              Don’t have an account? <Link href="/auth/signup">Sign up</Link>
            </p>
          </form>
        </section>
      </main>

      <style jsx>{`
        .wrap { min-height: 100vh; background: radial-gradient(1200px 600px at 50% -200px, #0b3a6a22, transparent) #0a1730; color:#e6eef8; }
        .header { max-width: 960px; margin:0 auto; padding:24px 20px; display:flex; align-items:center; justify-content:space-between; }
        .brand { font-weight:800; letter-spacing:0.4px; color:#fff; text-decoration:none; font-size:20px; }
        .nav :global(a){ color:#c9d6e5; text-decoration:none; padding:8px 14px; border:1px solid #2b3950; border-radius:10px; }
        .ghost:hover{ background:#13233f; }
        .card { max-width:960px; margin:0 auto 64px; padding:24px 20px 48px; background:#0f1c37; border:1px solid #22304a; border-radius:16px; }
        h1{ margin:8px 0 8px; font-size:28px; }
        .sub{ color:#b5c3d9; margin-bottom:20px; }
        .grid{ display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
        @media (max-width:760px){ .grid{ grid-template-columns:1fr; } }
        .field{ display:flex; flex-direction:column; }
        label{ font-size:14px; margin-bottom:8px; color:#dbe7fb; }
        input{ background:#0b1730; border:1px solid #2a3a56; color:#e6eef8; border-radius:12px; padding:12px 14px; outline:none; }
        input:focus{ border-color:#3f86ff; box-shadow:0 0 0 3px #3f86ff33; }
        .hint{ color:#93a7c4; margin-top:6px; }
        .pwd{ position:relative; display:flex; align-items:center; }
        .pwd input{ flex:1; padding-right:88px; }
        .pwd button{ position:absolute; right:6px; top:50%; transform:translateY(-50%); background:#14294d; border:0; color:#d7e5ff; padding:8px 12px; border-radius:8px; cursor:pointer; }
        .alert{ margin-top:14px; padding:12px 14px; border-radius:10px; font-size:14px; }
        .alert.error{ background:#3a1120; border:1px solid #7a2745; color:#ffc3d2; }
        .alert.ok{ background:#0f3020; border:1px solid #2e7a59; color:#b8ffde; }
        .primary{ margin-top:18px; background:linear-gradient(180deg,#ffd86b,#ffbe3b); color:#1b1200; border:0; padding:12px 16px; border-radius:12px; font-weight:700; cursor:pointer; }
        .primary:disabled{ opacity:0.6; cursor:not-allowed; }
        .foot{ color:#b5c3d9; margin-top:14px; }
        .foot :global(a){ color:#fff; }
      `}</style>
    </>
  );
}
