// app/layout.js
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Genio OS",
  description: "Genio Money OS Dashboard",
};

// شعار Genio (SVG مضمّن)
function GenioLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="shrink-0">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#g)" />
      <path d="M12 21c0-5 4-9 9-9 2.4 0 4.5.9 6.1 2.4l-2.4 2.4c-.9-.8-2.2-1.3-3.7-1.3-3 0-5.5 2.3-5.5 5.5s2.5 5.5 5.5 5.5c2 0 3.7-1 4.7-2.5h-4.7v-3.3h8.7c.1.5.1 1 .1 1.5 0 5-4.1 9-8.8 9-5 0-8.8-4-8.8-9Z" fill="#0b1220"/>
    </svg>
  );
}

// ماسكوت بسيط (SVG مضمّن)
function Mascot({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className="shrink-0">
      <defs>
        <radialGradient id="m" cx="50%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#fbbf24"/>
          <stop offset="100%" stopColor="#f59e0b"/>
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#m)" />
      <circle cx="17" cy="20" r="3" fill="#0b1220"/>
      <circle cx="31" cy="20" r="3" fill="#0b1220"/>
      <path d="M16 30c3-2 13-2 16 0" stroke="#0b1220" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen text-slate-200 antialiased"
        style={{
          // خلفية متدرجة زرقاء (بدون Tailwind ألوان إضافية)
          background:
            "radial-gradient(1000px 600px at 0% -20%, rgba(56,189,248,.12), transparent 60%)," +
            "radial-gradient(900px 500px at 110% -10%, rgba(99,102,241,.12), transparent 60%)," +
            "#0b1220",
        }}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur bg-[#0b1220cc]">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <GenioLogo />
              <span className="font-semibold tracking-wide">Genio OS</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="hover:text-white/90">Home</Link>
              <Link href="/services" className="hover:text-white/90">Services</Link>
              <Link href="/settings" className="hover:text-white/90">Settings</Link>
            </nav>

            <Mascot />
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-6xl px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-10 border-t border-white/10 text-center text-sm text-white/60 py-6">
          © {new Date().getFullYear()} Genio Systems
        </footer>
      </body>
    </html>
  );
}
