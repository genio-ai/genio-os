// components/layout/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-[#0b1220] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">
          Genio <span className="text-yellow-400">AI Twin Studio</span>
        </div>

        {/* Nav Links */}
        <nav className="space-x-8 hidden md:flex">
          <Link href="/about" className="hover:text-yellow-400 transition">
            About
          </Link>
          <Link href="/support" className="hover:text-yellow-400 transition">
            Support
          </Link>
          <Link href="/chat" className="hover:text-yellow-400 transition">
            Chat
          </Link>
        </nav>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/login"
            className="px-4 py-2 border border-gray-400 rounded-md hover:bg-gray-800 transition"
          >
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-300 transition"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
