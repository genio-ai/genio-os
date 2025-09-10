import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard(){
  const [txs, setTxs] = useState([]);
  const [balances, setBalances] = useState({ usd: 0, eur: 0 });

  // حمّل بيانات ديمو من localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("genio_txs") || "[]");
    if (saved.length === 0) {
      const seed = [
        { id: "TX-1001", time: Date.now()-86400000*2, amount: 150.12, currency: "USD", provider: "Wise",        status: "settled" },
        { id: "TX-1002", time: Date.now()-86400000,   amount: 89.55,  currency: "EUR", provider: "Stripe",      status: "settled" },
        { id: "TX-1003", time: Date.now()-3600*1000,  amount: 42.00,  currency: "USD", provider: "Flutterwave", status: "pending" },
      ];
      localStorage.setItem("genio_txs", JSON.stringify(seed));
      setTxs(seed);
    } else setTxs(saved);
  }, []);

  // احسب الأرصدة
  useEffect(() => {
    const ok = (t) => t.status !== "failed";
    const usd = txs.filter(t=>t.currency==="USD" && ok(t)).reduce((s,t)=>s+t.amount,0);
    const eur = txs.filter(t=>t.currency==="EUR" && ok(t)).reduce((s,t)=>s+t.amount,0);
    setBalances({ usd, eur });
  }, [txs]);

  const fmt = (n) => n.toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 });

  // أضف عملية ديمو
  const addTestPayment = () => {
    const id = "TX-" + Math.floor(1000 + Math.random()*9000);
    const curr = Math.random() > 0.5 ? "USD" : "EUR";
    const providers = ["Wise","Stripe","Flutterwave","PayGate"];
    const provider = providers[Math.floor(Math.random()*providers.length)];
    const amount = Number((Math.random()*200 + 10).toFixed(2));
    const row = { id, time: Date.now(), amount, currency: curr, provider, status: "settled" };
    const next = [row, ...txs].slice(0, 100);
    setTxs(next);
    localStorage.setItem("genio_txs", JSON.stringify(next));
  };

  // تصدير CSV
  const exportCSV = () => {
    const header = ["id,time,amount,currency,provider,status"];
    const rows = txs.map(t => [
      t.id, new Date(t.time).toISOString(), t.amount, t.currency, t.provider, t.status
    ].join(","));
    const csv = [...header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "genio-transactions.csv";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Head><title>Genio OS — Dashboard</title></Head>

      {/* Topbar */}
      <div className="topbar">
        <div className="wrap topbarRow">
          <div className="brand">Genio OS</div>
          <nav className="nav">
            <Link href="/">Home</Link>
            <Link href="/router">Router</Link>
            <Link href="/login">Login</Link>
          </nav>
        </div>
      </div>

      <main className="page">
        <section className="wrap hero">
          <div className="panel">
            <h1>Dashboard</h1>
            <p className="muted">Overview • Balances • Recent activity</p>

            {/* Balances */}
            <div className="cards">
              <div className="card">
                <div className="t">Total (USD + EUR)</div>
                <div className="v">${fmt(balances.usd)} / €{fmt(balances.eur)}</div>
              </div>
              <div className="card">
                <div className="t">USD Balance</div>
                <div className="v">${fmt(balances.usd)}</div>
              </div>
              <div className="card">
                <div className="t">EUR Balance</div>
                <div className="v">€{fmt(balances.eur)}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions">
              <button className="btn" onClick={addTestPayment}>Add Test Payment</button>
              <button className="btn" onClick={exportCSV}>Export CSV</button>
              <Link href="/router" className="btn">Open Router</Link>
            </div>

            {/* Table */}
            <div className="tableWrap">
              <div className="tableHead">
                <div>ID</div><div>Time</div><div>Amount</div><div>Provider</div><div>Status</div>
              </div>
              {txs.map((t) => (
                <div key={t.id} className="tableRow">
                  <div className="mono">{t.id}</div>
                  <div>{new Date(t.time).toLocaleString()}</div>
                  <div className="mono">{t.currency==="USD" ? "$" : "€"}{fmt(t.amount)}</div>
                  <div>{t.provider}</div>
                  <div className={`badge ${t.status}`}>{t.status}</div>
                </div>
              ))}
              {txs.length === 0 && <div className="empty">No activity yet.</div>}
            </div>
          </div>
        </section>
      </main>

      {/* Styles */}
      <style jsx global>{`
        :root{--bg1:#0b1530;--bg2:#0f1f48;--text:#fff;--muted:#b8c0d4;--panel:rgba(255,255,255,.06);--border:rgba(255,255,255,.12);--accent:#78f6cf;--gA:#22ff9a;--gB:#10e0ff}
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

        .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media(max-width:720px){.cards{grid-template-columns:1fr}}
        .card{background:rgba(255,255,255,.06);border:1px solid var(--border);border-radius:14px;padding:16px}
        .t{color:var(--accent);font-weight:800}
        .v{font-size:22px;margin-top:6px}

        .actions{display:flex;flex-wrap:wrap;gap:12px;margin:16px 0 10px}
        .btn{background:linear-gradient(90deg,var(--gA),var(--gB));color:#08231f;font-weight:800;padding:10px 18px;border-radius:12px;box-shadow:0 10px 28px rgba(16,224,255,.22);border:0;cursor:pointer}

        .tableWrap{margin-top:10px;border:1px solid var(--border);border-radius:14px;overflow:hidden;background:rgba(255,255,255,.04)}
        .tableHead,.tableRow{display:grid;grid-template-columns:1.2fr 1.6fr 1fr 1fr .9fr;gap:10px;padding:12px 14px}
        .tableHead{background:rgba(255,255,255,.06);font-weight:800;color:#dbe6ff}
        .tableRow{border-top:1px solid rgba(255,255,255,.06);align-items:center}
        .mono{font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;}
        .badge{padding:6px 10px;border-radius:999px;text-align:center;font-weight:800;color:#08231f;background:linear-gradient(90deg,#b0ffc8,#88f7ff)}
        .badge.pending{background:linear-gradient(90deg,#fff0a8,#ffd67a)}
        .badge.failed{background:linear-gradient(90deg,#ffb3b3,#ff8a8a)}
        .empty{padding:18px;text-align:center;color:#9fb1cf}
        @media(max-width:640px){
          .tableHead,.tableRow{grid-template-columns: 1.1fr 1.6fr 1fr .9fr .9fr; padding:10px 12px}
        }
      `}</style>
    </>
  );
}
