// app/dashboard/layout.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";

// Link helper so styles apply to the real <a> tag (no blue underline)
function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} passHref legacyBehavior>
      <a className="block px-3 py-2 rounded text-slate-100 no-underline hover:bg-slate-800">
        {children}
      </a>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 text-slate-100 p-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-2 mb-6">
          <Image src="/genio-logo.png" alt="Genio logo" width={24} height={24} />
          <span className="font-bold text-lg leading-tight">GENIO OS</span>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          <NavItem href="/dashboard">🏠 Overview</NavItem>
          <NavItem href="/dashboard/money">💸 Money Router</NavItem>
          <NavItem href="/dashboard/transactions">📊 Transactions</NavItem>
          <NavItem href="/dashboard/kyc">🪪 KYC</NavItem>
          <NavItem href="/dashboard/aml">🛡️ AML</NavItem>
          <NavItem href="/dashboard/providers">⚙️ Providers</NavItem>
          <NavItem href="/dashboard/settings">🔧 Settings</NavItem>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
