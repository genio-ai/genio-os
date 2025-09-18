import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative min-h-[88vh] pt-28 overflow-hidden bg-[#0b1220] text-white"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <picture>
          <source srcSet="/hero/model.webp" type="image/webp" />
          <img
            src="/hero/model.jpg"
            alt=""
            className="w-full h-full object-cover object-center opacity-80"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        {/* Overlay + glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220]/60 via-[#0b1220]/70 to-[#0b1220]/92" />
        <div className="absolute -right-24 -top-24 w-[520px] h-[520px] rounded-full blur-3xl bg-[#7db2ff33]" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-tight tracking-tight">
            Create your smart twin
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-200/90">
            It writes, speaks, appears, and responds for you — 24/7. Built from your
            style, voice, and preferences. Private by design.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition shadow-[0_10px_30px_rgba(250,204,21,0.28)]"
            >
              Create My Twin
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-white/15 text-white hover:bg-white/5 transition"
            >
              See how it works
            </Link>
          </div>

          <div className="mt-4 text-sm text-gray-300/80">
            Your data stays inside Genio · No raw media is shared with third parties.
          </div>
        </div>
      </div>

      {/* Subtle glass card on the right (mock twin silhouette) */}
      <div className="pointer-events-none hidden lg:block absolute right-10 bottom-12">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 w-[360px]">
          <div className="h-40 w-full rounded-xl bg-gradient-to-br from-white/10 to-white/0 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_70%_40%,rgba(125,178,255,0.18),transparent)]" />
            <div className="absolute inset-0 bg-[url('/hero/twin-mask.svg')] bg-contain bg-center bg-no-repeat opacity-70" />
          </div>
          <div className="mt-4 space-y-1">
            <div className="h-3 w-2/3 bg-white/20 rounded" />
            <div className="h-3 w-1/2 bg-white/10 rounded" />
            <div className="h-3 w-3/5 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
}
