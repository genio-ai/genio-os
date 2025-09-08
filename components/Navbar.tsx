import Image from "next/image";

export default function Navbar() {
  return (
    <header className="w-full border-b border-white/10">
      <div className="mx-auto max-w-4xl px-4 h-14 flex items-center gap-3">
        <Image src="/genio-logo.png" alt="Genio" width={28} height={28} priority />
        <span className="text-sm font-medium opacity-90">Genio Money OS</span>
      </div>
    </header>
  );
}
