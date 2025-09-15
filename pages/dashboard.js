// pages/dashboard.js
import Head from "next/head";

export default function Dashboard() {
  const rows = [
    { date: "2025-09-15", action: "KYC Submission", status: "Pending" },
    { date: "2025-09-10", action: "API Call /api/attest", status: "Success" },
  ];

  return (
    <>
      <Head>
        <title>Genio Dashboard</title>
      </Head>

      <main className="page container">
        <h1 className="h1">Dashboard</h1>
        <p className="muted">Track your KYC status and recent activity.</p>

        <section className="grid gap section">
          <article className="card gradient-blue">
            <h3 className="h3">KYC Status</h3>
            <p className="muted">Current status: <b>Pending</b></p>
          </article>
          <article className="card gradient-green">
            <h3 className="h3">Quick Action</h3>
            <a href="/#how" className="btn btn-primary">Start New KYC</a>
          </article>
          <article className="card gradient-violet">
            <h3 className="h3">API Keys</h3>
            <p className="muted">Test Key: <code>demo_123456</code></p>
          </article>
        </section>

        <section className="section">
          <h2 className="h2">Recent Activity</h2>
          <table className="activity-table">
            <thead>
              <tr><th>Date</th><th>Action</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td><td>{r.action}</td><td>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <style jsx>{`
        .activity-table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .activity-table th, .activity-table td {
          border: 1px solid var(--border);
          padding: 10px 12px;
          text-align: left;
          font-size: 14px;
        }
        .activity-table th { background: rgba(255,255,255,.06); }
      `}</style>
    </>
  );
}
