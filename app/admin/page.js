// app/admin/page.js
import StatCard from "@/components/overview/StatCard";

export const dynamic = "force-static";

const mock = {
  metrics: [
    { label: "Active Users", value: "123", hint: "last 24h" },
    { label: "Minutes Used", value: "2,145", hint: "current month" },
    { label: "Errors", value: "3", hint: "last 24h" },
    { label: "MRR", value: "$1,240", hint: "recurring" },
  ],
  activity: [
    { id: 1, text: "User alice@example.com upgraded to Pro", time: "2h ago" },
    { id: 2, text: "Created new API key for project X", time: "5h ago" },
    { id: 3, text: "Payment succeeded: $49", time: "yesterday" },
  ],
};

export default function AdminOverview() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Overview</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mock.metrics.map((m) => (
          <StatCard key={m.label} label={m.label} value={m.value} hint={m.hint} />
        ))}
      </div>

      {/* Recent activity */}
      <div className="rounded-lg border border-white/10 bg-black/30">
        <div className="border-b border-white/10 p-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <ul className="divide-y divide-white/10">
          {mock.activity.map((a) => (
            <li key={a.id} className="p-4 flex items-start justify-between gap-4">
              <p className="text-sm">{a.text}</p>
              <span className="shrink-0 text-xs text-white/40">{a.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
