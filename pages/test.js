// pages/test.js — simple button to call /api/biometrics and show JSON
import { useState } from "react";

export default function TestPage() {
  const [out, setOut] = useState("");

  async function runBiometrics() {
    setOut("Loading...");
    try {
      const r = await fetch("/api/biometrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selfieBase64: "data:image/png;base64,AAA" })
      });
      const data = await r.json();
      setOut(JSON.stringify(data, null, 2));
    } catch (e) {
      setOut("Error: " + e.message);
    }
  }

  return (
    <main className="page container">
      <h1 className="h1">Biometrics Test</h1>
      <p className="muted">Tap the button to call <code>/api/biometrics</code>.</p>
      <button className="btn btn-secondary" onClick={runBiometrics}>
        Run biometrics test
      </button>
      <pre className="code" style={{marginTop:12}} aria-live="polite">
        {out || "No output yet."}
      </pre>
    </main>
  );
}
