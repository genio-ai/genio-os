export const metadata = {
  title: "Tarot Soul 369",
  description: "3D Tarot Experience of Self and Energy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#0b0c2a", color: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
