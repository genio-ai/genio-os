"use client";

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded border border-white/10 p-4 bg-white/5">
      <div className="text-sm opacity-80">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint ? <div className="text-xs opacity-60 mt-1">{hint}</div> : null}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Overview</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Active Users" value="123" hint="last 24h" />
        <StatCard title="Minutes Used" value="2,145" hint="current month" />
        <StatCard title="Errors" value="3" hint="last 24h" />
      </div>

      <div className="mt-8 rounded border border-white/10 p-4 bg-white/5">
        <h2 className="font-semibold mb-2">Recent Activity</h2>
        <ul className="text-sm list-disc ml-6 space-y-1 opacity-90">
          <li>User alice@example.com upgraded to Pro</li>
          <li>Worker queue scaled to 5 instances</li>
          <li>New TTS provider added to gateway</li>
        </ul>
      </div>
    </div>
  );
}
