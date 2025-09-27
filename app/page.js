"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Genio OS Home</h1>
        <p className="opacity-75 mt-2">App Router is active.</p>
        <a href="/admin" className="inline-block mt-6 underline">Go to Admin</a>
      </div>
    </main>
  );
}
