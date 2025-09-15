// pages/dashboard.js — Polished dashboard (matches landing style)
import Head from "next/head";
import Link from "next/link";

export default function Dashboard() {
  const rows = [
    { date: "2025-09-15", action: "KYC Submission", status: "Pending" },
    { date: "2025-09-10", action: "API Call /api/attest", status: "Success" },
  ];

  return (
    <>
      <Head>
        <title>Genio Dashboard — KYC status & activity</title>
        <meta name="description" content="Track your KYC status and recent activity." />
      </Head>

      {/* Header (simple, no overlay) */}
      <header className="site-header">
        <nav className="nav" aria-label="Dashboard navigation">
          <Link href="/" className="brand" aria-label="Genio home">
            <span className="brand-main">Genio</span>
            <span className="brand-dot"> </span>
            <span className="brand-sub">KYC&nbsp;OS</span>
          </Link>
          <ul className="nav-links" role="list">
            <li><Link className="link" href="/">Home</Link></li>
            <li><Link className="link" href="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>
      </header>

      <main className="page">
        {/* Title */}
        <section className="container title-section">
          <h1 className="h1">Dashboard</h1>
          <p className="muted">Track your KYC status and recent activity.</p>
        </section>

        {/* Cards */}
        <section className="container grid gap-cards">
          <article className="card gradient-blue">
            <h3 className="h3">KYC Status</h3>
            <p className="muted">Current status: <b>Pending</b></p>
          </article>

          <article className="card gradient-green">
            <h3 className="h3">Quick Action</h3>
            <Link href="/#how" className="btn btn-primary">Start New KYC</Link>
          </article>

          <article className="card gradient-violet">
            <h3 className="h3">API Keys</h3>
            <p className="muted">Test Key: <code>demo_123456</code></p>
          </article>
        </section>

        {/* Activity */}
        <section className="container section">
          <h2 className="h2">Recent Activity</h2>
          <div className="table-wrap">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Action</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.action}</td>
                    <td>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-links">
            <a className="link" href="/#support">Contact</a>
            <span aria-hidden>•</span>
            <a className="link" href="/#hero">Terms</a>
            <span aria-hidden>•</span>
            <a className="link" href="/#hero">Privacy</a>
          </div>
          © {new Date().getFullYear()} Genio Systems — All rights reserved.
        </footer>
      </main>

      {/* Local styles (kept here so index.js is untouched) */}
      <style jsx global>{`
        :root{
          --bg:#08162e; --text:#e6f0ff; --muted:#cdd8ef;
          --border:rgba(255,255,255,.12);
          --cta:linear-gradient(90deg,#2AF598,#009EFD);
          --grad-blue:linear-gradient(135deg,#1d4ed8,#0ea5e9);
          --grad-green:linear-gradient(135deg,#16a34a,#22c55e);
          --grad-violet:linear-gradient(135deg,#9333ea,#22d3ee);
        }

        html,body{background:var(--bg);color:var(--text);font-family:-apple-system, Segoe UI, Roboto, Arial, sans-serif}
        .page{min-height:100vh}
        .container{max-width:1120px;margin:0 auto;padding:32px 16px}
        .title-section{margin-top:28px;margin-bottom:6px}
        .section{margin:46px auto 0}
        .grid{display:grid}
        .gap-cards{gap:22px}
        .row{display:flex;gap:12px;flex-wrap:wrap}

        .h1{font-size:44px;line-height:1.08;margin:0 0 12px;font-weight:900;letter-spacing:-.4px}
        .h2{font-size:26px;margin:0 0 12px;font-weight:900}
        .h3{font-size:18px;margin:0 0 6px;font-weight:900}
        .muted{color:var(--muted);line-height:1.65;margin:0 0 16px}

        /* Header */
        .site-header{position:sticky;top:0;z-index:40;background:rgba(8,22,46,.9);
          backdrop-filter:blur(6px);border-bottom:1px solid var(--border)}
        .nav{display:flex;align-items:center;justify-content:space-between;max-width:1120px;margin:0 auto;padding:16px}
        .brand{display:flex;align-items:baseline;gap:8px;text-decoration:none;color:inherit}
        .brand-main{font-weight:900;font-size:20px;letter-spacing:.2px}
        .brand-sub{font-weight:800;font-size:16px;opacity:.95}
        .nav-links{display:flex;align-items:center;gap:22px;list-style:none;margin:0;padding:0}
        .link{color:rgba(255,255,255,.92);text-decoration:none}
        .link:hover{text-decoration:underline;opacity:.9}
        @media (max-width:899px){ .nav-links{display:none !important} }

        /* Cards */
        .card{border-radius:22px;padding:22px;border:1px solid rgba(255,255,255,.14)}
        .gradient-blue{background:var(--grad-blue)}
        .gradient-green{background:var(--grad-green)}
        .gradient-violet{background:var(--grad-violet)}

        /* Buttons */
        .btn{display:inline-flex;align-items:center;justify-content:center;font-weight:900;border-radius:12px;
          padding:12px 16px;text-decoration:none;min-height:44px;border:1px solid rgba(255,255,255,.2)}
        .btn-primary{background:var(--cta);color:#001219}

        /* Table */
        .table-wrap{overflow:auto;border-radius:14px;border:1px solid var(--border);background:rgba(255,255,255,.03)}
        table{width:100%;border-collapse:collapse}
        th,td{padding:14px;border-bottom:1px solid var(--border);text-align:left}
        thead th{background:rgba(255,255,255,.06);font-weight:800}

        /* Footer spacing/size */
        .footer{margin-top:80px;padding:26px 0;border-top:1px solid var(--border);opacity:.9;font-size:12px;text-align:center}
        .footer-links{display:flex;gap:14px;justify-content:center;margin-bottom:10px;flex-wrap:wrap}

        /* Responsive cards grid */
        @media (min-width:700px){ .grid{grid-template-columns:repeat(2,1fr)} }
        @media (min-width:960px){ .grid{grid-template-columns:repeat(3,1fr)} }

        /* Small phones */
        @media (max-width:360px){
          .container{padding-left:14px;padding-right:14px}
          .h1{font-size:40px}
        }
      `}</style>
    </>
  );
}
