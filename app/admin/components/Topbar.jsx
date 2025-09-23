"use client";
import { useState } from "react";

export default function Topbar() {
  const [q, setQ] = useState("");
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4">
      <div className="text-sm text-gray-500">Admin</div>
      <div className="flex items-center gap-3">
        <input
          placeholder="Global search (email, ID, task...)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-10 w-[320px] rounded border px-3"
        />
        <button className="h-10 rounded px-3 border hover:bg-gray-50">Search</button>
      </div>
    </header>
  );
}
