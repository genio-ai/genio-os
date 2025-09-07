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
        <header style={{
          width: "100%",
          borderBottom: "1px solid #e5e7eb",
          background: "#ffffff",
        }}>
          <div style={{
            maxWidth: 1100, margin: "0 auto", padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <img src="/genio-logo.png" alt="Genio" width={36} height={36} />
              <div style={{ lineHeight: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Smart</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Payment</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>System</div>
              </div>
            </Link>

            <nav style={{ display: "flex", gap: 8, marginLeft: 12 }}>
              {tabs.map(t => {
                const active = pathname === t.path;
                return (
                  <Link
                    key={t.path}
                    href={t.path}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 8,
                      textDecoration: "none",
                      color: active ? "#1f2937" : "#374151",
                      background: active ? "#e5edff" : "transparent",
                      fontWeight: 600
                    }}
                  >
                    {t.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: 16 }}>
          {children}
        </main>

        <footer style={{ padding: "24px 16px", textAlign: "center", color: "#6b7280" }}>
          © 2025 Genio Systems
        </footer>
      </body>
    </html>
  );
}
