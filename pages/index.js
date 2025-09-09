// pages/index.js
import Image from "next/image";

function HeroHome() {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-12 pb-6">
      <h1 className="text-3xl md:text-5xl font-bold" style={{ color: "#1f9cff" }}>
        Route payments smartly.
      </h1>
      <p className="mt-3 text-gray-600 max-w-2xl">
        Send & accept payments globally — faster, cheaper, smarter.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="#send"
          className="rounded-lg border border-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-50"
        >
          Send Money
        </a>
        <a
          href="/accept"
          className="rounded-lg border border-gray-200 px-4 py-2 text-gray-900 hover:bg-gray-50"
        >
          Accept Payments
        </a>
        <a
          href="/links"
          className="rounded-lg px-4 py-2 font-semibold text-white"
          style={{
            background:
              "linear-gradient(90deg, rgba(34,211,238,1) 0%, rgba(16,185,129,1) 100%)",
          }}
        >
          Create Payment Link
        </a>
      </div>
    </section>
  );
}

function Card({ title, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* الهيدر: لوجو + اسم النظام */}
      <header className="mx-auto flex max-w-5xl items-center gap-3 px-4 pt-6">
        <Image src="/logo.png" alt="Genio Logo" width={48} height={48} priority />
        <h1 className="text-2xl font-semibold">Genio OS</h1>
      </header>

      {/* Hero */}
      <HeroHome />

      {/* كروت سريعة */}
      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card title="Settlement Speed" value="< 1h avg" />
          <Card title="Fees Saved" value="30–50%" />
          <Card title="Uptime" value="99.9%" />
        </div>
      </section>
    </main>
  );
}
