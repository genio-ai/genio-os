// File: app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";

// ↓↓↓ add these three lines
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
// ↑↑↑

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://genio.systems";
const OG_TITLE = "genio os — Create your digital twin";
const OG_DESC =
  "Another you — a digital twin that replies in your tone, posts content, sends WhatsApp & emails, even drops TikToks.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: OG_TITLE,
  description: OG_DESC,
  // themeColor removed (unsupported in current metadata API)
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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url:
          "data:image/svg+xml;utf8," +
          encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
              <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0' stop-color='#20E3B2'/><stop offset='1' stop-color='#6FC3FF'/></linearGradient></defs>
              <rect width='64' height='64' rx='12' fill='#0b111a'/>
              <circle cx='48' cy='-4' r='28' fill='url(#g)' opacity='.35'/>
              <text x='12' y='44' font-family='Inter,Arial' font-weight='800' font-size='28' fill='url(#g)'>g</text>
            </svg>`
          ),
        type: "image/svg+xml",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
