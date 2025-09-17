// pages/about.js
export default function About() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>About Genio Twin Studio</h1>
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.subtitle}>Who we are</h2>
          <p style={styles.text}>
            Genio Twin Studio builds AI twins that act as your smarter, faster,
            tireless version. Your twin communicates in your style, respects your
            rules, and never publishes without your approval.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Our Vision</h2>
          <p style={styles.text}>
            We believe AI should amplify your voice, not replace it. Our system is
            designed with “Review-First” so you are always in control.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subtitle}>Why Trust Us</h2>
          <ul style={styles.list}>
            <li>No stock faces, no generic posts — your voice, your rules.</li>
            <li>Review-First workflow: nothing is published without approval.</li>
            <li>Brand guardrails to protect tone, style, and visual identity.</li>
          </ul>
        </section>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          © 2025 Genio Systems. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    margin: 0,
    padding: 0,
    background: "#0B1D3A",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "24px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  title: { margin: 0, fontSize: "28px", fontWeight: "bold" },
  main: { flex: 1, padding: "24px 16px", maxWidth: "800px", margin: "0 auto" },
  section: { marginBottom: "32px" },
  subtitle: { fontSize: "20px", marginBottom: "8px" },
  text: { fontSize: "16px", lineHeight: 1.5, color: "rgba(255,255,255,0.85)" },
  list: {
    margin: "12px 0 0",
    padding: "0 0 0 20px",
    color: "rgba(255,255,255,0.85)",
    fontSize: "16px",
    lineHeight: 1.6,
  },
  footer: {
    padding: "16px",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  },
  footerText: { fontSize: "14px", color: "rgba(255,255,255,0.7)" },
};
