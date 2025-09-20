import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>gineo os — Your Digital Twin</title>
        <meta
          name="description"
          content="Create your digital twin — a smarter version of you that replies, speaks, and creates in your style."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* NAVBAR */}
      <header className="hdr">
        <div className="container nav">
          <Link className="brand" href="/">
            <span className="brand-neon">gineo os</span>
          </Link>
          <nav className="links">
            <Link href="/support">Support</Link>
            <Link href="/chat">Chat</Link>
            <Link className="btn ghost" href="/login">Login</Link>
            <Link className="btn btn-neon" href="/signup">Signup</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div className="copy">
            <h1>Your Digital Twin — Always On</h1>
            <p className="sub">
              A smarter version of you that replies to emails and messages,
              speaks in your tone, and creates content securely — 24/7.
            </p>
            <div className="cta">
              <Link className="btn btn-neon" href="/signup">Create My Twin</Link>
              <a className="btn ghost" href="#how">Learn More</a>
            </div>
          </div>

          <div className="lab">
            <div className="grid" aria-hidden="true" />
            <div className="holo">
              <div className="ring r1"/><div className="ring r2"/><div className="ring r3"/>
              <div className="core"/>
              <div className="spark s1"/><div className="spark s2"/><div className="spark s3"/>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE */}
      <section className="section">
        <div className="container cards">
          <article className="card">
            <h3>In your voice</h3>
            <p>Mirror your tone, vocabulary, and style across chat, email, and posts.</p>
          </article>
          <article className="card">
            <h3>Do the work</h3>
            <p>Handle Gmail, WhatsApp, and Slack tasks — with your rules built-in.</p>
          </article>
          <article className="card">
            <h3>Private by design</h3>
            <p>Your data stays yours. Guardrails included. Reset anytime.</p>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="section">
        <div className="container steps">
          <h2>How it works</h2>
          <div className="cols">
            <div className="step">
              <span className="num">1</span>
              <h4>Describe yourself</h4>
              <p>Write a short note about you, your rules, and what you like.</p>
            </div>
            <div className="step">
              <span className="num">2</span>
              <h4>Record your voice</h4>
              <p>30–60 seconds helps the Twin learn your tone and cadence.</p>
            </div>
            <div className="step">
              <span className="num">3</span>
              <h4>Connect channels</h4>
              <p>Let it reply via Gmail, WhatsApp, or Slack — always in your style.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="section">
        <div className="container trust">
          <h2>Trust & Safety</h2>
          <ul>
            <li>Clear rules the Twin must follow.</li>
            <li>Data kept private — export or delete anytime.</li>
            <li>Audit trail for every action.</li>
          </ul>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="section cta-block">
        <div className="container cta-inline">
          <div>
            <h2>Ready to build your Twin?</h2>
            <p className="sub">Start free. Upgrade anytime.</p>
          </div>
          <div className="btns">
            <Link className="btn btn-neon" href="/signup">Start Now</Link>
            <Link className="btn ghost" href="/onboarding/personality">Try the Lab</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="ftr">
        <div className="container foot">
          <span className="foot-brand">gineo os</span>
          <nav>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <a href="mailto:support@gineo.systems">Contact</a>
          </nav>
        </div>
      </footer>

      {/* STYLES */}
      <style jsx>{`
        :root{
          --bg:#0a1018; --bg2:#0b111a; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
          --stroke:#1e2b41;
        }
        body{
          margin:0; font:16px/1.55 Inter, system-ui, sans-serif;
          color:var(--text);
          background:radial-gradient(1200px 600px at 80% -10%, #14263d 0%, var(--bg) 60%), var(--bg2);
        }
        .container{width:min(1200px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}

        /* NAV */
        .hdr{position:sticky; top:0; z-index:40; backdrop-filter:saturate(140%) blur(12px); background:#0b111add; border-bottom:1px solid #132238}
        .nav{display:flex; align-items:center; justify-content:space-between; padding:12px 0}
        .brand-neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 12px rgba(111,195,255,.4),0 0 22px rgba(32,227,178,.24);
          font-weight:800; letter-spacing:.2px
        }
        .links{display:flex; align-items:center; gap:10px}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; padding:10px 14px; font-weight:700; border:1px solid var(--stroke); background:#0f1828}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.ghost{background:#0f1828; color:#cfe6ff}

        /* HERO */
        .hero{padding:64px 0}
        .hero-grid{display:grid; grid-template-columns:1.1fr .9fr; gap:32px; align-items:center}
        .copy h1{
          margin:0 0 14px; font-size:clamp(32px,5vw,56px); line-height:1.05;
          background:linear-gradient(180deg, #f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;
          text-shadow:0 0 18px rgba(111,195,255,.15);
        }
        .sub{color:#c0d0e2; margin:0 0 18px; max-width:60ch}
        .cta{display:flex; gap:10px; flex-wrap:wrap}
        .lab{position:relative; min-height:320px; display:grid; place-items:center}
        .grid{position:absolute; inset:0; background:
          linear-gradient(#0f2138 1px, transparent 1px) 0 0/40px 40px,
          linear-gradient(90deg,#0f2138 1px, transparent 1px) 0 0/40px 40px; opacity:.28}
        .holo{position:relative; width:min(420px,90%); aspect-ratio:1/1; border-radius:20px; border:1px solid #233146; background:radial-gradient(120px 120px at 65% 35%, rgba(111,195,255,.16), transparent), #0c1320; display:grid; place-items:center; overflow:hidden}
        .ring{position:absolute; width:64%; height:64%; border-radius:50%; border:2px solid rgba(140,200,255,.18)}
        .r2{transform:scale(1.25)} .r3{transform:scale(1.5)}
        .core{width:94px; height:94px; border-radius:50%;
          background:radial-gradient(circle at 30% 30%, var(--neon2), transparent 60%), radial-gradient(circle at 70% 70%, var(--neon1), transparent 60%);
          filter:blur(2px) saturate(160%); animation:pulse 3.2s ease-in-out infinite}
        .spark{position:absolute; width:6px; height:6px; border-radius:50%; background:#cfe6ff66; box-shadow:0 0 12px #6fc3ff66}
        .s1{top:22%; left:32%} .s2{top:48%; right:26%} .s3{bottom:24%; left:42%}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @media (max-width:940px){ .hero-grid{grid-template-columns:1fr} .lab{order:-1} .copy{text-align:center} .cta{justify-content:center} }

        /* SECTIONS */
        .section{padding:48px 0}
        .cards{display:grid; grid-template-columns:repeat(3,1fr); gap:14px}
        .card{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:16px; padding:16px}
        .card h3{margin:0 0 6px}
        @media (max-width:840px){ .cards{grid-template-columns:1fr} }

        .steps h2{margin:0 0 10px}
        .cols{display:grid; grid-template-columns:repeat(3,1fr); gap:14px}
        .step{border:1px dashed #2a3a56; background:#0f1828; border-radius:16px; padding:16px}
        .num{display:inline-grid; place-items:center; width:28px; height:28px; border-radius:50%; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink); font-weight:800; margin-bottom:8px}
        @media (max-width:840px){ .cols{grid-template-columns:1fr} }

        .trust{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:16px; padding:16px}
        .trust h2{margin:0 0 6px}
        .trust ul{margin:8px 0 0 18px; color:#c0d0e2}

        .cta-block{padding:28px 0 52px}
        .cta-inline{display:flex; align-items:center; justify-content:space-between; gap:16px; border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:16px; padding:16px}
        .btns{display:flex; gap:10px; flex-wrap:wrap}
        @media (max-width:720px){ .cta-inline{flex-direction:column; text-align:center} }

        /* FOOTER */
        .ftr{border-top:1px solid #132238; padding:18px 0; background:#0b111a}
        .foot{display:flex; align-items:center; justify-content:space-between}
        .foot-brand{opacity:.9; font-weight:800}
        .foot nav{display:flex; gap:12px}
      `}</style>
    </>
  );
}
