export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0f14",
        color: "#e5e7eb",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "8px" }}>Genio OS Home</h1>
        <p style={{ opacity: 0.8 }}>Welcome to Genio Systems</p>
      </div>
    </main>
  );
}
