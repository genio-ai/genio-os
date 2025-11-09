export const metadata = {
  title: "GENIO — The Reader",
  description: "A calm, elegant tarot experience.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#0b0c2a",
          color: "#f5f5f5",
          fontFamily: "serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
