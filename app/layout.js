"use client";
import Topbar from "../../components/Topbar";

export default function AdminLayout({ children }) {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
