"use client";

import { useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic"; // اجعل الصفحة ديناميكية

const DECK = [
  "The Fool","The Magician","The High Priestess","The Empress","The Emperor",
  "The Hierophant","The Lovers","The Chariot","Strength","The Hermit",
  "Wheel of Fortune","Justice","The Hanged Man","Death","Temperance",
  "The Devil","The Tower","The Star","The Moon","The Sun","Judgement","The World"
];

export default function Page() {
  const [mode, setMode] = useState("daily");
  const [cards, setCards] = useState([]);
  const [shuffling, setShuffling] = useState(false);

  const count = useMemo(() => (mode === "daily" ? 1 : mode === "luck" ? 3 : 5), [mode]);

  useEffect(() => {
    startReading("daily");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startReading(selectedMode) {
    setMode(selectedMode);
    setShuffling(true);
    setCards([]);
    setTimeout(() => {
      const drawn = drawUnique(selectedMode === "daily" ? 1 : selectedMode === "luck" ? 3 : 5);
      setCards(drawn);
      setShuffling(false);
    }, 700);
  }

  function drawUnique(n) {
    const pool = [...DECK];
    const drawn = [];
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      drawn.push(pool.splice(idx, 1)[0]);
    }
    return drawn;
  }

  return (
    <main style={styles.page}>
      <div style={styles.backdrop} />
      <header style={styles.header}>
        <img
          src="/genio-reader-logo.png?v=2"
          alt="GENIO The Reader"
          width="40"
          height="40"
          onError={(e) => (e.currentTarget.style.display = "none")}
          style={{ marginRight: 8 }}
        />
        <div style={{ fontWeight: 600, letterSpacing: 1 }}>GENIO — The Reader</div>
      </header>

      <section style={styles.room}>
        <h1 style={styles.title}>Reading Room</h1>
        <p style={styles.subtitle}>Focus on your intention, breathe in, and receive your reading.</p>

        <div style={styles.controls}>
          <button style={btn(mode === "daily")} onClick={() => startReading("daily")} disabled={shuffling}>Daily (1)</button>
          <button style={btn(mode === "luck")}  onClick={() => startReading("luck")}  disabled={shuffling}>Luck (3)</button>
          <button style={btn(mode === "next")}  onClick={() => startReading("next")}  disabled={shuffling}>Next Path (5)</button>
        </div>

        <div style={styles.table}>
          {shuffling && <div style={styles.shuffle}>Shuffling…</div>}
          {!shuffling && cards.length > 0 && (
            <div style={styles.cardsGrid}>
              {cards.map((c, i) => (
                <div key={i} style={styles.card}>
                  <div style={styles.cardFace}>{c}</div>
                  <div style={styles.cardMeta}>
                    {i === 0 && cards.length > 1 ? "Present"   : ""}
                    {i === 1 && cards.length > 1 ? "Challenge" : ""}
                    {i === 2 && cards.length > 1 ? "Outcome"   : ""}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!shuffling && cards.length > 0 && (
            <div style={styles.interpretation}>
              <h3 style={{ margin: "0 0 8px" }}>Interpretation</h3>
              <p style={{ opacity: 0.9 }}>
                Ground yourself and reflect on what this spread highlights. Let clarity guide your next gentle step.
              </p>
              <div style={styles.manifestBox}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Manifestation Tip</div>
                <p style={{ margin: 0 }}>
                  Breathe slowly for 30 seconds. State your intention in the present tense. Take one practical action today aligned with it.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <footer style={styles.footer}>GENIO — The Reader</footer>
    </main>
  );
}

const styles = {
  page: { position: "relative", minHeight: "100vh", backgroundColor: "#0b0c2a", color: "#f5f5f5", fontFamily: "serif" },
  backdrop: { position: "absolute", inset: 0, background: "radial-gradient(60% 55% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(11,12,42,0) 60%), linear-gradient(180deg, #0f1033 0%, #0b0c2a 60%)", pointerEvents: "none" },
  header: { position: "fixed", top: 16, left: 16, display: "flex", alignItems: "center", opacity: 0.9, fontSize: 14 },
  room: { position: "relative", maxWidth: 1080, margin: "0 auto", padding: "96px 20px 48px" },
  title: { margin: "0 0 8px", fontSize: 28, color: "#d4af37" },
  subtitle: { margin: "0 0 24px", opacity: 0.9 },
  controls: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 },
  table: { background: "linear-gradient(180deg, rgba(19,20,60,0.9) 0%, rgba(11,12,42,0.95) 100%)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 12, padding: 20, minHeight: 260 },
  shuffle: { textAlign: "center", padding: "40px 0", opacity: 0.9 },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 },
  card: { border: "1px solid rgba(212,175,55,0.35)", borderRadius: 10, padding: 12, background: "linear-gradient(180deg, rgba(18,19,52,0.8) 0%, rgba(12,13,44,0.9) 100%)" },
  cardFace: { fontWeight: 700, marginBottom: 6 },
  cardMeta: { fontSize: 12, opacity: 0.8 },
  interpretation: { marginTop: 18, lineHeight: 1.6 },
  manifestBox: { marginTop: 10, padding: 12, border: "1px solid rgba(212,175,55,0.25)", borderRadius: 8, background: "rgba(19,20,60,0.5)" },
  footer: { textAlign: "center", opacity: 0.6, fontSize: 12, padding: "16px 0 24px" },
};

function btn(active) {
  return {
    backgroundColor: active ? "#d4af37" : "transparent",
    color: active ? "#0b0c2a" : "#d4af37",
    border: "1px solid #d4af37",
    padding: "10px 14px",
    fontSize: 14,
    borderRadius: 6,
    cursor: "pointer",
    transition: "opacity .2s ease",
  };
}
