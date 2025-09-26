import Link from "next/link";

export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>Admin Dashboard</h1>
      <nav style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <Link href="/admin/users">Users</Link>
        <Link href="/admin/payments">Payments</Link>
        <Link href="/admin/subscriptions">Subscriptions</Link>
        <Link href="/admin/events">Events</Link>
        <Link href="/admin/jobs">Jobs</Link>
        <Link href="/admin/twins">Twins</Link>
        <Link href="/admin/knowledge">Knowledge</Link>
        <Link href="/admin/settings">Settings</Link>
      </nav>
    </main>
  );
}
