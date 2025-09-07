"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Services", path: "/services" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, Arial",
          background: "#f9fafb",
        }}
      >
        {/* Header */}
        <header
          style={{
            width: "100%",
            borderBottom: "1px solid #e5e7eb",
            background: "#ffffff",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src="/genio-logo.png" alt="Genio Logo" height={40} />
            <span style={{ fontWeight: "bold", fontSize: "18px" }}>
              Genio OS
            </span>
          </div>

          {/* Navigation */}
          <nav style={{ display: "flex", gap: "16px" }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                style={{
                  textDecoration: "none",
                  color: pathname === link.path ? "#2563eb" : "#374151",
                  fontWeight: pathname === link.path ? "bold" : "normal",
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </header>

        {/* Page Content */}
        <main style={{ padding: "24px" }}>{children}</main>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "12px",
            marginTop: "40px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          © {new Date().getFullYear()} Genio Systems
        </footer>
      </body>
    </html>
  );
}
