import { useState } from "react";

export default function KycStatusCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runDecision = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Demo values — replace later with real capture results
        body: JSON.stringify({
          faceMatch: 0.82,
          liveness: 0.80,
          quality: 0.70,
          docValid: true,
          expiryValid: true
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "network_error", details: e.message });
    } finally {
      setLoading(false);
    }
  };

  const badge = (d) => {
    const base = { padding:"6px 10px", borderRadius:999, fontWeight:600, display:"inline-block" };
    if (d === "approved") return { ...base, background:"#16a34a", color:"#fff" };
    if (d === "manual_review") return { ...base, background:"#f59e0b", color:"#111" };
    return { ...base, background:"#ef4444", color:"#fff" };
  };

  return (
    <div style={{ background:"#0B1D3A", color:"#fff", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:16 }}>
      <h2 style={{ marginTop:0, marginBottom:8 }}>KYC Status</h2>
      <p style={{ marginTop:0, opacity:.85 }}>Run a demo decision and show the status card below.</p>

      <button
        onClick={runDecision}
        style={{ background:"#3B82F6", color:"#fff", border:"none", padding:"10px 14px", borderRadius:8, cursor:"pointer" }}
      >
        {loading ? "Processing..." : "Run Decision"}
      </button>

      {result && (
        <div style={{ marginTop:14, background:"#111827", borderRadius:10, padding:14 }}>
          {"decision" in result ? (
            <>
              <div style={{ marginBottom:8 }}>
                <span style={badge(result.decision)}>{result.decision}</span>
              </div>
              <div style={{ opacity:.9 }}>
                <div><strong>Risk score:</strong> {result.risk_score ?? "—"}</div>
                <div><strong>Reasons:</strong> {Array.isArray(result.reasons) ? result.reasons.join(", ") : "—"}</div>
              </div>
            </>
          ) : (
            <pre style={{ margin:0 }}>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
