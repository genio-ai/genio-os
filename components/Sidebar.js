"use client";

export default function Sidebar() {
  return (
    <aside className="w-60 h-screen bg-white/5 border-r border-white/10 p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-6">Admin Menu</h2>
      <nav className="flex flex-col gap-3 text-sm">
        <a href="/admin" className="opacity-80 hover:opacity-100">Dashboard</a>
        <a href="/admin/users" className="opacity-80 hover:opacity-100">Users</a>
        <a href="/admin/payments" className="opacity-80 hover:opacity-100">Payments</a>
        <a href="/admin/settings" className="opacity-80 hover:opacity-100">Settings</a>
      </nav>
    </aside>
  );
}
