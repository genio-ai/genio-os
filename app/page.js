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

  const goCreateTwin = () => router.push(hasAuth() ? "/onboarding" : "/signup");

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

          {/* CTA buttons */}
          <div className="hero-ctas">
            <Link className="btn btn-neon cta" href="/signup">Sign up</Link>
            <button className="btn btn-neon cta" onClick={goCreateTwin}>Create your twin</button>
          </div>
        </div>

        <figure className="hero-visual" aria-hidden="true">
          <div className="blob" />
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
        :root{ --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
               --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018; }
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
        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; transition:box-shadow .2s}
        .hdr.scrolled{box-shadow:0 8px 28px rgba(0,0,0,.5)}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 0}

        .brand{display:inline-flex; align-items:center; gap:8px; min-width:0; flex:1 1 auto; white-space:nowrap}
        .brand-name{font-weight:900; letter-spacing:.3px; font-size:22px;} /* bigger logo text */
        .brand-name--neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 8px rgba(111,195,255,.4), 0 0 18px rgba(32,227,178,.25);
          transition:text-shadow .2s ease, filter .2s ease;
        }
        .brand:hover .brand-name--neon,
        .brand:focus-visible .brand-name--neon{ text-shadow:0 0 10px rgba(111,195,255,.55), 0 0 26px rgba(32,227,178,.35); filter:drop-shadow(0 0 8px rgba(111,195,255,.15)); }

        .actions{display:flex; align-items:center; gap:10px}
        .menu-chip{display:inline-flex; align-items:center; gap:8px; padding:8px 12px; border-radius:12px; background:#0e1a2a; border:1px solid #1e2b41; color:#cfe6ff}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:var(--text)}
        .btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn-outline{background:#0f1828; font-weight:600}

        /* Mobile tighten header */
        @media (max-width:360px){
          .menu-text{display:none}
          .menu-chip{padding:6px 8px}
          .btn{padding:6px 10px; font-size:13px}
          .brand-name{font-size:18px}
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
        .hero{
          display:grid; grid-template-columns:1.1fr .9fr; gap:32px; align-items:center;
          padding:84px 0; min-height:80vh;
        }
        .hero-text h1{
          margin:0 0 14px; font-size:clamp(32px,5vw,56px); line-height:1.05;
          background:linear-gradient(180deg, #f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;
          text-shadow:0 0 18px rgba(111,195,255,.15);
        }
        .hero-text .hook{color:#c0d0e2; margin:0 0 18px; max-width:58ch}
        .cta{min-width:220px}

        /* CTA row: spacing desktop, stacked on mobile */
        .hero-ctas{display:flex; gap:12px; align-items:center; flex-wrap:wrap}
        @media (max-width:940px){
          .hero-ctas{flex-direction:column; align-items:center}
          .cta{width:100%; max-width:320px}
        }

        .hero-visual{position:relative; aspect-ratio:1/1; min-height:320px; display:grid; place-items:center}
        .blob{
          position:absolute; width:560px; height:560px; border-radius:50%;
          background:radial-gradient(circle at 30% 30%, var(--neon1), transparent 60%), radial-gradient(circle at 70% 70%, var(--neon2), transparent 60%);
          filter:blur(44px) saturate(160%); opacity:.35;
        }
        .twin{width:min(440px,90%); filter:drop-shadow(0 10px 40px rgba(0,0,0,.5))}

        /* Mobile hero balance: center content, clamp long text, reduce padding */
        @media (max-width:940px){
          .hero{grid-template-columns:1fr; text-align:center; padding:60px 0; min-height:90dvh; place-items:center}
          .hero-text .hook{
            margin-inline:auto; max-width:46ch;
            display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;
          }
          .hero-visual{margin-top:12px}
        }
      `}</style>
    </div>
  );
}
