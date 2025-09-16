// components/KycStatusCard.js
import { useState } from "react";

export default function KycStatusCard() {
  const [result, setResult] = useState(null);
  const [preset, setPreset] = useState("approved");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset }) // approved | review | rejected
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "network_error", details: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const badge = (d) => {
    const base = { padding: "6px 10px", borderRadius: 999, fontWeight: 700 };
    if (d === "approved") return { ...base, background: "#16a34a", color: "#fff" };
    if (d === "manual_review") return { ...base, background: "#f59e0b", color: "#111" };
    return { ...base, background: "#ef4444", color: "#fff" };
  };

  const panel = (d) => {
    if (d === "approved") return { background: "#065F46", border: "1px solid #10B981" };
    if (d === "manual_review") return { background: "#7C3E0C", border: "1px solid #F59E0B" };
    return { background: "#7F1D1D", border: "1px solid #EF4444" };
  };

  const btn = {
    padding: "8px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "#334155",
    color: "#fff",
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
        <button
          onClick={() => setPreset("approved")}
          style={{ ...btn, background: preset === "approved" ? "#1D4ED8" : "#334155" }}
        >
          Preset: Approved
        </button>
        <button
          onClick={() => setPreset("review")}
          style={{ ...btn, background: preset === "review" ? "#1D4ED8" : "#334155" }}
        >
          Preset: Review
        </button>
        <button
          onClick={() => setPreset("rejected")}
          style={{ ...btn, background: preset === "rejected" ? "#1D4ED8" : "#334155" }}
        >
          Preset: Rejected
        </button>
      </div>

      <button
        onClick={send}
        style={{ ...btn, background: "#3B82F6", fontWeight: 700 }}
        disabled={loading}
      >
        {loading ? "Processing..." : "Run Decision"}
      </button>

      {/* Result */}
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
