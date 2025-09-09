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

        <button className="menuBtn" onClick={() => setMenuOpen((v) => !v)}>☰</button>
      </header>

      {/* Hero */}
      <section className="hero container">
        <h1>Route payments smartly.</h1>
        <p>Send & accept payments globally — faster, cheaper, smarter.</p>

        {/* Get Started */}
        <div className="cta">
          <a href="/get-started" className="btn btnGreen">Get Started</a>
        </div>

        {/* Other actions */}
        <div className="actions">
          <a href="#send" className="btn btnGhost">Send Money</a>
          <a href="#receive" className="btn btnGhost">Receive Money</a>
          <a href="/links" className="btn btnGhost">Create Payment Link</a>
          <a href="/dashboard" className="btn btnGhost">Open Dashboard</a>
        </div>
      </section>

      {/* Providers */}
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
        /* ===== COLORS ===== */
        :global(:root) {
          --bgTop: #0a1930;
          --bgBottom: #0f1e3d;
          --green: #22c55e;
          --ghostBg: rgba(255,255,255,0.08);
          --ghostBd: rgba(255,255,255,0.14);
          --textSub: rgba(255,255,255,0.72);
        }

        /* Page background */
        .page {
          min-height: 100vh;
          background: linear-gradient(180deg, var(--bgTop) 0%, var(--bgBottom) 100%);
          color: #fff;
          font-family: -apple-system, system-ui, Segoe UI, Roboto, sans-serif;
        }
        .container {
          max-width: 920px;
          margin: 0 auto;
          padding: 16px 20px;
          box-sizing: border-box;
        }

        /* Header */
        .header {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: transparent;
        }
        .brand {
          font-size: 18px;
          font-weight: 700;
          white-space: nowrap;
        }
        .nav {
          display: flex;
          gap: 18px;
        }
        .nav a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 14px;
        }
        .nav a:hover {
          color: var(--green);
        }
        .menuBtn {
          display: none;
          font-size: 20px;
          background: none;
          border: 0;
          color: #fff;
        }
        @media (max-width: 768px) {
          .menuBtn {
            display: block;
          }
          .nav {
            display: none;
            position: absolute;
            right: 20px;
            top: 56px;
            flex-direction: column;
            gap: 10px;
            background: rgba(10, 25, 48, 0.96);
            padding: 12px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
          }
          .nav.open {
            display: flex;
          }
        }

        /* Hero */
        .hero h1 {
          font-size: 22px;
          margin: 10px 0 6px;
          font-weight: 700;
        }
        .hero p {
          font-size: 15px;
          color: var(--textSub);
          max-width: 640px;
        }

        /* Get Started */
        .cta {
          margin-top: 18px;
          display: flex;
          justify-content: center;
        }
        .cta .btn {
          max-width: 220px;
          width: 100%;
          background: var(--green);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 15px;
          text-align: center;
          padding: 14px 20px;
          box-shadow: 0 4px 12px rgba(34, 197, 94, 0.35);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .cta .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(34, 197, 94, 0.45);
        }

        /* Other actions */
        .actions {
          margin-top: 16px;
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, 1fr);
          max-width: 640px;
        }
        @media (min-width: 880px) {
          .actions {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        /* Buttons */
        .btn {
          display: block;
          text-align: center;
          padding: 14px 20px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
          box-sizing: border-box;
        }
        .btnGhost {
          background: var(--ghostBg);
          border: 1px solid var(--ghostBd);
          color: #fff;
        }

        /* Providers */
        .subtle {
          margin-top: 24px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.75);
        }
        .providers {
          margin-top: 10px;
          display: grid;
          gap: 10px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          max-width: 520px;
        }
        @media (min-width: 700px) {
          .providers {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }
        .pill {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 12px;
          text-align: center;
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}
