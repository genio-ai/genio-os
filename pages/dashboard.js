import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch("/api/kyc/status")
      .then(r=>r.json())
      .then(setData)
      .finally(()=>setLoading(false));
  },[]);

  async function attestNow(){
    if(!data) return;
    const payload = {
      attestationHash: "0x" + Math.random().toString(16).slice(2),
      network: "sepolia"
    };
    const r = await fetch("/api/attest", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    const j = await r.json();
    setData(prev => ({ ...prev, txid: j.txid }));
  }

  return (
    <>
      <Head><title>Genio Dashboard — KYC status & activity</title></Head>

      <header className="site-header">
        <nav className="nav" aria-label="Dashboard navigation">
          <Link href="/" className="brand"><span className="brand-main">Genio</span><span className="brand-sub">KYC&nbsp;OS</span></Link>
          <ul className="nav-links" role="list">
            <li><Link className="link" href="/">Home</Link></li>
            <li><Link className="link" href="/dashboard">Dashboard</Link></li>
          </ul>
        </nav>
      </header>

      <main className="page">
        <section className="container section">
          <h1 className="h1">Dashboard</h1>
          <p className="muted">Track your KYC status and recent activity.</p>
        </section>

        <section className="container grid gap-cards">
          <article className="card gradient-blue">
            <h3 className="h3">KYC Status</h3>
            {loading ? <p className="muted">Loading…</p> : (
              <>
                <p className="muted">Current status: <b>{data?.kycStatus ?? "—"}</b></p>
                <p className="muted">Face match: <b>{(data?.faceMatchScore??0).toFixed(2)}</b> • Liveness: <b>{(data?.livenessScore??0).toFixed(2)}</b></p>
                {data?.txid ? (
                  <p className="muted">Tx: <code>{data.txid}</code></p>
                ) : (
                  <button onClick={attestNow} className="btn btn-primary">Attest hash</button>
                )}
              </>
            )}
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

        <section className="container section">
          <h2 className="h2">Recent Activity</h2>
          <div className="table-wrap">
            <table className="activity-table">
              <thead><tr><th>Date</th><th>Action</th><th>Status</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="muted">Loading…</td></tr>
                ) : (
                  (data?.activity ?? []).map((r,i)=>(
                    <tr key={i}><td>{r.date}</td><td>{r.action}</td><td>{r.status}</td></tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="footer">
          <div className="footer-links">
            <a className="link" href="/#support">Contact</a><span aria-hidden>•</span>
            <a className="link" href="/#hero">Terms</a><span aria-hidden>•</span>
            <a className="link" href="/#hero">Privacy</a>
          </div>
          © {new Date().getFullYear()} Genio Systems — All rights reserved.
        </footer>
      </main>
    </>
  );
}
