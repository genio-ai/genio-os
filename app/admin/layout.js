"use client";

// Inline Topbar (no imports)
function Topbar() {
  return (
    <header className="w-full h-14 border-b border-white/10 bg-white/5 backdrop-blur flex items-center px-4">
      <div className="text-sm font-semibold tracking-wide">Genio Admin</div>
      <nav className="ml-auto flex items-center gap-4 text-sm">
        <a href="/" className="opacity-80 hover:opacity-100">Home</a>
        <a href="/admin" className="opacity-80 hover:opacity-100">Dashboard</a>
      </nav>
    </header>
  );
}

// Inline Sidebar (no imports)
function Sidebar() {
  return (
    <aside className="w-60 h-[calc(100vh-3.5rem)] bg-white/5 border-r border-white/10 p-4 flex flex-col">
      <h2 className="text-lg font-semibold mb-6">Admin Menu</h2>
      <nav className="flex flex-col gap-3 text-sm">
        <a href="/admin" className="opacity-80 hover:opacity-100">Overview</a>
        <a href="/admin/users" className="opacity-80 hover:opacity-100">Users</a>
        <a href="/admin/payments" className="opacity-80 hover:opacity-100">Payments</a>
        <a href="/admin/subscriptions" className="opacity-80 hover:opacity-100">Subscriptions</a>
        <a href="/admin/settings" className="opacity-80 hover:opacity-100">Settings</a>
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children }) {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
