// pages/support.js
import { useState } from "react";

export default function Support() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    // Placeholder submit: open mailto prefilled (no backend yet)
    const body =
      `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`;
    window.location.href = `mailto:support@genio.systems?subject=${encodeURIComponent(
      "[Genio Support] " + (form.subject || "")
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Support</h1>
        <p style={styles.subtitle}>
          Need help? Email{" "}
          <a href="mailto:support@genio.systems" style={styles.link}>
            support@genio.systems
          </a>{" "}
          or use the form below.
        </p>
      </header>

      <main style={styles.main}>
        <form onSubmit={onSubmit} style={styles.form} noValidate>
          <Field label="Name" name="name" value={form.name} onChange={onChange} />
          <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} />
          <Field label="Subject" name="subject" value={form.subject} onChange={onChange} />
          <TextArea
            label="Message"
            name="message"
            rows={6}
            value={form.message}
            onChange={onChange}
          />

          <button type="submit" style={styles.button}>
            Send (placeholder)
          </button>

          {sent && (
            <p style={styles.note}>
              Message window opened. If it didn’t, email us directly:
              {" "}
              <a href="mailto:support@genio.systems" style={styles.link}>support@genio.systems</a>
            </p>
          )}
        </form>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2025 Genio Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange }) {
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
        style={styles.input}
        autoComplete="off"
        required={name !== "subject"} // subject optional
      />
    </div>
  );
}

function TextArea({ label, name, rows = 4, value, onChange }) {
  const id = `field-${name}`;
  return (
    <div style={styles.field}>
      <label htmlFor={id} style={styles.label}>{label}</label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        style={{ ...styles.input, height: "auto", minHeight: 120, resize: "vertical" }}
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
  link: { color: "#FFD54A", textDecoration: "none" },
  main: { flex: 1, padding: "24px 16px", maxWidth: 820, margin: "0 auto" },
  form: { marginTop: 8 },
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
  button: {
    marginTop: 12,
    background: "#FFD54A",
    color: "#102244",
    border: "none",
    borderRadius: 12,
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  note: { marginTop: 10, color: "rgba(255,255,255,0.85)" },
  footer: {
    padding: 16,
    borderTop: "1px solid rgba(255,255,255,0.1)",
    textAlign: "center",
  },
  footerText: { fontSize: 14, color: "rgba(255,255,255,0.7)", margin: 0 },
};
