// app/page.js
export default function Home() {
  const providers = [
    { name: 'Wise', fee: 6.00, feePct: '0.6%', spread: 1.00, spreadPct: '0.1%' },
    { name: 'PayGate', fee: 9.00, feePct: '0.9%', spread: 2.50, spreadPct: '0.3%' },
    { name: 'Flutterwave', fee: 12.00, feePct: '1.2%', spread: 2.00, spreadPct: '0.2%' },
    { name: 'Stripe', fee: 14.00, feePct: '1.4%', spread: 1.50, spreadPct: '0.1%' },
  ];

  return (
    <main className="min-h-[calc(100vh-120px)] bg-slate-950 text-slate-100">
      {/* شريط علوي بسيط يحافظ على نفس الـ layout الحالي */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Genio Money OS Dashboard
        </h1>

        {/* بطاقة Money Router */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-5 md:p-6 shadow-lg">
          <h2 className="text-xl font-semibold">Money Router</h2>
          <p className="mt-1 text-sm text-slate-400">
            Enter an amount and currencies. We’ll simulate fees & FX spread and suggest a provider.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="col-span-1">
              <label className="mb-1 block text-xs text-slate-400">Amount</label>
              <input
                defaultValue="1000"
                className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-slate-100 outline-none focus:border-blue-500"
              />
            </div>
            <div className="col-span-1">
              <label className="mb-1 block text-xs text-slate-400">From currency</label>
              <select className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className="mb-1 block text-xs text-slate-400">To currency</label>
              <select className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2">
                <option>EUR</option>
                <option>USD</option>
                <option>GBP</option>
              </select>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm">Best: <b>Wise</b></span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2">
              <span className="text-sm">Est. fee <b>$7.00</b></span>
            </div>
            <button className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium hover:bg-blue-500 transition">
              USD → EUR
            </button>
          </div>
        </section>

        {/* جدول المقارنة */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur p-5 md:p-6">
          <h3 className="text-lg font-semibold">Provider comparison</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-slate-400">
                  <th className="py-2 pr-4">Provider</th>
                  <th className="py-2 pr-4">Fee</th>
                  <th className="py-2 pr-4">FX Spread</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p, i) => (
                  <tr key={p.name} className={i === 0 ? 'bg-emerald-500/5' : ''}>
                    <td className="py-3 pr-4">{p.name}</td>
                    <td className="py-3 pr-4">
                      ${p.fee.toFixed(2)}{' '}
                      <span className="text-xs text-slate-400">({p.feePct})</span>
                    </td>
                    <td className="py-3 pr-4">
                      ${p.spread.toFixed(2)}{' '}
                      <span className="text-xs text-slate-400">({p.spreadPct})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* فوتر بسيط */}
        <footer className="mt-10 border-t border-slate-800 pt-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Genio Systems
        </footer>
      </div>
    </main>
  );
}
