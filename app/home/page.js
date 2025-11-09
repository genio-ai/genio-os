"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [language, setLanguage] = useState("en");
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLanguage(savedLang);

    const timer = setTimeout(() => setShowButton(true), 3000);

    const audio = new Audio("/sounds/intro.mp3");
    audio.volume = 0.6;
    audio.play().catch(() => {});
    return () => clearTimeout(timer);
  }, []);

  const text = {
    en: {
      welcome: "Welcome to Genio",
      subtitle: "The Reader within you is awakening",
      button: "Begin Your Reading",
    },
    ar: {
      welcome: "مرحبًا بك في جينيو",
      subtitle: "القارئ بداخلك يستيقظ الآن",
      button: "ابدأ قراءتك",
    },
  };

  const t = text[language];

  return (
    <div
      style={{
        backgroundColor: "#0B132B",
        color: "#D4AF37",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "all 1s ease",
      }}
    >
      <div
        style={{
          animation: "fadeIn 3s ease",
        }}
      >
        <img
          src="/assets/logo.svg"
          alt="Genio Logo"
          style={{ width: "160px", marginBottom: "20px" }}
        />
        <h1 style={{ fontSize: "2rem", marginBottom: "8px", letterSpacing: "2px" }}>
          {t.welcome}
        </h1>
        <p style={{ opacity: 0.8, fontSize: "1.1rem" }}>{t.subtitle}</p>
      </div>

      {showButton && (
        <button
          onClick={() => (window.location.href = "/reading")}
          style={{
            marginTop: "40px",
            padding: "14px 36px",
            backgroundColor: "#D4AF37",
            color: "#0B132B",
            border: "none",
            borderRadius: "30px",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
        >
          {t.button}
        </button>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
