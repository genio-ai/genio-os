// pages/auth/sign.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

const COUNTRIES = [
  { code: "US", dial: "+1",  name: "United States" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "AE", dial: "+971",name: "United Arab Emirates" },
  { code: "SA", dial: "+966",name: "Saudi Arabia" },
  { code: "QA", dial: "+974",name: "Qatar" },
  { code: "KW", dial: "+965",name: "Kuwait" },
  { code: "BH", dial: "+973",name: "Bahrain" },
  { code: "OM", dial: "+968",name: "Oman" },
  { code: "JO", dial: "+962",name: "Jordan" },
  { code: "EG", dial: "+20", name: "Egypt" },
  { code: "DE", dial: "+49", name: "Germany" },
  { code: "FR", dial: "+33", name: "France" },
  { code: "TR", dial: "+90", name: "Turkey" },
  { code: "IN", dial: "+91", name: "India" },
  { code: "PK", dial: "+92", name: "Pakistan" },
  { code: "PS", dial: "+970",name: "Palestine" },
];

export default function Sign() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "JO",
    dial: "+962",
    phone: "",
    password: "",
    confirm: "",
    allowWhatsapp: true,
    allowMarketing: false,
    acceptedTerms: false,
    acceptedPrivacy: false,
    acceptedResponsibleUse: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // Keep dial code in sync when country changes
  useEffect(() => {
    const c = COUNTRIES.find(c => c.code === form.country);
    if (c && c.dial !== form.dial) setForm(s => ({ ...s, dial: c.dial }));
  }, [form.country]); // eslint-disable-line

  const phoneE164 = useMemo(() => {
    const digits = form.phone.replace(/[^\d]/g, "");
    return `${form.dial}${digits}`;
  }, [form.dial, form.phone]);

  const valid = useMemo(() => {
    const emailOk =
      !form.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const passOk = form.password.length >= 8 && form.password === form.confirm;
    const phoneOk = /^\+\d{6,16}$/.test(phoneE164);
    const consentOk =
      form.acceptedTerms && form.acceptedPrivacy && form.acceptedResponsibleUse;
    return (
      form.name.trim().length >= 2 &&
      phoneOk &&
      passOk &&
      emailOk &&
      consentOk
    );
  }, [form, phoneE164]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setOk("");
    if (!valid) {
      setErr("Please complete all required fields correctly.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim() || null,
          phone: phoneE164,
          country: form.country,
          allowWhatsapp: form.allowWhatsapp,
          allowMarketing: form.allowMarketing,
          consents: {
            terms: form.acceptedTerms,
            privacy: form.acceptedPrivacy,
            responsibleUse: form.acceptedResponsibleUse,
          },
          client: {
            tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: navigator.language,
            ua: navigator.userAgent,
            ref: typeof document !== "undefined" ? document.referrer : "",
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Signup failed (${res.status})`);
      }
      setOk("Account created. Redirecting…");
      // Navigate to the twin studio after account creation
      setTimeout(() => Router.push("/twin"), 600);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sign up · Genio</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main className="wrap">
        <header className="header">
          <Link href="/" className="brand">Genio</Link>
          <nav className="nav">
            <Link href="/auth/login" className="ghost">Log in</Link>
          </nav>
        </header>

        <section className="card">
          <h1>Create your account</h1>
          <p className="sub">
            One account for everything: build your Twin, manage data and consents, and
            keep full control. Phone number is required for verification and optional WhatsApp linking.
          </p>

          <form onSubmit={onSubmit} noValidate>
            <div className="grid">
              <div className="field">
                <label>Full name<span>*</span></label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <small className="hint">Optional — used for receipts and account recovery.</small>
              </div>

              <div className="field">
                <label>Country<span>*</span></label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.name} ({c.dial})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Phone (for OTP & WhatsApp)<span>*</span></label>
                <div className="phone">
                  <span className="dial">{form.dial}</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="7 9XX XXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                </div>
                <small className="hint">Stored internally. We never share raw numbers with third parties.</small>
              </div>

              <div className="field">
                <label>Password<span>*</span></label>
                <input
                  type="password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              <div className="field">
                <label>Confirm password<span>*</span></label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="options">
              <label className="check">
                <input
                  type="checkbox"
                  checked={form.allowWhatsapp}
                  onChange={(e) => setForm({ ...form, allowWhatsapp: e.target.checked })}
                />
                Use WhatsApp for notifications (optional)
              </label>

              <label className="check">
                <input
                  type="checkbox"
                  checked={form.allowMarketing}
                  onChange={(e) => setForm({ ...form, allowMarketing: e.target.checked })}
                />
                Receive product updates and offers (optional)
              </label>
            </div>

            <div className="consents">
              <label className="check">
                <input
                  type="checkbox"
                  checked={form.acceptedTerms}
                  onChange={(e) => setForm({ ...form, acceptedTerms: e.target.checked })}
                  required
                />
                I accept the <Link href="/legal/terms" target="_blank">Terms</Link>.
              </label>

              <label className="check">
                <input
                  type="checkbox"
                  checked={form.acceptedPrivacy}
                  onChange={(e) => setForm({ ...form, acceptedPrivacy: e.target.checked })}
                  required
                />
                I accept the <Link href="/legal/privacy" target="_blank">Privacy Policy</Link>.
              </label>

              <label className="check">
                <input
                  type="checkbox"
                  checked={form.acceptedResponsibleUse}
                  onChange={(e) => setForm({ ...form, acceptedResponsibleUse: e.target.checked })}
                  required
                />
                I accept the <Link href="/legal/responsible-use" target="_blank">Responsible-Use Policy</Link>.
              </label>
            </div>

            {err && <div className="alert error">{err}</div>}
            {ok && <div className="alert ok">{ok}</div>}

            <button className="primary" type="submit" disabled={!valid || submitting}>
              {submitting ? "Creating…" : "Create account"}
            </button>

            <p className="foot">
              Already have an account?{" "}
              <Link href="/auth/login">Log in</Link>
            </p>
          </form>
        </section>
      </main>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          background: radial-gradient(1200px 600px at 50% -200px, #0b3a6a22, transparent) #0a1730;
          color: #e6eef8;
        }
        .header {
          max-width: 960px;
          margin: 0 auto;
          padding: 24px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          font-weight: 800;
          letter-spacing: 0.4px;
          color: #fff;
          text-decoration: none;
          font-size: 20px;
        }
        .nav :global(a) {
          color: #c9d6e5;
          text-decoration: none;
          padding: 8px 14px;
          border: 1px solid #2b3950;
          border-radius: 10px;
        }
        .ghost:hover { background:#13233f; }

        .card {
          max-width: 960px;
          margin: 0 auto 64px;
          padding: 24px 20px 48px;
          background: #0f1c37;
          border: 1px solid #22304a;
          border-radius: 16px;
        }
        h1 { margin: 8px 0 8px; font-size: 28px; }
        .sub { color:#b5c3d9; margin-bottom: 20px; }

        form { margin-top: 8px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }
        @media (max-width: 760px) {
          .grid { grid-template-columns: 1fr; }
        }
        .field { display: flex; flex-direction: column; }
        label { font-size: 14px; margin-bottom: 8px; color:#dbe7fb; }
        label span { color:#ffdf6d; margin-left: 4px; }
        input, select {
          background:#0b1730;
          border:1px solid #2a3a56;
          color:#e6eef8;
          border-radius:12px;
          padding:12px 14px;
          outline:none;
        }
        input:focus, select:focus { border-color:#3f86ff; box-shadow:0 0 0 3px #3f86ff33; }

        .hint { color:#93a7c4; margin-top:6px; }

        .phone { display:flex; gap:8px; align-items:center; }
        .dial {
          background:#0b1730;
          border:1px solid #2a3a56;
          padding:12px 12px;
          border-radius:12px;
          color:#d2def3;
          min-width:72px;
          text-align:center;
        }

        .options, .consents {
          margin-top: 18px;
          display: grid;
          gap: 10px;
        }
        .check { display:flex; gap:10px; align-items:flex-start; color:#cfe1ff; }
        .check input { margin-top: 3px; }

        .alert {
          margin-top: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 14px;
        }
        .alert.error { background:#3a1120; border:1px solid #7a2745; color:#ffc3d2; }
        .alert.ok { background:#0f3020; border:1px solid #2e7a59; color:#b8ffde; }

        .primary {
          margin-top: 18px;
          background: linear-gradient(180deg,#ffd86b,#ffbe3b);
          color:#1b1200;
          border:0;
          padding:12px 16px;
          border-radius:12px;
          font-weight:700;
          cursor:pointer;
        }
        .primary:disabled { opacity:0.6; cursor:not-allowed; }
        .foot { color:#b5c3d9; margin-top:14px; }
        .foot :global(a){ color:#fff; }
      `}</style>
    </>
  );
}
