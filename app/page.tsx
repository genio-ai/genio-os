export default function Home() {
  return (
    <section style={{ paddingTop: 24 }}>
      <h1 style={{ fontSize: 44, margin: "0 0 12px", fontWeight: 800 }}>Genio OS</h1>
      <p style={{ margin: "0 0 24px", fontSize: 18 }}>It works!</p>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <img src="/genio-logo.png" alt="Genio Logo" height={80} />
        <img src="/genio-mascot.png" alt="Genio Mascot" height={80} />
      </div>
    </section>
  );
}
