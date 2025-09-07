import '../globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 border-b flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/settings">Settings</Link>
        </header>
        <main className="p-6">{children}</main>
        <footer className="p-4 border-t text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Genio Systems
        </footer>
      </body>
    </html>
  );
}
