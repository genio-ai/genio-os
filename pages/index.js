// pages/index.tsx
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  // Ripple Effect على كل الأزرار
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest(".btn") as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const circle = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      const x = (e.clientX ?? 0) - rect.left - size / 2;
      const y = (e.clientY ?? 0) - rect.top - size / 2;
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Top Bar ثابت */}
      <div className="topbar">
        <div className="wrap topbarRow">
          <div className="brand">Genio OS</div>
          <nav className="nav">
            <a href="#how">How it works</a>
            <a href="#security">Security</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </div>

      <main className="page">
        {/* Hero */}
        <section className="wrap hero" id="home">
          <div className="panel">
            <div className="heroText">
              <h1>
                Route payments <span className="accent">smartly</span>.
              </h1>
              <p className="muted">
                Send & accept payments globally — faster, cheaper, smarter.
              </p>

              <div className="actions">
                <Link href="#get-started" className="btn">
                  Get Started
                </Link>
                <a href="#dashboard" className="btn">
                  Open Dashboard
                </a>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid">
              <a className="btn" href="#send">Send Money</a>
              <a className="btn" href="#receive">Receive Money</a>
              <a className="btn" href="#link">Create Payment Link</a>
              <a className="btn" href="#dashboard">Open Dashboard</a>
            </div>

            {/* Providers */}
            <div className="providers">
              <p className="label">Powered by</p>
              <div className="providerGrid">
                {["Wise", "Flutterwave", "PayGate", "Stripe"].map((p) => (
                  <div key={p} className="chip">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="wrap section">
          <h2>How it works</h2>
          <div className="cards3">
            <div className="card">
              <div className="cardTitle">1) Connect</div>
              <p className="muted">Link your preferred providers. No custody — Genio only routes.</p>
            </div>
            <div className="card">
              <div className="cardTitle">2) Smart routing</div>
              <p className="muted">We pick the best route for price, speed, and success rate.</p>
            </div>
            <div className="card">
              <div className="cardTitle">3) Track & reconcile</div>
              <p className="muted">Live status, webhooks, and simple exports for your finance team.</p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="wrap section">
          <div className="panel">
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
          <div className="wrap footRow">
            <div>© {new Date().getFullYear()} Genio OS</div>
            <div className="links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </footer>
      </main>

      {/* ===== Global Base & Smooth Scroll ===== */}
      <style jsx global>{`
        :root{
          --bg1:#0b1530; --bg2:#0f1f48;
          --text:#fff; --muted:#b8c0d4;
          --panel:rgba(255,255,255,.06);
          --border:rgba(255,255,255,.12);
          --accent:#78f6cf;
          --gA:#22ff9a; --gB:#10e0ff; /* موحّد */
        }
        *{box-sizing:border-box}
        html,body,#__next{height:100%}
        html{scroll-behavior:smooth;} /* Smooth Scroll */
        body{
          margin:0;
          font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial;
          color:var(--text);
          background:linear-gradient(180deg,var(--bg1),var(--bg2));
        }
        a{text-decoration:none;color:inherit}
      `}</style>

      {/* ===== Page Styles ===== */}
      <style jsx>{`
        .page{min-height:100vh;display:flex;flex-direction:column;padding-top:64px} /* مساحة للـ TopBar */
        .wrap{max-width:1120px;margin:0 auto;padding:0 16px}

        /* TopBar */
        .topbar{
          position:fixed; inset:0 0 auto 0; height:64px; z-index:50;
          background:rgba(10,18,42,.65); backdrop-filter: blur(10px);
          border-bottom:1px solid rgba(255,255,255,.08);
          box-shadow:0 6px 20px rgba(0,0,0,.25);
        }
        .topbarRow{height:64px; display:flex; align-items:center; justify-content:space-between;}
        .brand{font-weight:800;letter-spacing:.3px}
        .nav{display:none;gap:22px;color:#c9d1e8}
        .nav a:hover{color:#fff}
        @media(min-width:640px){.nav{display:flex}}

        /* Hero */
        .hero{padding:28px 0 40px}
        .panel{background:var(--panel);border:1px solid var(--border);border-radius:18px;padding:26px 22px;backdrop-filter:blur(6px)}
        @media(min-width:640px){.panel{padding:38px}}
        h1{margin:0 0 6px;font-size:34px;line-height:1.15;font-weight:900}
        @media(min-width:640px){h1{font-size:44px}}
        .accent{color:var(--accent)}
        .muted{color:var(--muted)}
        .actions{display:flex;flex-wrap:wrap;gap:12px;margin:18px 0 10px}

        /* Buttons - Gradient + Gloss + Ripple */
        .btn{
          position:relative; isolation:isolate;
          display:inline-flex; align-items:center; justify-content:center;
          min-height:46px; padding:0 18px; border-radius:14px;
          font-weight:800; letter-spacing:.2px;
          border:0; cursor:pointer; color:#08231f;
          transition:transform .18s ease, box-shadow .18s ease, filter .18s ease;
          box-shadow:0 10px 28px rgba(16,224,255,.22);
          background:linear-gradient(90deg,var(--gA),var(--gB));
          overflow:hidden;
        }
        .btn:before{
          content:""; position:absolute; inset:1px; border-radius:13px;
          background:linear-gradient(180deg,rgba(255,255,255,.28),rgba(255,255,255,.08));
          z-index:-1;
        }
        .btn:hover{ transform:translateY(-2px); filter:saturate(1.05) }
        .ripple{
          position:absolute; border-radius:50%; pointer-events:none;
          transform:scale(0); opacity:.5;
          background:radial-gradient(circle, rgba(255,255,255,.55) 0%, rgba(255,255,255,.15) 60%, transparent 70%);
          animation:ripple .6s ease-out;
        }
        @keyframes ripple { to { transform:scale(2.2); opacity:0; } }

        /* Grid of action buttons */
        .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:16px}
        @media(min-width:640px){.grid{grid-template-columns:repeat(4,1fr)}}

        /* Providers */
        .providers{margin-top:22px}
        .label{font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#9aa6c8}
        .providerGrid{margin-top:10px;display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
        @media(min-width:640px){.providerGrid{grid-template-columns:repeat(4,1fr)}}
        .chip{background:rgba(255,255,255,.08);border:1px solid var(--border);
              border-radius:12px;padding:10px;text-align:center;color:#d7def4}

        /* Sections */
        .section{padding:10px 0 40px}
        h2{margin:0 0 14px;font-size:22px}
        .cards3{display:grid;gap:14px}
        @media(min-width:640px){.cards3{grid-template-columns:repeat(3,1fr)}}
        .card{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:16px}
        .cardTitle{color:var(--accent);font-weight:800;margin-bottom:6px}
        .list{margin:10px 0 0 18px;color:var(--muted)} .list li{margin:6px 0}

        /* Footer */
        .footer{border-top:1px solid var(--border);background:rgba(0,0,0,.22);color:#c6cde5}
        .footRow{display:flex;align-items:center;justify-content:space-between;padding:16px 0;gap:12px}
        .links{display:flex;gap:18px} .links a:hover{color:#fff}

        /* تحسينات موبايل */
        @media (max-width:420px){
          .btn{min-height:42px; padding:0 14px; border-radius:12px; font-weight:700}
          h1{font-size:28px}
          .panel{padding:20px}
          .grid{gap:10px}
          .chip{font-size:13px; padding:8px}
        }
      `}</style>
    </>
  );
}
