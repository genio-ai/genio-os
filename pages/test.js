import { useState } from "react";

export default function Test() {
  const [out, setOut] = useState("");

  async function run() {
    const r = await fetch("/api/kyc/sessions", { method: "POST" });
    const j = await r.json();
    setOut(JSON.stringify(j, null, 2));
  }

  return (
    <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Test KYC API</h1>
      <button onClick={run}>Start New Session</button>
      <pre>{out}</pre>
    </main>
  );
}
