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
