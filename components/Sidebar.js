export default function Sidebar() {
  const links = [
    { name: "Overview", href: "/admin" },
    { name: "Users", href: "/admin/users" },
    { name: "Payments", href: "/admin/payments" },
    { name: "Subscriptions", href: "/admin/subscriptions" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="w-56 min-h-screen bg-white/5 border-r border-white/10 p-4">
      <h2 className="text-lg font-semibold mb-6">Admin</h2>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="px-3 py-2 rounded hover:bg-white/10"
          >
            {link.name}
          </a>
        ))}
      </nav>
    </aside>
  );
}
