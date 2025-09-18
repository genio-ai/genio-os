// components/header.js
import Link from "next/link";

export default function Header() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(8, 22, 46, 0.95)", // #08162e with slight transparency
        backdropFilter: "saturate(120%) blur(6px)",
        borderBottom: "1px solid rgba(255,255,255,.06)",
      }}
      aria-label="Site header"
    >
      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Brand */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: "linear-gradient(135deg,#ffd166,#fcbf49)",
              boxShadow: "0 0 0 2px rgba(255,209,102,.2)",
            }}
            aria-hidden
          />
          <strong style={{ color: "#fff", fontSize: 18, letterSpacing: .4 }}>Genio</strong>
        </Link>

        {/* Nav */}
        <nav aria-label="Primary" style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <Link href="/about" style={navLink}>About</Link>
          <Link href="/support" style={navLink}>Support</Link>
          <Link href="/chat" style={navLink}>Chat</Link>

          <div style={{ width: 12 }} />

          <Link href="/auth/login" style={{ ...button, background: "transparent", border: "1px solid rgba(255,255,255,.18)" }}>
            Log in
          </Link>
          <Link href="/auth/signup" style={{ ...button, background: "#ffd166", color: "#0b1220" }}>
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}

const navLink = {
  color: "rgba(230,240,255,.92)",
  textDecoration: "none",
  fontSize: 14,
  lineHeight: "18px",
};

const button = {
  textDecoration: "none",
  fontSize: 14,
  lineHeight: "18px",
  padding: "8px 14px",
  borderRadius: 10,
  color: "#fff",
};
