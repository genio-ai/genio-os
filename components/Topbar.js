"use client";

export default function Topbar() {
  return (
    <header className="w-full h-14 border-b border-white/10 bg-white/5 backdrop-blur flex items-center px-4">
      <div className="text-sm font-semibold tracking-wide">Genio Admin</div>
      <nav className="ml-auto flex items-center gap-4 text-sm">
        <a href="/" className="opacity-80 hover:opacity-100">Home</a>
        <a href="/admin" className="opacity-80 hover:opacity-100">Dashboard</a>
      </nav>
    </header>
  );
}
