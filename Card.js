export default function Card({ title, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-sm opacity-80">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}