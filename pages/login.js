// pages/login.js
import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Placeholder only — no backend yet
    if (!form.email || !form.password) {
      setMsg("Please enter your email and password.");
      return;
    }
    setMsg("Login placeholder — backend coming soon.");
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Login</h1>
        <p style={styles.subtitle}>
          Access your Genio Twin Studio account.
        </p>
      </header>

      <main style={styles.main}>
        <form onSubmit={onSubmit} style={styles.form} noValidate>
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@domain.com"
            value={form.email}
            onChange={onChange}
          />

          <div style={styles.field}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <div style={styles.pwWrap}>
              <input
                id="password"
                name="password"
                type={showPw ? "text" : "password"}
                value={form.password}
                onChange={onChange}
                placeholder="••••••••"
                style={{ ...styles.input, paddingRight: 44 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={styles.eyeBtn}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div style={styles.actions}>
            <button type="submit" style={styles.primaryBtn}>
              Log in
            </button>
            <a href="/" style={styles.linkLight}>Back to home</a>
          </div>

          {msg && <p style={styles.note}>{msg}</p>}
        </form>

        <div style={styles.divider} />

        <section aria-label="coming soon" style={styles.coming}>
          <h2 style={styles.subtitle}>Coming next</h2>
          <ul style={styles.list}>
            <li>Magic link & social sign-in</li>
            <li>Dashboard access for your Twin</li>
            <li>Two-factor authentication</li>
          </ul>
        </section>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 Genio Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, placeholder }) {
  const id = `field-${name}`;
  return (
    <div style={styles.field}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={styles.input}
        autoComplete={name === "email" ? "email" : "off"}
        required
      />
    </div>
  );
}

const styles = {
  page: {
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    background: "#0B1D3A",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "24px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
  title: { margin: 0, fontSize: 28, fontWeight: 800 },
  subtitle: { marginTop: 8, color: "rgba(255,255,255,0.85)" },
  main: { flex: 1, padding: "24px 16px", maxWidth: 420, margin: "0 auto" },
  form: { marginTop: 12 },
  field: { margin: "10px 0" },
  label: { display: "block", marginBottom: 6, fontWeight: 600 },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#0A1A35",
    color: "#fff",
    fontSize: 15,
    outline: "none",
  },
  pwWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    top: 4,
    right: 6,
    height: 34,
    padding: "0 10px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#13264a",
    color: "#fff",
    fontSize: 12,
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  primaryBtn: {
    background: "#FFD54A",
    color: "#102244",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  linkLight: { color: "#FFD54A", textDecoration: "none" },
  note: { marginTop: 10, color: "rgba(255,255,255,0.85)" },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.1)",
    margin: "24px 0",
  },
  coming: { opacity: 0.95 },
  list: {
    margin: "8px 0 0",
    padding: "0 0 0 20px",
    color: "rgba(255,255,255,0.85)",
    fontSize: 15,
    lineHeight: 1.6,
  },
  footer: {
    padding: 16,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  },
  footerText: { fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0 },
};
