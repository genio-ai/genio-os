// pages/index.js — Genio KYC OS (Company-Style, Polished, No external deps)
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [open, setOpen] = useState(false); // mobile nav

  return (
    <>
      <Head>
        <title>Genio KYC OS — Verify once. Reuse anywhere.</title>
        <meta
          name="description"
          content="Multi-modal KYC with privacy-first attestations. Verify once, reuse anywhere."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ===== Header / Navbar ===== */}
      <header className="site-header">
        <nav className="nav" aria-label="Main navigation">
          <div className="brand">
            <span className="brand-main">Genio</span>
            <span className="brand-sub">KYC&nbsp;OS</span>
          </div>

          <button
            className="hamburger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>

          <ul className={`nav-links ${open ? "open" : ""}`} role="list">
            <li><Link className="link" href="/">Home</Link></li>
            <li><Link className="link" href="/kyc">KYC</Link></li>
            <li><Link className="link" href="/dashboard">Dashboard</Link></li>
            <li><Link className="link" href="/support">Support</Link></li>
            <li><Link className="link" href="/login">Login</Link></li>
            <li className="nav-cta"><Link className="btn btn-gradient" href="/kyc">Get Verified</Link></li>
          </ul>
        </nav>
      </header>

      {/* ===== Page ===== */}
      <main className="page">
        <section className="container hero">
          <div className="hero-card">
            <h1 className="h1">Verified identity. Portable. On-chain proof.</h1>
            <p className="muted">
              Verify once with <b>multi-modal KYC</b>: documents, biometrics, and liveness.
              We anchor <b>hash-based attestations</b> on-chain—privacy by design.
            </p>
            <div className="row">
              <Link href="/kyc" className="btn btn-gradient">Get Verified</Link>
              <a href="#how" className="btn btn-outline">How it works</a>
            </div>

            <div className="badges" aria-label="Key benefits">
              <span className="badge badge-green">🔒 Privacy-first</span>
              <span className="badge badge-blue">⚡ Fast & modern</span>
              <span className="badge badge-purple">🌍 Vendor-agnostic</span>
              <span className="badge badge-teal">📱 Mobile-friendly</span>
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="container grid gap">
          <article className="card gradient-blue">
            <h3 className="h3">Attestations, not raw data</h3>
            <p className="muted">
              Only salted hashes are anchored on-chain. Your raw files remain local or with your chosen vendor.
            </p>
          </article>

          <article className="card gradient-green">
            <h3 className="h3">Strict file checks</h3>
            <p className="muted">Corners, glare, file type and size (&lt; 8&nbsp;MB). Clear guidance for clean captures.</p>
          </article>

          <article className="card gradient-violet">
            <h3 className="h3">Biometrics + Liveness</h3>
            <p className="muted">On-device face match (demo), liveness prompts, plus a portable “Genio ID”.</p>
          </article>

          <article className="card gradient-warm">
            <h3 className="h3">Developer-friendly</h3>
            <p className="muted">Simple client flow now; drop-in API later. Start on testnet, switch networks anytime.</p>
          </article>
        </section>

        {/* Steps */}
        <section id="how" className="container section">
          <h2 className="h2">How it works</h2>
          <p className="muted">Three quick steps. Verify once, reuse anywhere.</p>

          <div className="steps">
            <div className="step">
              <span className="step-num step-green">1</span>
              <div className="step-body">
                <b>Personal Info</b>
                <p className="muted">Name, date of birth, residence & citizenship. Contact optional.</p>
              </div>
            </div>

            <div className="step">
              <span className="step-num step-blue">2</span>
              <div className="step-body">
                <b>ID Upload</b>
                <p className="muted">Passport (photo page) or National/Driver (front & back). Client-side checks first.</p>
              </div>
            </div>

            <div className="step">
              <span className="step-num step-violet">3</span>
              <div className="step-body">
                <b>Biometrics + Liveness</b>
                <p className="muted">Selfie match (demo) and liveness cues. Device-only preview in demo mode.</p>
              </div>
            </div>
          </div>

          <div className="row">
            <Link href="/kyc" className="btn btn-pink">Start KYC</Link>
            <Link href="/dashboard" className="btn btn-outline">Open Dashboard</Link>
          </div>
        </section>

        {/* API box */}
        <section className="container section">
          <h2 className="h2">Developer API</h2>
          <div className="api-box">
            <p className="muted">
              Minimal API surface: <b>/api/biometrics</b> to create a face embedding → <b>/api/attest</b> to anchor proofs (hash-only).
            </p>
            <code className="code">
{`POST /api/biometrics
- body: { selfieBase64 }
- returns: { embedding }

POST /api/attest
- body: { attestationHash, network: "sepolia" }
- returns: { txid }`}
            </code>
          </div>
        </section>

        {/* Support */}
        <section className="container section">
          <h2 className="h2">Support</h2>
          <div className="support-grid">
            <div className="card gradient-mix">
              <ul className="list">
                <li>Passport/ID capture tips (corners, glare, size)</li>
                <li>Biometrics & liveness best practices</li>
                <li>Attestation flow & on-chain verification</li>
              </ul>
              <Link href="/kyc" className="btn btn-gradient">Start KYC</Link>
            </div>

            <SupportForm />
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-links">
            <Link href="/support" className="link">Contact</Link>
            <span aria-hidden>•</span>
            <Link href="/terms" className="link">Terms</Link>
            <span aria-hidden>•</span>
            <Link href="/privacy" className="link">Privacy</Link>
          </div>
          © {new Date().getFullYear()} Genio Systems — All rights reserved.
        </footer>
      </main>

      {/* ======= Global Styles (Company-style + Polish) ======= */}
      <style jsx global>{`
        :root{
          --bg: #08162e;
          --panel: #0d1e3f;
          --text: #e6f0ff;
          --muted: #c8d4ea;
          --surface: rgba(255,255,255,.06);
          --border: rgba(255,255,255,.12);
          --ring: #38bdf8;

          /* gradients */
          --grad-main: linear-gradient(90deg,#2AF598,#009EFD);
          --grad-hero: linear-gradient(135deg,#0b2a59 0%, #2c2a72 60%, #6e2b8f 100%);
          --grad-blue: linear-gradient(135deg,#1d4ed8,#0ea5e9);
          --grad-green: linear-gradient(135deg,#16a34a,#22c55e);
          --grad-violet: linear-gradient(135deg,#9333ea,#22d3ee);
          --grad-warm: linear-gradient(135deg,#f43f5e,#f59e0b);
          --grad-pink: linear-gradient(90deg,#ff7eb3,#ff758c);
          --grad-mix: linear-gradient(135deg, rgba(45,212,191,.10), rgba(147,51,234,.10));
        }

        *{box-sizing:border-box}
        html,body{padding:0;margin:0}
        body{
          background:var(--bg);
          color:var(--text);
          font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          -webkit-font-smoothing:antialiased;
          -moz-osx-font-smoothing:grayscale;
        }

        .container{max-width:1120px;margin:0 auto;padding:32px 16px}   /* (polish) */
        .page{min-height:100vh}
        .h1{font-size:42px;line-height:1.08;margin:0 0 12px;font-weight:900} /* (polish) */
        .h2{font-size:26px;line-height:1.2;margin:0 0 12px;font-weight:900}
        .h3{font-size:18px;margin:0 0 6px;font-weight:900}
        .muted{color:var(--muted);opacity:.92;line-height:1.6;margin:0 0 16px}
        .row{display:flex;gap:12px;flex-wrap:wrap}
        .section{margin-top:40px} /* (polish) */

        /* Header / Nav */
        .site-header{
          position:sticky;top:0;z-index:40;
          background:rgba(8,22,46,.85);
          backdrop-filter:blur(6px);
          border-bottom:1px solid var(--border);
        }
        .nav{display:flex;align-items:center;justify-content:space-between;max-width:1120px;margin:0 auto;padding:14px 16px} /* (polish) */
        .brand{display:flex;align-items:baseline;gap:8px}
        .brand-main{font-weight:900;letter-spacing:.2px;font-size:20px}
        .brand-sub{font-weight:700;font-size:16px;opacity:.9}
        .nav-links{display:flex;align-items:center;gap:22px;list-style:none;margin:0;padding:0}
        .nav-links li{line-height:1} /* (polish) */
        .nav-cta{margin-left:8px}
        .link{color:rgba(255,255,255,.92);text-decoration:none;transition:opacity .15s ease} /* (polish) */
        .link:hover{text-decoration:underline;opacity:.9} /* (polish) */

        .hamburger{
          display:none;appearance:none;background:transparent;border:0;padding:8px;margin:0;border-radius:8px;cursor:pointer;
        }
        .hamburger:focus{outline:2px solid var(--ring);outline-offset:2px}
        .hamburger span{display:block;width:22px;height:2px;background:#cfd9ef;margin:4px 0;border-radius:2px}

        /* Buttons */
        .btn{
          display:inline-flex;align-items:center;justify-content:center;
          font-weight:900;border-radius:12px;padding:12px 16px; /* (polish) */
          text-decoration:none;border:1px solid rgba(255,255,255,.2);cursor:pointer;
          min-height:44px; /* (polish) */
        }
        .btn-gradient{background:var(--grad-main);color:#001219;border-color:rgba(255,255,255,.2)}
        .btn-outline{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.28)} /* (polish) */
        .btn-pink{background:var(--grad-pink);color:#001219;border:1px solid transparent} /* (polish) */
        .btn:focus-visible{outline:2px solid var(--ring);outline-offset:2px}
        .btn:hover{filter:brightness(1.03)} /* (polish) */
        .btn:active{transform:translateY(1px)} /* (polish) */

        /* Hero */
        .hero{padding-top:10px}
        .hero-card{
          border-radius:32px;padding:30px 22px; /* (polish) */
          background:var(--grad-hero);
          border:1px solid var(--border);
          box-shadow:0 14px 36px rgba(0,0,0,.28); /* (polish) */
        }
        .badges{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;row-gap:8px} /* (polish) */
        .badge{display:inline-flex;align-items:center;gap:8px;padding:8px 10px;border-radius:999px;font-size:13px;font-weight:700;border:1px solid rgba(255,255,255,.14)}
        .badge-green{background:rgba(52,211,153,.15)}
        .badge-blue{background:rgba(56,189,248,.15)}
        .badge-purple{background:rgba(216,180,254,.18)}
        .badge-teal{background:rgba(45,212,191,.18)}

        /* Cards grid */
        .grid{display:grid}
        .gap{gap:18px} /* (polish) */
        .card{
          border-radius:20px;padding:20px; /* (polish) */
          border:1px solid rgba(255,255,255,.14); /* (polish) */
          box-shadow:0 14px 36px rgba(0,0,0,.28); /* (polish) */
        }
        .gradient-blue{background:var(--grad-blue)}
        .gradient-green{background:var(--grad-green)}
        .gradient-violet{background:var(--grad-violet)}
        .gradient-warm{background:var(--grad-warm)}

        /* Steps */
        .steps{display:grid;gap:18px} /* (polish) */
        .step{display:flex;align-items:flex-start;border-radius:20px;padding:20px;border:1px solid var(--border);background:rgba(255,255,255,.03)} /* (polish) */
        .step-num{display:inline-flex;min-width:32px;height:32px;align-items:center;justify-content:center;border-radius:9px;font-weight:900;margin-right:10px;color:#0b0f1a}
        .step-green{background:rgba(16,185,129,.85)}
        .step-blue{background:rgba(59,130,246,.85)}
        .step-violet{background:rgba(168,85,247,.85)}
        .step-body .muted{margin:6px 0 0} /* (polish) */

        /* API box */
        .api-box{
          border-radius:26px;padding:20px;
          background:linear-gradient(135deg,#0b335a,#0d7a86);
          border:1px solid var(--border);
          box-shadow:0 14px 36px rgba(0,0,0,.28); /* (polish) */
        }
        .code{
          display:block;white-space:pre;overflow-x:auto;margin-top:10px;
          background:rgba(0,0,0,.35);border-radius:12px;padding:10px 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size:13px;color:#dcf1ff
        }

        /* Support */
        .support-grid{display:grid;gap:20px} /* (polish) */
        .gradient-mix{background:var(--grad-mix)}
        .list{margin:0 0 14px 18px;line-height:1.8}
        .field{
          width:100%;
          background:linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.05)); /* (polish) */
          border:1px solid rgba(255,255,255,.28); /* (polish) */
          color:#fff;border-radius:12px;padding:10px 12px;outline:0
        }
        .field::placeholder{color:#cdd8ef;opacity:.9} /* (polish) */
        .field:focus{border-color:#7dd3fc;outline:2px solid #7dd3fc;outline-offset:0} /* (polish) */
        .textarea{min-height:140px;resize:vertical} /* (polish) */

        /* Footer */
        .footer{margin-top:36px;padding:22px 0;border-top:1px solid var(--border);opacity:.9;font-size:13px;text-align:center} /* (polish) */
        .footer-links{display:flex;gap:18px;justify-content:center;margin-bottom:8px} /* (polish) */

        /* Responsive grids */
        @media (min-width: 700px){
          .grid{grid-template-columns:repeat(2,1fr)}
          .steps{grid-template-columns:1fr}
          .card .btn.btn-gradient{width:auto}
        }
        @media (min-width: 960px){
          .grid{grid-template-columns:repeat(4,1fr)}
        }

        /* Mobile menu */
        @media (max-width: 900px){
          .hamburger{display:inline-block}
          .nav-links{
            position:absolute;left:0;right:0;top:60px;
            background:rgba(8,22,46,.96);
            border-bottom:1px solid var(--border);
            display:none;flex-direction:column;gap:10px; /* (polish) */
            padding:14px 16px 16px; /* (polish) */
          }
          .nav-links.open{display:flex}
          .nav-links li a.link{padding:8px 0;display:block} /* (polish) */
          .nav-cta{margin-left:0;margin-top:4px} /* (polish) */
        }

        /* small phones */
        @media (max-width: 360px){
          .container{padding-left:14px;padding-right:14px} /* (polish) */
        }
      `}</style>
    </>
  );
}

/* ---------- Support Form (same file) ---------- */
function SupportForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | ok | err
  const [err, setErr] = useState("");

  const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || "");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!emailOk(email)) { setErr("Invalid email"); return; }
    if (!msg || msg.trim().length < 3) { setErr("Message too short"); return; }

    try {
      setStatus("sending");
      const r = await fetch("/api/support", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, msg })
      });
      if (!r.ok) throw new Error("Request failed");
      setEmail(""); setMsg(""); setStatus("ok");
    } catch {
      setStatus("err"); setErr("Could not send. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="card" aria-label="Support form" style={{background:"linear-gradient(135deg, rgba(37,99,235,.12), rgba(56,189,248,.12))"}}>
      <div className="row" style={{flexDirection:"column", gap:12}}>
        <label>
          <span className="sr-only">Email</span>
          <input
            type="email"
            className="field"
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            aria-invalid={!emailOk(email)}
            required
          />
        </label>
        <label>
          <span className="sr-only">Message</span>
          <textarea
            className="field textarea"
            placeholder="How can we help?"
            value={msg}
            onChange={(e)=>setMsg(e.target.value)}
          />
        </label>
        {err && <div role="alert" style={{color:"#ffbdbd"}}>{err}</div>}
        <button type="submit" className="btn btn-gradient" disabled={status==="sending"}>
          {status==="sending" ? "Sending..." : "Send message"}
        </button>
        {status==="ok" && <div role="status" style={{color:"#bdf9c4"}}>Thanks! We’ll get back to you shortly.</div>}
      </div>

      <style jsx>{`
        .sr-only{
          position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;
          clip:rect(0,0,0,0);border:0;white-space:nowrap;
        }
      `}</style>
    </form>
  );
}
