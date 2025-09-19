// File: pages/index.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isAuth, setIsAuth] = useState(false); // mock, replace with real auth check
  const router = useRouter();

  // header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // handle CTA click
  const handleCreateTwin = () => {
    if (isAuth) {
      router.push("/onboarding");
    } else {
      router.push("/signup");
    }
  };

  return (
    <>
      <Head>
        <title>genio ai studio — Create your digital twin</title>
        <meta
          name="description"
          content="Imagine another you — working 24/7, replying in your tone and voice, posting content, sending WhatsApp & emails, even TikToks."
        />
      </Head>

      {/* Header */}
      <header id="hdr" className={scrolled ? "scrolled" : ""}>
        <div className="container nav">
          <a href="/" className="brand">
            <img src="/logo.png" alt="Genio Studio logo" className="logo" />
            <span>genio ai studio</span>
          </a>
          <nav>
            <ul>
              <li><a href="/support">Support</a></li>
              <li><a href="/chat">Chat</a></li>
              <li><a href="/login">Login</a></li>
              <li><a className="btn btn-primary" href="/signup">Signup</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main id="home" className="container hero">
        <div className="hero-text">
          <h1>Create your digital twin</h1>
          <p>
            Imagine having another you — working 24/7, even while you sleep.  
            Your twin lives as a digital bot on your pages: replying in your tone and voice,  
            posting content, sending WhatsApp & emails, even dropping TikToks.  
            It’s your personal assistant on call — one click, by the name you choose.
          </p>
          <button className="btn btn-primary cta" onClick={handleCreateTwin}>
            Create your twin
          </button>
        </div>
        <div className="hero-visual">
          {/* Placeholder twin image / replace with 3D later */}
          <img src="/twin-placeholder.png" alt="Digital twin preview" />
        </div>
      </main>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: Inter, system-ui, sans-serif;
          background: #0b0f14;
          color: #e9eef5;
        }
        .container {
          width: min(1200px, 92%);
          margin: 0 auto;
        }
        header {
          position: sticky;
          top: 0;
          padding: 14px 0;
          background: #0b0f14e6;
          backdrop-filter: blur(10px);
        }
        header.scrolled {
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
        }
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
        }
        .logo {
          width: 32px;
          height: 32px;
        }
        nav ul {
          display: flex;
          gap: 20px;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }
        nav a {
          color: #a9b4c2;
          text-decoration: none;
        }
        nav a:hover {
          color: #fff;
        }
        .btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }
        .btn-primary {
          background: linear-gradient(135deg, #5ee1a1, #6fc3ff);
          color: #071018;
          font-weight: 600;
        }
        .hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          padding: 80px 0;
        }
        .hero-text h1 {
          font-size: 2.8rem;
          margin-bottom: 16px;
          background: linear-gradient(180deg, #e9eef5 0%, #bcd2ff 100%);
          -webkit-background-clip: text;
          color: transparent;
        }
        .hero-text p {
          max-width: 52ch;
          color: #a9b4c2;
          margin-bottom: 24px;
        }
        .hero-visual img {
          max-width: 100%;
          border-radius: 12px;
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
