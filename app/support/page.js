// File: app/support/page.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    topic: "general",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    document.title = "Support — genio os";
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
        {/* Header (brand + Go Back only, NO login/signup, NO redirects) */}
        <header className="hdr">
          <div className="container nav">
            <Link href="/" className="brand" aria-label="genio os">
              <span className="brand-neon">genio os</span>
            </Link>
            <nav className="links">
              <Link href="/dashboard" className="btn ghost">Go Back</Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="container hero">
          <h1>Support</h1>
          <p className="sub">We’re here to help. Browse quick answers or contact us.</p>
        </section>

        {/* Quick FAQ */}
        <section className="container grid">
          <article className="card faq">
            <h3>How is my data handled?</h3>
            <p>
              Raw media (voice/video) is stored internally. Text-only prompts may be sent to AI if you opt in.
            </p>
          </article>
          <article className="card faq">
            <h3>Do I need phone verification?</h3>
            <p>
              Yes. Phone is required for account security and optional WhatsApp notifications.
            </p>
          </article>
          <article className="card faq">
            <h3>Can I edit or delete my Twin later?</h3>
            <p>
              Yes. You have full control: edit style, revoke consents, and delete data.
            </p>
          </article>
        </section>

        {/* Contact form */}
        <section className="container form-wrap">
          <form onSubmit={submit} className="card form" noValidate>
            <h2>Contact support</h2>

            <div className="row">
              <label className="field">
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  required
                />
              </label>

              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  required
                />
              </label>
            </div>

            <label className="field">
              <span>Topic</span>
              <select
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              >
                <option value="general">General</option>
                <option value="billing">Billing</option>
                <option value="privacy">Privacy</option>
                <option value="twin">Twin setup</option>
              </select>
            </label>

            <label className="field">
              <span>Message</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="How can we help?"
                required
              />
            </label>

            {msg && <div className="note">{msg}</div>}

            <div className="actions">
              <Link href="/dashboard" className="btn ghost">Cancel</Link>
              <button className="btn btn-neon" type="submit" disabled={busy}>
                {busy ? "Sending…" : "Send"}
              </button>
            </div>
          </form>
        </section>

        <footer className="footer">
          <p>© {new Date().getFullYear()} genio os · All rights reserved.</p>
        </footer>
      </main>

      <style jsx>{`
        :root {
          --bg: #0a1018;
          --card: #0f1725;
          --muted: #a7b7c8;
          --text: #edf3ff;
          --stroke: #223145;
          --neon1: #20e3b2;
          --neon2: #6fc3ff;
          --ink: #071018;
        }

        .wrap {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          color: var(--text);
          background: radial-gradient(1200px 600px at 80% -10%, #14263d 0%, #0b111a 60%), #0b111a;
        }
        .container { width: min(1100px, 92%); margin-inline: auto; }

        /* Header */
        .hdr {
          position: sticky; top: 0; z-index: 40;
          backdrop-filter: saturate(150%) blur(10px);
          background: #0b111add; border-bottom: 1px solid #1b2840;
        }
        .nav { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
        .brand-neon {
          font-size: 26px; font-weight: 900; letter-spacing: .3px;
          background: linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-shadow: 0 0 8px rgba(111,195,255,.35), 0 0 18px rgba(32,227,178,.22);
        }
        .links { display: flex; gap: 10px; align-items: center; }

        /* Buttons */
        .btn {
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 12px; padding: 10px 14px; font-weight: 700; text-decoration: none;
          border: 1px solid var(--stroke); background: #0f1828; color: var(--text);
        }
        .btn.ghost { border-style: dashed; }
        .btn.btn-neon { border: none; background: linear-gradient(135deg, var(--neon1), var(--neon2)); color: var(--ink); }

        /* Hero */
        .hero { text-align: center; padding: 40px 0 8px; }
        .hero h1 {
          margin: 0 0 8px;
          font-size: clamp(28px, 4.4vw, 42px);
          line-height: 1.1;
          background: linear-gradient(180deg, #f4f8ff 0%, #cfe0ff 100%);
          -webkit-background-clip: text; color: transparent;
        }
        .sub { color: #c0d0e2; margin: 0; }

        /* Cards grid */
        .grid {
          display: grid; gap: 14px; padding: 16px 0 4px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
        @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } }
        .card {
          border: 1px solid #20304a;
          background: linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92));
          border-radius: 14px; padding: 16px;
        }
        .faq h3 { margin: 0 0 6px; }
        .faq p { margin: 0; color: #b8c8df; }

        /* Form */
        .form-wrap { padding: 8px 0 26px; }
        .form { max-width: 760px; margin: 0 auto; }
        .form h2 { margin: 0 0 12px; }

        .row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
        @media (max-width: 780px) { .row { grid-template-columns: 1fr; } }

        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
        .field > span { font-size: 14px; color: #dbe7fb; }

        input, select, textarea {
          background: #0f1828; color: var(--text);
          border: 1px solid var(--stroke); border-radius: 10px; padding: 12px 14px; outline: none;
        }
        input:focus, select:focus, textarea:focus {
          border-color: #2b86c8; box-shadow: 0 0 0 3px rgba(111,195,255,.12);
        }

        .note {
          background: #0f3020; border: 1px solid #2e7a59; color: #b8ffde;
          border-radius: 10px; padding: 10px 12px; margin: 8px 0;
        }

        .actions { display: flex; gap: 10px; justify-content: space-between; margin-top: 10px; }
        @media (max-width: 640px) { .actions { flex-direction: column; align-items: stretch; } }

        /* Footer */
        .footer {
          border-top: 1px solid #1b2840; color: #93a7c4; font-size: 14px;
          text-align: center; padding: 18px; margin-top: auto;
        }

        /* Mobile tightening */
        @media (max-width: 640px) {
          .brand-neon { font-size: 24px; }
          .sub { display: none; }
        }
      `}</style>
    </>
  );
}
