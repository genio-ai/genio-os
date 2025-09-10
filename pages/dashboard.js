import Head from "next/head";
import Link from "next/link";

export default function Dashboard(){
  return (
    <>
      <Head><title>Genio OS — Dashboard</title></Head>
      <main className="page">
        <section className="wrap hero">
          <div className="panel">
            <h1>Dashboard</h1>
            <p className="muted">Overview • Balances • Recent activity (placeholder)</p>

            <div className="cards">
              <div className="card"><div className="t">Total Volume</div><div className="v">$0.00</div></div>
              <div className="card"><div className="t">Payments</div><div className="v">0</div></div>
              <div className="card"><div className="t">Refunds</div><div className="v">0</div></div>
            </div>

            <div className="actions">
              <Link href="/router" className="btn">Open Router</Link>
              <Link href="/" className="btn">Back to Home</Link>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system; color:#fff;
             background:linear-gradient(180deg,#0b1530,#0f1f48)}
        a{text-decoration:none;color:inherit}
      `}</style>
      <style jsx>{`
        .page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
        .wrap{max-width:1120px;margin:0 auto;width:100%}
        .panel{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
               border-radius:18px;padding:28px}
        h1{margin:0 0 6px;font-weight:900}
        .muted{color:#b8c0d4}
        .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0}
        .card{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
              border-radius:14px;padding:16px}
        .t{color:#78f6cf;font-weight:800}
        .v{font-size:22px;margin-top:6px}
        .actions{display:flex;gap:12px;margin-top:10px}
        .btn{background:linear-gradient(90deg,#22ff9a,#10e0ff);color:#08231f;font-weight:800;
             padding:10px 18px;border-radius:12px;box-shadow:0 10px 28px rgba(16,224,255,.22)}
      `}</style>
    </>
  );
}
