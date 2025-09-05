export default function MoneyRouterPage() {
  return (
    <div style={{ color: "#fff" }}>
      <h1 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}>
        Money Router
      </h1>
      <p style={{ marginBottom: 20, opacity: 0.8 }}>
        Here you will be able to create transfers, pick best providers, and see routing results.
      </p>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 12,
          padding: 16,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <p style={{ margin: 0, opacity: 0.7 }}>
          🚧 Transfer form coming soon (amount, currency, route, provider selection).
        </p>
      </div>
    </div>
  );
}
