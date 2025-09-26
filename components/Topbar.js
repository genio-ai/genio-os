export default function Topbar() {
  return (
    <header className="w-full h-14 border-b border-white/10 bg-white/5 backdrop-blur flex items-center px-4">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 rounded-full border border-white/40" />
        <span className="font-semibold">Genio Admin</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <a href="/" className="text-sm opacity-80 hover:opacity-100">Home</a>
        <button
          className="text-sm bg-white/10 hover:bg-white/15 border border-white/10 rounded px-3 py-1"
          onClick={() => alert('Profile placeholder')}
        >
          Profile
        </button>
      </div>
    </header>
  );
}
