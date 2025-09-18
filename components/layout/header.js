import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors ${
        scrolled ? "bg-[#0b1220]/90 backdrop-blur border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-white font-extrabold text-xl">
          Genio
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-gray-200 hover:text-white transition">
            About
          </Link>
          <Link href="/support" className="text-gray-200 hover:text-white transition">
            Support
          </Link>
          <Link
            href="/auth/login"
            className="text-gray-200 hover:text-white transition font-medium"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition"
          >
            Sign up
          </Link>
          <button
            className="ml-2 px-3 py-1 border border-white/20 rounded-md text-gray-200 hover:text-white hover:border-white/40 transition text-sm"
          >
            EN
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-200 hover:text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-[#0b1220] border-t border-white/10">
          <nav className="flex flex-col px-4 py-4 space-y-4">
            <Link href="/about" className="text-gray-200 hover:text-white transition">
              About
            </Link>
            <Link href="/support" className="text-gray-200 hover:text-white transition">
              Support
            </Link>
            <Link
              href="/auth/login"
              className="text-gray-200 hover:text-white transition font-medium"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-yellow-300 transition w-fit"
            >
              Sign up
            </Link>
            <button
              className="px-3 py-1 border border-white/20 rounded-md text-gray-200 hover:text-white hover:border-white/40 transition text-sm w-fit"
            >
              EN
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
