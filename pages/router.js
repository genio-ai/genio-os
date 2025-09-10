import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function RouterPage() {
  const [routes, setRoutes] = useState([]);
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    // داتا ديمو للـ routes
    setRoutes([
      { id:"wise",        name:"Wise",        fee:0.50, eta:2, success:98 },
      { id:"stripe",      name:"Stripe",      fee:0.70, eta:1, success:97 },
      { id:"flutterwave", name:"Flutterwave", fee:0.40, eta:3, success:95 },
      { id:"paygate",     name:"PayGate",     fee:0.60, eta:4, success:96 },
    ]);
  }, []);

  // احفظ العملية في Dashboard (localStorage)
  const addToDashboard = (r) => {
    const txs = JSON.parse(localStorage.getItem("genio_txs") || "[]");
    const row = {
      id: "TX-" + Math.floor(1000 + Math.random()*9000),
      time: Date.now(),
      amount: Number((Math.random()*200 + 10).toFixed(2)),
      currency: Math.random() > 0.5 ? "USD" : "EUR",
      provider: r.name,
      status: "settled"
    };
    const next = [row, ...txs].slice(0, 100);
    localStorage.setItem("genio_txs", JSON.stringify(next));
    alert(`Route ${r.name} selected & transaction added!`);
  };

  // اختر أفضل Route (الأرخص ثم الأسرع)
  const simulateBest = () => {
    if (!routes.length) return;
    const best = [...routes].sort((a,b) => (a.fee === b.fee ? a.eta - b.eta : a.fee - b.fee))[0];
    setPicked(best);
    alert(`Best route: ${best.name} (Fee: $${best.fee.toFixed(2)}, ETA: ${best.eta}m)`);
  };

  return (
    <>
      <Head><title>Genio OS — Router</title></Head>

      {/* Topbar */}
      <div className="topbar">
        <div className="wrap topbarRow">
          <div className="brand">Genio OS</div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">Login</Link>
          </nav>
        </div>
      </div>

      <main className="page">
        <section className="wrap hero">
          <div className="panel">
            <h1>Router</h1>
            <p className="muted">Pick the best route by price, speed & success rate.</p>

            <div className="actions">
              <button className="btn" onClick={simulateBest}>Simulate Best Route</button>
              <Link href="/dashboard" className="btn">Go to Dashboard</Link>
            </div>

            {/* Routes table */}
            <div className="tableWrap">
              <div className="tableHead">
                <div>Provider</div><div>Fee</div><div>ETA</div><div>Success</div><div></div>
              </div>
              {routes.map(r => (
                <div key={r.id} className={`tableRow ${picked?.id===r.id ? "highlight" : ""}`}>
                  <div>{r.name}</div>
                  <div>${r.fee.toFixed(2)}</div>
                  <div>~{r.eta} min</div>
                  <div>{r.success}%</div>
                  <div><button className="btn small" onClick={()=>addToDashboard(r)}>Use this</button></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Styles */}
      <style jsx global>{`
        :root{--bg1:#0b1530;--bg2:#0f1f48;--text:#fff;--muted:#b8c0d4;--panel:rgba(255,255,255,.06);--border:rgba(255,255,255,.12);--gA:#22ff9a;--gB:#10e0ff}
        body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system;color:var(--text);background:linear-gradient(180deg,var(--bg1),var(--bg2))}
        a{text-decoration:none;color:inherit}
      `}</style>
      <style jsx>{`
        .page{min-height:100vh;display:flex;flex-direction:column;padding-top:64px}
        .wrap{max-width:1120px;margin:0 auto;padding:0 16px}
        .topbar{position:fixed;inset:0 0 auto 0;height:64px;background:rgba(10,18,42,.65);backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08);z-index:50}
        .topbarRow{height:64px;display:flex;align-items:center;justify-content:space-between}
        .brand{font-weight:800}
        .nav{display:flex;gap:16px;color:#c9d1e8}
        .nav a:hover{color:#fff}

        .hero{padding:28px 0 40px}
        .panel{background:var(--panel);border:1px solid var(--border);border-radius:18px;padding:26px 22px}
        h1{margin:0 0 6px;font-weight:900}
        .muted{color:var(--muted);margin-bottom:12px}

        .actions{display:flex;gap:12px;margin:14px 0}
        .btn{background:linear-gradient(90deg,var(--gA),var(--gB));color:#08231f;font-weight:800;padding:10px 18px;border-radius:12px;box-shadow:0 10px 28px rgba(16,224,255,.22);border:0;cursor:pointer}
        .btn.small{padding:6px 12px;font-size:14px}

        .tableWrap{margin-top:14px;border:1px solid var(--border);border-radius:14px;overflow:hidden;background:rgba(255,255,255,.04)}
        .tableHead,.tableRow{display:grid;grid-template-columns:1.5fr .8fr .8fr 1fr .9fr;gap:10px;padding:12px 14px}
        .tableHead{background:rgba(255,255,255,.06);font-weight:800;color:#dbe6ff}
        .tableRow{border-top:1px solid rgba(255,255,255,.06);align-items:center}
        .tableRow.highlight{background:rgba(34,255,154,.15)}
      `}</style>
    </>
  );
}
