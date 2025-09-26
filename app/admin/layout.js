export default function AdminLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        background: "#0b1020",
        color: "#e6e8ee",
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
