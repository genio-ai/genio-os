import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  // Ripple effect
  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest(".btn");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = (e.clientX || 0) - rect.left - size / 2;
      const y = (e.clientY || 0) - rect.top - size / 2;
      const circle = document.createElement("span");
      circle.className = "ripple";
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      target.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <Head>
        <title>Genio OS — Route payments smartly</title>
      </Head>

      {/* Topbar */}
      <div className="topbar">
        <div className="wrap topbarRow">
          <div className="brand">Genio OS</div>
          <nav className="nav">
            <a href="#how">How it works</a>
            <a href="#security">Security</a>
            <a href="#contact">Contact</a>
            <a href="/login" className="btn small">Login</a>
          </nav>
        </div>
      </div>

      <main className="page">
        {/* Hero */}
        <section className="wrap hero">
          <div className="panel">
            <h1>Route payments <span className="accent">smartly</span>.</h1>
            <p className="muted">Send & accept payments globally — faster, cheaper, smarter.</p>
            <div className="actions">
              <Link href="/login" className="btn">Get Started</Link>
              <Link href="/dashboard" className="btn">Open Dashboard</Link>
            </div>

            {/* Grid buttons */}
            <div className="grid">
              <Link href="/router" className="btn">Send Money</Link>
              <Link href="/router" className="btn">Receive Money</Link>
              <Link href="/router" className="btn">Create Payment Link</Link>
            </div>
          </div>
        </section>
      </main>

      {/* Styles */}
      <style jsx global>{`
        :root{
          --bg1:#0b1530;--bg2:#0f1f48;
          --text:#fff;--muted:#b8c0d4;
          --panel:rgba(255,255,255,.06);
          --border:rgba(255,255,255,.12);
          --gA:#22ff9a;--gB:#10e0ff;
        }
        body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system; color:var(--text);
             background:linear-gradient(180deg,var(--bg1),var(--bg2))}
        a{text-decoration:none;color:inherit}
      `}</style>
      <style jsx>{`
        .page{padding-top:64px}
        .topbar{position:fixed;top:0;left:0;right:0;height:64px;background:rgba(10,18,42,.65);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08)}
        .topbarRow{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 16px}
        .brand{font-weight:800}
        .nav{display:flex;gap:14px;align-items:center}
        .btn{background:linear-gradient(90deg,var(--gA),var(--gB));color:#08231f;padding:10px 18px;border-radius:12px;font-weight:700;box-shadow:0 6px 16px rgba(16,224,255,.22);position:relative;overflow:hidden}
        .btn.small{padding:6px 14px}
        .ripple{position:absolute;border-radius:50%;pointer-events:none;transform:scale(0);opacity:.5;background:radial-gradient(circle,rgba(255,255,255,.55) 0%,rgba(255,255,255,.15) 60%,transparent 70%);animation:ripple .6s ease-out}
        @keyframes ripple{to{transform:scale(2.2);opacity:0}}
        .hero{padding:40px 0}
        .panel{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:24px;text-align:center}
        h1{margin:0;font-size:32px;font-weight:900}
        .muted{color:var(--muted);margin:12px 0}
        .actions{display:flex;gap:12px;justify-content:center;margin-bottom:20px}
        .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
      `}</style>
    </>
  );
}
