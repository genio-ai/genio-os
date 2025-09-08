export const metadata = {
  title: "Genio OS",
  description: "Genio Money OS Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="p-4 bg-gray-900 bg-opacity-70 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-400">🚀 Genio OS</h1>
          <nav className="space-x-6">
            <a href="/" className="hover:text-blue-400">Home</a>
            <a href="/services" className="hover:text-blue-400">Services</a>
            <a href="/settings" className="hover:text-blue-400">Settings</a>
          </nav>
        </header>
        <main className="container mx-auto p-6">{children}</main>
        <footer className="p-4 text-center text-gray-400">
          © 2025 Genio Systems
        </footer>
      </body>
    </html>
  );
}
