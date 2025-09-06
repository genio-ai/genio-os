export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial" }}>
        {/* Header */}
        <header style={{
          width: "100%",
          borderBottom: "1px solid #eee",
          background: "#fff"
        }}>
          <div style={{
            maxWidth: 1080,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px"
          }}>
            {/* Logo */}
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <img src="/genio-logo.png" alt="Genio Logo" height={36} />
            </a>

            <span style={{ fontSize: 12, color: "#6b7280" }}>Smart Payment System</span>

            {/* Nav */}
            <nav style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
              <a href="/" style={{ color: "#111827", textDecoration: "none" }}>Home</a>
              <a href="/dashboard" style={{ color: "#111827", textDecoration: "none" }}>Dashboard</a>
              <a href="/services" style={{ color: "#111827", textDecoration: "none" }}>Services</a>
              <a href="/settings" style={{ color: "#111827", textDecoration: "none" }}>Settings</a>
              {/* Mascot */}
              <img src="/genio-mascot.png" alt="Genio Mascot" height={28} style={{ marginLeft: 8 }} />
            </nav>
          </div>
        </header>

        {/* Page container */}
        <main style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 16px" }}>
          {children}
        </main>

        <footer style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 16px", fontSize: 12, color: "#6b7280" }}>
          © Genio
        </footer>
      </body>
    </html>
  );
}
