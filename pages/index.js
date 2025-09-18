import Head from "next/head";
import Link from "next/link";
import SystemChat from "../components/SystemChat";

export default function Home() {
  return (
    <>
      <Head>
        <title>Genio · Build Your AI Twin</title>
        <meta
          name="description"
          content="Genio helps you create your AI Twin — a smarter, always-on version of you."
        />
      </Head>

      <main className="wrap">
        {/* Header */}
        <header className="header">
          <Link href="/" className="brand">Genio</Link>
          <nav className="nav">
            <Link href="/about" className="navLink">About</Link>
            <Link href="/support" className="navLink">Support</Link>
            <Link href="/auth/login" className="btn ghost">Log in</Link>
            <Link href="/auth/signup" className="btn primary">Sign up</Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="hero">
          <h1>Meet Your AI Twin</h1>
          <p>
            A smarter version of you — available 24/7 to answer, draft, and
            connect in your own style.
          </p>
          <div className="cta">
            <Link href="/auth/signup" className="btn primary big">
              Create My Twin
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} Genio · All rights reserved.</p>
        </footer>
      </main>

      {/* System Chat */}
      <SystemChat />

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0a1730;
          color: #e6eef8;
        }
        .header {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          text-decoration: none;
        }
        .nav {
          display: flex;
          gap: 14px;
          align-items: center;
        }
        .navLink {
          color: #c9d6e5;
          text-decoration: none;
          font-size: 15px;
        }
        .btn {
          border-radius: 10px;
          padding: 8px 16px;
          font-weight: 600;
          text-decoration: none;
        }
        .btn.ghost {
          border: 1px solid #ffd54d;
          color: #ffd54d;
        }
        .btn.ghost:hover {
          background: #ffd54d22;
        }
        .btn.primary {
          background: #ffd54d;
          color: #0a1730;
        }
        .btn.primary:hover {
          filter: brightness(0.95);
        }
        .btn.big {
          font-size: 18px;
          padding: 12px 24px;
        }
        .hero {
          flex: 1;
          max-width: 960px;
          margin: 0 auto;
          padding: 80px 20px;
          text-align: center;
        }
        .hero h1 {
          font-size: 48px;
          margin-bottom: 20px;
          background: linear-gradient(90deg, #ffd54d, #ffae00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero p {
          color: #c9d6e5;
          font-size: 20px;
          margin-bottom: 32px;
        }
        .cta {
          margin-top: 20px;
        }
        .footer {
          border-top: 1px solid #22304a;
          padding: 20px;
          text-align: center;
          color: #93a7c4;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}
