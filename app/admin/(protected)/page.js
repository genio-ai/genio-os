import Sidebar from "../components/Sidebar";

export default function AdminOverviewPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 260, borderRight: "1px solid #eee" }}>
        <Sidebar />
      </aside>
      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ margin: 0, marginBottom: 12 }}>Admin Overview</h1>
        <p style={{ margin: 0 }}>Welcome to the admin dashboard.</p>
      </main>
    </div>
  );
}
