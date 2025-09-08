export const metadata = {
  title: 'Services – Genio OS',
};

export default function ServicesPage() {
  const items = [
    { name: 'Auth', desc: 'User login & session management' },
    { name: 'Storage', desc: 'Upload & serve files' },
    { name: 'Analytics', desc: 'Basic usage statistics' },
  ];

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Our Services</h1>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.name} className="border p-4 rounded">
            <h2 className="font-medium">{item.name}</h2>
            <p className="text-gray-600">{item.desc}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
