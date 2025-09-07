export default function Home() {
  return (
    <section style={{ paddingTop: 24, textAlign: "center" }}>
      <h1 style={{ fontSize: 44, marginBottom: 16 }}>Genio OS</h1>
      <p style={{ margin: "0 0 24px" }}>It works!</p>

      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <img src="/genio-logo.png" alt="Genio Logo" height={80} />
        <img src="/genio-mascot.png" alt="Genio Mascot" height={80} />
      </div>
    </section>
  );
}
