// File: pages/index.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Why: choose CTA without backend
  const isAuth = useMemo(() => {
    if (typeof window === "undefined") return false;
    const cookieHasAuth =
      document.cookie.includes("auth=") || document.cookie.includes("token=");
    const lsHasAuth =
      !!localStorage.getItem("auth") || !!localStorage.getItem("token");
    return cookieHasAuth || lsHasAuth;
  }, []);

  const goCreateTwin = () => router.push(isAuth ? "/onboarding" : "/signup");

  return (
    <>
      <Head>
        <title>genio ai studio — Create your digital twin</title>
        <meta
          name="description"
          content="Another you — a digital twin that replies in your tone, posts content, sends WhatsApp & emails, even drops TikToks."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Header */}
      <header className={scrolled ? "hdr scrolled" : "hdr"} aria-label="Site header">
        <div className="container nav">
          {/* Brand: logo + name */}
          <a className="brand" href="/" aria-label="genio ai studio">
            <span className="brand-logo" aria-hidden="true">
              {/* Neon logo: gradient + subtle glow */}
              <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#20E3B2" />
                    <stop offset="1" stopColor="#6FC3FF" />
                  </linearGradient>
                  <filter id="glo">
                    <feGaussianBlur stdDeviation="2.2" result="b" />
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <rect x="1" y="1" width="26" height="26" rx="9" fill="url(#lg)" filter="url(#glo)"></rect>
                <path d="M8 16V12M13 20V8M18 15V13M23 22V6" stroke="#071018" strokeWidth="2.4" strokeLinecap="round"/>
              </svg>
            </span>
            <span className="brand-name">genio ai studio</span>
          </a>

          {/* Right side actions */}
          <div className="actions">
            <button
              className="menu-chip"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M7 12h13M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Menu</span>
            </button>
            <a className="btn btn-outline" href="/login">Login</a>
            <a className="btn btn-neon" href="/signup">Signup</a>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="sheet" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="backdrop" onClick={() => setMenuOpen(false)} />
          <aside className="panel">
            <div className="panel-head">
              <div className="brand mini">
                <span className="brand-logo" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 28 28" aria-hidden="true">
                    <defs>
                      <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#20E3B2" />
                        <stop offset="1" stopColor="#6FC3FF" />
                      </linearGradient>
                    </defs>
                    <rect x="1" y="1" width="26" height="26" rx="9" fill="url(#lg2)"></rect>
                    <path d="M8 16V12M13 20V8M18 15V13M23 22V6" stroke="#071018" strokeWidth="2.4" strokeLinecap="round"/>
                  </svg>
                </span>
                <span className="brand-name">genio</span>
              </div>
              <button className="close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>✕</button>
            </div>

            <nav className="panel-links">
              <a href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</a>
              <a href="/support" onClick={() => setMenuOpen(false)}>Support</a>
              <a href="/chat" onClick={() => setMenuOpen(false)}>Chat</a>
            </nav>
          </aside>
        </div>
      )}

      {/* Hero */}
      <main className="container hero" aria-label="Hero">
        <div className="hero-text">
          <h1>Create your digital twin</h1>
          <p className="hook">
            Imagine having another you — working 24/7, even while you sleep. Your twin lives as a digital bot on your
            pages: replying in your tone and voice, posting content, sending WhatsApp & emails, even dropping TikToks.
            It’s your personal assistant on call — one click, by the name you choose.
          </p>
          <button className="btn btn-neon cta" onClick={goCreateTwin}>Create your twin</button>
        </div>

        <figure className="hero-visual" aria-label="Digital twin preview">
          <div className="blob" aria-hidden="true" />
          <svg className="twin" viewBox="0 0 480 480" role="img" aria-label="AI twin">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6FC3FF" />
                <stop offset="1" stopColor="#20E3B2" />
              </linearGradient>
              <radialGradient id="g2" cx="50%" cy="10%" r="80%">
                <stop offset="0" stopColor="#13243a" />
                <stop offset="1" stopColor="#0b1421" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect x="0" y="0" width="480" height="480" rx="26" fill="url(#g2)" />
            <circle cx="240" cy="164" r="74" fill="#0d1420" stroke="url(#g1)" strokeWidth="3" />
            <ellipse cx="218" cy="160" rx="10" ry="12" fill="#bfe1ff" />
            <ellipse cx="262" cy="160" rx="10" ry="12" fill="#bfe1ff" />
            <path d="M210 188q30 22 60 0" stroke="url(#g1)" strokeWidth="4" fill="none" strokeLinecap="round" />
            <rect x="168" y="230" width="144" height="150" rx="20" fill="#0d1420" stroke="#233043" />
            <path d="M350 160 q20 20 0 40" stroke="url(#g1)" strokeWidth="4" fill="none" filter="url(#glow)" />
            <path d="M360 150 q32 36 0 72" stroke="url(#g1)" strokeWidth="3" fill="none" opacity=".75" />
            <path d="M370 140 q44 52 0 104" stroke="url(#g1)" strokeWidth="2" fill="none" opacity=".55" />
          </svg>
        </figure>
      </main>

      <style jsx global>{`
        :root{
          --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
        }
        *{box-sizing:border-box}
        html,body{height:100%}
        body{
          margin:0; font:16px/1.55 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color:var(--text);
          background:
            radial-gradient(1200px 600px at 80% -10%, #14263d 0%, var(--bg) 60%),
            #0b111a;
          -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
        }
        .container{width:min(1200px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}

        /* Header */
        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; transition:box-shadow .2s ease, background .2s ease}
        .hdr.scrolled{box-shadow:0 8px 28px rgba(0,0,0,.5)}
        .nav{display:flex; align-items:center; justify-content:space-between; padding:12px 0; gap:12px}
        .brand{display:inline-flex; align-items:center; gap:10px; white-space:nowrap}
        .brand-logo{display:inline-grid; place-items:center; width:32px; height:32px}
        .brand-name{font-weight:800; letter-spacing:.2px}
        .actions{display:flex; align-items:center; gap:10px}
        .menu-chip{
          display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:12px;
          background:#0e1a2a; border:1px solid #1e2b41; color:#cfe6ff;
          box-shadow:0 0 0 0 rgba(32,227,178,0);
        }
        .menu-chip:focus-visible{outline:none; box-shadow:0 0 0 3px rgba(111,195,255,.35)}
        .btn{
          display:inline-flex; align-items:center; justify-content:center; padding:10px 14px; border-radius:12px;
          border:1px solid #223145; background:#0f1828; color:var(--text); cursor:pointer; transition:transform .08s ease, box-shadow .2s ease, background .2s ease
        }
        .btn:hover{transform:translateY(-1px)}
        .btn-outline{background:#0f1828}
        .btn-neon{
          border:none;
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          color:var(--ink); font-weight:700;
          box-shadow:0 0 0 0 rgba(32,227,178,0.0), 0 0 0 0 rgba(111,195,255,0.0);
        }
        .btn-neon:hover{
          box-shadow:
            0 0 24px rgba(32,227,178,.25),
            0 0 20px rgba(111,195,255,.18);
        }

        @media (max-width: 920px){
          .brand-name{font-size:18px}
        }

        /* Drawer */
        .sheet{position:fixed; inset:0; z-index:60}
        .backdrop{position:absolute; inset:0; background:rgba(0,0,0,.6)}
        .panel{
          position:absolute; right:0; top:0; height:100%; width:min(86%, 340px);
          background:var(--card); border-left:1px solid #20304a; display:flex; flex-direction:column; padding:16px;
          box-shadow:-10px 0 40px rgba(0,0,0,.45);
        }
        .panel-head{display:flex; align-items:center; justify-content:space-between}
        .close{background:none; border:none; color:var(--text); font-size:20px}
        .panel-links{display:flex; flex-direction:column; gap:10px; margin-top:18px}
        .panel-links a{
          padding:12px 14px; border-radius:12px; background:#0f1b2d; color:#e7f0ff; border:1px solid #1f2c44;
        }
        .panel-links a:focus-visible{outline:none; box-shadow:0 0 0 3px rgba(111,195,255,.35)}

        /* Hero */
        .hero{display:grid; grid-template-columns:1.1fr .9fr; gap:32px; align-items:center; padding:84px 0}
        .hero-text h1{
          margin:0 0 14px; font-size:clamp(32px,5vw,56px); line-height:1.05;
          background:linear-gradient(180deg, #f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; background-clip:text; color:transparent;
          text-shadow:0 0 18px rgba(111,195,255,.15);
        }
        .hero-text .hook{color:#c0d0e2; margin:0 0 24px; max-width:58ch}
        .cta{min-width:180px}
        .hero-visual{position:relative; aspect-ratio:1/1; min-height:320px; display:grid; place-items:center}
        .blob{
          position:absolute; width:560px; height:560px; border-radius:50%;
          background:
            radial-gradient(circle at 30% 30%, var(--neon1), transparent 60%),
            radial-gradient(circle at 70% 70%, var(--neon2), transparent 60%);
          filter:blur(44px) saturate(160%); opacity:.35;
        }
        .twin{width:min(440px,90%); filter:drop-shadow(0 10px 40px rgba(0,0,0,.5))}
        @media (max-width: 940px){
          .hero{grid-template-columns:1fr; text-align:center}
          .hero-visual{margin-top:16px}
        }
      `}</style>
    </>
  );
}
