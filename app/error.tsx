"use client";

import React from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  console.error("GlobalError:", error); // يظهر التفاصيل في Console
  return (
    <html>
      <body style={{ padding: 24, fontFamily: "system-ui" }}>
        <h2>Something went wrong on the client</h2>
        <pre style={{ whiteSpace: "pre-wrap", background: "#111", color: "#eee", padding: 12, borderRadius: 8 }}>
          {error?.message || String(error)}
          {"\n\n"}{error?.stack}
        </pre>
        <button
          onClick={() => reset()}
          style={{ marginTop: 12, padding: "8px 12px", borderRadius: 6 }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
