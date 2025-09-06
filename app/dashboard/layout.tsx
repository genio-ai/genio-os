import React from "react";
import Link from "next/link";
import Image from "next/image";

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
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 p-4 flex flex-col">
        <div className="flex items-center mb-8">
          <Image src="/logo.png" alt="Genio Logo" width={40} height={40} />
          <span className="ml-3 font-bold text-lg">Genio OS</span>
        </div>
        <nav className="space-y-2">
          <NavItem href="/dashboard">Dashboard</NavItem>
          <NavItem href="/dashboard/profile">Profile</NavItem>
          <NavItem href="/dashboard/settings">Settings</NavItem>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
