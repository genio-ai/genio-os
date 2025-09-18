// pages/index.js
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Header from "../components/header";
import WhatIsTwinModal from "../components/home/WhatIsTwinModal";

export default function Home() {
  const [openInfo, setOpenInfo] = useState(false);

  return (
    <>
      <Head>
        <title>Genio — Create your smart twin</title>
        <meta name="description" content="Build your AI Twin: it writes, speaks, and responds 24/7 with your style, tone, and preferences." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Fixed Header */}
      <Header />

      {/* Page Content */}
      <main
        style={{
          minHeight: "100vh",
          paddingTop: 80, // keeps content below header
          background: "#08162e",
          color: "#e6f0ff",
        }}
      >
        {/* Hero Section */}
        <section style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 16px" }}>
          <h1 style={{ fontSize: 46, lineHeight: "1.1", marginBottom: 16 }}>
            Create your smart twin
          </h1>
          <p
            style={{
              maxWidth: 720,
              fontSize: 18,
              lineHeight: "28px",
              color: "rgba(230,240,255,.85)",
              marginBottom: 24,
            }}
          >
            It writes, speaks, appears, and responds for you — 24/7. 
            Built from your style, voice, and preferences. Private by design.
          </p>

          {/* Call To Action Buttons */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <Link href="/twin" style={ctaPrimary}>
              Create My Twin
            </Link>
            <button onClick={() => setOpenInfo(true)} style={ctaGhost}>
              How it works
            </button>
          </div>
        </section>
      </main>

      {/* Modal */}
      <WhatIsTwinModal open={openInfo} onClose={() => setOpenInfo(false)} />
    </>
  );
}

const ctaPrimary = {
  textDecoration: "none",
  background: "#ffd166",
  color: "#0b1220",
  padding: "14px 20px",
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 16,
};

const ctaGhost = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,.2)",
  color: "#fff",
  padding: "14px 20px",
  borderRadius: 12,
  fontWeight: 600,
  fontSize: 16,
  cursor: "pointer",
};
