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

  // Why: client-only routing for CTA
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
        <title>genio os — Create your digital twin</title>
        <meta
          name="description"
          content="Another you — a digital twin that replies in your tone, posts content, sends WhatsApp & emails, even drops TikToks."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <header className={scrolled ? "hdr scrolled" : "hdr"} aria-label="Site header">
        <div className="container nav">
          {/* Brand */}
          <a className="brand" href="/" aria-label="genio os">
            <span className="brand-logo" aria-hidden="true">
              {/* Neon hollow ring + smile + waves (precise, retina-crisp) */}
              <svg width="28" height="28" viewBox="0 0 28 28" role="img" aria-label="genio os logo">
                <defs>
                  {/* Gradient for all strokes */}
                  <linearGradient id="gt-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#20E3B2" />
                    <stop offset="1" stopColor="#6FC3FF" />
                  </linearGradient>
                  {/* Soft outer glow */}
                  <filter id="gt-glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="1.6" result="b" />
                    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  {/* Ring mask: creates a perfect hollow ring */}
                  <mask id="gt-ring-mask">
                    <rect x="0" y="0" width="28" height="28" fill="#fff"/>
                    <circle cx="14" cy="14" r="11" fill="#000"/>
                    <circle cx="14" cy="14" r="9" fill="#fff"/>
                  </mask>
                </defs>

                {/* Hollow ring with gradient stroke using mask */}
                <rect x="0" y="0" width="28" height="28" fill="none" />
                <g filter="url(#gt-glow)">
                  <circle cx="14" cy="14" r="10" fill="url(#gt-grad)" mask="url(#gt-ring-mask)"/>
                </g>

                {/* Eyes (slightly higher than center for friendly look) */}
                <circle cx="11.25" cy="11.8" r="1.25" fill="#EAF8FF"/>
                <circle cx="16.75" cy="11.8" r="1.25" fill="#EAF8FF"/>

                {/* Smile (arc) */}
                <path d="M10.4 14.9q3.6 2.8 7.2 0" fill="none" stroke="url(#gt-grad)" strokeWidth="1.8" strokeLinecap="round"/>

                {/* Voice waves on the right */}
                <path d="M21.1 10.9c2.2 2.3 2.2 3.9 0 6.2" fill="none" stroke="url(#gt-grad)" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M23.2 9.5c3.4 3.5 3.4 6.6 0 10.1" fill="none" stroke="url(#gt-grad)" strokeWidth="1.15" strokeLinecap="round" opacity=".7"/>
              </svg>
            </span>
            <span className="brand-name">genio os</span>
          </a>

          <div className="actions">
            <button className="menu-chip" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M7 12h13M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="menu-text">Menu</span>
            </button>
            <a className="btn btn-outline" href="/login">Login</a>
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
                  {/* Same logo (smaller) */}
                  <svg width="22" height="22" viewBox="0 0 28 28" aria-hidden="true">
                    <defs>
                      <linearGradient id="gt-grad-2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#20E3B2" />
                        <stop offset="1" stopColor="#6FC3FF" />
                      </linearGradient>
                      <mask id="gt-ring-mask-2">
                        <rect x="0" y="0" width="28" height="28" fill="#fff"/>
                        <circle cx="14" cy="14" r="11" fill="#000"/>
                        <circle cx="14" cy="14" r="9" fill="#fff"/>
                      </mask>
                    </defs>
                    <circle cx="14" cy="14" r="10" fill="url(#gt-grad-2)" mask="url(#gt-ring-mask-2)"/>
                    <circle cx="11.25" cy="11.8" r="1.2" fill="#EAF8FF"/>
                    <circle cx="16.75" cy="11.8" r="1.2" fill="#EAF8FF"/>
                    <path d="M10.4 14.9q3.6 2.8 7.2 0" fill="none" stroke="url(#gt-grad-2)" strokeWidth="1.7" strokeLinecap="round"/>
                    <path d="M21.1 10.9c2.2 2.3 2.2 3.9 0 6.2" fill="none" stroke="url(#gt-grad-2)" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M23.2 9.5c3.4 3.5 3.4 6.6 0 10.1" fill="none" stroke="url(#gt-grad-2)" strokeWidth="1.05" strokeLinecap="round" opacity=".7"/>
                  </svg>
                </span>
                <span className="brand-name">genio os</span>
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
            Imagine having another you — working 24/7, even while you sleep. Your twin lives as a digital bot on your pages:
            replying in your tone and voice, posting content, sending WhatsApp & emails, even dropping TikToks.
            It’s your personal assistant on call — one click, by the name you choose.
          </p>

          {/* Signup above CTA, same style */}
          <a className="btn btn-neon cta" href="/signup" style={{ marginBottom: 12 }}>Signup</a>
          <button className="btn btn-neon cta" onClick={goCreateTwin}>Create your twin</button>
        </div>
      </main>

      <style jsx global>{`
        :root{ --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff; --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018; }
        *{box-sizing:border-box}
        html,body{height:100%}
        body{ margin:0; font:16px/1.55 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; color:var(--text);
              background:radial-gradient(1200px 600px at 80% -10%, #14263d 0%, var(--bg) 60%), #0b111a;
              max-width:100vw; overflow-x:hidden; }
        .container{ width:min(1200px,92%); margin-inline:auto }
        a{ color:inherit; text-decoration:none }

        /* Header */
        .hdr{ position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; transition:box-shadow .2s ease }
        .hdr.scrolled{ box-shadow:0 8px 28px rgba(0,0,0,.5) }
        .nav{ display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 0 }
        .brand{ display:inline-flex; align-items:center; gap:8px; min-width:0; flex:1 1 auto; white-space:nowrap }
        .brand-logo{ width:28px; height:28px; flex:0 0 auto }
        .brand-name{ font-weight:800; letter-spacing:.2px }
        .actions{ display:flex; align-items:center; gap:8px; flex:0 1 auto; min-width:0 }
        .menu-chip{ display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:12px; background:#0e1a2a; border:1px solid #1e2b41; color:#cfe6ff }
        .btn{ display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:var(--text) }
        .btn-neon{ border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink) }
        .btn-outline{ background:#0f1828; font-weight:600 }
        @media (max-width:360px){
          .menu-text{ display:none }
          .menu-chip{ padding:6px 8px }
          .btn{ padding:6px 10px; font-size:13px }
          .brand-name{ font-size:16px }
        }

        /* Drawer */
        .sheet{ position:fixed; inset:0; z-index:60 }
        .backdrop{ position:absolute; inset:0; background:rgba(0,0,0,.6) }
        .panel{ position:absolute; right:0; top:0; height:100%; width:min(86%, 340px); background:var(--card); border-left:1px solid #20304a; display:flex; flex-direction:column; padding:16px; box-shadow:-10px 0 40px rgba(0,0,0,.45) }
        .panel-head{ display:flex; align-items:center; justify-content:space-between }
        .close{ background:none; border:none; color:var(--text); font-size:20px }
        .panel-links{ display:flex; flex-direction:column; gap:10px; margin-top:18px }
        .panel-links a{ padding:12px 14px; border-radius:12px; background:#0f1b2d; color:#e7f0ff; border:1px solid #1f2c44 }

        /* Hero */
        .hero{ display:grid; grid-template-columns:1.1fr .9fr; gap:32px; align-items:center; padding:84px 0 }
        .hero-text h1{
          margin:0 0 14px; font-size:clamp(32px,5vw,56px); line-height:1.05;
          background:linear-gradient(180deg, #f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;
          text-shadow:0 0 18px rgba(111,195,255,.15);
        }
        .hero-text .hook{ color:#c0d0e2; margin:0 0 18px; max-width:58ch }
        .cta{ min-width:220px }
        @media (max-width:940px){ .hero{ grid-template-columns:1fr; text-align:center } }
      `}</style>
    </>
  );
}
