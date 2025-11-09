export default function HomePage() {
  return (
    <section
      style={{
        padding: "80px 24px",
        textAlign: "center",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontSize: "36px",
          marginBottom: "16px",
          color: "#d4af37",
        }}
      >
        GENIO — The Reading Room
      </h2>
      <p
        style={{
          fontSize: "20px",
          lineHeight: 1.6,
          opacity: 0.9,
          marginBottom: "32px",
        }}
      >
        Focus on your intention, take a deep breath, and begin your tarot
        session.
      </p>
      <button
        style={{
          backgroundColor: "#d4af37",
          color: "#0b0c2a",
          border: "none",
          padding: "14px 36px",
          fontSize: "18px",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.85")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        Shuffle the Cards
      </button>
    </section>
  );
}
