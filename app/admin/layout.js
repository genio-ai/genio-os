"use client";

// super-visible Topbar (no imports)
function Topbar() {
  return (
    <header
      className="w-full h-16 flex items-center justify-between px-4"
      style={{ background: "#16a34a", color: "#0b0f17" }} // GREEN bar so it's obvious
    >
      <strong style={{ letterSpacing: 0.4 }}>GENIO ADMIN</strong>
      <nav className="flex items-center gap-4 text-sm">
        <a href="/" style={{ textDecoration: "underline" }}>Home</a>
        <a href="/admin" style={{ textDecoration: "underline" }}>Dashboard</a>
      </nav>
    </header>
  );
}

// super-visible Sidebar (no imports)
function Sidebar() {
  return (
    <aside
      className="h-[calc(100vh-4rem)] p-4"
      style={{
        width: 240,
        background: "#111827",      // dark slate
        borderRight: "3px solid #16a34a"
      }}
    >
      <h2 className="text-lg font-semibold mb-4" style={{ color: "#a7f3d0" }}>
        Admin Menu
      </h2>
      <nav className="flex flex-col gap-3 text-sm">
        <a href="/admin" className="hover:underline">Overview</a>
        <a href="/admin/users" className="hover:underline">Users</a>
        <a href="/admin/payments" className="hover:underline">Payments</a>
        <a href="/admin/subscriptions" className="hover:underline">Subscriptions</a>
        <a href="/admin/settings" className="hover:underline">Settings</a>
      </nav>
    </aside>
  );
}

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen" style={{ background: "#0b0f17", color: "white" }}>
      <Topbar />
      <div className="flex">
        <Sidebar />
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
