"use client";

const rows = [
  { id: "p_101", user: "Alice Johnson", amount: 24.00, currency: "USD", status: "paid" },
  { id: "p_102", user: "Bob Lee", amount: 9.99, currency: "USD", status: "refunded" },
  { id: "p_103", user: "Sara Kim", amount: 49.00, currency: "USD", status: "pending" },
];

export default function PaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Payments</h1>

      <div className="overflow-x-auto rounded border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">{r.id}</td>
                <td className="px-4 py-3">{r.user}</td>
                <td className="px-4 py-3">{r.amount.toFixed(2)} {r.currency}</td>
                <td className="px-4 py-3">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
