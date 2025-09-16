// pages/test.js
import { useState } from "react";

export default function TestPage() {
  const [sessionId, setSessionId] = useState(null);
  const [result, setResult] = useState([]);

  async function createSession() {
    const r = await fetch("/api/sessions", { method: "POST" });
    const j = await r.json();
    setSessionId(j.sessionId);
    setResult((prev) => [...prev, j]);
  }

  async function uploadDocument() {
    if (!sessionId) return;
    const r = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const j = await r.json();
    setResult((prev) => [...prev, j]);
  }

  async function biometrics() {
    if (!sessionId) return;
    const r = await fetch("/api/biometrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const j = await r.json();
    setResult((prev) => [...prev, j]);
  }

  async function submit() {
    if (!sessionId) return;
    const r = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const j = await r.json();
    setResult((prev) => [...prev, j]);
  }

  async function attest() {
    if (!sessionId) return;
    const r = await fetch("/api/attest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const j = await r.json();
    setResult((prev) => [...prev, j]);
  }

  return (
    <main style={{ padding: "20px", fontFamily: "Arial, sans-serif", color: "#fff", background: "#0B1D3A", minHeight: "100vh" }}>
      <h1>Test KYC API</h1>
      <div style={{ marginBottom: 12 }}>
        <button onClick={createSession}>1) Create Session</button>{" "}
        <button onClick={uploadDocument}>2) Upload Document</button>{" "}
        <button onClick={biometrics}>3) Biometrics</button>{" "}
        <button onClick={submit}>4) Submit</button>{" "}
        <button onClick={attest}>5) Attest</button>
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
