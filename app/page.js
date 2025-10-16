// File: app/page.js
import Link from "next/link";

// ---- Config (read at build time)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://genio.systems";
const OG_TITLE = process.env.NEXT_PUBLIC_OG_TITLE || "Genio OS — Gaza Relief";
const OG_DESC =
  process.env.NEXT_PUBLIC_OG_DESC ||
  "Donate securely via PayPal to deliver direct humanitarian aid for families in Gaza.";
const PAYPAL_LINK = process.env.NEXT_PUBLIC_PAYPAL_LINK || "";
const HERO_IMG =
  process.env.NEXT_PUBLIC_HERO_IMG ||
  "https://images.pexels.com/photos/13100143/pexels-photo-13100143.jpeg?auto=compress&cs=tinysrgb&h=1100";
const IMG_WHY =
  process.env.NEXT_PUBLIC_IMG_WHY ||
  "https://images.pexels.com/photos/13100133/pexels-photo-13100133.jpeg?auto=compress&cs=tinysrgb&h=900";

// ---- SEO / OpenGraph
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: OG_TITLE,
  description: OG_DESC,
  openGraph: {
    title: OG_TITLE,
    description: OG_DESC,
    url: SITE_URL,
    siteName: "Genio OS",
    images: [{ url: HERO_IMG }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESC,
    images: [HERO_IMG],
  },
};

// ---- Page
export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-semibold tracking-wide">
            Genio OS
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link href="/chat" className="hover:opacity-80">
              Chat
            </Link>
            <Link href="/support" className="hover:opacity-80">
              Support
            </Link>
            <Link href="/login" className="hover:opacity-80">
              Login
            </Link>
            <Link href="/admin" className="rounded-md border border-white/20 px-3 py-1.5 hover:bg-white/10">
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${HERO_IMG})` }}
        />
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-20 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
              {OG_TITLE}
            </h1>
            <p className="mb-8 text-base text-white/80 md:text-lg">{OG_DESC}</p>

            <div className="flex flex-wrap gap-3">
              {PAYPAL_LINK ? (
                <a
                  href={PAYPAL_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-neutral-950 hover:bg-emerald-400"
                >
                  Donate via PayPal
                </a>
              ) : null}

              <Link
                href="/chat"
                className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/10"
              >
                Ask Nio
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <img
              src={IMG_WHY}
              alt="Relief"
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Why / Info */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="mb-6 text-2xl font-bold">Where your donation goes</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card
              title="Direct Aid"
              text="Funds are prioritized for urgent family needs: food, medicine, and safe accommodation."
            />
            <Card
              title="Transparent"
              text="We publish periodic summaries and keep admin costs minimal to maximize impact."
            />
            <Card
              title="Secure"
              text="Payments are processed through trusted providers. No card data stored on our side."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-white/60 md:flex-row">
          <p>© {new Date().getFullYear()} Genio OS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/support" className="hover:opacity-80">
              Support
            </Link>
            <Link href="/login" className="hover:opacity-80">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ---- UI
function Card({ title, text }) {
  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900 p-5">
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-white/70">{text}</p>
    </div>
  );
}
