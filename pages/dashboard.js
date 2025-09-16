import KycStatusCard from "../components/KycStatusCard";// pages/dashboard.js
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null); // { status, scores:{face,liveness}, tx, updatedAt }

  async function loadStatus() {
    try {
      setErr("");
      setLoading(true);
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setErr("Failed to load status. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  const face = data?.scores?.face ?? null;
  const live = data?.scores?.liveness ?? null;

  return (
    <main className="page container" style={{ paddingBottom: 40 }}>
      <h1 className="h1">Dashboard</h1>
      <p className="muted">Track your KYC status and recent activity.</p>

      {/* KYC Status */}
      <section
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 16,
          background:
            "linear-gradient(135deg, rgba(37,99,235,.25), rgba(56,189,248,.25))",
          border: "1px solid rgba(255,255,255,.14)",
        }}
      >
        <h2 className="h2" style={{ marginBottom: 8 }}>
          KYC Status
        </h2>

        {loading && <div className="muted">Loading…</div>}

        {!loading && err && (
          <div style={{ color: "#ffb4b4", fontWeight: 700 }}>{err}</div>
        )}

        {!loading && !err && (
          <>
            <div className="muted" style={{ marginBottom: 8 }}>
              Current status:{" "}
              <b>{data?.status ? String(data.status) : "—"}</b>
            </div>

            <div className="muted" style={{ marginBottom: 8 }}>
              Face match: <b>{face != null ? face.toFixed(2) : "—"}</b> •
              {"  "}
              Liveness: <b>{live != null ? live.toFixed(2) : "—"}</b>
            </div>

            {data?.tx && (
              <div className="muted" style={{ wordBreak: "break-all" }}>
                Tx: <code>{data.tx}</code>
              </div>
            )}

            {data?.updatedAt && (
              <div
                className="muted"
                style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}
              >
                Updated: {new Date(data.updatedAt).toLocaleString()}
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button className="btn btn-secondary" onClick={loadStatus}>
            Refresh
          </button>
        </div>
      </section>

      {/* Quick Action */}
      <section
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 16,
          background:
            "linear-gradient(135deg, rgba(34,197,94,.25), rgba(16,185,129,.25))",
          border: "1px solid rgba(255,255,255,.14)",
        }}
      >
        <h3 className="h3" style={{ marginBottom: 8 }}>
          Quick Action
        </h3>
        <a href="#how" className="btn btn-primary">
          Start New KYC
        </a>
      </section>

      {/* API Keys (demo) */}
      <section
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 16,
          background:
            "linear-gradient(135deg, rgba(147,51,234,.25), rgba(34,211,238,.25))",
          border: "1px solid rgba(255,255,255,.14)",
        }}
      >
        <h3 className="h3" style={{ marginBottom: 8 }}>
          API Keys
        </h3>
        <div className="muted">
          Test Key: <span style={{ opacity: 0.9 }}>demo_123456</span>
        </div>
      </section>

      {/* Recent Activity (static demo) */}
      <section
        style={{
          marginTop: 18,
          padding: 16,
          borderRadius: 16,
          background: "rgba(255,255,255,.03)",
          border: "1px solid rgba(255,255,255,.14)",
        }}
      >
        <h2 className="h2" style={{ marginBottom: 8 }}>
          Recent Activity
        </h2>
        <div className="muted">
          2025-09-15 — KYC Submission — Pending
          <br />
          2025-09-10 — API Call /attest (test) — Success
        </div>
      </section>
    </main>
  );
}
