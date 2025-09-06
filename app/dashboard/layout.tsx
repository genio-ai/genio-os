// app/dashboard/layout.tsx

import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "#0f172a",
          color: "white",
          padding: "16px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
          <Image src="/genio-logo.png" alt="Genio logo" width={28} height={28} />
          <span style={{ fontWeight: "bold", fontSize: "18px" }}>GENIO OS</span>
        </div>

        {/* Menu */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link href="/dashboard">🏠 Overview</Link>
          <Link href="/dashboard/money">💸 Money Router</Link>
          <Link href="/dashboard/transactions">📊 Transactions</Link>
          <Link href="/dashboard/kyc">🪪 KYC</Link>
          <Link href="/dashboard/aml">🛡️ AML</Link>
          <Link href="/dashboard/providers">⚙️ Providers</Link>
          <Link href="/dashboard/settings">🔧 Settings</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, background: "white", padding: "24px" }}>
        {children}
      </main>
    </div>
  );
}
