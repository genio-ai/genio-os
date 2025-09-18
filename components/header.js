import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-[#0A1733] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">Genio</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link href="/about" className="hover:text-yellow-400">About</Link>
          <Link href="/support" className="hover:text-yellow-400">Support</Link>
          <Link href="/chat" className="hover:text-yellow-400">Chat</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <Link href="/auth/login">
            <button className="px-4 py-2 rounded-md bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black transition">
              Log in
            </button>
          </Link>
          <Link href="/auth/signup">
            <button className="px-4 py-2 rounded-md bg-yellow-400 text-black font-medium hover:bg-yellow-300 transition">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
