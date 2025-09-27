"use client";

const rows = [
  { id: "s_001", user: "Alice Johnson", plan: "Pro", renewsAt: "2025-12-01", active: true },
  { id: "s_002", user: "Bob Lee", plan: "Starter", renewsAt: "2025-11-10", active: true },
  { id: "s_003", user: "Sara Kim", plan: "Trial", renewsAt: "2025-10-15", active: false },
];

export default function SubscriptionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Subscriptions</h1>

      <div className="overflow-x-auto rounded border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Plan</th>
              <th className="px-4 py-3 text-left">Renews At</th>
              <th className="px-4 py-3 text-left">Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">{r.id}</td>
                <td className="px-4 py-3">{r.user}</td>
                <td className="px-4 py-3">{r.plan}</td>
                <td className="px-4 py-3">{r.renewsAt}</td>
                <td className="px-4 py-3">{r.active ? "yes" : "no"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
