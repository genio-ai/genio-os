// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Link Chain",
  description: "Affiliate link system"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
