// components/overview/StatCard.js
export default function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/30 p-4">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-xs text-white/40">{hint}</p> : null}
    </div>
  );
}
