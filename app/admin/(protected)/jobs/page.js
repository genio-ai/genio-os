import Sidebar from "../../components/Sidebar";

export default function AdminJobsPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 260, borderRight: "1px solid #eee" }}>
        <Sidebar />
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ margin: 0, marginBottom: 12 }}>Jobs</h1>

        <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
          <p style={{ margin: 0 }}>No jobs yet.</p>
        </div>
      </main>
    </div>
  );
}
