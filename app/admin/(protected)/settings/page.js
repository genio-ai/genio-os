import Sidebar from "../../components/Sidebar";

export default function AdminSettingsPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 260, borderRight: "1px solid #eee" }}>
        <Sidebar />
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ margin: 0, marginBottom: 12 }}>Settings</h1>

        <div style={{ border: "1px solid #eee", borderRadius: 8, padding: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            Site Name
            <input type="text" placeholder="Genio Admin"
                   style={{ width: "100%", padding: 10, marginTop: 6 }} />
          </label>
          <button style={{ padding: 10, fontWeight: 600 }}>Save</button>
        </div>
      </main>
    </div>
  );
}
