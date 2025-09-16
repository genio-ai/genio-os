import KycStatusCard from "../components/KycStatusCard";

export default function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B1D3A",
        color: "#fff",
        fontFamily: "-apple-system, Segoe UI, Roboto, Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 32 }}>Dashboard</h1>
      <p style={{ opacity: 0.85, marginBottom: 20 }}>
        Track your KYC status and recent activity.
      </p>

      {/* Live decision card (new) */}
      <KycStatusCard />

      {/* Quick Action card */}
      <div
        style={{
          background: "#064E3B",
          borderRadius: 12,
          padding: 16,
          marginTop: 20,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Quick Action</h2>
        <button
          style={{
            background: "#10B981",
            color: "#fff",
            border: "none",
            padding: "8px 12px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Start New KYC
        </button>
      </div>

      {/* API Keys card */}
      <div
        style={{
          background: "#1E293B",
          borderRadius: 12,
          padding: 16,
          marginTop: 20,
        }}
      >
        <h2 style={{ marginTop: 0 }}>API Keys</h2>
        <p>Test Key: demo_123456</p>
      </div>

      {/* Recent Activity card */}
      <div
        style={{
          background: "#1E293B",
          borderRadius: 12,
          padding: 16,
          marginTop: 20,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Recent Activity</h2>
        <ul>
          <li>2025-09-15 — KYC Submission — Pending</li>
          <li>2025-09-10 — API Call /attest (test) — Success</li>
        </ul>
      </div>
    </div>
  );
}
