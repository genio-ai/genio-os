export default function Features() {
  const items = [
    {
      title: "Privacy-first",
      desc: "Your raw media stays inside Genio. You control consents and retention.",
      icon: "🔒",
    },
    {
      title: "24/7 availability",
      desc: "Your Twin replies, drafts, and coordinates around the clock.",
      icon: "⏰",
    },
    {
      title: "Your style & voice",
      desc: "It learns your tone and preferences for natural, on-brand responses.",
      icon: "🗣️",
    },
    {
      title: "Multi-channel",
      desc: "Works across email, web, and messaging—managed from one place.",
      icon: "🌐",
    },
  ];

  return (
    <section className="bg-[#0b1220] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Why choose Genio
          </h2>
          <p className="text-gray-300 mt-2">
            Build a reliable Twin that works the way you do—securely and continuously.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 hover:bg-white/[0.08] transition"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-4">
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
