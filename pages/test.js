import { useState } from "react";

export default function Test() {
  const [sessionId, setSessionId] = useState("");
  const [out, setOut] = useState("");

  const log = (o) => setOut((p) => p + "\n" + JSON.stringify(o, null, 2));

  async function createSession() {
    const r = await fetch("/api/kyc/sessions", { method: "POST" });
    const j = await r.json();
    setSessionId(j.sessionId || "");
    setOut(JSON.stringify(j, null, 2));
  }

  async function uploadDoc() {
    if (!sessionId) return log({ error: "no sessionId" });
    const r = await fetch("/api/kyc/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, type: "passport" }),
    });
    log(await r.json());
  }

  async function biometrics() {
    if (!sessionId) return log({ error: "no sessionId" });
    const r = await fetch("/api/kyc/biometrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, livenessScore: 0.72, selfieMeta: { device: "web" } }),
    });
    log(await r.json());
  }

  async function submit() {
    if (!sessionId) return log({ error: "no sessionId" });
    const r = await fetch("/api/kyc/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    log(await r.json());
  }

  async function attest() {
    if (!sessionId) return log({ error: "no sessionId" });
    const canonicalJSON = JSON.stringify({ sessionId, t: Date.now() });
    const salt = Math.random().toString(36).slice(2, 10);
    const r = await fetch("/api/attest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, canonicalJSON, salt }),
    });
    log(await r.json());
  }

  return (
    <main style={{ padding: 20, fontFamily: "Arial, sans-serif", background: "#0B1D3A", minHeight: "100vh", color: "#fff" }}>
      <h1>Test KYC API</h1>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        <button onClick={createSession}>1) Create Session</button>
        <button onClick={uploadDoc}>2) Upload Document</button>
        <button onClick={biometrics}>3) Biometrics</button>
        <button onClick={submit}>4) Submit</button>
        <button onClick={attest}>5) Attest</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        sessionId: <code>{sessionId || "-"}</code>
      </div>
      <pre style={{ background: "rgba(255,255,255,0.08)", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap" }}>
        {out}
      </pre>
    </main>
  );
}
