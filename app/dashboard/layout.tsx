// app/dashboard/layout.tsx
import Link from "next/link";
import React from "react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 text-slate-100 p-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-2 mb-6">
          <Image src="/genio-logo.png" alt="Genio logo" width={28} height={28} />
          <span className="font-bold text-lg leading-tight">GENIO OS</span>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          <Link href="/dashboard"
            className="block px-3 py-2 rounded text-slate-100 no-underline hover:bg-slate-800">
            🏠 Overview
          </Link>
          <Link href="/dashboard/money"
            className="block px-3 py-2 rounded text-slate-100 no-underline hover:bg-slate-800">
            💸 Money Router
          </Link>
          <Link href="/dashboard/transactions"
            className="block px-3 py-2 rounded text-slate-100 no-underline hover:bg-slate-800">
            📊 Transactions
          </Link>
          <Link href="/dashboard/kyc"
            className="block px-3 py-2 rounded text-slate-100 no-underline hover:bg-slate-800">
            🪪 KYC
          </Link>
          <Link href="/dashboard/aml"
            className="block px-3 py-2 rounded text-slate-100 no-underline hover:bg-slate-800">
            🛡️ AML
          </Link>
          <Link href="/dashboard/providers"
            className="block px-3 py-2 rounded text-slate-100 no-underline hover:bg-slate-800">
            ⚙️ Providers
          </Link>
          <Link href="/dashboard/settings"
            className="block px-3 py-2 rounded text-slate-100 no-underline hover:bg-slate-800">
            🔧 Settings
          </Link>
        </nav>
      </aside>

      {/* Main area (don’t force white) */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
