export default function Page() {
  return (
    <main
      style={{
        padding: "64px 24px",
        maxWidth: "900px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <img
        src="/genio-reader-logo.png"
        alt="GENIO The Reader"
        width="160"
        height="160"
        style={{
          display: "block",
          margin: "0 auto 24px",
          borderRadius: "12px",
        }}
      />
      <h1 style={{ fontSize: "44px", margin: "0 0 12px" }}>GENIO — The Reader</h1>
      <p
        style={{
          fontSize: "20px",
          lineHeight: 1.6,
          opacity: 0.9,
          marginBottom: "28px",
        }}
      >
        Welcome to your spiritual tarot experience.
      </p>
      <a
        href="/home"
        style={{
          fontSize: "18px",
          textDecoration: "none",
          borderBottom: "1px solid #d4af37",
          color: "#d4af37",
        }}
      >
        Enter Reading Room →
      </a>
    </main>
  );
}
