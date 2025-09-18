// pages/index.js
import Head from "next/head";
import Link from "next/link";
import ChatWidget from "../components/ChatWidget";

export default function Home() {
  return (
    <>
      <Head>
        <title>Genio — Create your AI Twin</title>
        <meta name="description" content="Create your smart twin: a better version of you that writes, speaks, and responds 24/7." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "#0b1220",
          borderBottom: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Link href="/" style={{ fontSize: 20, fontWeight: 800, color: "#fff", textDecoration: "none" }}>
            Genio
          </Link>

          <nav style={{ display: "flex", gap: 18 }}>
            <Link href="/about" style={{ color: "#cbd5e1", textDecoration: "none" }}>About</Link>
            <Link href="/support" style={{ color: "#cbd5e1", textDecoration: "none" }}>Support</Link>
            <Link href="/auth/login" style={{ color: "#cbd5e1", textDecoration: "none" }}>Log in</Link>
            <Link
              href="/auth/signup"
              style={{
                color: "#111827",
                background: "#facc15",
                padding: "8px 14px",
                borderRadius: 999,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main
        style={{
          background: "radial-gradient(1200px 500px at 50% -10%, rgba(250, 204, 21, .12), transparent 60%) #0b1220",
          minHeight: "calc(100vh - 64px)",
          color: "#e5e7eb",
        }}
      >
        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 20px 40px" }}>
          <h1
            style={{
              fontSize: 56,
              lineHeight: 1.05,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            Create your smart twin… <br /> a better version of you
          </h1>

          <p style={{ marginTop: 16, fontSize: 18, color: "#cbd5e1", maxWidth: 720 }}>
            It writes, speaks, appears, and responds for you — 24/7. Your data stays inside Genio. You control consents.
          </p>

          <div style={{ marginTop: 28, display: "flex", gap: 14 }}>
            <Link
              href="/twin"
              style={{
                background: "#facc15",
                color: "#111827",
                fontWeight: 800,
                padding: "14px 20px",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              Create My Twin
            </Link>

            <Link
              href="/auth/signup"
              style={{
                border: "1px solid rgba(255,255,255,.2)",
                color: "#e5e7eb",
                padding: "14px 18px",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              Get started free
            </Link>
          </div>
        </section>
      </main>

      {/* System brain (assistant) */}
      <ChatWidget />
    </>
  );
}
