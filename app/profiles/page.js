"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    document.title = "Profiles — Genio";
    (async () => {
      try {
        const res = await fetch("/api/profiles", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProfiles(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr("Failed to load profiles.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <main style={styles.wrap}>Loading profiles…</main>;

  return (
    <main style={styles.wrap}>
      <h1 style={styles.title}>User Profiles</h1>

      {err && <div style={styles.err}>{err}</div>}

      <ul style={styles.list}>
        {profiles.map((p, i) => (
          <li key={i} style={styles.item}>
            <div style={styles.name}>{p.name || "Unnamed"}</div>
            <div style={styles.sub}>{p.email || "no email"}</div>
          </li>
        ))}
        {!profiles.length && !err && (
          <li style={styles.empty}>No profiles found.</li>
        )}
      </ul>
    </main>
  );
}

const styles = {
  wrap: { padding: 20, maxWidth: 720, margin: "0 auto", color: "#e6eef8" },
  title: { margin: "0 0 12px 0", fontSize: 24, fontWeight: 800 },
  err: {
    background: "#1a0f14",
    color: "#ffd6df",
    border: "1px solid #5b2330",
    padding: "10px 12px",
    borderRadius: 10,
    marginBottom: 12,
  },
  list: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10 },
  item: {
    background: "#0f1b33",
    border: "1px solid #22304a",
    borderRadius: 12,
    padding: 12,
  },
  name: { fontWeight: 700 },
  sub: { opacity: 0.8, fontSize: 14 },
  empty: { opacity: 0.7, padding: 12 },
};
