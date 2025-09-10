// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  // Ripple effect خفيف لكل الأزرار
  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest(".btn");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = (e.clientX || 0) - rect.left - size / 2;
      const y = (e.clientY || 0) - rect.top - size / 2;
      const s = document.createElement("span");
      s.className = "ripple";
      s.style.width = s.style.height = `${size}px`;
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      target.appendChild(s);
      setTimeout(() => s.remove(), 600);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <Head>
        <title>Genio OS — Route payments smartly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* CSS كله بملف واحد — بدون _app.js */}
        <style>{`
          :root{
            --bg1:#0b1530; --bg2:#0f1f48;
            --text:#fff;   --muted:#b8c0d4;
            --panel:rgba(255,255,255,.06);
            --border:rgba(255,255,255,.12);
            --gA:#22ff9a; --gB:#10e0ff;
          }
          *{box-sizing:border-box}
          html,body,#__next{height:100%}
          body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Arial;
               color:var(--text); background:linear-gradient(180deg,var(--bg1),var(--bg2))}
          a{text-decoration:none;color:inherit}

          .topbar{position:fixed;top:0;left:0;right:0;height:64px;z-index:50;
                  background:rgba(10,18,42,.65);backdrop-filter:blur(10px);
                  border-bottom:1px solid rgba(255,255,255,.08)}
          .wrap{max-width:1120px;margin:0 auto;padding:0 16px}
          .topbarRow{height:64px;display:flex;align-items:center;justify-content:space-between}
          .brand{font-weight:800;letter-spacing:.2px}
          .nav{display:flex;gap:14px;align-items:center;color:#c9d1e8}
          .nav a:hover{color:#fff}

          .page{min-height:100vh;padding-top:64px}
          .hero{padding:28px 0 40px}
          .panel{background:var(--panel);border:1px solid var(--border);border-radius:18px;padding:26px 22px}
          h1{margin:0 0 10px;font-weight:900;font-size:34px;line-height:1.15}
          @media(min-width:640px){h1{font-size:44px}}
          .accent{color:#78f6cf}
          .muted{color:var(--muted)}
          .actions{display:flex;gap:12px;flex-wrap:wrap;margin:18px 0}

          .btn{
            position:relative;display:inline-flex;align-items:center;justify-content:center;
            min-height:46px;padding:0 18px;border-radius:14px;border:0;cursor:pointer;
            font-weight:800;letter-spacing:.2px;color:#08231f;
            background:linear-gradient(90deg,var(--gA),var(--gB));
            box-shadow:0 10px 28px rgba(16,224,255,.22); overflow:hidden;
            transition:transform .18s ease, filter .18s ease;
          }
          .btn.small{min-height:38px;padding:0 14px}
          .btn:hover{transform:translateY(-2px);filter:saturate(1.05)}
          .ripple{position:absolute;border-radius:50%;pointer-events:none;transform:scale(0);
                  opacity:.5;background:radial-gradient(circle,rgba(255,255,255,.55) 0%,
                  rgba(255,255,255,.15) 60%, transparent 70%);animation:ripple .6s ease-out}
          @keyframes ripple{to{transform:scale(2.2);opacity:0}}

          .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:8px}
          @media(max-width:640px){.grid{grid-template-columns:repeat(2,1fr)}}

          .providers{margin-top:22px}
          .label{font-size:12px;text-transform:uppercase;letter-spacing:1.2px;color:#9aa6c8}
          .providerGrid{margin-top:10px;display:grid;gap:12px;grid-template-columns:repeat(2,1fr)}
          @media(min-width:640px){.providerGrid{grid-template-columns:repeat(4,1fr)}}
          .chip{background:rgba(255,255,255,.08);border:1px solid var(--border);
                border-radius:12px;padding:10px;text-align:center;color:#d7def4}

          .section{padding:10px 0 40px}
          h2{margin:0 0 14px;font-size:22px}
          .cards3{display:grid;gap:14px}
          @media(min-width:640px){.cards3{grid-template-columns:repeat(3,1fr)}}
          .card{background:var(--panel);border:1px solid var(--border);border-radius:16px;padding:16px}
          .cardTitle{color:#78f6cf;font-weight:800;margin-bottom:6px}

          .footer{border-top:1px solid var(--border);background:rgba(0,0,0,.22);color:#c6cde5}
          .footerRow{display:flex;align-items:center;justify-content:space-between;padding:16px 0}
          .links{display:flex;gap:18px}
          .links a:hover{color:#fff}
        `}</style>
      </Head>

      {/* Top Bar */}
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
        <section className="wrap hero" id="home">
          <div className="panel">
            <h1>
              Route payments <span className="accent">smartly</span>.
            </h1>
            <p className="muted">
              Send & accept payments globally — faster, cheaper, smarter.
            </p>

            <div className="actions">
              <Link href="/login" className="btn">Get Started</Link>
              <Link href="/dashboard" className="btn">Open Dashboard</Link>
            </div>

            {/* Quick actions — صارت كلها أزرار بنفس الستايل */}
            <div className="grid">
              <Link href="/router" className="btn">Send Money</Link>
              <Link href="/router" className="btn">Receive Money</Link>
              <Link href="/router" className="btn">Create Payment Link</Link>
            </div>

            {/* Providers */}
            <div className="providers">
              <p className="label">Powered by</p>
              <div className="providerGrid">
                {["Wise","Flutterwave","PayGate","Stripe"].map((p)=>(
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

        {/* Footer */}
        <footer id="contact" className="footer">
          <div className="wrap footerRow">
            <div>© {new Date().getFullYear()} Genio OS</div>
            <div className="links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
