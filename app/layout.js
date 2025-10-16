// File: app/layout.js
import "./globals.css";
import { Inter } from "next/font/google";

// ---- Caching & Rendering (server-first)
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// ---- Font
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

// ---- Site constants
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") || "https://genio.systems";
const OG_TITLE = "genio os — Create your digital twin";
const OG_DESC =
  "Another you — a digital twin that replies in your tone, posts content, sends WhatsApp & emails, even drops TikToks.";

// ---- Viewport (recommended by Next.js)
export const viewport = {
  themeColor: "#0b111a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

// ---- Metadata / SEO
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: OG_TITLE,
  description: OG_DESC,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: OG_TITLE,
    description: OG_DESC,
    images: ["/og-image.png"], // ensure this file exists in /public
    siteName: "genio os",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESC,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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

// ---- Root Layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-neutral-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
