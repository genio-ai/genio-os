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
          content="Imagine another you — working 24/7, replying in your tone and voice, posting content, sending WhatsApp & emails, even TikToks."
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
          <a className="brand" href="/" aria-label="genio ai studio">
            <span className="brand-logo" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#5EE1A1" />
                    <stop offset="1" stopColor="#6FC3FF" />
                  </linearGradient>
                </defs>
                <rect x="0" y="0" width="24" height="24" rx="7" fill="url(#lg)" />
                <path
                  d="M6 14V10M10 18V6M14 13V11M18 20V4"
                  stroke="#071018"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="brand-name">genio ai studio</span>
          </a>

          <nav className="nav-links desktop" aria-label="Primary">
            <a href="/pricing">Pricing</a>
            <a href="/support">Support</a>
            <a href="/chat">Chat</a>
            <a href="/login">Login</a>
            <a className="btn btn-primary" href="/signup">
              Signup
            </a>
          </nav>

          <button
            className="menu-btn mobile"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="sheet" role="dialog" aria-modal="true">
          <div className="backdrop" onClick={() => setMenuOpen(false)} />
          <aside className="panel">
            <div className="panel-head">
              <div className="brand small">
                <span className="brand-logo">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="lg2" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#5EE1A1" />
                        <stop offset="1" stopColor="#6FC3FF" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="24" height="24" rx="7" fill="url(#lg2)" />
                    <path
                      d="M6 14V10M10 18V6M14 13V11M18 20V4"
                      stroke="#071018"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <span className="brand-name">genio</span>
              </div>
              <button className="close" onClick={() => setMenuOpen(false)}>
                ✕
              </button>
            </div>

            <nav className="panel-links">
              <a href="/pricing" onClick={() => setMenuOpen(false)}>
                Pricing
              </a>
              <a href="/support" onClick={() => setMenuOpen(false)}>
                Support
              </a>
              <a href="/chat" onClick={() => setMenuOpen(false)}>
                Chat
              </a>
              <a href="/login" onClick={() => setMenuOpen(false)}>
                Login
              </a>
              <a
                className="btn btn-primary"
                href="/signup"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </a>
            </nav>
          </aside>
        </div>
      )}

      {/* Hero */}
      <main className="container hero">
        <div className="hero-text">
          <h1>Create your digital twin</h1>
          <p className="hook">
            Imagine having another you — working 24/7, even while you sleep. Your
            twin lives as a digital bot on your pages: replying in your tone and
            voice, posting content, sending WhatsApp & emails, even dropping
            TikToks.
          </p>
          <button className="btn btn-primary cta" onClick={goCreateTwin}>
            Create your twin
          </button>
        </div>

        <figure className="hero-visual">
          <div className="blob" aria-hidden="true" />
          <svg className="twin" viewBox="0 0 480 480">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6fc3ff" />
                <stop offset="1" stopColor="#5ee1a1" />
              </linearGradient>
              <radialGradient id="g2" cx="50%" cy="10%" r="80%">
                <stop offset="0" stopColor="#1a2a42" />
                <stop offset="1" stopColor="#0d1420" />
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
            <circle
              cx="240"
              cy="164"
              r="74"
              fill="#0f1726"
              stroke="url(#g1)"
              strokeWidth="3"
            />
            <ellipse cx="218" cy="160" rx="10" ry="12" fill="#9fd1ff" />
            <ellipse cx="262" cy="160" rx="10" ry="12" fill="#9fd1ff" />
            <path
              d="M210 188q30 22 60 0"
              stroke="url(#g1)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
            <rect
              x="168"
              y="230"
              width="144"
              height="150"
              rx="20"
              fill="#0f1726"
              stroke="#233043"
            />
            <path
              d="M350 160 q20 20 0 40"
              stroke="url(#g1)"
              strokeWidth="4"
              fill="none"
              filter="url(#glow)"
            />
            <path
              d="M360 150 q32 36 0 72"
              stroke="url(#g1)"
              strokeWidth="3"
              fill="none"
              opacity=".7"
            />
            <path
              d="M370 140 q44 52 0 104"
              stroke="url(#g1)"
              strokeWidth="2"
              fill="none"
              opacity=".5"
            />
          </svg>
        </figure>
      </main>

      <style jsx global>{`
        :root {
          --bg: #0b0f14;
          --muted: #a9b4c2;
          --text: #e9eef5;
          --brand: #5ee1a1;
          --brand2: #6fc3ff;
        }
        body {
          margin: 0;
          font: 16px/1.55 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial,
            sans-serif;
          color: var(--text);
          background: radial-gradient(
            1200px 600px at 80% -10%,
            #142132 0%,
            #0b0f14 60%
          );
        }
        .container {
          width: min(1200px, 92%);
          margin-inline: auto;
        }

        /* Header */
        .hdr {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: saturate(140%) blur(10px);
          background: #0b0f14e6;
          transition: box-shadow 0.2s ease;
        }
        .hdr.scrolled {
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
        }
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
        }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
        }
        .brand-logo {
          display: inline-grid;
          place-items: center;
          width: 32px;
          height: 32px;
        }
        .brand-name {
          font-weight: 800;
          color: #f2f6ff;
        }
        .nav-links {
          display: flex;
          gap: 18px;
          align-items: center;
        }
        .nav-links a {
          padding: 10px 12px;
          border-radius: 10px;
          color: var(--muted);
          text-decoration: none;
        }
        .nav-links a:hover {
          background: #101826;
          color: var(--text);
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid #233043;
          background: #111a27;
          color: var(--text);
          cursor: pointer;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--brand), var(--brand2));
          border: none;
          color: #071018;
          font-weight: 700;
        }
        .menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--text);
          font-size: 20px;
        }
        @media (max-width: 920px) {
          .desktop {
            display: none;
          }
          .menu-btn {
            display: inline-flex;
          }
        }

        /* Mobile drawer */
        .sheet {
          position: fixed;
          inset: 0;
          z-index: 60;
        }
        .backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
        }
        .panel {
          position: absolute;
          right: 0;
          top: 0;
          height: 100%;
          width: min(86%, 320px);
          background: #0f1620;
          border-left: 1px solid #223045;
          display: flex;
          flex-direction: column;
          padding: 16px;
        }
        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .panel-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 20px;
        }
        .panel-links a {
          padding: 10px 12px;
          border-radius: 10px;
          background: #111a27;
          color: var(--text);
        }
        .close {
          background: none;
          border: none;
          color: var(--text);
          font-size: 20px;
        }

        /* Hero */
        .hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 32px;
          align-items: center;
          padding: 84px 0;
        }
        .hero-text h1 {
          margin: 0 0 14px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.05;
          background: linear-gradient(180deg, #e9eef5 0%, #bcd2ff 100%);
          -webkit-background-clip: text;
          color: transparent;
        }
        .hero-text .hook {
          color: #b7c4d4;
          margin: 0 0 24px;
          max-width: 58ch;
        }
        .cta {
          min-width: 180px;
        }
        .hero-visual {
          position: relative;
          aspect-ratio: 1/1;
          min-height: 320px;
          display: grid;
          place-items: center;
        }
        .blob {
          position: absolute;
          width: 560px;
          height: 560px;
          border-radius: 50%;
          background: radial-gradient(
              circle at 30% 30%,
              var(--brand),
              transparent 60%
            ),
            radial-gradient(circle at 70% 70%, var(--brand2), transparent 60%);
          filter: blur(40px);
          opacity: 0.35;
        }
        .twin {
          width: min(440px, 90%);
        }
        @media (max-width: 940px) {
          .hero {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .hero-visual {
            margin-top: 20px;
          }
        }
      `}</style>
    </>
  );
}
