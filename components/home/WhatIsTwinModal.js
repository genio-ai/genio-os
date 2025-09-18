// components/home/WhatIsTwinModal.js
import { useEffect } from "react";

export default function WhatIsTwinModal({ open, onClose }) {
  // lock scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="twin-title"
      style={overlay}
      onClick={onClose}
    >
      <div style={sheet} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <h3 id="twin-title" style={{ margin: 0, color: "#fff", fontSize: 20 }}>What is a Twin?</h3>
          <button onClick={onClose} aria-label="Close" style={closeBtn}>×</button>
        </div>

        <p style={p}>
          Your Twin is a secure, always-on assistant trained on your voice, tone, habits, and preferences.
          It responds like you — but faster.
        </p>

        <ul style={{ margin: "8px 0 0 18px", color: "rgba(230,240,255,.9)", fontSize: 14 }}>
          <li>Mirrors your style and tone</li>
          <li>Handles replies, drafts, and tasks</li>
          <li>Optional voice and short video</li>
          <li>Privacy-first: raw media stays internal</li>
        </ul>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <a href="/twin" style={primaryBtn}>Create My Twin</a>
          <button onClick={onClose} style={ghostBtn}>Close</button>
        </div>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  inset: 0,
  zIndex: 60,
  background: "rgba(0,0,0,.55)",
  display: "grid",
  placeItems: "center",
  padding: 16,
};

const sheet = {
  width: "100%",
  maxWidth: 560,
  background: "linear-gradient(180deg,#0b1220,#0d1b2a)",
  border: "1px solid rgba(255,255,255,.06)",
  borderRadius: 14,
  boxShadow: "0 10px 30px rgba(0,0,0,.45)",
  padding: 18,
};

const p = { color: "rgba(230,240,255,.9)", fontSize: 14, marginTop: 4, lineHeight: "22px" };

const closeBtn = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,.14)",
  color: "#fff",
  width: 34,
  height: 34,
  borderRadius: 10,
  cursor: "pointer",
};

const primaryBtn = {
  textDecoration: "none",
  background: "#ffd166",
  color: "#0b1220",
  padding: "10px 14px",
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 600,
};

const ghostBtn = {
  background: "transparent",
  border: "1px solid rgba(255,255,255,.18)",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: 10,
  fontSize: 14,
  cursor: "pointer",
};
