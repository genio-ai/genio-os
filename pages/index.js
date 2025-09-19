// File: pages/index.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Why: only to decide CTA target without backend hookup
  const isAuth = useMemo(() => {
    if (typeof window === "undefined") return false;
    const cookieHasAuth = document.cookie.includes("auth=") || document.cookie.includes("token=");
    const lsHasAuth = !!localStorage.getItem("auth") || !!localStorage.getItem("token");
    return cookieHasAuth || lsHasAuth;
  }, []);

  const goCreateTwin = () => router.push(isAuth ? "/onboarding" : "/signup");

  return (
    <>
      <Head>
        <title>genio ai studio — Create your digital twin</title>
        <meta
          name="description"
          content="Imagine another you — working 24/7, replying in your tone and voice, posting content, sending WhatsApp & emails, even TikToks."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Inter for crisp English UI */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Header — step #1 only */}
      <header className={scrolled ? "hdr scrolled" : "hdr"} aria-label="Site header">
        <div className="container nav">
          {/* Brand lockup: logo + name (never wraps, always aligned) */}
          <a className="brand" href="/" aria-label="genio ai studio">
            <span className="brand-logo" aria-hidden="true">
              {/* Minimal mark resembling genio: gradient pill + bars */}
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#5EE1A1" />
                    <stop offset="1" stopColor="#6FC3FF" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="24" height="24" rx="7" fill="url(#lg)"></rect>
                <path d="M6 14V10M10 18V6M14 13V11M18 20V4" stroke="#071018" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="brand-name">genio ai studio</span>
          </a>

          {/* Keep links; mobile handling comes next step */}
          <nav className="nav-links" aria-label="Primary">
            <a href="/support">Support</a>
            <a href="/chat">Chat</a>
            <a href="/login">Login</a>
            <a className="btn btn-primary" href="/signup">Signup</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="container hero" aria-label="Hero">
        <div className="hero-text">
          <h1>Create your digital twin</h1>
          <p className="hook">
            Imagine having another you — working 24/7, even while you sleep.
            Your twin lives as a digital bot on your pages: replying in your tone and voice,
            posting content, sending WhatsApp & emails, even dropping TikToks.
            It’s your personal assistant on call — one click, by the name you choose.
          </p>
          <button className="btn btn-primary cta" onClick={goCreateTwin}>Create your twin</button>
        </div>

        {/* Twin visual */}
        <figure className="hero-visual" aria-label="Digital twin preview">
          <div className="blob" aria-hidden="true" />
          <svg className="twin" viewBox="0 0 480 480" role="img" aria-label="AI twin">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6fc3ff" /><stop offset="1" stopColor="#5ee1a1"/>
              </linearGradient>
              <radialGradient id="g2" cx="50%" cy="10%" r="80%">
                <stop offset="0" stopColor="#1a2a42"/><stop offset="1" stopColor="#0d1420"/>
              </radialGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <rect x="0" y="0" width="480" height="480" rx="26" fill="url(#g2)"/>
            <circle cx="240" cy="164" r="74" fill="#0f1726" stroke="url(#g1)" strokeWidth="3"/>
            <ellipse cx="218" cy="160" rx="10" ry="12" fill="#9fd1ff"/><ellipse cx="262" cy="160" rx="10" ry="12" fill="#9fd1ff"/>
            <path d="M210 188q30 22 60 0" stroke="url(#g1)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <rect x="168" y="230" width="144" height="150" rx="20" fill="#0f1726" stroke="#233043" />
            <path d="M350 160 q20 20 0 40" stroke="url(#g1)" strokeWidth="4" fill="none" filter="url(#glow)"/>
            <path d="M360 150 q32 36 0 72" stroke="url(#g1)" strokeWidth="3" fill="none" opacity=".7"/>
            <path d="M370 140 q44 52 0 104" stroke="url(#g1)" strokeWidth="2" fill="none" opacity=".5"/>
          </svg>
        </figure>
      </main>

      <style jsx global>{`
        :root{
          --bg:#0b0f14; --card:#0f1620; --muted:#a9b4c2; --text:#e9eef5; --brand:#5ee1a1; --brand-2:#6fc3ff;
          --radius:14px; --shadow:0 10px 30px rgba(0,0,0,.35);
        }
        *{box-sizing:border-box}
        html,body{height:100%}
        body{
          margin:0; font:16px/1.55 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color:var(--text); background:radial-gradient(1200px 600px at 80% -10%, #142132 0%, #0b0f14 60%);
          -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
        }
        .container{width:min(1200px,92%); margin-inline:auto}

        /* Header — company-grade brand lockup */
        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(140%) blur(10px); background:#0b0f14e6; transition:box-shadow .2s ease}
        .hdr.scrolled{box-shadow:0 6px 18px rgba(0,0,0,.35)}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 0}
        .brand{display:inline-flex; align-items:center; gap:10px; white-space:nowrap} /* Why: prevent wrapping between logo & name */
        .brand-logo{display:inline-grid; place-items:center; width:32px; height:32px; flex:0 0 auto}
        .brand-name{font-weight:800; letter-spacing:.2px; color:#f2f6ff}
        .nav-links{display:flex; gap:18px; align-items:center}
        .nav-links a{padding:10px 12px; border-radius:10px; color:var(--muted); text-decoration:none}
        .nav-links a:hover,.nav-links a:focus-visible{background:#101826; color:var(--text); outline:none}
        .btn{display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:10px 14px; border-radius:12px; border:1px solid #233043; background:#111a27; color:var(--text); cursor:pointer; transition:transform .08s ease, background .2s ease, border-color .2s ease}
        .btn:hover{transform:translateY(-1px); background:#132035; border-color:#2b3b53}
        .btn-primary{background:linear-gradient(135deg,var(--brand),var(--brand-2)); border:none; color:#071018; font-weight:700}

        /* Hero */
        .hero{display:grid; grid-template-columns:1.1fr .9fr; gap:32px; align-items:center; padding:84px 0}
        .hero-text h1{
          margin:0 0 14px; font-size:clamp(32px,5vw,56px); line-height:1.05;
          background:linear-gradient(180deg, #e9eef5 0%, #bcd2ff 100%); -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .hero-text .hook{color:#b7c4d4; margin:0 0 24px; max-width:58ch}
        .cta{min-width:180px}
        .hero-visual{position:relative; aspect-ratio:1/1; min-height:320px; border-radius:20px; background:radial-gradient(120px 100px at 65% 30%, #1b2a40 0%, transparent 60%); display:grid; place-items:center; isolation:isolate}
        .blob{position:absolute; width:560px; height:560px; border-radius:50%; background:radial-gradient(circle at 30% 30%, var(--brand), transparent 60%), radial-gradient(circle at 70% 70%, var(--brand-2), transparent 60%); filter:blur(40px) saturate(140%); opacity:.35; animation:float 9s ease-in-out infinite alternate; z-index:0}
        @keyframes float{from{transform:translate(10px,0) scale(1)} to{transform:translate(-10px,-20px) scale(1.05)}}
        .twin{position:relative; z-index:1; width:min(440px,90%); filter:drop-shadow(0 10px 30px rgba(0,0,0,.45))}

        @media (max-width: 940px){
          .hero{grid-template-columns:1fr; text-align:center}
          .hero-visual{margin-top:14px}
          .brand-name{font-size:18px}
        }
      `}</style>
    </>
  );
}
