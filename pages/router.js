import Head from "next/head";
import Link from "next/link";

export default function RouterPage(){
  return (
    <>
      <Head><title>Genio OS — Router</title></Head>
      <main className="page">
        <section className="wrap hero">
          <div className="panel">
            <h1>Router</h1>
            <p className="muted">Choose the best route by price/speed (placeholder).</p>

            <div className="grid">
              <div className="route">
                <div className="row">
                  <span className="tag">Wise</span>
                  <span className="price">$0.50</span>
                  <span className="eta">~2m</span>
                </div>
                <button className="btn">Use this route</button>
              </div>

              <div className="route">
                <div className="row">
                  <span className="tag">Stripe</span>
                  <span className="price">$0.70</span>
                  <span className="eta">~Instant</span>
                </div>
                <button className="btn">Use this route</button>
              </div>
            </div>

            <div className="actions">
              <Link href="/dashboard" className="btn">Go to Dashboard</Link>
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
        .muted{color:#b8c0d4;margin-bottom:8px}
        .grid{display:grid;gap:12px;margin:12px 0}
        .route{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);
               border-radius:14px;padding:16px}
        .row{display:flex;align-items:center;gap:12px;justify-content:space-between;margin-bottom:10px}
        .tag{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);padding:6px 10px;border-radius:10px}
        .price{font-weight:800}
        .eta{color:#78f6cf}
        .actions{display:flex;gap:12px;margin-top:6px}
        .btn{background:linear-gradient(90deg,#22ff9a,#10e0ff);color:#08231f;font-weight:800;
             padding:10px 18px;border-radius:12px;box-shadow:0 10px 28px rgba(16,224,255,.22)}
      `}</style>
    </>
  );
}
