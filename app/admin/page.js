export const dynamic = "force-static";

export default function AdminDashboard() {
  return (
    <div style={{
      backgroundColor: "#0d1117",
      color: "#fff",
      minHeight: "100vh",
      padding: "40px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ fontSize: "28px", marginBottom: "30px" }}>
        Admin Dashboard
      </h1>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px"
      }}>
        <a href="/admin/users" style={cardStyle}>Users</a>
        <a href="/admin/payments" style={cardStyle}>Payments</a>
        <a href="/admin/subscriptions" style={cardStyle}>Subscriptions</a>
        <a href="/admin/events" style={cardStyle}>Events</a>
        <a href="/admin/jobs" style={cardStyle}>Jobs</a>
        <a href="/admin/twins" style={cardStyle}>Twins</a>
        <a href="/admin/knowledge" style={cardStyle}>Knowledge</a>
        <a href="/admin/settings" style={cardStyle}>Settings</a>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#161b22",
  padding: "20px",
  borderRadius: "8px",
  textDecoration: "none",
  color: "#fff",
  fontWeight: "bold",
  textAlign: "center",
  border: "1px solid #30363d"
};
