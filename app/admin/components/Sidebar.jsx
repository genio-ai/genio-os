"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/sessions", label: "Sessions" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/twins", label: "Twins" },
  { href: "/admin/jobs", label: "Media Jobs" },
  { href: "/admin/knowledge", label: "Knowledge" },
  { href: "/admin/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="h-screen border-r bg-white p-4 sticky top-0">
      <div className="mb-6">
        <div className="text-xl font-bold">Genio OS</div>
        <div className="text-xs text-gray-500">Admin Console</div>
      </div>
      <nav className="space-y-1">
        {nav.map((i) => {
          const active = pathname === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              className={`block rounded px-3 py-2 text-sm ${active ? "bg-black text-white" : "hover:bg-gray-100"}`}
            >
              {i.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
