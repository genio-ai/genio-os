import Sidebar from "../../components/Sidebar";

export default function AdminTwinsPage() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside style={{ width: 260, borderRight: "1px solid #eee" }}>
        <Sidebar />
      </aside>

      <main style={{ flex: 1, padding: 24 }}>
        <h1 style={{ margin: 0, marginBottom: 12 }}>Twins</h1>

        <div style={{ overflowX: "auto", border: "1px solid #eee", borderRadius: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#fafafa" }}>
                <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>ID</th>
                <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>Owner</th>
                <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>Status</th>
                <th style={{ textAlign: "left", padding: 12, borderBottom: "1px solid #eee" }}>Created</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: 12, borderBottom: "1px solid #f2f2f2" }}>—</td>
                <td style={{ padding: 12, borderBottom: "1px solid #f2f2f2" }}>—</td>
                <td style={{ padding: 12, borderBottom: "1px solid #f2f2f2" }}>—</td>
                <td style={{ padding: 12, borderBottom: "1px solid #f2f2f2" }}>—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
