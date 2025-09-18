// pages/index.js
import Head from "next/head";
import Header from "../components/header";
import Hero from "../components/home/hero";
import Features from "../components/home/features";
import ChatWidget from "../components/ChatWidget";
import TwinModal from "../components/TwinModal";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Genio — Create your smart twin</title>
        <meta
          name="description"
          content="Build your AI twin from your style, voice, and preferences. Private by design. 24/7 on-brand responses."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Genio — Create your smart twin" />
        <meta
          property="og:description"
          content="A smarter version of you — writes, speaks, appears, and responds 24/7."
        />
        <meta property="og:type" content="website" />
      </Head>

      {/* Site header (sticky, shared across pages) */}
      <Header />

      {/* Main content */}
      <main role="main">
        {/* Hero section: headline + background visual + primary CTA */}
        <Hero />

        {/* Feature highlights: privacy-first, 24/7 availability, multi-channel, etc. */}
        <Features />
      </main>

      {/* Footer (simple, keep in index to avoid global coupling) */}
      <footer
        role="contentinfo"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "32px 20px",
          marginTop: 32,
          opacity: 0.9,
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 14 }}>
            © {new Date().getFullYear()} Genio Systems. All rights reserved.
          </span>
          <nav aria-label="Footer">
            <a href="/terms" style={{ marginRight: 16 }}>
              Terms
            </a>
            <a href="/privacy">Privacy</a>
          </nav>
        </div>
      </footer>

      {/* On-page assistant: welcomes and answers pre-signup questions */}
      <ChatWidget initialMessage="Hi, I'm your AI Twin. I'm here to help. Ask me anything before you sign up." />

      {/* Twin creation modal is kept mounted for fast open */}
      <TwinModal />
    </>
  );
}
