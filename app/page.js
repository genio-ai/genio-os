export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold">Genio Money OS Dashboard</h1>
          <p className="text-gray-400">
            Route payments smartly. We simulate fees & FX spreads and suggest the best provider.
          </p>
        </header>

        {/* Money Router */}
        <section className="bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
          <h2 className="text-xl font-semibold">Money Router</h2>
          <form className="space-y-4">
            <input
              type="number"
              defaultValue="1000"
              className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none"
            />
            <div className="flex space-x-2">
              <select className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700">
                <option>USD</option>
              </select>
              <select className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700">
                <option>EUR</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg font-semibold">
              USD → EUR
            </button>
          </form>
        </section>

        {/* Provider Comparison */}
        <section className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Provider Comparison</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400">
                <th className="pb-2">Provider</th>
                <th className="pb-2">Fee</th>
                <th className="pb-2">FX Spread</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td>Wise</td>
                <td>$6.00 (0.6%)</td>
                <td>$1.00 (0.1%)</td>
              </tr>
              <tr>
                <td>PayGate</td>
                <td>$9.00 (0.9%)</td>
                <td>$2.50 (0.3%)</td>
              </tr>
              <tr>
                <td>Flutterwave</td>
                <td>$12.00 (1.2%)</td>
                <td>$2.00 (0.2%)</td>
              </tr>
              <tr>
                <td>Stripe</td>
                <td>$14.00 (1.4%)</td>
                <td>$1.50 (0.1%)</td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className="text-center text-gray-500 text-sm">
          © 2025 Genio Systems
        </footer>
      </div>
    </main>
  );
}
