// File: app/page.js
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hasAuth = useCallback(() => {
    try {
      const cookieHasAuth =
        document.cookie.includes("auth=") || document.cookie.includes("token=");
      const lsHasAuth =
        !!localStorage.getItem("auth") || !!localStorage.getItem("token");
      return cookieHasAuth || lsHasAuth;
    } catch {
      return false;
    }
  }, []);

  const openNio = () => router.push("/chat");
  const goCreateTwin = () => router.push(hasAuth() ? "/onboarding" : "/signup");

  // mobile drawer focus + body lock
  useEffect(() => {
    if (!menuOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const bgEls = [headerRef.current, mainRef.current].filter(Boolean);
    bgEls.forEach((el) => {
      el.setAttribute("inert", "");
      el.setAttribute("aria-hidden", "true");
    });

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

  return (
    <div>
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

          {/* Keep header clean on mobile/desktop: Menu only */}
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
              <a href="mailto:hello@genio.systems" onClick={() => setMenuOpen(false)}>Contact us</a>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            </nav>
          </aside>
        </div>
      )}

      {/* Hero */}
      <main ref={mainRef} className="container hero" aria-label="Hero">
        <div className="hero-text">
          <h1>Meet Nio — your Genio assistant</h1>
          <p className="hook">
            Nio is your built-in assistant across Genio OS. Ask anything about your Twin,
            onboarding, or account — Nio guides you, fixes issues, and helps you move faster.
          </p>

          <button className="btn btn-neon cta" onClick={goCreateTwin}>
            Create your twin
          </button>
        </div>

        {/* Nio face + button */}
        <div className="hero-visual" aria-hidden="true">
          <button
            className="nio-face"
            onClick={openNio}
            aria-label="Open Nio assistant"
          >
            <svg className="twin" viewBox="0 0 480 480">
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
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <rect x="0" y="0" width="480" height="480" rx="26" fill="url(#g2)" />

              {/* head */}
              <circle cx="240" cy="164" r="74" fill="#0d1420" stroke="url(#g1)" strokeWidth="3" />

              {/* eyes (blink) */}
              <g className="eyes">
                <ellipse className="eye e1" cx="218" cy="160" rx="10" ry="12" fill="#bfe1ff" />
                <ellipse className="eye e2" cx="262" cy="160" rx="10" ry="12" fill="#bfe1ff" />
              </g>

              {/* mouth (idle) */}
              <g className="mouth">
                <path d="M210 188q30 22 60 0" stroke="url(#g1)" strokeWidth="4" fill="none" strokeLinecap="round" />
              </g>

              {/* body */}
              <rect x="168" y="230" width="144" height="150" rx="20" fill="#0d1420" stroke="#233043" />

              {/* animated waves */}
              <g className="waves">
                <path className="wave wave1" d="M350 160 q20 20 0 40" stroke="url(#g1)" strokeWidth="4" fill="none" filter="url(#glow)" />
                <path className="wave wave2" d="M360 150 q32 36 0 72" stroke="url(#g1)" strokeWidth="3" fill="none" opacity=".75" />
                <path className="wave wave3" d="M370 140 q44 52 0 104" stroke="url(#g1)" strokeWidth="2" fill="none" opacity=".55" />
              </g>
            </svg>
          </button>

          {/* Nio CTA button under the face (not stuck, small gap) */}
          <button className="btn btn-neon nio-cta" onClick={openNio}>
            Nio
          </button>
        </div>
      </main>

      <style jsx global>{`
        :root{
          --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
        }
        *{box-sizing:border-box}
        html,body{height:100%}
        body{
          margin:0;
          font:16px/1.55 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color:var(--text);
          background:radial-gradient(1200px 600px at 80% -10%, #14263d 0%, var(--bg) 60%), #0b111a;
          max-width:100vw; overflow-x:hidden;
        }
        .container{width:min(1200px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}

        /* Header */
        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; transition:box-shadow .2s}
        .hdr.scrolled{box-shadow:0 8px 28px rgba(0,0,0,.5)}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 0}
        .brand{display:inline-flex; align-items:center; gap:8px; min-width:0; flex:1 1 auto; white-space:nowrap}
        .brand-name{font-weight:900; letter-spacing:.2px; font-size:26px;}
        .brand-name--neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 8px rgba(111,195,255,.4), 0 0 18px rgba(32,227,178,.25);
        }

        .actions{display:flex; align-items:center; gap:10px}
        .menu-chip{display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:12px; background:#0e1a2a; border:1px solid #1e2b41; color:#cfe6ff}
        .menu-text{font-weight:700}

        /* Drawer */
        .sheet{position:fixed; inset:0; z-index:60}
        .backdrop{position:absolute; inset:0; background:rgba(0,0,0,.6)}
        .panel{position:absolute; right:0; top:0; height:100%; width:min(86%, 340px); background:var(--card); border-left:1px solid #20304a; display:flex; flex-direction:column; padding:16px; box-shadow:-10px 0 40px rgba(0,0,0,.45)}
        .panel-head{display:flex; align-items:center; justify-content:space-between}
        .close{background:none; border:none; color:var(--text); font-size:20px}
        .panel-links{display:flex; flex-direction:column; gap:10px; margin-top:18px}
        .panel-links a{padding:12px 14px; border-radius:12px; background:#0f1b2d; color:#e7f0ff; border:1px solid #1f2c44}

        /* Hero */
        .hero{
          display:grid; grid-template-columns:1.1fr .9fr; gap:32px; align-items:center; padding:84px 0;
        }
        .hero-text h1{
          margin:0 0 14px; font-size:clamp(28px,5vw,56px); line-height:1.05;
          background:linear-gradient(180deg, #f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;
          text-shadow:0 0 18px rgba(111,195,255,.15);
        }
        .hero-text .hook{color:#c0d0e2; margin:0 0 18px; max-width:60ch}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:800; border:1px solid #223145; background:#0f1828; color:var(--text)}
        .btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .cta{min-width:220px}

        .hero-visual{
          position:relative; aspect-ratio:1/1; min-height:320px;
          display:flex; flex-direction:column; align-items:center; justify-content:center;
        }
        .nio-face{
          position:relative; display:grid; place-items:center; background:transparent; border:none; padding:0; cursor:pointer; border-radius:24px; outline-offset:4px;
          transition:transform .15s ease, filter .2s ease;
        }
        .nio-face:focus-visible{ outline: 3px solid rgba(111,195,255,.5); }
        .nio-face:hover{ transform: translateY(-2px); filter: drop-shadow(0 8px 24px rgba(0,0,0,.35)); }
        .nio-face:active{ transform: translateY(0); }

        .nio-cta{
          margin-top:10px; /* not stuck to the face */
          min-width:120px;
        }

        /* Eyes blink */
        .eyes .eye{ transform-origin: center; animation: blink 6s ease-in-out infinite; }
        .eyes .e2{ animation-delay: .25s; }
        @keyframes blink {
          0%, 96%, 100% { transform: scaleY(1); }
          97%, 99% { transform: scaleY(0.1); }
        }

        /* Mouth subtle idle */
        .mouth{ transform-origin: 240px 188px; animation: talkIdle 4.5s ease-in-out infinite; }
        @keyframes talkIdle {
          0%,100% { transform: scaleY(1); }
          50%     { transform: scaleY(1.06); }
        }

        /* Waves (always live) */
        @keyframes wavePulse {
          0% { opacity:.25; transform: translateX(0) scale(1); }
          50% { opacity:1; transform: translateX(2px) scale(1.02); }
          100% { opacity:.25; transform: translateX(0) scale(1); }
        }
        .waves .wave{ transform-origin: 360px 160px; animation: wavePulse 1.8s ease-in-out infinite; }
        .waves .wave2{ animation-duration: 2.2s; animation-delay: .2s; }
        .waves .wave3{ animation-duration: 2.6s; animation-delay: .4s; }

        .twin{ width:min(440px,90%); filter:drop-shadow(0 10px 40px rgba(0,0,0,.5)); }
        .nio-face .twin{ animation: twinFloat 6s ease-in-out infinite; }
        @keyframes twinFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }

        /* Mobile layout */
        @media (max-width:940px){
          .hero{grid-template-columns:1fr; text-align:center}
          .hero-visual{margin-top:16px}
          .cta{min-width:200px}
        }
        @media (max-width:360px){
          .menu-text{display:none}
          .menu-chip{padding:6px 10px}
          .btn{padding:8px 12px; font-size:14px}
          .brand-name{font-size:22px}
        }
      `}</style>
    </div>
  );
}
