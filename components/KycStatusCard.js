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
        body: JSON.stringify({ preset })
      });
      const data = await r.json();
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  const bg =
    result?.decision === "approved"
      ? "#0f5132"
      : result?.decision === "manual_review"
      ? "#7c4a03"
      : "#842029";

  const chipBg =
    result?.decision === "approved"
      ? "#198754"
      : result?.decision === "manual_review"
      ? "#f59e0b"
      : "#dc3545";

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => setPreset("approved")}>Preset: Approved</button>
        <button onClick={() => setPreset("review")}>Preset: Review</button>
        <button onClick={() => setPreset("rejected")}>Preset: Rejected</button>
      </div>

      <button onClick={run} disabled={loading} style={{ padding: "6px 12px" }}>
        {loading ? "Processing..." : "Run Decision"}
      </button>

      {result && (
        <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: bg }}>
          <div style={{ marginBottom: 6 }}>
            <span
              style={{
                background: chipBg,
                color: "#fff",
                padding: "4px 10px",
                borderRadius: 999,
                fontWeight: 700
              }}
            >
              {result.decision}
            </span>
          </div>

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
      )}
    </div>
  );
}
