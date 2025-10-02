// File: app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://genio.systems";
const OG_TITLE = "Genio OS — Create your digital twin";
const OG_DESC =
  "Another you — a digital twin that replies in your tone, posts content, sends WhatsApp & emails, even drops TikToks.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: OG_TITLE,
  description: OG_DESC,
  themeColor: "#0b111a",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: OG_TITLE,
    description: OG_DESC,
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESC,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#0b111a] text-white`}>
        {children}
      </body>
    </html>
  );
}
