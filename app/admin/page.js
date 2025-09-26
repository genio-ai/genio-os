import Link from "next/link";

export default function Page() {
  return (
    <main style={{ maxWidth: 1100, margin: "48px auto", padding: 24 }}>
      <h1 style={{ fontSize: 28, margin: 0, marginBottom: 20, letterSpacing: 0.3 }}>
        Admin Dashboard
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <Card href="/admin/users" label="Users" />
        <Card href="/admin/payments" label="Payments" />
        <Card href="/admin/subscriptions" label="Subscriptions" />
        <Card href="/admin/events" label="Events" />
        <Card href="/admin/jobs" label="Jobs" />
        <Card href="/admin/twins" label="Twins" />
        <Card href="/admin/knowledge" label="Knowledge" />
        <Card href="/admin/settings" label="Settings" />
      </div>
    </main>
  );
}

function Card({ href, label }) {
  const base = {
    display: "block",
    padding: 18,
    borderRadius: 12,
    textDecoration: "none",
    color: "#e6e8ee",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
    transition: "transform .15s ease, box-shadow .15s ease, border-color .15s ease",
    fontWeight: 600,
    textAlign: "center",
  };

  const hover = {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
    borderColor: "rgba(118,178,255,0.35)",
  };

  return (
    <Link
      href={href}
      style={base}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, hover)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, base)}
    >
      {label}
    </Link>
  );
}
