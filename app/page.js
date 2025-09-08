// app/page.js

function Card({ children, className = "" }) {
  return (
    <section className={`rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/30 ${className}`}>
      {children}
    </section>
  );
}

/* شعارات الشركاء — SVGs مضمّنة */
function LogoWise({ size = 80 }) {
  return (
    <svg viewBox="0 0 256 256" width={size} height={size}>
      <path fill="#0A5AFF" d="M41 32h97l-22 48h41l-92 144 27-88H58l30-56H41z"/>
    </svg>
  );
}
function LogoStripe({ size = 80 }) {
  return (
    <svg viewBox="0 0 256 256" width={size} height={size}>
      <path fill="#635BFF" d="M128 28c55 0 100 45 100 100s-45 100-100 100S28 183 28 128 73 28 128 28z"/>
      <path fill="#fff" d="M168 152c0 22-18 36-43 36-10 0-19-2-26-6v-25c7 5 15 8 25 8 8 0 13-3 13-8 0-6-5-8-15-12-17-7-28-16-28-33 0-19 16-33 40-33 10 0 18 2 24 5v24c-7-4-14-6-23-6-7 0-12 3-12 8 0 5 5 8 16 12 18 7 29 16 29 30z"/>
    </svg>
  );
}
function LogoFlutterwave({ size = 80 }) {
  return (
    <svg viewBox="0 0 256 256" width={size} height={size}>
      <circle cx="128" cy="128" r="100" fill="#FFB703"/>
      <path d="M88 156c14-30 34-64 75-66 8 0 16 2 25 6-15 1-27 6-36 15-18 18-20 47-53 55-7 2-11-3-11-10z" fill="#111827"/>
    </svg>
  );
}
function LogoPayGate({ size = 80 }) {
  return (
    <svg viewBox="0 0 256 256" width={size} height={size}>
      <rect x="36" y="40" width="184" height="176" rx="22" fill="#10B981"/>
      <path d="M76 128h64a24 24 0 0 1 0 48H76v-48zm0-16V80h88a24 24 0 0 1 0 48H76z" fill="#0b1220"/>
    </svg>
  );
}

export default function Home() {
  const providers = [
    { name: 'Wise',        fee: 6.00,  feePct: '0.6%',  spread: 1.00,  spreadPct: '0.1%' },
    { name: 'PayGate',     fee: 9.00,  feePct: '0.9%',  spread: 2.50,  spreadPct: '0.3%' },
    { name: 'Flutterwave', fee: 12.00, feePct: '1.2%',  spread: 2.00,  spreadPct: '0.2%' },
    { name: 'Stripe',      fee: 14.00, feePct: '1.4%',  spread: 1.50,  spreadPct: '0.1%' },
  ];

  return (
    <div className="space-y-6">
      {/* Hero خفيف */}
      <Card className="p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Genio Money OS Dashboard</h1>
        <p className="mt-2 text-white/70">
          Route payments smartly. We simulate fees & FX spreads and suggest the best provider.
        </p>
      </Card>

      {/* Money Router */}
      <Card className="p-6 md:p-8">
        <h2 className="text-xl font-semibold">Money Router</h2>
        <p className="text-sm text-white/70 mt-1">
          Enter an amount and currencies. We’ll simulate fees & FX spread and suggest a provider.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <label className="block">
            <div className="text-xs text-white/60 mb-1">Amount</div>
            <input defaultValue="1000" className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" />
          </label>
          <label className="block">
            <div className="text-xs text-white/60 mb-1">From currency</div>
            <select className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2">
              <option>USD</option><option>EUR</option><option>GBP</option>
            </select>
          </label>
          <label className="block">
            <div className="text-xs text-white/60 mb-1">To currency</div>
            <select className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2">
              <option>EUR</option><option>USD</option><option>GBP</option>
            </select>
          </label>
        </div>

        {/* Recommendation */}
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm">Best: <b>Wise</b></span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
            <span className="text-sm">Est. fee <b>$7.00</b></span>
          </div>
          <button className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-500 transition">
            USD → EUR
          </button>
        </div>
      </Card>

      {/* Provider comparison */}
      <Card className="p-6 md:p-8">
        <h3 className="text-lg font-semibold">Provider comparison</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-white/70">
              <tr>
                <th className="py-2 pr-4">Provider</th>
                <th className="py-2 pr-4">Fee</th>
                <th className="py-2 pr-4">FX Spread</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p, i) => (
                <tr key={p.name} className={i === 0 ? "bg-emerald-500/5" : "hover:bg-white/5"}>
                  <td className="py-3 pr-4">{p.name}</td>
                  <td className="py-3 pr-4">
                    ${p.fee.toFixed(2)}{" "}
                    <span className="text-xs text-white/50">({p.feePct})</span>
                  </td>
                  <td className="py-3 pr-4">
                    ${p.spread.toFixed(2)}{" "}
                    <span className="text-xs text-white/50">({p.spreadPct})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Partners / Connected providers */}
      <Card className="p-5 md:p-6">
        <h4 className="font-semibold mb-4">Connected providers</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 place-items-center">
          <div className="opacity-90"><LogoWise /></div>
          <div className="opacity-90"><LogoStripe /></div>
          <div className="opacity-90"><LogoFlutterwave /></div>
          <div className="opacity-90"><LogoPayGate /></div>
        </div>
      </Card>
    </div>
  );
}
