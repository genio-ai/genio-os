import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", background: "#0b0f17", color: "#e5e7eb" }}>
        {children}
      </body>
    </html>
  );
}
