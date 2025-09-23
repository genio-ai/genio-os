export default function OverviewPage() {
  const cards = [
    { label: "Users (total)", value: "—" },
    { label: "Active sessions", value: "—" },
    { label: "MRR", value: "—" },
    { label: "Jobs processing", value: "—" },
  ];
  const recent = [
    { ts: "—", type: "auth.login", user: "—", note: "—" },
    { ts: "—", type: "payment.succeeded", user: "—", note: "—" },
    { ts: "—", type: "tts.request", user: "—", note: "—" },
  ];
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded border bg-white p-4">
            <div className="text-sm text-gray-500">{c.label}</div>
            <div className="text-2xl font-bold">{c.value}</div>
          </div>
        ))}
      </section>
      <section className="rounded border bg-white">
        <div className="p-4 border-b font-medium">Latest events</div>
        <div className="p-4">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="py-2">Time</th>
                <th className="py-2">Type</th>
                <th className="py-2">User</th>
                <th className="py-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2">{r.ts}</td>
                  <td className="py-2">{r.type}</td>
                  <td className="py-2">{r.user}</td>
                  <td className="py-2">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
