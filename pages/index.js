// pages/index.js
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="page">
      {/* Header */}
      <header className="header container">
        <div className="brand">Genio OS</div>

        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <a href="/pricing">Pricing</a>
          <a href="/docs">Docs</a>
          <a href="/compliance">Compliance</a>
          <a href="/support">Support</a>
        </nav>

        <button className="menuBtn" onClick={() => setMenuOpen((v) => !v)}>
          ☰
        </button>
      </header>

      {/* Hero */}
      <section className="hero container">
        <h1>Route payments smartly.</h1>
        <p>Send & accept payments globally — faster, cheaper, smarter.</p>

        {/* Get Started (صف أول لوحده) */}
        <div className="cta">
          <a href="/get-started" className="btn btnGreen">Get Started</a>
        </div>

        {/* باقي الأزرار — متناسقة */}
        <div className="actions">
          <a href="#send" className="btn btnGhost">Send Money</a>
          <a href="#receive" className="btn btnGhost">Receive Money</a>
          <a href="/links" className="btn btnGhost">Create Payment Link</a>
          <a href="/dashboard" className="btn btnGhost">Open Dashboard</a>
        </div>
      </section>

      {/* Providers كنص بسيط */}
      <section className="container">
        <div className="subtle">Powered by</div>
        <div className="providers">
          <div className="pill">Wise</div>
          <div className="pill">Flutterwave</div>
          <div className="pill">PayGate</div>
          <div className="pill">Stripe</div>
        </div>
      </section>

      <style jsx>{`
        /* الخلفية: أزرق غامق مع تدرّج */
        .page {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a1930 0%, #0f1e3d 100%);
          color: #fff;
          font-family: -apple-system, system-ui, Segoe UI, Roboto, sans-serif;
        }
        .container { max-width: 920px; margin: 0 auto; padding: 18px; }

        /* Header */
        .header {
          position: sticky; top: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          backdrop-filter: saturate(140%) blur(6px);
          background: rgba(10, 25, 48, 0.35);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .brand { font-size: 18px; font-weight: 700; white-space: nowrap; }

        .nav { display: flex; gap: 18px; }
        .nav a {
          color: rgba(255,255,255,0.85);
          text-decoration: none; font-size: 14px;
        }
        .nav a:hover { color: #22c55e; }

        .menuBtn {
          display: none; font-size: 20px; line-height: 1;
          background: none; border: 0; color: #fff; cursor: pointer;
        }

        /* موبايل: منيو منسدلة */
        @media (max-width: 768px) {
          .menuBtn { display: block; }
          .nav {
            display: none;
            position: absolute; right: 18px; top: 58px;
            flex-direction: column; gap: 10px;
            background: rgba(10, 25, 48, 0.96);
            padding: 12px; border: 1px solid rgba(255,255,255,0.08);
            border-radius: 10px;
          }
          .nav.open { display: flex; }
        }

        /* Hero */
        .hero h1 { font-size: 22px; margin: 10px 0 6px; font-weight: 700; }
        .hero p  { font-size: 15px; color: rgba(255,255,255,0.72); max-width: 640px; }

        /* Get Started لوحده */
        .cta { margin-top: 18px; max-width: 320px; }
        .cta .btn { width: 100%; }

        /* باقي الأزرار */
        .actions {
          margin-top: 16px;
          display: grid; gap: 12px;
          grid-template-columns: repeat(2, 1fr);
          max-width: 640px;
        }
        @media (min-width: 880px) {
          .actions { grid-template-columns: repeat(4, 1fr); }
        }

        /* Buttons */
        .btn {
          display: block; text-align: center;
          padding: 14px 20px; border-radius: 12px;
          text-decoration: none; font-weight: 600; font-size: 15px;
        }
        .btnGreen { background: #22c55e; color: #fff; border: none; }
        .btnGhost {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          color: #fff;
        }

        /* Providers */
        .subtle { margin-top: 24px; font-size: 13px; color: rgba(255,255,255,0.75); }
        .providers {
          margin-top: 10px;
          display: grid; gap: 10px;
          grid-template-columns: repeat(2, minmax(0,1fr));
          max-width: 520px;
        }
        @media (min-width: 700px) {
          .providers { grid-template-columns: repeat(4, minmax(0,1fr)); }
        }
        .pill {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px; padding: 12px;
          text-align: center; font-size: 14px;
        }
      `}</style>
    </main>
  );
}
