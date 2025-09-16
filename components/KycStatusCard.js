import { useState } from "react";

export default function KycStatusCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // demo payload to send
  const [payload, setPayload] = useState({
    faceMatch: 0.82,
    liveness: 0.80,
    quality: 0.70,
    docValid: true,
    expiryValid: true
  });

  const runDecision = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "network_error", details: e.message });
    } finally {
      setLoading(false);
    }
  };

  const preset = (type) => {
    if (type === "approved") {
      setPayload({ faceMatch: 0.88, liveness: 0.86, quality: 0.75, docValid: true,  expiryValid: true });
    } else if (type === "review") {
      setPayload({ faceMatch: 0.76, liveness: 0.72, quality: 0.62, docValid: true,  expiryValid: true });
    } else if (type === "rejected") {
      setPayload({ faceMatch: 0.62, liveness: 0.60, quality: 0.50, docValid: false, expiryValid: false });
    }
  };

  const getBackground = (decision) => {
    if (decision === "approved") return "#064E3B";
    if (decision === "manual_review") return "#78350F";
    if (decision === "rejected") return "#7F1D1D";
    return "#111827";
  };

  const getBadgeStyle = (decision) => {
    const base = { padding: "6px 10px", borderRadius: 999, fontWeight: 600 };
    if (decision === "approved") return { ...base, background: "#16a34a", color: "#fff" };
    if (decision === "manual_review") return { ...base, background: "#f59e0b", color: "#111" };
    if (decision === "rejected") return { ...base, background: "#ef4444", color: "#fff" };
    return { ...base, background: "#334155", color: "#fff" };
  };

  const btn = { padding: "8px 12px", border: "none", borderRadius: 8, cursor: "pointer", color: "#fff" };
  const btnBlue = { ...btn, background: "#3B82F6" };
  const btnGray = { ...btn, background: "#334155" };

  return (
    <div style={{ background: "#0B1D3A", color: "#fff", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16 }}>
      <h2 style={{ marginTop: 0, marginBottom: 8 }}>KYC Status</h2>
      <p style={{ marginTop: 0, opacity: 0.85 }}>Run a demo decision and show the status card below.</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <button onClick={() => preset("approved")} style={btnGray}>Preset: Approved</button>
        <button onClick={() => preset("review")}   style={btnGray}>Preset: Review</button>
        <button onClick={() => preset("rejected")} style={btnGray}>Preset: Rejected</button>
      </div>

      <button onClick={runDecision} style={btnBlue}>
        {loading ? "Processing..." : "Run Decision"}
      </button>

      {result && (
        <div style={{ marginTop: 14, borderRadius: 10, padding: 14, background: getBackground(result.decision) }}>
          {"decision" in result ? (
            <>
              <div style={{ marginBottom: 8 }}>
                <span style={getBadgeStyle(result.decision)}>{result.decision}</span>
              </div>
              <div style={{ opacity: 0.9 }}>
                <div><strong>Risk score:</strong> {result.risk_score ?? "—"}</div>
                <div><strong>Reasons:</strong> {Array.isArray(result.reasons) ? result.reasons.join(", ") : "—"}</div>
              </div>
            </>
          ) : (
            <pre style={{ margin: 0 }}>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
