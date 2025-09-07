"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const nav = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Services", path: "/services" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, Arial" }}>
        {/* Header */}
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
              gap: 14,
            }}
          >
            <img src="/genio-logo.png" alt="Genio" width={36} height={36} />
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontWeight: 700 }}>Smart Payment System</div>
              <div style={{ fontSize: 12, color: "#555" }}>Genio Systems</div>
            </div>

            <nav style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
              {nav.map((item) => {
                const active = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    style={{
                      textDecoration: "none",
                      fontWeight: 600,
                      padding: "6px 10px",
                      borderRadius: 8,
                      color: active ? "#1f2937" : "#374151",
                      background: active ? "#e5edff" : "transparent",
                    }}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>{children}</main>

        {/* Footer */}
        <footer
          style={{
            marginTop: 60,
            padding: "18px 16px",
            borderTop: "1px solid #e5e7eb",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Genio Systems
        </footer>
      </body>
    </html>
  );
}
