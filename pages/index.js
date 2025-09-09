// pages/index.js
import Image from "next/image";

function HeroHome() {
  return (
    <section style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ fontSize: "40px", fontWeight: "bold", color: "#1f9cff" }}>
        Route payments smartly.
      </h1>
      <p style={{ marginTop: "12px", color: "rgba(255,255,255,0.7)", fontSize: "18px" }}>
        Send & accept payments globally — faster, cheaper, smarter.
      </p>

      <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <a
          href="#send"
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            background: "rgba(255,255,255,0.1)",
            textDecoration: "none",
            color: "#fff",
          }}
        >
          Send Money
        </a>

        <a
          href="/accept"
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            background: "rgba(255,255,255,0.1)",
            textDecoration: "none",
            color: "#fff",
          }}
        >
          Accept Payments
        </a>

        <a
          href="/links"
          style={{
            padding: "10px 20px",
            borderRadius: "6px",
            background: "linear-gradient(90deg,#22d3ee,#10b981)",
            color: "#000",
            fontWeight: "600",
            textDecoration: "none",
          }}
        >
          Create Payment Link
        </a>
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        padding: "16px",
        background: "rgba(255,255,255,0.05)",
        flex: "1",
      }}
    >
      <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>{title}</div>
      <div style={{ marginTop: "8px", fontSize: "22px", fontWeight: "bold", color: "#fff" }}>
        {value}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "#0a0a23", color: "#fff" }}>
      {/* Header */}
      <header
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "20px",
        }}
      >
        <Image src="/logo.png" alt="Genio Logo" width={48} height={48} priority />
        <h1 style={{ fontSize: "24px", fontWeight: "600" }}>Genio OS</h1>
      </header>

      {/* Hero */}
      <HeroHome />

      {/* Cards */}
      <section
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          display: "grid",
          gap: "16px",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        }}
      >
        <Card title="Settlement Speed" value="< 1h avg" />
        <Card title="Fees Saved" value="30–50%" />
        <Card title="Uptime" value="99.9%" />
      </section>
    </main>
  );
}
