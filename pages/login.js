import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Login() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("genio_token"));
  }, []);

  const demoLogin = () => {
    localStorage.setItem("genio_token", "demo_" + Date.now());
    window.location.href = "/dashboard";
  };

  const logout = () => {
    localStorage.removeItem("genio_token");
    setLoggedIn(false);
  };

  return (
    <>
      <Head><title>Login — Genio OS</title></Head>
      <main className="page">
        <div className="panel">
          <h1>Login</h1>
          <p className="muted">Demo login to access your dashboard</p>

          {!loggedIn ? (
            <button className="btn" onClick={demoLogin}>Continue (Demo Login)</button>
          ) : (
            <>
              <Link href="/dashboard" className="btn">Go to Dashboard</Link>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </main>

      <style jsx global>{`
        body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system;background:linear-gradient(180deg,#0b1530,#0f1f48);color:#fff}
      `}</style>
      <style jsx>{`
        .page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}
        .panel{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:24px;text-align:center}
        .muted{color:#b8c0d4;margin-bottom:20px}
        .btn{background:linear-gradient(90deg,#22ff9a,#10e0ff);color:#08231f;padding:10px 18px;border-radius:12px;font-weight:700;margin:5px}
      `}</style>
    </>
  );
}
