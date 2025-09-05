import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "linear-gradient(135deg,#0a0f1c,#122240)",
        padding: 32,
      }}
    >
      <h1 style={{ color: "#ffffff", fontSize: 28, fontWeight: 800, margin: 0 }}>
        GENIO Money OS
      </h1>
      <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, textAlign: "center" }}>
        Router • KYC • AML — built for speed, savings, and compliance.
      </p>
      <Link
        href="/dashboard"
        style={{
          marginTop: 10,
          color: "#0a0f1c",
          background: "#c9d8ff",
          border: "1px solid rgba(255,255,255,0.15)",
          textDecoration: "none",
          padding: "10px 16px",
          borderRadius: 10,
          fontWeight: 700,
        }}
      >
        Open Dashboard
      </Link>
    </main>
  );
}
