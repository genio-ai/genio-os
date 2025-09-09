// pages/index.js
export default function Home() {
  return (
    <main className="page">
      {/* Header */}
      <header className="header container">
        <div className="brand">Genio OS</div>

        <nav className="top-links">
          <a href="/pricing">Pricing</a>
          <a href="/docs">Docs</a>
          <a href="/compliance">Compliance</a>
          <a href="/support">Support</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="hero container">
        <h1>Route payments smartly.</h1>
        <p>Send & accept payments globally — faster, cheaper, smarter.</p>

        {/* Get Started CTA */}
        <div className="cta">
          <a href="/get-started" className="btn btn--green">Get Started</a>
        </div>

        {/* Other actions */}
        <div className="actions">
          <a href="#send" className="btn btn--ghost">Send Money</a>
          <a href="#receive" className="btn btn--ghost">Receive Money</a>
          <a href="/links" className="btn btn--ghost">Create Payment Link</a>
          <a href="/dashboard" className="btn btn--ghost">Open Dashboard</a>
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
        .page {
          min-height: 100vh;
          background: #0b0f1e;
          color: #fff;
          font-family: -apple-system, system-ui, Segoe UI, Roboto, sans-serif;
        }
        .container { max-width: 900px; margin: 0 auto; padding: 18px; }

        /* Header */
        .header { display: flex; align-items: center; justify-content: space-between; }
        .brand { font-size: 18px; font-weight: 700; white-space: nowrap; }
        .top-links a {
          margin-left: 14px; font-size: 14px;
          color: rgba(255,255,255,0.8); text-decoration: none;
        }

        /* Hero */
        .hero h1 { font-size: 24px; margin: 6px 0 6px; font-weight: 700; }
        .hero p  { font-size: 16px; color: rgba(255,255,255,0.72); max-width: 640px; }

        /* Get Started CTA */
        .cta { margin-top: 20px; max-width: 300px; }
        .cta .btn { width: 100%; }

        /* Actions grid */
        .actions {
          margin-top: 16px;
          display: grid;
          grid-template-columns: repeat(2,1fr);
          gap: 12px;
          max-width: 600px;
        }
        @media (min-width: 768px) {
          .actions { grid-template-columns: repeat(4,1fr); }
        }

        /* Buttons */
        .btn {
          display: block;
          text-align: center;
          padding: 14px 20px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
          font-size: 15px;
        }
        .btn--ghost {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          color: #fff;
        }
        .btn--green {
          background: #22c55e;
          color: #fff;
          border: none;
        }

        /* Providers */
        .subtle { font-size: 13px; color: rgba(255,255,255,0.7); margin-top: 24px; }
        .providers {
          display: grid;
          grid-template-columns: repeat(2,minmax(0,1fr));
          gap: 10px;
          max-width: 520px;
          margin-top: 10px;
        }
        @media (min-width: 700px) {
          .providers { grid-template-columns: repeat(4,minmax(0,1fr)); }
        }
        .pill {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 12px;
          text-align: center;
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}
