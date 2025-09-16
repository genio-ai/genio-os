// pages/dashboard.js
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [data, setData] = useState(null); // { status, scores, tx, updatedAt }
  const [attesting, setAttesting] = useState(false);

  // fetch KYC status from our mock API
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetch("/api/kyc/status")
      .then((r) => r.ok ? r.json() : Promise.reject(new Error("Bad response")))
      .then((json) => { if (isMounted) { setData(json); setErr(""); } })
      .catch((e) => { if (isMounted) setErr("Failed to load status."); })
      .finally(() => { if (isMounted) setLoading(false); });

    return () => { isMounted = false; };
  }, []);

  async function attestHash() {
    try {
      setAttesting(true);
      setErr("");
      const res = await fetch("/api/attest", { method: "POST" });
      if (!res.ok) throw new Error("Bad response");
      const json = await res.json(); // { txid }
      // reflect tx on the page without refetch
      setData((prev) => ({ ...(prev || {}), tx: json.txid }));
    } catch (e) {
      setErr("Attest failed. Try again.");
    } finally {
      setAttesting(false);
    }
  }

  return (
    <main className="page container">
      <h1 className="h1">Dashboard</h1>
      <p className="muted">Track your KYC status and recent activity.</p>

      {/* KYC Card */}
      <section className="card grad-blue">
        <h2 className="h2">KYC Status</h2>

        {loading && <p className="muted">Loading…</p>}
        {!loading && err && <p style={{color:"#ffb4b4"}}>{err}</p>}

        {!loading && !err && data && (
          <>
            <p className="muted">
              Current status: <b style={{color:"#fff"}}>{data.status || "—"}</b>
            </p>
            {data.scores && (
              <p className="muted">
                Face match: <b>{Number(data.scores.face).toFixed(2)}</b> • Liveness: <b>{Number(data.scores.liveness).toFixed(2)}</b>
              </p>
            )}

            <div className="row" style={{alignItems:"center"}}>
              <button
                className="btn btn-secondary"
                onClick={attestHash}
                disabled={attesting}
              >
                {attesting ? "Attesting…" : "Attest hash"}
              </button>

              {data.tx && (
                <span className="tag">Tx: <code>{data.tx}</code></span>
              )}
            </div>
          </>
        )}
      </section>

      {/* Quick action */}
      <section className="card grad-green">
        <h3 className="h3">Quick Action</h3>
        <a href="/#how" className="btn btn-primary">Start New KYC</a>
      </section>

      {/* API key */}
      <section className="card grad-violet">
        <h3 className="h3">API Keys</h3>
        <p className="muted">Test Key: <code>demo_123456</code></p>
      </section>

      {/* Recent activity (static demo) */}
      <section className="card">
        <h2 className="h2">Recent Activity</h2>
        <div className="table">
          <div className="thead">
            <div>Date</div><div>Action</div><div>Status</div>
          </div>
          <div className="trow">
            <div>2025-09-15</div><div>KYC Submission</div><div>Pending</div>
          </div>
          <div className="trow">
            <div>2025-09-10</div><div>API Call /attest (test)</div><div>Success</div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .container{max-width:1120px;margin:0 auto;padding:24px 16px}
        .page{min-height:100vh}
        .row{display:flex;gap:12px;flex-wrap:wrap}
        .h1{font-size:44px;font-weight:900;margin:0 0 8px}
        .h2{font-size:26px;font-weight:900;margin:0 0 8px}
        .h3{font-size:18px;font-weight:900;margin:0 0 6px}
        .muted{color:#cdd8ef;opacity:.95;margin:0 0 10px}
        .card{border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:18px;margin:14px 0;background:rgba(255,255,255,.03)}
        .grad-blue{background:linear-gradient(135deg,#1d4ed8,#0ea5e9)}
        .grad-green{background:linear-gradient(135deg,#16a34a,#22c55e)}
        .grad-violet{background:linear-gradient(135deg,#9333ea,#22d3ee)}
        .btn{display:inline-flex;align-items:center;justify-content:center;font-weight:900;border-radius:12px;padding:10px 16px;min-height:40px;border:1px solid rgba(255,255,255,.32);color:#fff;text-decoration:none;background:transparent}
        .btn-primary{background:linear-gradient(90deg,#2AF598,#009EFD);color:#001219;border-color:rgba(255,255,255,.2)}
        .btn-secondary{background:transparent}
        .tag{display:inline-block;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:6px 10px;font-size:13px}
        .table{border:1px solid rgba(255,255,255,.12);border-radius:14px;overflow:hidden}
        .thead,.trow{display:grid;grid-template-columns:1fr 2fr 1fr}
        .thead{background:rgba(255,255,255,.06);font-weight:800}
        .thead>div,.trow>div{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08)}
      `}</style>
    </main>
  );
}
