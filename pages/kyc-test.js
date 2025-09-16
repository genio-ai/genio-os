// pages/kyc-test.js
import { useState } from "react";

export default function KycTest() {
  const [sessionId, setSessionId] = useState("");

  async function startNewKyc() {
    const r = await fetch("/api/kyc/sessions", { method: "POST" });
    const j = await r.json();
    setSessionId(j.sessionId || "error");
  }

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif", background: "#0B1D3A", color: "#fff", minHeight: "100vh" }}>
      <h1>Start New KYC</h1>
      <button onClick={startNewKyc} style={{ padding: "10px 20px", borderRadius: 6 }}>
        Start New KYC
      </button>
      <p>Session ID: {sessionId}</p>
    </main>
  );
}
