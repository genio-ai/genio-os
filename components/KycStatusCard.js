import { useState } from "react";

export default function KycStatusCard() {
  const [decision, setDecision] = useState(null);

  const runDecision = async (preset) => {
    try {
      const response = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset })
      });
      const data = await response.json();
      setDecision(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div style={{ background: "#0d1b2a", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
      <h2>KYC Status</h2>
      <p>Run a demo decision and show the status card below.</p>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => runDecision("approved")}>Preset: Approved</button>
        <button onClick={() => runDecision("review")}>Preset: Review</button>
        <button onClick={() => runDecision("rejected")}>Preset: Rejected</button>
      </div>

      <button onClick={() => runDecision(null)}>Run Decision</button>

      {decision && (
        <div style={{
          marginTop: "15px",
          padding: "15px",
          borderRadius: "6px",
          background: decision.decision === "approved"
            ? "green"
            : decision.decision === "review"
            ? "orange"
            : "red"
        }}>
          <p><strong>{decision.decision}</strong></p>
          <p>Risk score: {decision.risk_score}</p>
          <p>Reasons: {decision.reasons?.join(", ")}</p>
        </div>
      )}
    </div>
  );
}
