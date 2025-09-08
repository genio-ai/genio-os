import './globals.css';

export const metadata = {
  title: 'Genio OS',
  description: 'Genio Money OS Dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-slate-950/60 sticky top-0 z-10">
          <div className="container flex items-center justify-between py-4">
            <div className="text-xl font-bold text-blue-400">🚀 Genio OS</div>
            <nav className="space-x-6 text-slate-300">
              <a href="/" className="hover:text-blue-400">Home</a>
              <a href="/services" className="hover:text-blue-400">Services</a>
              <a href="/settings" className="hover:text-blue-400">Settings</a>
            </nav>
          </div>
        </header>

        <main className="container py-8">{children}</main>

        <footer className="container py-8 text-center text-slate-400">
          © 2025 Genio Systems
        </footer>
      </body>
    </html>
  );
}
