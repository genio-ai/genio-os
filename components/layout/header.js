// components/layout/Header.js
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-[#0b1220] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 whitespace-nowrap">
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-bold text-yellow-400">
          Genio AI Twin Studio
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link href="/about" className="hover:text-yellow-400">
            About
          </Link>
          <Link href="/support" className="hover:text-yellow-400">
            Support
          </Link>
          <Link href="/chat" className="hover:text-yellow-400">
            Chat
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button className="px-3 py-1 rounded border border-gray-400 hover:bg-gray-800">
            Log in
          </button>
          <button className="px-3 py-1 rounded bg-yellow-400 text-black font-semibold hover:bg-yellow-300">
            Sign up
          </button>
          <button className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
            العربية / EN
          </button>
        </div>
      </div>
    </header>
  );
}
