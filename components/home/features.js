export default function Features() {
  const items = [
    {
      title: "Privacy-first",
      desc: "Your raw media stays inside Genio. You control consents and retention.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="opacity-90">
          <path fill="currentColor" d="M12 2a6 6 0 0 0-6 6v2.1A6.5 6.5 0 0 0 3 16.5C3 20.09 5.91 23 9.5 23h5c3.59 0 6.5-2.91 6.5-6.5 0-2.86-1.87-5.28-4.46-6.14V8a6 6 0 0 0-6-6Zm0 2a4 4 0 0 1 4 4v2H8V8a4 4 0 0 1 4-4Z"/>
        </svg>
      ),
    },
    {
      title: "24/7 availability",
      desc: "Your Twin replies, drafts, and coordinates around the clock.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="opacity-90">
          <path fill="currentColor" d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1Zm1 11h5v2h-7V6h2Z"/>
        </svg>
      ),
    },
    {
      title: "Your style & voice",
      desc: "It learns your tone and preferences for natural, on-brand responses.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="opacity-90">
          <path fill="currentColor" d="M4 21v-2l10-10 2 2-10 10H4Zm12.2-12.2 1.4-1.4a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0L13.2 5.8l3 3Z"/>
        </svg>
      ),
    },
    {
      title: "Multi-channel",
      desc: "Works across email, web, and messaging—managed from one place.",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden className="opacity-90">
          <path fill="currentColor" d="M3 5h18v6H3V5Zm0 8h10v6H3v-6Zm12 0h6v6h-6v-6Z"/>
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#0b1220] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Why Genio
          </h2>
          <p className="text-gray-300 mt-2">
            Build a reliable Twin that works the way you do—securely and continuously.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 hover:bg-white/[0.08] transition"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mb-4">
                {it.icon}
              </div>
              <h3 className="font-semibold text-lg">{it.title}</h3>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
