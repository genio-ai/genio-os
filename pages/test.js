// pages/test.js
import { useState } from "react";

export default function TestKycAPI() {
  const [sessionId, setSessionId] = useState(null);
  const [logs, setLogs] = useState([]);

  const push = (obj) => setLogs((prev) => [...prev, obj]);

  // 1) Create Session
  async function createSession() {
    try {
      const r = await fetch("/api/session", { method: "POST" });
      const j = await r.json();
      if (j.sessionId) setSessionId(j.sessionId);
      push(j);
    } catch (e) {
      push({ error: "createSession failed", details: e.message });
    }
  }

  // 2) Upload Document
  async function uploadDocument() {
    if (!sessionId) return push({ error: "⚠️ Please run Create Session first" });
    try {
      const r = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, type: "passport" }),
      });
      const j = await r.json();
      push(j);
    } catch (e) {
      push({ error: "uploadDocument failed", details: e.message });
    }
  }

  // 3) Biometrics
  async function biometrics() {
    if (!sessionId) return push({ error: "⚠️ Please run Create Session first" });
    try {
      const r = await fetch("/api/biometrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const j = await r.json();
      push(j);
    } catch (e) {
      push({ error: "biometrics failed", details: e.message });
    }
  }

  // 4) Submit
  async function submit() {
    if (!sessionId) return push({ error: "⚠️ Please run Create Session first" });
    try {
      const r = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const j = await r.json();
      push(j);
    } catch (e) {
      push({ error: "submit failed", details: e.message });
    }
  }

  // 5) Attest
  async function attest() {
    if (!sessionId) return push({ error: "⚠️ Please run Create Session first" });
    try {
      const r = await fetch("/api/attest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      const j = await r.json();
      push(j);
    } catch (e) {
      push({ error: "attest failed", details: e.message });
    }
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
      <div style={{ marginBottom: 12 }}>sessionId: {sessionId || "-"}</div>
      <pre style={{ background: "#111", padding: 12, borderRadius: 4 }}>
        {logs.map((l, i) => JSON.stringify(l, null, 2)).join("\n\n")}
      </pre>
    </main>
  );
}
