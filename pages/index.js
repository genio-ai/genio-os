// pages/index.js
export default function Home() {
  return (
    <main className="page">
      {/* Header */}
      <header className="header container">
        <div className="brand">
          <span>Genio OS</span>
        </div>

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
          <div className="value">&lt; 1h avg</div>
        </div>
        <div className="card">
          <div className="subtle">Fees Saved</div>
          <div className="value">30–50%</div>
        </div>
        <div className="card">
          <div className="subtle">Uptime</div>
          <div className="value">99.9%</div>
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
        .brand span {
          font-size: 20px;
          font-weight: 700;
        }
        .top-links a {
          margin-left: 16px;
          color: rgba(255,255,255,0.8);
          text-decoration: none;
        }
        .hero h1 {
          font-size: 28px;
          margin: 0 0 10px;
          font-weight: 700;
        }
        .hero p {
          color: rgba(255,255,255,0.7);
          font-size: 18px;
          max-width: 600px;
        }
        .cta {
          margin: 20px 0;
        }
        .actions {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .btn {
          padding: 12px 18px;
          border-radius: 10px;
          text-decoration: none;
          font-weight: 600;
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
          padding: 14px 28px;
          font-size: 18px;
        }
        .subtle {
          font-size: 14px;
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
          border-radius: 12px;
          padding: 14px;
          text-align: center;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
          gap: 14px;
          margin-top: 30px;
        }
        .card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 14px;
          padding: 16px;
        }
        .value {
          margin-top: 6px;
          font-size: 22px;
          font-weight: 700;
          color: #fff;
        }
      `}</style>
    </main>
  );
}
