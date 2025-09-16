import { useState } from "react";

export default function KycTest() {
  const [faceMatch, setFaceMatch] = useState(0.82);
  const [liveness, setLiveness]   = useState(0.80);
  const [quality, setQuality]     = useState(0.70);
  const [docValid, setDocValid]   = useState(true);
  const [expiryValid, setExpiryValid] = useState(true);

  const [loading, setLoading] = useState(false);
  const [result, setResult]   = useState(null);

  const runDecision = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faceMatch: Number(faceMatch),
          liveness: Number(liveness),
          quality: Number(quality),
          docValid,
          expiryValid
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: "network_error", details: e.message });
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (type) => {
    if (type === "approved") {
      setFaceMatch(0.88); setLiveness(0.86); setQuality(0.75);
      setDocValid(true); setExpiryValid(true);
    } else if (type === "review") {
      setFaceMatch(0.76); setLiveness(0.72); setQuality(0.62);
      setDocValid(true); setExpiryValid(true);
    } else if (type === "rejected") {
      setFaceMatch(0.62); setLiveness(0.60); setQuality(0.50);
      setDocValid(false); setExpiryValid(false);
    }
  };

  const box = { background:"#0B1D3A", minHeight:"100vh", color:"#fff", padding:"20px", fontFamily:"-apple-system,Segoe UI,Roboto,Arial,sans-serif" };
  const card = { background:"#111827", borderRadius:8, padding:16, marginTop:12 };
  const label = { display:"block", fontSize:14, marginBottom:6, opacity:.9 };
  const input = { width:"100%", padding:"10px 12px", borderRadius:6, border:"1px solid #334155", background:"#0f172a", color:"#fff", fontSize:16 };
  const row = { display:"flex", gap:8, flexWrap:"wrap", marginTop:8 };
  const btn = { padding:"10px 14px", border:"none", borderRadius:6, color:"#fff", cursor:"pointer" };
  const btnPrimary = { ...btn, background:"#3B82F6" };
  const btnGhost   = { ...btn, background:"#334155" };

  return (
    <div style={box}>
      <h1 style={{margin:0, fontSize:28}}>KYC Decision Sandbox</h1>
      <p style={{opacity:.9, marginTop:8}}>Test different values and see the decision instantly.</p>

      <div style={card}>
        <div style={row}>
          <div style={{flex:"1 1 140px"}}>
            <label style={label}>Face match (0–1)</label>
            <input
              type="number" step="0.01" min="0" max="1"
              value={faceMatch}
              onChange={e=>setFaceMatch(e.target.value)}
              style={input}
            />
          </div>
          <div style={{flex:"1 1 140px"}}>
            <label style={label}>Liveness (0–1)</label>
            <input
              type="number" step="0.01" min="0" max="1"
              value={liveness}
              onChange={e=>setLiveness(e.target.value)}
              style={input}
            />
          </div>
          <div style={{flex:"1 1 140px"}}>
            <label style={label}>Quality (0–1)</label>
            <input
              type="number" step="0.01" min="0" max="1"
              value={quality}
              onChange={e=>setQuality(e.target.value)}
              style={input}
            />
          </div>
        </div>

        <div style={{...row, marginTop:12}}>
          <button onClick={()=>setDocValid(v=>!v)} style={btnGhost}>
            Document: {docValid ? "valid ✅" : "invalid ❌"}
          </button>
          <button onClick={()=>setExpiryValid(v=>!v)} style={btnGhost}>
            Expiry: {expiryValid ? "valid ✅" : "expired ❌"}
          </button>
        </div>

        <div style={{...row, marginTop:12}}>
          <button onClick={()=>setPreset("approved")} style={btnGhost}>Preset: Approved</button>
          <button onClick={()=>setPreset("review")}   style={btnGhost}>Preset: Review</button>
          <button onClick={()=>setPreset("rejected")} style={btnGhost}>Preset: Rejected</button>
        </div>

        <div style={{...row, marginTop:12}}>
          <button onClick={runDecision} style={btnPrimary}>
            {loading ? "Processing..." : "Run Decision"}
          </button>
        </div>
      </div>

      {result && (
        <div style={card}>
          <pre style={{margin:0, whiteSpace:"pre-wrap"}}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
