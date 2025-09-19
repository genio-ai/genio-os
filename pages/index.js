// File: pages/index.js
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap", // why: reduce FOIT/CLS
});

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [origin, setOrigin] = useState(""); // why: canonical/og fallback without env vars

  const menuBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const mainRef = useRef(null);

  // shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // compute origin (client-safe)
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  // auth check at click-time (stale-safe)
  const hasAuth = useCallback(() => {
    if (typeof window === "undefined") return false;
    try {
      const cookieHasAuth =
        document.cookie.includes("auth=") || document.cookie.includes("token=");
      const lsHasAuth =
        !!localStorage.getItem("auth") || !!localStorage.getItem("token");
      return cookieHasAuth || lsHasAuth;
    } catch {
      return false; // why: storage can be blocked
    }
  }, []);

  const goCreateTwin = () => router.push(hasAuth() ? "/onboarding" : "/signup");

  // Drawer a11y: lock scroll, esc close, focus trap, inert/aria-hidden, swipe-to-close
  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // isolate background for AT + keyboard
    const bgEls = [headerRef.current, mainRef.current].filter(Boolean);
    bgEls.forEach((el) => {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    });

    // focus first control
    closeBtnRef.current?.focus();

    const focusables = () => {
      if (!panelRef.current) return [];
      const sel =
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
      return Array.from(panelRef.current.querySelectorAll(sel)).filter(
        (el) =>
          !el.hasAttribute("disabled") &&
          el.getAttribute("tabindex") !== "-1" &&
          el.offsetParent !== null
      );
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key === "Tab") {
        const nodes = focusables();
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const current = document.activeElement;
        if (e.shiftKey) {
          if (current === first || !panelRef.current.contains(current)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (current === last || !panelRef.current.contains(current)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    // simple swipe-to-close on panel/backdrop (RTL-safe: close on rightward swipe)
    let startX = null;
    const onTouchStart = (e) => (startX = e.touches?.[0]?.clientX ?? null);
    const onTouchEnd = (e) => {
      if (startX == null) return;
      const endX = e.changedTouches?.[0]?.clientX ?? startX;
      if (endX - startX > 50) setMenuOpen(false);
      startX = null;
    };
    const panel = panelRef.current;
    const backdrop = panel?.previousElementSibling;

    document.addEventListener("keydown", onKeyDown);
    panel?.addEventListener("touchstart", onTouchStart, { passive: true });
    panel?.addEventListener("touchend", onTouchEnd, { passive: true });
    backdrop?.addEventListener("touchstart", onTouchStart, { passive: true });
    backdrop?.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
      panel?.removeEventListener("touchstart", onTouchStart);
      panel?.removeEventListener("touchend", onTouchEnd);
      backdrop?.removeEventListener("touchstart", onTouchStart);
      backdrop?.removeEventListener("touchend", onTouchEnd);
      bgEls.forEach((el) => {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      });
      menuBtnRef.current?.focus();
    };
  }, [menuOpen]);

  // SEO meta (no env required)
  const canonicalHref = useMemo(() => (origin ? origin + "/" : null), [origin]);
  const ogTitle = "genio os — Create your digital twin";
  const ogDesc =
    "Another you — a digital twin that replies in your tone, posts content, sends WhatsApp & emails, even drops TikToks.";
  // tiny SVG as data-uri fallback (valid but some crawlers may prefer file). Keep both.
  const ogFallbackDataUri =
    "data:image/svg+xml;base64," +
    Buffer.from(
      `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='#20E3B2'/><stop offset='1' stop-color='#6FC3FF'/></linearGradient></defs>
        <rect width='100%' height='100%' fill='#0b111a'/>
        <circle cx='980' cy='-80' r='420' fill='url(#g)' opacity='.2'/>
        <text x='60' y='360' font-family='Inter, system-ui, Arial' font-size='96' font-weight='800' fill='url(#g)'>genio os</text>
        <text x='60' y='440' font-family='Inter, system-ui, Arial' font-size='44' fill='#cfe0ff'>Create your digital twin</text>
      </svg>`
    ).toString("base64");

  return (
    <div className={inter.className}>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {canonicalHref && <link rel="canonical" href={canonicalHref} />}
        <meta name="theme-color" content="#0b111a" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        {canonicalHref && <meta property="og:url" content={canonicalHref} />}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        {/* Prefer real file if present, plus data-uri fallback */}
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image" content={ogFallbackDataUri} />
        <meta property="og:image:alt" content="genio os — Create your digital twin" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        {canonicalHref && <meta name="twitter:url" content={canonicalHref} />}
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:image" content={ogFallbackDataUri} />

        {/* Favicons: inline SVG fallback + standard files if provided */}
        <link
          rel="icon"
          type="image/svg+xml"
          href={`data:image/svg+xml;utf8,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
              <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0' stop-color='#20E3B2'/><stop offset='1' stop-color='#6FC3FF'/></linearGradient></defs>
              <rect width='64' height='64' rx='12' fill='#0b111a'/>
              <circle cx='48' cy='-4' r='28' fill='url(#g)' opacity='.35'/>
              <text x='12' y='44' font-family='Inter,Arial' font-weight='800' font-size='28' fill='url(#g)'>g</text>
            </svg>`
          )}`}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Preconnect fonts (next/font handles actual loading) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      {/* Header */}
      <header
        ref={headerRef}
        className={scrolled ? "hdr scrolled" : "hdr"}
        aria-label="Site header"
      >
        <div className="container nav">
          <Link href="/" className="brand" aria-label="genio os">
            <span className="brand-name brand-name--neon">genio os</span>
          </Link>

          <div className="actions">
            <button
              ref={menuBtnRef}
              className="menu-chip"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMenuOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M7 12h13M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="menu-text">Menu</span>
            </button>
            <Link className="btn btn-outline" href="/login">Login</Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div id="mobile-drawer" className="sheet" role="dialog" aria-modal="true" aria-label="Mobile menu">
          <div className="backdrop" onClick={() => setMenuOpen(false)} />
          <aside className="panel" ref={panelRef}>
            <div className="panel-head">
              <div className="brand mini">
                <span className="brand-name brand-name--neon">genio os</span>
              </div>
              <button
                className="close"
                aria-label="Close menu"
                ref={closeBtnRef}
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>

            <nav className="panel-links">
              <Link href="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
              <Link href="/support" onClick={() => setMenuOpen(false)}>Support</Link>
              <Link href="/chat" onClick={() => setMenuOpen(false)}>Chat</Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Hero */}
      <main ref={mainRef} className="container hero" aria-label="Hero">
        <div className="hero-text">
          <h1>Create your digital twin</h1>
          <p className="hook">
            Imagine having another you — working 24/7, even while you sleep. Your twin lives as a digital bot on your
            pages: replying in your tone and voice, posting content, sending WhatsApp & emails, even dropping TikToks.
            It’s your personal assistant on call — one click, by the name you choose.
          </p>

          <Link className="btn btn-neon cta" href="/signup" style={{ marginBottom: 12 }}>
            Signup
          </Link>
          <button className="btn btn-neon cta" onClick={goCreateTwin}>Create your twin</button>
        </div>

        <figure className="hero-visual">
          <div className="blob" aria-hidden="true" />
          {/* Decorative SVG */}
          <svg className="twin" viewBox="0 0 480 480" aria-hidden="true">
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
          background:radial-gradient(1200px 600px at 80% -10%, #14263d 0%, var(--bg) 60%), #0b111a;
          max-width:100vw; overflow-x:hidden;
        }
        .container{width:min(1200px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}

        /* Header */
        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; transition:box-shadow .2s ease}
        .hdr.scrolled{box-shadow:0 8px 28px rgba(0,0,0,.5)}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 0}
        .brand{display:inline-flex; align-items:center; gap:8px; min-width:0; flex:1 1 auto; white-space:nowrap}
        .brand-name{font-weight:800; letter-spacing:.2px}
        .brand-name--neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          text-shadow:0 0 8px rgba(111,195,255,.4), 0 0 18px rgba(32,227,178,.25);
          transition: text-shadow .2s ease, filter .2s ease;
        }
        .brand:hover .brand-name--neon,
        .brand:focus-visible .brand-name--neon,
        .brand-name--neon:focus-visible{
          text-shadow:0 0 10px rgba(111,195,255,.55), 0 0 26px rgba(32,227,178,.35);
          filter: drop-shadow(0 0 8px rgba(111,195,255,.15));
        }
        /* High-contrast fallback */
        @media (forced-colors: active){
          .brand-name--neon{
            -webkit-text-fill-color: CanvasText;
            color: CanvasText;
            background: none;
            text-shadow: none;
          }
        }

        .actions{display:flex; align-items:center; gap:8px; flex:0 1 auto; min-width:0}
        .menu-chip{display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:12px; background:#0e1a2a; border:1px solid #1e2b41; color:#cfe6ff}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:var(--text)}
        .btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn-outline{background:#0f1828; font-weight:600}
        @media (max-width:360px){
          .menu-text{display:none}
          .menu-chip{padding:6px 8px}
          .btn{padding:6px 10px; font-size:13px}
          .brand-name{font-size:16px}
        }

        /* Drawer */
        .sheet{position:fixed; inset:0; z-index:60}
        .backdrop{position:absolute; inset:0; background:rgba(0,0,0,.6)}
        .panel{position:absolute; right:0; top:0; height:100%; width:min(86%, 340px); background:var(--card); border-left:1px solid #20304a; display:flex; flex-direction:column; padding:16px; box-shadow:-10px 0 40px rgba(0,0,0,.45)}
        .panel-head{display:flex; align-items:center; justify-content:space-between}
        .close{background:none; border:none; color:var(--text); font-size:20px}
        .panel-links{display:flex; flex-direction:column; gap:10px; margin-top:18px}
        .panel-links a{padding:12px 14px; border-radius:12px; background:#0f1b2d; color:#e7f0ff; border:1px solid #1f2c44}

        /* Hero */
        .hero{display:grid; grid-template-columns:1.1fr .9fr; gap:32px; align-items:center; padding:84px 0}
        .hero-text h1{
          margin:0 0 14px; font-size:clamp(32px,5vw,56px); line-height:1.05;
          background:linear-gradient(180deg, #f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;
          text-shadow:0 0 18px rgba(111,195,255,.15);
        }
        .hero-text .hook{color:#c0d0e2; margin:0 0 18px; max-width:58ch}
        .cta{min-width:220px}
        .hero-visual{position:relative; aspect-ratio:1/1; min-height:320px; display:grid; place-items:center}
        .blob{
          position:absolute; width:560px; height:560px; border-radius:50%;
          background:radial-gradient(circle at 30% 30%, var(--neon1), transparent 60%), radial-gradient(circle at 70% 70%, var(--neon2), transparent 60%);
          filter:blur(44px) saturate(160%); opacity:.35;
        }
        .twin{width:min(440px,90%); filter:drop-shadow(0 10px 40px rgba(0,0,0,.5))}
        @media (max-width:940px){ .hero{grid-template-columns:1fr; text-align:center} .hero-visual{margin-top:16px} }

        /* Motion respect */
        @media (prefers-reduced-motion: reduce){
          .brand-name--neon{transition:none}
        }
      `}</style>
    </div>
  );
}
