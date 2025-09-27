"use client";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
