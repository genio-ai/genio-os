"use client";

const rows = [
  { id: "u_001", name: "Alice Johnson", email: "alice@example.com", role: "admin" },
  { id: "u_002", name: "Bob Lee", email: "bob@example.com", role: "user" },
  { id: "u_003", name: "Sara Kim", email: "sara@example.com", role: "user" },
];

export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      <div className="overflow-x-auto rounded border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-3">{r.id}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
