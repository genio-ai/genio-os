export const metadata = {
  title: 'Services – Genio OS',
};

export default function ServicesPage() {
  const items = [
    { name: 'Auth', desc: 'User login & session management' },
    { name: 'Storage', desc: 'Upload & serve files' },
    { name: 'Analytics', desc: 'Basic traffic insights' },
  ];

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Services</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => (
          <div key={s.name} className="rounded-lg border p-4">
            <h2 className="text-lg font-medium">{s.name}</h2>
            <p className="text-sm text-gray-600">{s.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
