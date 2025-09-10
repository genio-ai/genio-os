// pages/index.tsx
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Genio OS — Route payments smartly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Send & accept payments globally — faster, cheaper, smarter."
        />
      </Head>

      <main className="page">
        {/* Header */}
        <header className="container header">
          <div className="brand">Genio OS</div>
          <nav className="nav">
            <a href="#how">How it works</a>
            <a href="#security">Security</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        {/* Hero */}
        <section className="container hero">
          <div className="card">
            <div className="hero-text">
              <h1>
                Route payments <span className="accent">smartly</span>.
              </h1>
              <p className="muted">
                Send & accept payments globally — faster, cheaper, smarter.
              </p>

              <div className="actions">
                <Link href="#get-started" className="btn btn-gradient">
                  Get Started
                </Link>
                <a href="#dashboard" className="btn btn-ghost">
                  Open Dashboard
                </a>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid">
              <a href="#send" className="tile">Send Money</a>
              <a href="#receive" className="tile">Receive Money</a>
              <a href="#link" className="tile">Create Payment Link</a>
              <a href="#dashboard" className="tile">Open Dashboard</a>
            </div>

            {/* Providers */}
            <div className="providers">
              <p className="label">Powered by</p>
              <div className="provider-grid">
                {["Wise", "Flutterwave", "PayGate", "Stripe"].map((p) => (
                  <div key={p} className="provider">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="container section">
          <h2>How it works</h2>
          <div className="cards3">
            <div className="mini-card">
              <div className="mini-title">1) Connect</div>
              <p className="muted">
                Link your preferred providers. No custody — Genio only routes.
              </p>
            </div>
            <div className="mini-card">
              <div className="mini-title">2) Smart routing</div>
              <p className="muted">
                We pick the best route for price, speed, and success rate.
              </p>
            </div>
            <div className="mini-card">
              <div className="mini-title">3) Track & reconcile</div>
              <p className="muted">
                Live status, webhooks, and simple exports for your finance team.
              </p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="container section">
          <div className="card">
            <h3>Security & Compliance</h3>
            <ul className="list">
              <li>KYC tiers and AML screening via connected providers.</li>
              <li>Genio OS is a routing layer — we do not hold customer funds.</li>
              <li>Audit logs, role-based access, and provider webhooks.</li>
            </ul>
          </div>
        </section>

        {/* Footer */}
        <footer id="contact" className="footer">
          <div className="container footer-row">
            <div>© {new Date().getFullYear()} Genio OS</div>
            <div className="footer-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </footer>
      </main>

      {/* --- Styles (styled-jsx) --- */}
      <style jsx global>{`
        :root {
          --bg1: #0b1530;
          --bg2: #0f1f48;
          --panel: rgba(255,255,255,0.06);
          --panel-border: rgba(255,255,255,0.12);
          --text: #ffffff;
          --muted: #b8c0d4;
          --accent: #88f7c8; /* text accent */
          --btn-grad-a: #00ff94;
          --btn-grad-b: #00d4ff;
        }
        * { box-sizing: border-box; }
        html, body, #__next { height: 100%; }
        body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; color: var(--text); background: linear-gradient(to bottom, var(--bg1), var(--bg2)); }
        a { color: inherit; text-decoration: none; }
      `}</style>

      <style jsx>{`
        .page { min-height: 100vh; display: flex; flex-direction: column; }
        .container { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 16px; }

        /* Header */
        .header { display: flex; align-items: center; justify-content: space-between; padding: 18px 16px; }
        .brand { font-weight: 700; letter-spacing: .3px; }
        .nav { display: none; gap: 20px; color: #c9d1e8; }
        .nav a:hover { color: #fff; }
        @media (min-width: 640px){ .nav{ display:flex; } }

        /* Hero */
        .hero { padding: 24px 16px 40px; }
        .card { background: var(--panel); border: 1px solid var(--panel-border); border-radius: 16px; padding: 24px; backdrop-filter: blur(6px); }
        @media (min-width:640px){ .card{ padding: 40px; } }
        h1 { margin: 0; font-size: 32px; line-height: 1.2; font-weight: 800; }
        @media (min-width:640px){ h1{ font-size: 40px; } }
        .accent { color: var(--accent); }
        .muted { color: var(--muted); }
        .hero-text p { margin: 10px 0 0; }
        .actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 20px; }

        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          height: 44px; padding: 0 18px; border-radius: 10px; font-weight: 600;
          transition: transform .15s ease, opacity .15s ease, background .15s ease;
          border: 1px solid transparent;
        }
        .btn-gradient {
          background: linear-gradient(90deg, var(--btn-grad-a), var(--btn-grad-b));
          color: #071b1a; box-shadow: 0 6px 16px rgba(0, 212, 255, 0.25);
        }
        .btn-gradient:hover { opacity: .9; transform: translateY(-1px); }
        .btn-ghost {
          border-color: var(--panel-border); background: rgba(255,255,255,.06); color: #fff;
        }
        .btn-ghost:hover { background: rgba(255,255,255,.12); }

        /* Quick actions grid */
        .grid { margin-top: 22px; display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
        @media (min-width:640px){ .grid{ grid-template-columns: repeat(4,1fr); } }
        .tile {
          text-align: center; padding: 14px 10px; border-radius: 12px;
          background: rgba(255,255,255,.06); border: 1px solid var(--panel-border);
          font-weight: 700; font-size: 14px; color:#e6ecff;
        }
        .tile:hover { background: rgba(255,255,255,.12); }

        /* Providers */
        .providers { margin-top: 26px; }
        .label { font-size: 12px; letter-spacing: 1.2px; text-transform: uppercase; color: #9aa6c8; }
        .provider-grid { margin-top: 10px; display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
        @media (min-width:640px){ .provider-grid{ grid-template-columns: repeat(4,1fr); } }
        .provider {
          text-align:center; padding: 10px; border-radius: 12px;
          background: rgba(255,255,255,.06); border: 1px solid var(--panel-border);
          color:#d7def4; font-size: 14px;
        }

        /* Sections */
        .section { padding: 24px 16px 40px; }
        .section h2 { margin: 0 0 14px; font-size: 22px; }
        .cards3 { display: grid; gap: 14px; }
        @media (min-width:640px){ .cards3{ grid-template-columns: repeat(3,1fr); } }
        .mini-card { background: var(--panel); border: 1px solid var(--panel-border); border-radius: 16px; padding: 18px; }
        .mini-title { color: var(--accent); font-weight: 700; }

        .list { margin: 10px 0 0 18px; color: var(--muted); }
        .list li { margin: 6px 0; }

        /* Footer */
        .footer { border-top: 1px solid var(--panel-border); background: rgba(0,0,0,.25); color:#c6cde5; }
        .footer-row { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; gap:12px; }
        .footer-links { display:flex; gap:16px; }
        .footer-links a:hover { color:#fff; }
      `}</style>
    </>
  );
}
