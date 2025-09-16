import { useState } from "react";

export default function KycTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDecision = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faceMatch: 0.76,
          liveness: 0.82,
          quality: 0.65,
          docValid: true,
          expiryValid: true,
        }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Network error", details: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0B1D3A", color: "#fff", padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>KYC Decision Test</h1>
      <p>Click the button to send test data to <code>/api/decision</code> and see the result.</p>
      <button
        onClick={runDecision}
        style={{
          background: "#3B82F6",
          color: "#fff",
          border: "none",
          padding: "12px 20px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "10px"
        }}
      >
        {loading ? "Loading..." : "Run Decision Test"}
      </button>

      {result && (
        <pre style={{ marginTop: "20px", background: "#111827", padding: "15px", borderRadius: "6px", overflowX: "auto" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
