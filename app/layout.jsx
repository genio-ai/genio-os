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
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <img src="/genio-logo.png" alt="Genio logo" width={36} height={36} />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Smart</div>
              <div style={{ fontSize: 14, color: "#6b7280" }}>Payment System</div>
            </div>

            <nav style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
              {tabs.map((t) => {
                const active = pathname === t.path;
                return (
                  <Link
                    key={t.path}
                    href={t.path}
                    style={{
                      textDecoration: "none",
                      fontWeight: 700,
                      padding: "8px 12px",
                      borderRadius: 8,
                      background: active ? "#e5edff" : "transparent",
                      color: active ? "#1f4ed8" : "#111827",
                    }}
                  >
                    {t.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        <main style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
          {children}
        </main>

        <footer
          style={{ padding: "40px 16px", color: "#6b7280", textAlign: "center" }}
        >
          © {new Date().getFullYear()} Genio Systems
        </footer>
      </body>
    </html>
  );
}
