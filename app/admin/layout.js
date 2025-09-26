import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#0b0f17] text-[#e5e7eb] flex flex-col">
      <Topbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
