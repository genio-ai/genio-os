export default function Home() {
  const rows = [
    { name: 'Wise',        fee: '$6.00',  feePct: '0.6%', spread: '$1.00', spreadPct: '0.1%' },
    { name: 'PayGate',     fee: '$9.00',  feePct: '0.9%', spread: '$2.50', spreadPct: '0.3%' },
    { name: 'Flutterwave', fee: '$12.00', feePct: '1.2%', spread: '$2.00', spreadPct: '0.2%' },
    { name: 'Stripe',      fee: '$14.00', feePct: '1.4%', spread: '$1.50', spreadPct: '0.1%' },
  ];

  return (
    <div className="space-y-8">
      <section className="card">
        <h1 className="text-3xl font-extrabold">Genio Money OS Dashboard</h1>
        <p className="text-slate-300 mt-2">
          Route payments smartly. We simulate fees &amp; FX spreads and suggest the best provider.
        </p>

        <div className="card mt-6">
          <h2 className="text-xl font-semibold mb-4">Money Router</h2>

          <div className="grid gap-4">
            <div>
              <label className="block mb-1 text-slate-300">Amount</label>
              <input defaultValue="1000" type="number" className="input" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-slate-300">From currency</label>
                <select className="select">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-slate-300">To currency</label>
                <select className="select">
                  <option>EUR</option>
                  <option>USD</option>
                  <option>GBP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-green-400 font-semibold">● Best: Wise</div>
              <div className="text-slate-300">Est. fee <span className="font-semibold">$7.00</span></div>
            </div>

            <button className="btn w-full">USD → EUR</button>
          </div>
        </div>
      </section>

      <section className="card">
        <h3 className="text-2xl font-bold mb-4">Provider comparison</h3>

        <table className="table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Fee</th>
              <th>FX Spread</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="rounded-xl">
                <td className="font-semibold">{r.name}</td>
                <td>
                  {r.fee} <span className="text-slate-400">({r.feePct})</span>
                </td>
                <td>
                  {r.spread} <span className="text-slate-400">({r.spreadPct})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
