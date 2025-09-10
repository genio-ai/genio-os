// pages/login.js
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("genio_token"));
  }, []);

  const demoLogin = () => {
    // توكن ديمو بسيط
    localStorage.setItem("genio_token", "demo_" + Math.random().toString(36).slice(2));
    window.location.href = "/dashboard";
  };

  const logout = () => {
    localStorage.removeItem("genio_token");
    setLoggedIn(false);
  };

  return (
    <>
      <Head><title>Genio OS — Login</title></Head>
      <main className="page">
        <section className="wrap hero">
          <div className="panel">
            <h1>Login</h1>
            <p className="muted">Sign in to access your dashboard and router.</p>

            {!loggedIn ? (
              <div className="actions">
                <button className="btn" onClick={demoLogin}>Continue (Demo Login)</button>
                <Link href="/" className="btn">Back to Home</Link>
              </div>
            ) : (
              <div className="actions">
                <Link href="/dashboard" className="btn">Go to Dashboard</Link>
                <button className="btn" onClick={logout}>Logout</button>
              </div>
            )}

            <p className="hint">
              لاحقًا منضيف <b>Passkeys/FaceID</b> و<em>Magic Link</em> بسهولة بدون ما نغيّر
              التدفق الحالي.
            </p>
          </div>
        </section>
      </main>

      {/* نفس ستايل الصفحات السابقة */}
      <style jsx global>{`
        :root{--bg1:#0b1530;--bg2:#0f1f48;--text:#fff;--muted:#b8c0d4;--panel:rgba(255,255,255,.06);--border:rgba(255,255,255,.12);--gA:#22ff9a;--gB:#10e0ff}
        *{box-sizing:border-box} html,body,#__next{height:100%}
        body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system; color:var(--text);
             background:linear-gradient(180deg,var(--bg1),var(--bg2))}
        a{text-decoration:none;color:inherit}
      `}</style>
      <style jsx>{`
        .page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
        .wrap{max-width:720px;margin:0 auto;width:100%}
        .panel{background:var(--panel);border:1px solid var(--border);border-radius:18px;padding:28px}
        h1{margin:0 0 6px;font-weight:900}
        .muted{color:var(--muted)}
        .actions{display:flex;gap:12px;margin-top:16px;flex-wrap:wrap}
        .btn{background:linear-gradient(90deg,var(--gA),var(--gB));color:#08231f;font-weight:800;
             padding:10px 18px;border-radius:12px;box-shadow:0 10px 28px rgba(16,224,255,.22)}
        .hint{margin-top:14px;color:#9fb1cf;font-size:14px}
      `}</style>
    </>
  );
}
