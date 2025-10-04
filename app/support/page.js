"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "general",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    document.title = "Support · Genio";
  }, []);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    if (!form.name || !form.email || !form.message) {
      setMsg("Please fill all required fields.");
      return;
    }
    setBusy(true);
    try {
      // TODO: replace with POST /api/support
      await new Promise((r) => setTimeout(r, 500));
      setMsg("Thanks! We received your request and will get back to you.");
      setForm({ name: "", email: "", topic: "general", message: "" });
    } catch {
      setMsg("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <main className="wrap">
        {/* Header */}
        <header className="header">
          <Link href="/" className="brand">
            Genio
          </Link>
          <nav className="nav">
            <Link href="/about" className="navLink">
              About
            </Link>
            <Link href="/login" className="btn ghost">
              Log in
            </Link>
            <Link href="/signup" className="btn primary">
              Sign up
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="hero">
          <h1>Support</h1>
          <p>We’re here to help. Browse quick answers or contact us.</p>
        </section>

        {/* Quick FAQ */}
        <section className="grid">
          <div className="faq">
            <h3>How is my data handled?</h3>
            <p>
              Raw media (voice/video) is stored internally. Text-only prompts may be sent to AI if you opt in.
            </p>
          </div>
          <div className="faq">
            <h3>Do I need phone verification?</h3>
            <p>Yes. Phone is required for account security and optional WhatsApp notifications.</p>
          </div>
          <div className="faq">
            <h3>Can I edit or delete my Twin later?</h3>
            <p>Yes. You have full control: edit style, revoke consents, and delete data.</p>
          </div>
        </section>

        {/* Contact form */}
        <section className="formWrap">
          <form onSubmit={submit} className="form" noValidate>
            <h2>Contact support</h2>
            <div className="row">
              <div className="field">
                <label>Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@domain.com"
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Topic</label>
              <select
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              >
                <option value="general">General</option>
                <option value="billing">Billing</option>
                <option value="privacy">Privacy</option>
                <option value="twin">Twin setup</option>
              </select>
            </div>

            <div className="field">
              <label>Message</label>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
                required
              />
            </div>

            {msg && <div className="note">{msg}</div>}

            <button className="btn primary" type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send"}
            </button>
          </form>
        </section>

        <footer className="footer">
          <p>© {new Date().getFullYear()} Genio · All rights reserved.</p>
        </footer>
      </main>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #0a1730;
          color: #e6eef8;
        }
        .header {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          text-decoration: none;
        }
        .nav {
          display: flex;
          gap: 14px;
          align-items: center;
        }
        .navLink {
          color: #c9d6e5;
          text-decoration: none;
          font-size: 15px;
        }
        .btn {
          border-radius: 10px;
          padding: 8px 16px;
          font-weight: 600;
          text-decoration: none;
        }
        .btn.ghost {
          border: 1px solid #ffd54d;
          color: #ffd54d;
        }
        .btn.ghost:hover {
          background: #ffd54d22;
        }
        .btn.primary {
          background: #ffd54d;
          color: #0a1730;
        }
        .btn.primary:hover {
          filter: brightness(0.95);
        }

        .hero {
          max-width: 900px;
          margin: 0 auto;
          padding: 64px 20px 16px;
          text-align: center;
        }
        .hero h1 {
          font-size: 40px;
          margin-bottom: 10px;
          background: linear-gradient(90deg, #ffd54d, #ffae00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero p {
          color: #c9d6e5;
        }

        .grid {
          max-width: 1100px;
          margin: 24px auto;
          padding: 0 20px;
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
        .faq {
          background: #0f1b33;
          border: 1px solid #22304a;
          border-radius: 14px;
          padding: 18px;
        }
        .faq h3 {
          margin: 0 0 6px;
        }
        .faq p {
          margin: 0;
          color: #b8c8df;
        }

        .formWrap {
          max-width: 900px;
          margin: 8px auto 32px;
          padding: 0 20px;
          width: 100%;
        }
        .form {
          background: #0f1b33;
          border: 1px solid #22304a;
          border-radius: 14px;
          padding: 18px;
        }
        .form h2 {
          margin: 0 0 12px;
        }
        .row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        @media (max-width: 780px) {
          .row {
            grid-template-columns: 1fr;
          }
        }
        .field {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
        }
        .field label {
          font-size: 14px;
          margin-bottom: 6px;
          color: #dbe7fb;
        }
        input,
        select,
        textarea {
          background: #0b1730;
          border: 1px solid #2a3a56;
          color: #e6eef8;
          border-radius: 12px;
          padding: 12px 14px;
          outline: none;
        }
        input:focus,
        select:focus,
        textarea:focus {
          border-color: #3f86ff;
          box-shadow: 0 0 0 3px #3f86ff33;
        }
        .note {
          background: #0f3020;
          border: 1px solid #2e7a59;
          color: #b8ffde;
          border-radius: 10px;
          padding: 10px 12px;
          margin: 8px 0;
        }
        .footer {
          border-top: 1px solid #22304a;
          padding: 20px;
          text-align: center;
          color: #93a7c4;
          font-size: 14px;
          margin-top: auto;
        }
      `}</style>
    </>
  );
}
