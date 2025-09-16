// pages/dashboard.js
import KycStatusCard from "../components/KycStatusCard";

function Card({ title, children, style = {} }) {
  return (
    <section
      style={{
        background: "#0F172A",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: 18,
        marginTop: 20,
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        ...style,
      }}
    >
      {title && (
        <h2 style={{ margin: 0, marginBottom: 10, fontSize: 22, letterSpacing: 0.2 }}>
          {title}
        </h2>
      )}
      <div>{children}</div>
    </section>
  );
}

export default function Dashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B1D3A",
        color: "#fff",
        fontFamily: "-apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      <header
        style={{
          padding: "28px 16px 8px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 8,
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 38, lineHeight: 1.2 }}>Dashboard</h1>
          <p style={{ opacity: 0.85, margin: "6px 0 0" }}>
            Track your KYC status and recent activity.
          </p>
        </div>
      </header>

      <main style={{ padding: "0 16px 36px" }}>
        <div style={{ maxWidth: 980, margin: "0 auto" }}>
          <Card title="KYC Status">
            <KycStatusCard />
          </Card>

          <Card title="Quick Action" style={{ background: "#063A2D" }}>
            <button
              style={{
                background: "#10B981",
                color: "#0B1D3A",
                fontWeight: 700,
                border: "none",
                padding: "10px 14px",
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              Start New KYC
            </button>
          </Card>

          <Card title="API Keys">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div style={{ opacity: 0.9 }}>
                Test Key: <code>demo_123456</code>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  style={{
                    background: "#334155",
                    color: "#fff",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Copy
                </button>
                <button
                  style={{
                    background: "transparent",
                    color: "#93C5FD",
                    border: "1px solid #1D4ED8",
                    padding: "8px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Rotate
                </button>
              </div>
            </div>
          </Card>

          <Card title="Recent Activity">
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
              <li>2025-09-15 — KYC Submission — Pending</li>
              <li>
                2025-09-10 — API Call <code>/attest</code> (test) — Success
              </li>
            </ul>
          </Card>
        </div>
      </main>
    </div>
  );
}
