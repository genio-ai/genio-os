// File: pages/index.js
import { useEffect, useState, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [origin, setOrigin] = useState("");

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

  // safe origin
  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  // auth check
  const hasAuth = useCallback(() => {
    if (typeof window === "undefined") return false;
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

  const goCreateTwin = () =>
    router.push(hasAuth() ? "/onboarding" : "/signup");

  const ogTitle = "Genio OS — Create your digital twin";
  const ogDesc =
    "Another you — a digital twin that replies in your tone, posts content, sends WhatsApp & emails, even drops TikToks.";

  // fallback inline SVG (safe, no Buffer)
  const ogFallbackSvg = `
<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630'>
  <rect width='100%' height='100%' fill='#0b111a'/>
  <text x='60' y='360' font-family='Inter, Arial' font-size='96' font-weight='800' fill='#6FC3FF'>Genio OS</text>
  <text x='60' y='440' font-family='Inter, Arial' font-size='44' fill='#cfe0ff'>Create your digital twin</text>
</svg>`;
  const ogFallbackDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(
    ogFallbackSvg
  )}`;

  return (
    <div className={inter.className}>
      <Head>
        <title>{ogTitle}</title>
        <meta name="description" content={ogDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {origin && <link rel="canonical" href={origin + "/"} />}
        <meta name="theme-color" content="#0b111a" />

        <meta property="og:type" content="website" />
        {origin && <meta property="og:url" content={origin + "/"} />}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDesc} />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image" content={ogFallbackDataUri} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        <meta name="twitter:description" content={ogDesc} />
        <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:image" content={ogFallbackDataUri} />
      </Head>

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
          <p className="hook">{ogDesc}</p>
          <Link className="btn btn-neon cta" href="/signup">
            Signup
          </Link>
          <button className="btn btn-neon cta" onClick={goCreateTwin}>
            Create your twin
          </button>
        </div>
      </main>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #0b111a;
          color: white;
        }
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
