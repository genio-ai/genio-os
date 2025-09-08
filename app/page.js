export const metadata = { title: 'Genio Money OS Dashboard' };

export default function Dashboard() {
  const providers = [
    { name: 'Wise',        fee: 6.00,  feePct: '0.6%',  fx: 1.00, fxPct: '0.1%' },
    { name: 'PayGate',     fee: 9.00,  feePct: '0.9%',  fx: 2.50, fxPct: '0.3%' },
    { name: 'Flutterwave', fee: 12.00, feePct: '1.2%',  fx: 2.00, fxPct: '0.2%' },
    { name: 'Stripe',      fee: 14.00, feePct: '1.4%',  fx: 1.50, fxPct: '0.1%' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Shell */}
      <div className="mx-auto max-w-7xl flex">

        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-white/10 bg-neutral-950/60 sticky top-0 h-screen hidden md:block">
          <div className="p-4 text-lg font-semibold tracking-wide">GENIO OS</div>

          <nav className="px-3 space-y-6 text-sm">
            <Section title="Money OS" items={[
              { label: 'Overview' },
              { label: 'Money Router', active: true },
              { label: 'Transactions' },
            ]}/>
            <Section title="Compliance" items={[
              { label: 'KYC' },
              { label: 'AML' },
            ]}/>
            <Section title="System" items={[
              { label: 'Providers' },
              { label: 'Settings' },
            ]}/>
            <div className="p-3 text-xs text-white/40">v0.1 · AI-built, AI-run</div>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-8">
          <h1 className="text-xl md:text-2xl font-bold">Genio Money OS Dashboard</h1>

          {/* Money Router Card */}
          <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.03] shadow-lg">
            <div className="p-4 md:p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold">Money Router</h2>
              <p className="text-sm text-white/60 mt-1">
                Enter an amount and currencies. We’ll simulate fees & FX spread and suggest a provider.
              </p>
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {/* Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Amount">
                  <input defaultValue="1000" className="w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2 outline-none focus:ring-2 focus:ring-white/20" />
                </Field>

                <Field label="From currency">
                  <select className="w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2">
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </Field>

                <Field label="To currency">
                  <select className="w-full rounded-md bg-neutral-900 border border-white/10 px-3 py-2">
                    <option>EUR</option>
                    <option>USD</option>
                    <option>GBP</option>
                  </select>
                </Field>
              </div>

              {/* Recommendation */}
              <div className="rounded-md border border-white/10 bg-white/[0.02] p-4 flex flex-wrap items-center gap-3">
                <Badge green>Best: Wise</Badge>
                <Badge>Est. fee $7.00</Badge>
                <div className="grow" />
                <Badge>USD → EUR</Badge>
              </div>

              {/* Providers Table */}
              <div>
                <h3 className="font-semibold mb-3">Provider comparison</h3>
                <div className="overflow-x-auto rounded-lg border border-white/10">
                  <table className="min-w-full text-sm">
                    <thead className="bg-white/[0.03] text-white/70">
                      <tr>
                        <Th>Provider</Th>
                        <Th>Fee</Th>
                        <Th>FX Spread</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {providers.map((p, i) => (
                        <tr key={p.name} className={i === 0 ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'}>
                          <Td>{p.name}</Td>
                          <Td>${p.fee.toFixed(2)} <span className="text-white/40">({p.feePct})</span></Td>
                          <Td>${p.fx.toFixed(2)} <span className="text-white/40">({p.fxPct})</span></Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ---------- tiny UI helpers (inline for speed) ---------- */
function Section({ title, items }) {
  return (
    <div>
      <div className="px-2 pb-2 text-[11px] uppercase tracking-wider text-white/40">{title}</div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.label}>
            <a className={`block rounded-md px-3 py-2 hover:bg-white/[0.06] ${it.active ? 'bg-white/[0.08]' : ''}`}>
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs mb-1 text-white/60">{label}</div>
      {children}
    </label>
  );
}
function Badge({ children, green }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs ${green ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/[0.06] text-white/80'}`}>
      {green && <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />}
      {children}
    </span>
  );
}
function Th({ children }) {
  return <th className="text-left px-4 py-3 font-medium">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 border-t border-white/10">{children}</td>;
}
