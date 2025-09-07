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

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial" }}>
        <header
          style={{
            width: "100%",
            borderBottom: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 16px",
            }}
          >
            <img src="/genio-logo.png" alt="Genio" height={32} />
            <div style={{ fontWeight: 600 }}>Smart Payment System</div>

            <nav style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
              {tabs.map((t) => (
                <Link
                  key={t.path}
                  href={t.path}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: pathname === t.path ? "#e5edff" : "transparent",
                    color: pathname === t.path ? "#1e40af" : "#111827",
                    textDecoration: "none",
                    fontWeight: pathname === t.path ? 700 : 500,
                  }}
                >
                  {t.name}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
          {children}
        </main>

        <footer style={{ textAlign: "center", padding: "24px 0", color: "#6b7280" }}>
          © {new Date().getFullYear()} Genio Systems
        </footer>
      </body>
    </html>
  );
}
