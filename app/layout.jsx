"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const tabs = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Services", path: "/services" },
    { name: "Settings", path: "/settings" },
  ];

  const isActive = (path) => (pathname === path ? "active" : "");

  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.brand}>
            <span style={{ fontWeight: 700 }}>Smart Payment System</span>
          </div>

          <nav style={styles.nav}>
            {tabs.map((t) => (
              <Link
                key={t.path}
                href={t.path}
                style={{
                  ...styles.link,
                  ...(isActive(t.path) ? styles.linkActive : {}),
                }}
              >
                {t.name}
              </Link>
            ))}
          </nav>
        </header>

        {/* Main content */}
        <main style={styles.main}>{children}</main>

        {/* Footer */}
        <footer style={styles.footer}>
          © {new Date().getFullYear()} Genio Systems
        </footer>
      </body>
    </html>
  );
}

const styles = {
  header: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    background: "#ffffff",
    zIndex: 10,
    fontFamily: "system-ui, Arial, sans-serif",
  },
  brand: { display: "flex", gap: 8, alignItems: "center" },
  nav: { display: "flex", gap: 14 },
  link: {
    padding: "8px 10px",
    textDecoration: "none",
    color: "#111827",
    borderRadius: 8,
    fontWeight: 500,
  },
  linkActive: {
    background: "#111827",
    color: "#ffffff",
  },
  main: {
    maxWidth: 1100,
    margin: "24px auto",
    padding: "0 16px",
    minHeight: "60vh",
    fontFamily: "system-ui, Arial, sans-serif",
  },
  footer: {
    textAlign: "center",
    padding: "24px 0",
    color: "#6b7280",
    borderTop: "1px solid #e5e7eb",
    fontFamily: "system-ui, Arial, sans-serif",
  },
};
