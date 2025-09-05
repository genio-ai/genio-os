// app/dashboard/page.tsx
export default function DashboardHome() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* KPI cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0,1fr))",
          gap: 16,
        }}
      >
        <KPI title="Processed (24h)" value="$128,450" sub="+12% vs. yesterday" />
        <KPI title="Avg. Fee Saved" value="43%" sub="vs. legacy banks" />
        <KPI title="Success Rate" value="99.2%" sub="SLA: >98.5%" />
        <KPI title="Active Providers" value="4 / 6" sub="Wise · Flutterwave · PayGate · Stripe" />
      </div>

      {/* Mini charts placeholders */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        <Panel title="Volume (last 7 days)">
          <div style={{ height: 220, border: "1px dashed rgba(255,255,255,0.2)", borderRadius: 12, display: "grid", placeItems: "center", color: "rgba(255,255,255,0.6)" }}>
            (chart placeholder)
          </div>
        </Panel>

        <Panel title="Latency (p95)">
          <ul style={{ margin: 0, padding: "8px 14px", listStyle: "none", color: "#eaf1ff" }}>
            <li>Wise — 1.2s</li>
            <li>Flutterwave — 1.8s</li>
            <li>PayGate — 2.3s</li>
            <li>Stripe — 1.1s</li>
          </ul>
        </Panel>
      </div>

      {/* Transactions table */}
      <Panel title="Recent Transactions">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "#eaf1ff", fontSize: 14 }}>
            <thead>
              <tr>
                {["Time", "Customer", "From → To", "Amount", "Provider", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 10px",
                      borderBottom: "1px solid rgba(255,255,255,0.15)",
                      fontWeight: 600,
                      color: "#c9d8ff",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={td}>{r.time}</td>
                  <td style={td}>{r.customer}</td>
                  <td style={td}>{r.route}</td>
                  <td style={td}>{r.amount}</td>
                  <td style={td}>{r.provider}</td>
                  <td style={td}>
                    <Status label={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function KPI({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        padding: 16,
      }}
    >
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#ffffff" }}>{value}</div>
      {sub ? <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>{sub}</div> : null}
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        padding: 14,
      }}
    >
      <div style={{ fontSize: 13, color: "#c9d8ff", fontWeight: 700, marginBottom: 10 }}>{title}</div>
      {children}
    </section>
  );
}

function Status({ label }: { label: "Success" | "Pending" | "Failed" }) {
  const map: any = {
    Success: "#22c55e",
    Pending: "#f59e0b",
    Failed: "#ef4444",
  };
  const color = map[label] || "#c9d8ff";
  return (
    <span
      style={{
        display: "inline-flex",
        gap: 8,
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.18)",
        background: "rgba(255,255,255,0.06)",
        fontSize: 12,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 99, background: color, boxShadow: `0 0 8px ${color}` }} />
      {label}
    </span>
  );
}

const td: React.CSSProperties = { padding: "12px 10px", whiteSpace: "nowrap" };

const rows = [
  { time: "15:42", customer: "A. Santos", route: "BRL → EUR", amount: "€1,240", provider: "Wise", status: "Success" as const },
  { time: "15:29", customer: "M. Dlamini", route: "MZN → USD", amount: "$560", provider: "Flutterwave", status: "Pending" as const },
  { time: "15:01", customer: "J. Ibrahim", route: "ZAR → GBP", amount: "£3,100", provider: "PayGate", status: "Success" as const },
  { time: "14:44", customer: "L. Chen", route: "USD → NGN", amount: "₦980,000", provider: "Stripe", status: "Failed" as const },
];
