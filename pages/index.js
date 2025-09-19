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
        <title>genio os — Create your digital twin</title>
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
      <header
        className={scrolled ? "hdr scrolled" : "hdr"}
        aria-label="Site header"
      >
        <div className="container nav">
          <a className="brand" href="/" aria-label="genio os">
            <span className="brand-name">genio os</span>
          </a>

          <div className="actions">
            <button
              className="menu-chip"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 6h16M7 12h13M4 18h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span className="menu-text">Menu</span>
            </button>
            <a className="btn btn-outline" href="/login">
              Login
            </a>
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
                <span className="brand-name">genio os</span>
              </div>
              <button
                className="close"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
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
            Imagine having another you — working 24/7, even while you sleep. Your twin lives as a
            digital bot on your pages: replying in your tone and voice, posting content, sending
            WhatsApp & emails, even dropping TikToks. It’s your personal assistant on call — one
            click, by the name you choose.
          </p>

          {/* Signup above CTA */}
          <a className="btn btn-neon cta" href="/signup" style={{ marginBottom: 12 }}>
            Signup
          </a>
          <button className="btn btn-neon cta" onClick={goCreateTwin}>
            Create your twin
          </button>
        </div>
      </main>

      <style jsx global>{`
        :root {
          --bg: #0a1018;
          --card: #0f1725;
          --muted: #a7b7c8;
          --text: #edf3ff;
          --neon1: #20e3b2;
          --neon2: #6fc3ff;
          --ink: #071018;
        }
        body {
          margin: 0;
          font: 16px/1.55 Inter, system-ui, sans-serif;
          background: #0b111a;
          color: var(--text);
        }
        .hdr {
          position: sticky;
          top: 0;
          z-index: 50;
          background: #0b111add;
          backdrop-filter: blur(10px);
        }
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
        }
        .brand-name {
          font-weight: 900;
          font-size: 22px;
          background: linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.5px;
        }
        .actions {
          display: flex;
          gap: 8px;
        }
        .menu-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 12px;
          background: #0e1a2a;
          color: #cfe6ff;
        }
        .btn {
          padding: 10px 14px;
          border-radius: 12px;
          font-weight: 700;
        }
        .btn-neon {
          border: none;
          background: linear-gradient(135deg, var(--neon1), var(--neon2));
          color: var(--ink);
        }
        .btn-outline {
          background: #0f1828;
          border: 1px solid #223145;
          color: var(--text);
        }
        .hero {
          padding: 84px 0;
        }
        .hero-text {
          max-width: 600px;
        }
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
          width: min(86%, 340px);
          background: var(--card);
          border-left: 1px solid #20304a;
          display: flex;
          flex-direction: column;
          padding: 16px;
          box-shadow: -10px 0 40px rgba(0, 0, 0, 0.45);
        }
        .panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .close {
          background: none;
          border: none;
          color: var(--text);
          font-size: 20px;
        }
        .panel-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
        }
        .panel-links a {
          padding: 12px 14px;
          border-radius: 12px;
          background: #0f1b2d;
          color: #e7f0ff;
          border: 1px solid #1f2c44;
        }
      `}</style>
    </>
  );
}
