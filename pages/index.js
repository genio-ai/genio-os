// pages/index.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import TwinModal from "../components/TwinModal";

export default function HomePage() {
  const [showTwinModal, setShowTwinModal] = useState(false);

  return (
    <>
      <Head>
        <title>Genio — Create Your Smart Twin</title>
        <meta
          name="description"
          content="Create an AI twin that writes, speaks, and responds like you — 24/7."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <Link href="/" style={styles.brand} aria-label="Genio Home">
            Genio
          </Link>

          <nav aria-label="Primary" style={styles.nav}>
            <Link href="/login" style={styles.navLink}>
              Log in
            </Link>
            <Link
              href="/signup"
              style={{ ...styles.navLink, ...styles.signup }}
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main style={styles.main}>
        <section style={styles.hero}>
          <h1 style={styles.title}>
            Create your smart twin… a better version of you
          </h1>
          <p style={styles.subtitle}>
            It writes, speaks, appears, and responds for you — 24/7.
          </p>

          <button
            type="button"
            onClick={() => setShowTwinModal(true)}
            style={styles.cta}
            aria-haspopup="dialog"
            aria-expanded={showTwinModal ? "true" : "false"}
            aria-controls="twin-modal"
          >
            Create My Twin
          </button>
        </section>
      </main>

      <footer style={styles.footer}>
        <small style={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} Genio Systems. All rights reserved.
        </small>
      </footer>

      {showTwinModal && (
        <TwinModal
          id="twin-modal"
          onClose={() => setShowTwinModal(false)}
        />
      )}
    </>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    width: "100%",
    background: "rgba(5, 20, 45, 0.9)",
    backdropFilter: "blur(6px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    zIndex: 40,
  },
  headerInner: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    color: "white",
    fontWeight: 800,
    letterSpacing: "0.4px",
    textDecoration: "none",
    fontSize: 20,
  },
  nav: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 14,
    border: "1px solid rgba(255,255,255,0.15)",
  },
  signup: {
    background: "#ffd54d",
    color: "#1b1b1b",
    border: "1px solid #ffd54d",
    fontWeight: 700,
  },
  main: {
    minHeight: "calc(100vh - 140px)",
    background:
      "radial-gradient(1200px 600px at 50% 10%, rgba(255,255,255,0.06), rgba(5, 15, 35, 1))",
  },
  hero: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "80px 20px 64px",
    textAlign: "left",
    color: "white",
  },
  title: {
    fontSize: 40,
    lineHeight: 1.2,
    fontWeight: 800,
    margin: 0,
    letterSpacing: "0.3px",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 18,
    opacity: 0.9,
    maxWidth: 680,
  },
  cta: {
    marginTop: 28,
    display: "inline-block",
    background: "#ffd54d",
    color: "#151515",
    fontWeight: 800,
    border: "none",
    padding: "14px 22px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 16,
    boxShadow: "0 6px 16px rgba(255, 213, 77, 0.25)",
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(5, 20, 45, 1)",
    color: "white",
    textAlign: "center",
    padding: "18px 12px",
  },
};
