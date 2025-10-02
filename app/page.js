// File: app/page.js
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const OG_DESC =
  "Another you — a digital twin that replies in your tone, posts content, sends WhatsApp & emails, even drops TikToks.";

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

  const goCreateTwin = useCallback(() => {
    router.push(hasAuth() ? "/onboarding" : "/signup");
  }, [router, hasAuth]);

  return (
    <div>
      <header
        ref={headerRef}
        className={scrolled ? "hdr scrolled" : "hdr"}
        aria-label="Site header"
      >
        <div className="container nav">
          <Link href="/" className="brand" aria-label="Genio OS">
            <span className="brand-name brand-name--neon">Genio OS</span>
          </Link>

          <div className="actions">
            <button
              ref={menuBtnRef}
              className="menu-chip"
              onClick={() => setMenuOpen(true)}
            >
              ☰ Menu
            </button>
            <Link className="btn btn-outline" href="/login">
              Login
            </Link>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div id="mobile-drawer" className="sheet" role="dialog">
          <div className="backdrop" onClick={() => setMenuOpen(false)} />
          <aside className="panel" ref={panelRef}>
            <div className="panel-head">
              <span className="brand-name brand-name--neon">Genio OS</span>
              <button
                ref={closeBtnRef}
                className="close"
                onClick={() => setMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <nav className="panel-links">
              <Link href="/pricing">Pricing</Link>
              <Link href="/support">Support</Link>
              <Link href="/chat">Chat</Link>
            </nav>
          </aside>
        </div>
      )}

      <main ref={mainRef} className="container hero">
        <div className="hero-text">
          <h1>Create your digital twin</h1>
          <p className="hook">{OG_DESC}</p>
          <Link className="btn btn-neon cta" href="/signup">
            Signup
          </Link>
          <button className="btn btn-neon cta" onClick={goCreateTwin}>
            Create your twin
          </button>
        </div>
      </main>

      <style jsx global>{`
        .container {
          width: min(1200px, 92%);
          margin: 0 auto;
        }
        .hdr {
          position: sticky;
          top: 0;
          background: #0b111add;
        }
        .hdr.scrolled {
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
        }
        .actions {
          display: flex;
          gap: 8px;
        }
        .btn {
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .btn-neon {
          background: linear-gradient(135deg, #20e3b2, #6fc3ff);
          border: none;
          color: black;
        }
        .btn-outline {
          border: 1px solid #6fc3ff;
          background: transparent;
          color: white;
        }
        .hero {
          padding: 80px 0;
          text-align: center;
        }
        .brand-name--neon {
          background: linear-gradient(135deg, #20e3b2, #6fc3ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .sheet {
          position: fixed;
          inset: 0;
          display: flex;
        }
        .panel {
          background: #111827;
          padding: 16px;
          width: 280px;
          margin-left: auto;
        }
        .backdrop {
          flex: 1;
          background: rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
}
