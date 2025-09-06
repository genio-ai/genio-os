// app/dashboard/layout.tsx
import Link from "next/link";
import React from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "linear-gradient(135deg,#0a0f1c,#122240)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: 0.5 }}>
          GENIO <span style={{ opacity: 0.7 }}>OS</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <NavItem href="/dashboard" label="Overview" emoji="🏠" />
          <Divider label="Money OS" />
          <NavItem href="/dashboard/money" label="Money Router" emoji="💸" />
          <NavItem href="/dashboard/transactions" label="Transactions" emoji="📈" />
          <Divider label="Compliance" />
          <NavItem href="/dashboard/kyc" label="KYC" emoji="🪪" />
          <NavItem href="/dashboard/aml" label="AML" emoji="🛡️" />
          <Divider label="System" />
          <NavItem href="/dashboard/providers" label="Providers" emoji="🔗" />
          <NavItem href="/dashboard/settings" label="Settings" emoji="⚙️" />
        </nav>

        <div style={{ marginTop: "auto", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
          v0.1 • AI-built, AI-run
        </div>
      </aside>

      {/* Main area */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ color: "#c9d8ff", fontWeight: 600 }}>Genio Money OS Dashboard</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusPill color="#22c55e" text="Live" />
            <Link
              href="/"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: 13,
                padding: "6px 10px",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
              }}
            >
              Home
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ padding: 20 }}>{children}</main>
      </section>
    </div>
  );
}

function NavItem({ href, label, emoji }: { href: string; label: string; emoji: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "#eaf1ff",
        textDecoration: "none",
        fontSize: 14,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <span style={{ fontSize: 16 }}>{emoji}</span>
      <span>{label}</span>
    </Link>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div style={{ margin: "10px 4px 4px", fontSize: 11, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: 0.6 }}>
      {label}
    </div>
  );
}

function StatusPill({ color, text }: { color: string; text: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        color: "#fff",
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.15)",
        background: "rgba(255,255,255,0.06)",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      {text}
    </span>
  );
}
