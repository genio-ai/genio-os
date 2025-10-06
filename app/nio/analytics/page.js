"use client";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching analytics data
    setTimeout(() => {
      setStats([
        { title: "Active Twins", value: 128 },
        { title: "Monthly Users", value: 540 },
        { title: "Voice Minutes", value: "12.4k" },
        { title: "Avg Response Time", value: "1.8s" },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-2xl font-semibold mb-6">Analytics Dashboard</h1>

      {loading ? (
        <p className="text-gray-400">Loading analytics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-lg p-5 shadow hover:shadow-lg transition-all"
            >
              <h2 className="text-gray-400 text-sm mb-1">{item.title}</h2>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
