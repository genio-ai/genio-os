// pages/test.js
import { useState } from "react";

export default function TestPage() {
  const [sessionId, setSessionId] = useState(null);
  const [result, setResult] = useState([]);

  async function createSession() {
    const r = await fetch("/api/sessions", { method: "POST" });
    const j = await r.json();
    setSessionId(j.sessionId);
    setResult([j]); // نعرض النتيجة
  }

  async function callApi(path) {
    if (!sessionId) {
      setResult([{ error: "⚠️ لازم تعمل Create Session أول" }]);
      return;
    }
    const r = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const j = await r.json();
    setResult((prev) => [...prev, j]);
  }

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif", background: "#0B1D3A", color: "#fff", minHeight: "100vh" }}>
      <h1>Test KYC API</h1>
      <div style={{ marginBottom: 12 }}>
        <button onClick={createSession}>1) Create Session</button>{" "}
        <button onClick={() => callApi("/api/documents")}>2) Upload Document</button>{" "}
        <button onClick={() => callApi("/api/biometrics")}>3) Biometrics</button>{" "}
        <button onClick={() => callApi("/api/submit")}>4) Submit</button>{" "}
        <button onClick={() => callApi("/api/attest")}>5) Attest</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        sessionId: <code>{sessionId || "-"}</code>
      </div>
      <pre style={{ background: "#111", padding: 12, borderRadius: 4 }}>
        {result.map((r, i) => (
          <div key={i}>{JSON.stringify(r, null, 2)}</div>
        ))}
      </pre>
    </main>
  );
}
