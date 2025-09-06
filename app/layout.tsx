"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
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
              maxWidth: 1080,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
            }}
          >
            {/* Logo */}
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
              }}
            >
              <img src="/genio-logo.png" alt="Genio Logo" height={36} />
            </Link>

            <span style={{ fontSize: 12, color: "#6b7280" }}>
              Smart Payment System
            </span>

            {/* Navigation */}
            <nav
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: 20,
                alignItems: "center",
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  style={{
                    textDecoration: "none",
                    fontWeight: pathname === link.path ? "bold" : "normal",
                    color: pathname === link.path ? "#2563eb" : "#111827",
                    padding: "6px 10px",
                    borderRadius: 4,
                    backgroundColor:
                      pathname === link.path ? "rgba(37,99,235,0.1)" : "transparent",
                    transition: "all 0.2s ease-in-out",
                  }}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mascot */}
              <img
                src="/genio-mascot.png"
                alt="Genio Mascot"
                height={32}
                style={{ marginLeft: 12 }}
              />
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "24px 16px",
            minHeight: "70vh",
          }}
        >
          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            maxWidth: 1080,
            margin: "0 auto",
            padding: "24px 16px",
            fontSize: 12,
            color: "#6b7280",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Genio Systems
        </footer>
      </body>
    </html>
  );
}
