// components/KycStatusCard.js
import { useState } from "react";

export default function KycStatusCard() {
  const [result, setResult] = useState(null);
  const [preset, setPreset] = useState("approved");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset }) // approved | review | rejected
      });
      const data = await r.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  // --- Button styles (always colored, darker when selected) ---
  const pill = (type) => {
    const base = {
      padding: "8px 12px",
      borderRadius: 999,
      fontWeight: 600,
      color: "#fff",
      border: "1px solid transparent",
      cursor: "pointer",
    };
    const active = { filter: "brightness(0.9)", borderColor: "rgba(255,255,255,0.35)" };

    if (type === "approved") {
      return { ...base, background: "#16a34a", ...(preset === "approved" ? active : {}) };
    }
    if (type === "review") {
      return { ...base, background: "#f59e0b", color: "#111", ...(preset === "review" ? active : {}) };
    }
    return { ...base, background: "#dc2626", ...(preset === "rejected" ? active : {}) };
  };

  // --- Result styles ---
  const panel = (d) => {
    if (d === "approved") return { background: "#065F46", border: "1px solid #10B981" };
    if (d === "manual_review") return { background: "#7C3E0C", border: "1px solid #F59E0B" };
    return { background: "#7F1D1D", border: "1px solid #EF4444" };
  };
  const badge = (d) => {
    const base = { padding: "6px 10px", borderRadius: 999, fontWeight: 700 };
    if (d === "approved") return { ...base, background: "#16a34a", color: "#fff" };
    if (d === "manual_review") return { ...base, background: "#f59e0b", color: "#111" };
    return { ...base, background: "#dc2626", color: "#fff" };
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <button style={pill("approved")} onClick={() => setPreset("approved")}>
          Preset: Approved
        </button>
        <button style={pill("review")} onClick={() => setPreset("review")}>
          Preset: Review
        </button>
        <button style={pill("rejected")} onClick={() => setPreset("rejected")}>
          Preset: Rejected
        </button>
      </div>

      <button
        onClick={run}
        disabled={loading}
        style={{
          padding: "8px 12px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          background: "#3B82F6",
          color: "#fff",
          fontWeight: 700
        }}
      >
        {loading ? "Processing..." : "Run Decision"}
      </button>

      {result && !result.error && (
        <div style={{ ...panel(result.decision), marginTop: 16, borderRadius: 12, padding: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={badge(result.decision)}>{result.decision}</span>
          </div>

          <div style={{ marginTop: 6, lineHeight: 1.6 }}>
            <div><strong>Risk score:</strong> {result.risk_score}</div>
            <div style={{ marginTop: 6 }}>
              <strong>Reasons:</strong>
              <ul style={{ margin: "6px 0 0 18px" }}>
                {Array.isArray(result.reasons) && result.reasons.length > 0 ? (
                  result.reasons.map((r, i) => <li key={i}>{r}</li>)
                ) : (
                  <li>none</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {result?.error && (
        <div style={{ marginTop: 14, color: "#FCA5A5" }}>
          Error: {result.error} — {result.details}
        </div>
      )}
    </div>
  );
}
