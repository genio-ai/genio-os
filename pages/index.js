// pages/index.js (no Tailwind, pure CSS-in-page)
import Head from "next/head";
import Link from "next/link";

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0B1D3A",
    color: "#fff",
    fontFamily: "-apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    background: "rgba(14,35,68,0.8)",
    backdropFilter: "blur(6px)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "12px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: { fontWeight: 800, letterSpacing: 0.5 },
  navUl: { display: "flex", gap: 18, fontSize: 14, listStyle: "none" },
  link: { color: "rgba(255,255,255,0.9)", textDecoration: "none" },
  heroWrap: { maxWidth: 1100, margin: "0 auto", padding: "56px 16px 0" },
  card: {
    border: "1px solid rgba(255,255,255,0.1)",
    background: "linear-gradient(135deg,#102A55,#0A1936)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  },
  h1: { fontSize: 42, fontWeight: 900, margin: "0 0 12px" },
  p: { opacity: 0.9, fontSize: 18, maxWidth: 760, lineHeight: 1.6 },
  btnRow: { marginTop: 18, display: "flex", flexWrap: "wrap", gap: 10 },
  btnPrimary: {
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 700,
    color: "#000",
    background: "linear-gradient(90deg,#27E38A,#27D4F0)",
    textDecoration: "none",
  },
  btnGhost: {
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.08)",
    textDecoration: "none",
    color: "#fff",
  },
  btnSoft: {
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    textDecoration: "none",
    color: "#fff",
  },
  badges: {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(4,minmax(0,1fr))",
    gap: 10,
  },
  badge: {
    textAlign: "center",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    padding: "8px 10px",
    fontSize: 13,
    opacity: 0.9,
  },
  grid: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "36px 16px 40px",
    display: "grid",
    gridTemplateColumns: "repeat(3,minmax(0,1fr))",
    gap: 16,
  },
  tile: {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    padding: 20,
  },
  tileH: { fontSize: 20, fontWeight: 800, margin: "0 0 8px" },
  tileP: { opacity: 0.85, lineHeight: 1.6 },
  ctaWrap: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "0 16px 48px",
  },
  cta: {
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.06)",
    padding: 20,
    display: "flex",
    gap: 16,
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
    opacity: 0.7,
    fontSize: 13,
    padding: "18px 0 26px",
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Genio KYC OS — The Operating System of Trust</title>
        <meta
          name="description"
          content="Genio KYC OS builds the trust layer for banks and fintechs: multi-layer identity verification, AML screening, anti-fraud intelligence, and a developer-friendly API."
        />
        <meta name="google" content="notranslate" />
        <meta httpEquiv="Content-Language" content="en" />
      </Head>

      <main style={styles.page}>
        {/* Header */}
        <header style={styles.nav}>
          <nav style={styles.navInner}>
            <div style={styles.brand}>Genio <span style={{opacity:.8}}>KYC OS</span></div>
            <ul style={styles.navUl}>
              <li><Link href="/" style={styles.link}>Home</Link></li>
              <li><Link href="/kyc" style={styles.link}>KYC</Link></li>
              <li><Link href="/dashboard" style={styles.link}>Dashboard</Link></li>
              <li><Link href="/login" style={styles.link}>Login</Link></li>
            </ul>
          </nav>
        </header>

        {/* Hero */}
        <section style={styles.heroWrap}>
          <div style={styles.card}>
            <h1 style={styles.h1}>The Operating System of <span style={{opacity:.8}}>Trust.</span></h1>
            <p style={styles.p}>
              <b>Genio KYC OS</b> provides bank-grade identity verification,
              sanctions &amp; PEP screening, fraud detection, and a developer-friendly API.
              Build compliance into your products with speed and confidence.
            </p>

            <div style={styles.btnRow}>
              <Link href="/kyc" style={styles.btnPrimary}>Begin Verification</Link>
              <Link href="/dashboard" style={styles.btnGhost}>View KYC Status</Link>
              <a href="#how-it-works" style={styles.btnSoft}>See How KYC OS Works</a>
            </div>

            <div style={styles.badges}>
              {["Sanctions (UN/EU/OFAC)", "PEP & Adverse Media", "OCR & Liveness", "Risk Scoring"].map((t)=>(
                <div key={t} style={styles.badge}>{t}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <section id="how-it-works" style={styles.grid}>
          {[
            {t:"Bank-grade Compliance", d:"End-to-end KYC/AML workflows with full audit trails and regulator-ready reporting."},
            {t:"Adaptive Verification", d:"Dynamic checks: documents, selfie with ID, liveness, address — based on risk level."},
            {t:"Developer-first", d:"Clear APIs and webhooks. Start small and scale across providers and countries."},
          ].map((c)=>(
            <div key={c.t} style={styles.tile}>
              <h3 style={styles.tileH}>{c.t}</h3>
              <p style={styles.tileP}>{c.d}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section style={styles.ctaWrap}>
          <div style={styles.cta}>
            <div>
              <div style={{fontSize:22,fontWeight:800,marginBottom:6}}>Ready to power trust?</div>
              <p style={{opacity:.8,fontSize:13,maxWidth:560}}>
                Start verification today. Compliance connections are available only through licensed providers.
              </p>
            </div>
            <Link href="/kyc" style={styles.btnPrimary}>Begin Verification</Link>
          </div>
        </section>

        {/* Footer */}
        <footer style={styles.footer}>
          © {new Date().getFullYear()} Genio KYC OS — The Operating System of Trust
        </footer>
      </main>
    </>
  );
}
