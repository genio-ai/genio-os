// pages/router.js
const rows = [
  { method: "Document OCR", speed: "Fast", accuracy: "High", status: "Stable" },
  { method: "Selfie + Liveness", speed: "Medium", accuracy: "Very High", status: "Stable" },
  { method: "Sanctions & PEP", speed: "Fast", accuracy: "High", status: "Live feed" },
  { method: "Address Proof", speed: "Medium", accuracy: "Medium", status: "Optional" },
];

export default function Router() {
  return (
    <main className="min-h-screen bg-[#0B1D3A] text-white p-6">
      <section className="mx-auto max-w-5xl rounded-2xl bg-white/5 border border-white/10 p-6 shadow-xl">
        <h2 className="text-3xl font-extrabold mb-4">Verification Router</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="p-3">Method</th>
                <th className="p-3">Speed</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.method} className="border-t border-white/10">
                  <td className="p-3">{r.method}</td>
                  <td className="p-3">{r.speed}</td>
                  <td className="p-3">{r.accuracy}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">
                    <button className="rounded-xl px-3 py-1 font-semibold bg-gradient-to-r from-[#27E38A] to-[#27D4F0] text-black">
                      Run Check
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
