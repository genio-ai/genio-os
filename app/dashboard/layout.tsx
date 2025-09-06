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
          <span className="font-bold text-lg">GENIO OS</span>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="px-3 py-2 rounded hover:bg-slate-800 no-underline text-slate-100"
          >
            🏠 Overview
          </Link>
          <Link
            href="/dashboard/money"
            className="px-3 py-2 rounded hover:bg-slate-800 no-underline text-slate-100"
          >
            💸 Money Router
          </Link>
          <Link
            href="/dashboard/transactions"
            className="px-3 py-2 rounded hover:bg-slate-800 no-underline text-slate-100"
          >
            📊 Transactions
          </Link>
          <Link
            href="/dashboard/kyc"
            className="px-3 py-2 rounded hover:bg-slate-800 no-underline text-slate-100"
          >
            🪪 KYC
          </Link>
          <Link
            href="/dashboard/aml"
            className="px-3 py-2 rounded hover:bg-slate-800 no-underline text-slate-100"
          >
            🛡️ AML
          </Link>
          <Link
            href="/dashboard/providers"
            className="px-3 py-2 rounded hover:bg-slate-800 no-underline text-slate-100"
          >
            ⚙️ Providers
          </Link>
          <Link
            href="/dashboard/settings"
            className="px-3 py-2 rounded hover:bg-slate-800 no-underline text-slate-100"
          >
            🔧 Settings
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white">
        {children}
      </main>
    </div>
  );
}
