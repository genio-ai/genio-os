// pages/test.js
import { useState } from "react";

export default function TestKycAPI() {
  const [sessionId, setSessionId] = useState(null);
  const [logs, setLogs] = useState([]);

  const push = (obj) => setLogs((prev) => [...prev, obj]);

  async function createSession() {
    try {
      const r = await fetch("/api/kyc/sessions", { method: "POST" });
      const j = await r.json();
      setSessionId(j.sessionId || null);
      push(j);
    } catch (e) {
      push({ error: "createSession failed", details: String(e) });
    }
  }

  async function callApi(path, extra = {}) {
    if (!sessionId) {
      push({ error: "No sessionId. Click 'Create Session' first." });
      return;
    }
    try {
      const r = await fetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, ...extra }),
      });
      const j = await r.json();
      push(j);
    } catch (e) {
      push({ error: `${path} failed`, details: String(e) });
    }
  }

  const disabled = !sessionId;

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif", background: "#0B1D3A", minHeight: "100vh", color: "#fff" }}>
      <h1>Test KYC API</h1>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <button onClick={createSession}>1) Create Session</button>
        <button disabled={disabled} onClick={() => callApi("/api/documents", { type: "passport" })}>
          2) Upload Document
        </button>
        <button disabled={disabled} onClick={() => callApi("/api/biometrics")}>
          3) Biometrics
        </button>
        <button disabled={disabled} onClick={() => callApi("/api/kyc/submit")}>
          4) Submit
        </button>
        <button disabled={disabled} onClick={() => callApi("/api/attest")}>
          5) Attest
        </button>
      </div>

      <div style={{ marginBottom: 8 }}>
        sessionId: <code>{sessionId || "-"}</code>
      </div>

      <pre style={{ background: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap" }}>
        {logs.map((x, i) => (
          <div key={i}>{JSON.stringify(x, null, 2)}</div>
        ))}
      </pre>
    </main>
  );
}
