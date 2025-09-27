import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0f17] text-[#e5e7eb]">
        {children}
      </body>
    </html>
  );
}
