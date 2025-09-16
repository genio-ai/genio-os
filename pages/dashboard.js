import KycStatusCard from "../components/KycStatusCard";

export default function Dashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "#0B1D3A", color: "#fff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px" }}>
        <h1 style={{ margin: 0, fontSize: 36 }}>Dashboard</h1>
        <p style={{ opacity: 0.85 }}>Track your KYC status and recent activity.</p>

        <section style={{
          marginTop: 16, padding: 16, borderRadius: 12, background: "#0F172A",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <h2 style={{ marginTop: 0 }}>KYC Status</h2>
          <p>Run a demo decision and show the status card below.</p>
          <KycStatusCard />
        </section>

        <section style={{
          marginTop: 16, padding: 16, borderRadius: 12, background: "#063A2D",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <h2 style={{ marginTop: 0 }}>Quick Action</h2>
          <button style={{ padding: "8px 12px", background: "#10B981", color: "#0B1D3A",
            border: "none", borderRadius: 8, fontWeight: 700 }}>
            Start New KYC
          </button>
        </section>

        <section style={{
          marginTop: 16, padding: 16, borderRadius: 12, background: "#0F172A",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <h2 style={{ marginTop: 0 }}>API Keys</h2>
          <div>Test Key: <code>demo_123456</code></div>
        </section>

        <section style={{
          marginTop: 16, padding: 16, borderRadius: 12, background: "#0F172A",
          border: "1px solid rgba(255,255,255,0.08)"
        }}>
          <h2 style={{ marginTop: 0 }}>Recent Activity</h2>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li>2025-09-15 — KYC Submission — Pending</li>
            <li>2025-09-10 — API Call <code>/attest</code> (test) — Success</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
