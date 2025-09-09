// pages/index.js
import Image from "next/image";

const wrap = { maxWidth: 900, margin: "0 auto", padding: "20px" };
const btn = {
  padding: "12px 18px",
  borderRadius: 10,
  textDecoration: "none",
  display: "inline-block",
  fontWeight: 600,
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
};
const btnPrimary = {
  ...btn,
  border: "none",
  background: "linear-gradient(90deg,#22d3ee,#10b981)",
  color: "#001015",
};
const btnGhost = { ...btn };
const card = {
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 14,
  padding: 16,
  background: "rgba(255,255,255,0.06)",
};

function StatCard({ title, value }) {
  return (
    <div style={card}>
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{title}</div>
      <div style={{ marginTop: 8, fontSize: 26, fontWeight: 700, color: "#fff" }}>{value}</div>
    </div>
  );
}

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0f1f", color: "#fff" }}>
      {/* Header */}
      <header style={{ ...wrap, display: "flex", alignItems: "center", gap: 10 }}>
        {/* ملاحظة: لازم يكون logo.png بخلفية شفافة */}
        <Image src="/logo.png" alt="Genio Logo" width={36} height={36} priority />
        <div style={{ fontSize: 20, fontWeight: 700 }}>Genio OS</div>
      </header>

      {/* Hero */}
      <section style={{ ...wrap, paddingTop: 10 }}>
        <h1
          style={{
            fontSize: 36,
            lineHeight: 1.2,
            fontWeight: 800,
            color: "#fff", // عنوان أبيض مثل ما طلبت
            marginBottom: 8,
          }}
        >
          Route payments smartly.
        </h1>
        <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 18, maxWidth: 720 }}>
          Send & accept payments globally — faster, cheaper, smarter.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <a href="#send" style={btnGhost}>Send Money</a>
          <a href="#receive" style={btnGhost}>Receive Money</a>
          <a href="/links" style={btnPrimary}>Create Payment Link</a>
          <a href="/dashboard" style={btnGhost}>Open Dashboard</a>
        </div>

        {/* Quick links */}
        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            marginTop: 16,
            fontSize: 14,
          }}
        >
          <a href="/pricing" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
            Pricing
          </a>
          <a href="/docs" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
            Docs
          </a>
          <a href="/compliance" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
            Compliance
          </a>
          <a href="/support" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>
            Support
          </a>
        </div>
      </section>

      {/* Providers */}
      <section style={{ ...wrap, marginTop: 28 }}>
        <div style={{ opacity: 0.8, fontSize: 14, marginBottom: 10 }}>Powered by</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px,1fr))", gap: 10 }}>
          <div style={card}>Wise</div>
          <div style={card}>Flutterwave</div>
          <div style={card}>PayGate</div>
          <div style={card}>Stripe</div>
        </div>
      </section>

      {/* Stats */}
      <section
        style={{
          ...wrap,
          marginTop: 24,
          marginBottom: 40,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 14,
        }}
      >
        <StatCard title="Settlement Speed" value="< 1h avg" />
        <StatCard title="Fees Saved" value="30–50%" />
        <StatCard title="Uptime" value="99.9%" />
      </section>
    </main>
  );
}
