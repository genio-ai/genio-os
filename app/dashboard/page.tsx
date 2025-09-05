"use client";
import { useMemo, useState } from "react";

export default function MoneyRouterPage() {
  const [amount, setAmount] = useState<number>(1000);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  // Mock providers (we’ll wire real APIs later)
  const providers = [
    { name: "Wise",         feePct: 0.006, fxSpreadPct: 0.001,  etaMin: 45 },
    { name: "Flutterwave",  feePct: 0.012, fxSpreadPct: 0.002,  etaMin: 60 },
    { name: "PayGate",      feePct: 0.009, fxSpreadPct: 0.0025, etaMin: 70 },
    { name: "Stripe",       feePct: 0.014, fxSpreadPct: 0.0015, etaMin: 40 },
  ];

  const rows = useMemo(() => {
    const amt = isFinite(amount) && amount > 0 ? amount : 0;
    return providers.map(p => {
      const fee = +(amt * p.feePct).toFixed(2);
      const spread = +(amt * p.fxSpreadPct).toFixed(2);
      const total = +(fee + spread).toFixed(2);
      return { ...p, fee, spread, total };
    }).sort((a,b) => a.total === b.total ? a.etaMin - b.etaMin : a.total - b.total);
  }, [amount]);

  const best = rows[0];

  return (
    <div style={{ color: "#fff", display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>Money Router</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>
        Enter an amount and currencies. We’ll estimate fee + FX spread and suggest the best provider.
      </p>

      {/* Form */}
      <section style={panel}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          <Field label="Amount">
            <input
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              type="number"
              min={0}
              step="1"
              placeholder="1000"
              style={input}
            />
          </Field>

          <Field label="From currency">
            <select value={from} onChange={(e)=>setFrom(e.target.value)} style={input}>
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="To currency">
            <select value={to} onChange={(e)=>setTo(e.target.value)} style={input}>
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <button
            onClick={()=>{}}
            style={{
              ...button, height: 40,
              background: "#c9d8ff", color: "#0a0f1c",
              border: "1px solid rgba(255,255,255,0.15)"
            }}
          >
            Estimate
          </button>
        </div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
          * Demo math only (fees & spreads are sample values). Live routing comes next.
        </div>
      </section>

      {/* Recommendation */}
      <section style={panel}>
        <div style={{ marginBottom: 10, fontWeight: 700, color: "#c9d8ff" }}>Recommendation</div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <Pill text={`Best: ${best.name}`} color="#22c55e" />
          <Pill text={`Est. fee ${fmt(best.total, from)}`} />
          <Pill text={`ETA ${best.etaMin} min`} />
          <Pill text={`${from} → ${to}`} />
        </div>
      </section>

      {/* Table */}
      <section style={panel}>
        <div style={{ marginBottom: 10, fontWeight: 700, color: "#c9d8ff" }}>Provider comparison</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#eaf1ff", fontSize: 14 }}>
            <thead>
              <tr>
                {["Provider", "Fee", "FX Spread", "Total Cost", "ETA"].map(h=>(
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i)=>(
                <tr key={r.name} style={{ borderTop: "1px solid rgba(255,255,255,0.12)", background: i===0 ? "rgba(34,197,94,0.10)" : "transparent" }}>
                  <td style={td}>{r.name}</td>
                  <td style={td}>{fmt(r.fee, from)} <small style={{ opacity: .6 }}>({(r.feePct*100).toFixed(1)}%)</small></td>
                  <td style={td}>{fmt(r.spread, from)} <small style={{ opacity: .6 }}>({(r.fxSpreadPct*100).toFixed(1)}%)</small></td>
                  <td style={td}><strong>{fmt(r.total, from)}</strong></td>
                  <td style={td}>{r.etaMin} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/** UI bits **/
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6, color: "#eaf1ff" }}>
      <span style={{ fontSize: 12, opacity: 0.8 }}>{label}</span>
      {children}
    </label>
  );
}
function Pill({ text, color = "rgba(255,255,255,0.6)" }: { text: string; color?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      padding: "6px 10px", borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.18)", background: "rgba(255,255,255,0.05)",
      color: "#fff"
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}` }} />
      {text}
    </span>
  );
}

/** Styles **/
const panel: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.05)",
  borderRadius: 14,
  padding: 14,
};
const input: React.CSSProperties = {
  height: 40, borderRadius: 10, padding: "0 12px",
  border: "1px solid rgba(255,255,255,0.25)",
  background: "rgba(255,255,255,0.06)", color: "#fff", outline: "none"
};
const button: React.CSSProperties = {
  borderRadius: 10, padding: "0 14px", fontWeight: 700, cursor: "pointer"
};
const th: React.CSSProperties = { textAlign: "left", padding: "10px", color: "#c9d8ff" };
const td: React.CSSProperties = { padding: "10px", whiteSpace: "nowrap" };
const currencies = ["USD", "EUR", "GBP", "MZN", "ZAR", "NGN", "BRL"];

function fmt(n: number, ccy: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy }).format(n || 0);
}
