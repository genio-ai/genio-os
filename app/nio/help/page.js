"use client";

export default function HelpPage() {
  const faqs = [
    {
      q: "What is Nio?",
      a: "Nio is your intelligent assistant inside Genio OS, designed to help manage tasks, content, and automation.",
    },
    {
      q: "How do I create my digital twin?",
      a: "Go to the Twin section, record your consent, upload your voice sample, and complete the setup wizard.",
    },
    {
      q: "Where can I view my usage and analytics?",
      a: "You can access all insights and stats from the Analytics page in your Nio dashboard.",
    },
    {
      q: "How do I contact support?",
      a: "Visit the Contact page and send a message directly to the Genio support team.",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">Help & Documentation</h1>
      <div className="space-y-4 max-w-2xl">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow hover:shadow-lg transition-all"
          >
            <h2 className="text-lg font-medium mb-2 text-blue-400">{item.q}</h2>
            <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
