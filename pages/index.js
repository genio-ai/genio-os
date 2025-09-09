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

        {/* CTA الرئيسي */}
        <div className="cta">
          <a href="/get-started" className="btn btn--green btn--big">
            Get Started
          </a>
        </div>

        {/* أزرار إضافية */}
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

      {/* Stats */}
      <section className="container stats">
        <div className="card">
          <div className="subtle">Settlement Speed</div>
          <div className="value small">&lt; 1h avg</div>
        </div>
        <div className="card">
          <div className="subtle">Fees Saved</div>
          <div className="value small">30–50%</div>
        </div>
        <div className="card">
          <div className="subtle">Uptime</div>
          <div className="value small">99.9%</div>
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #0a0f1f;
          color: #fff;
          font-family: sans-serif;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          font-size: 18px;
          font-weight: 600;
        }
        .top-links a {
          margin-left: 16px;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          font-size: 14px;
        }
        .hero h1 {
          font-size: 24px;  /* أصغر */
          margin: 0 0 8px;
          font-weight: 600;
        }
        .hero p {
          color: rgba(255,255,255,0.7);
          font-size: 16px;
          max-width: 600px;
        }
        .cta {
          margin: 18px 0;
        }
        .actions {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .btn {
          padding: 10px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
        }
        .btn--ghost {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
        }
        .btn--green {
          background: linear-gradient(90deg,#16a34a,#22c55e);
          color: #fff;
          border: none;
        }
        .btn--big {
          padding: 12px 24px;
          font-size: 16px;
        }
        .subtle {
          font-size: 13px;
          color: rgba(255,255,255,0.7);
        }
        .providers {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(120px,1fr));
          gap: 10px;
          margin-top: 10px;
        }
        .pill {
          background: rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 12px;
          text-align: center;
          font-size: 14px;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(200px,1fr));
          gap: 12px;
          margin-top: 24px;
        }
        .card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 14px;
        }
        .value {
          margin-top: 4px;
          font-weight: 600;
          color: #fff;
        }
        .value.small {
          font-size: 18px; /* أصغر */
        }
      `}</style>
    </main>
  );
}
