import Head from "next/head";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About · Genio</title>
        <meta name="description" content="About Genio and the AI Twin vision." />
      </Head>

      <main className="wrap">
        {/* Header */}
        <header className="header">
          <Link href="/" className="brand">Genio</Link>
          <nav className="nav">
            <Link href="/support" className="navLink">Support</Link>
            <Link href="/auth/login" className="btn ghost">Log in</Link>
            <Link href="/auth/signup" className="btn primary">Sign up</Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="hero">
          <h1>About Genio</h1>
          <p>
            Genio helps you build an AI Twin that mirrors your tone, habits, and preferences.
            Your Twin handles replies, drafts, scheduling, and research — in your style, 24/7.
          </p>
        </section>

        {/* Pillars */}
        <section className="pillars">
          <div className="card">
            <h3>Private by default</h3>
            <p>Raw media (voice/video) is stored internally. Text-only prompts may be sent to AI if you opt in.</p>
          </div>
          <div className="card">
            <h3>Realistic presence</h3>
            <p>Optional voice and short video help the Twin capture your tone and presence more accurately.</p>
          </div>
          <div className="card">
            <h3>Works for you</h3>
            <p>From customer replies to summaries and scheduling, your Twin saves hours every week.</p>
          </div>
        </section>

        {/* CTA */}
        <section className="ctaRow">
          <Link href="/auth/signup" className="btn primary big">Create My Twin</Link>
        </section>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Genio · All rights reserved.</p>
        </footer>
      </main>

      <style jsx>{`
        .wrap { min-height: 100vh; display: flex; flex-direction: column; background:#0a1730; color:#e6eef8; }
        .header { max-width:1200px; margin:0 auto; padding:20px 24px; display:flex; align-items:center; justify-content:space-between; }
        .brand { font-size:22px; font-weight:800; color:#fff; text-decoration:none; }
        .nav { display:flex; gap:14px; align-items:center; }
        .navLink { color:#c9d6e5; text-decoration:none; font-size:15px; }
        .btn { border-radius:10px; padding:8px 16px; font-weight:600; text-decoration:none; }
        .btn.ghost { border:1px solid #ffd54d; color:#ffd54d; }
        .btn.ghost:hover { background:#ffd54d22; }
        .btn.primary { background:#ffd54d; color:#0a1730; }
        .btn.primary:hover { filter:brightness(0.95); }
        .btn.big { font-size:18px; padding:12px 24px; }
        .hero { max-width:900px; margin:0 auto; padding:64px 20px 16px; text-align:center; }
        .hero h1 { font-size:42px; margin-bottom:16px; background:linear-gradient(90deg,#ffd54d,#ffae00); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .hero p { color:#c9d6e5; font-size:18px; }
        .pillars { max-width:1100px; margin:24px auto; padding:0 20px; display:grid; gap:16px; grid-template-columns:repeat(3,minmax(0,1fr)); }
        @media (max-width:900px){ .pillars{ grid-template-columns:1fr; } }
        .card { background:#0f1b33; border:1px solid #22304a; border-radius:14px; padding:18px; }
        .card h3 { margin:0 0 6px; }
        .card p { margin:0; color:#b8c8df; }
        .ctaRow { display:flex; justify-content:center; padding:24px 20px 8px; }
        .footer { border-top:1px solid #22304a; padding:20px; text-align:center; color:#93a7c4; font-size:14px; margin-top:auto; }
      `}</style>
    </>
  );
}
