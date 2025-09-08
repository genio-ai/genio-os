import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0B1220] text-white">
        <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">Genio Money OS Dashboard</h1>
            <p className="text-sm opacity-80">
              Route payments across providers with transparent fees & FX.
            </p>
          </header>

          <section className="bg-gray-800/50 rounded-xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">Money Router</h2>
            <form className="space-y-4">
              <input
                type="number"
                defaultValue="1000"
                placeholder="Amount"
                className="w-full px-4 py-3 rounded-md bg-gray-900 border border-white/10"
              />
              <div className="flex gap-3">
                <select
                  className="flex-1 px-4 py-3 rounded-md bg-gray-900 border border-white/10"
                  defaultValue="USD"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>ZAR</option>
                  <option>MZN</option>
                </select>
                <select
                  className="flex-1 px-4 py-3 rounded-md bg-gray-900 border border-white/10"
                  defaultValue="EUR"
                >
                  <option>EUR</option>
                  <option>USD</option>
                  <option>ZAR</option>
                  <option>MZN</option>
                </select>
              </div>
            </form>

            <div className="flex items-center gap-2 bg-gray-900/60 border border-emerald-500/30 rounded-lg p-4">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              <span>
                Best: <strong>Wise</strong>
              </span>
            </div>
          </section>

          <section className="bg-gray-800/50 rounded-xl p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold mb-4">Estimated fees</h3>
            <table className="w-full text-sm">
              <thead className="text-gray-400">
                <tr>
                  <th className="text-left py-2">Provider</th>
                  <th className="text-left py-2">Transfer fee</th>
                  <th className="text-left py-2">FX spread</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td>Wise</td>
                  <td>$7.00</td>
                  <td>$1.00 (0.1%)</td>
                </tr>
                <tr>
                  <td>PayGate</td>
                  <td>$9.00</td>
                  <td>$1.50 (0.15%)</td>
                </tr>
                <tr>
                  <td>Flutterwave</td>
                  <td>$12.00</td>
                  <td>$2.00 (0.2%)</td>
                </tr>
                <tr>
                  <td>Stripe</td>
                  <td>$14.00</td>
                  <td>$1.50 (0.1%)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <footer className="border-t border-white/10 pt-6 text-center text-xs opacity-60">
            Genio is a technology platform. We don’t hold customer funds. Providers handle processing &amp; settlement.
          </footer>
        </div>
      </main>
    </>
  );
}
