"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function CheckoutPage() {
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const hfRef = useRef(null);      // hostedFields instance
  const clientRef = useRef(null);  // braintree client instance

  const fmt = useMemo(() => new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD"
  }), []);

  // Read total from URL or localStorage
  useEffect(() => {
    const url = new URL(window.location.href);
    const t = url.searchParams.get("total");
    const val = t ? parseFloat(t) : parseFloat(localStorage.getItem("donation_total") || "0");
    setTotal(Number.isFinite(val) ? +val.toFixed(2) : 0);
  }, []);

  // Load Braintree SDKs (client + hosted-fields) — لا 3DS
  useEffect(() => {
    const urls = [
      "https://js.braintreegateway.com/web/3.96.0/js/client.min.js",
      "https://js.braintreegateway.com/web/3.96.0/js/hosted-fields.min.js",
    ];
    let loaded = 0;
    const done = () => { loaded += 1; if (loaded === urls.length) setSdkReady(true); };
    for (const src of urls) {
      if (document.querySelector(`script[src="${src}"]`)) { done(); continue; }
      const s = document.createElement("script");
      s.src = src; s.async = true; s.onload = done;
      s.onerror = () => console.error("BT script load failed:", src);
      document.head.appendChild(s);
    }
  }, []);

  // Init Hosted Fields (نُظهر CVV صراحةً)
  useEffect(() => {
    if (!sdkReady) return;
    let mounted = true;

    (async () => {
      try {
        setBusy(true);
        const tok = await fetch("/api/payments/token", { cache: "no-store" }).then(r => r.json());
        if (!tok?.ok || !tok.clientToken) throw new Error(tok?.error || "No client token");

        // eslint-disable-next-line no-undef
        braintree.client.create({ authorization: tok.clientToken }, (err, clientInstance) => {
          if (err) { console.error(err); setBusy(false); return; }
          clientRef.current = clientInstance;

          // eslint-disable-next-line no-undef
          braintree.hostedFields.create({
            client: clientInstance,
            styles: {
              "input": { fontSize: "16px", fontFamily: "Inter, system-ui, sans-serif" },
              ".invalid": { color: "#d93025" },
              ".valid": { color: "#0a7d33" }
            },
            fields: {
              number:         { selector: "#card-number", placeholder: "4111 1111 1111 1111" },
              expirationDate: { selector: "#expiration-date", placeholder: "MM/YY" },
              cvv:            { selector: "#cvv", placeholder: "123" } // ← CVV ظاهر دائمًا
            }
          }, (hfErr, hostedFieldsInstance) => {
            setBusy(false);
            if (hfErr) { console.error(hfErr); return; }
            if (mounted) hfRef.current = hostedFieldsInstance;
          });
        });
      } catch (e) {
        console.error(e);
        setBusy(false);
        alert("Payment init error.");
      }
    })();

    return () => {
      mounted = false;
      if (hfRef.current) { hfRef.current.teardown(); hfRef.current = null; }
      if (clientRef.current) { clientRef.current = null; }
    };
  }, [sdkReady]);

  async function payNow() {
    const hf = hfRef.current;
    if (!hf) return;

    try {
      setBusy(true);
      // tokenize يجمّع number/exp/cvv ويولّد nonce
      const { nonce } = await hf.tokenize({ vault: false });

      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": `don-${Date.now()}-${Math.random().toString(36).slice(2)}`
        },
        body: JSON.stringify({ nonce, amount: +Number(total).toFixed(2) }) // 👈 بدون 3DS
      });

      const j = await res.json();
      if (!res.ok || j?.ok === false) throw new Error(j?.error || "Checkout failed");
      window.location.href = "/success";
    } catch (e) {
      console.error(e);
      alert(e.message || "Payment failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chk">
      <header className="bar">
        <div className="brand">GAZA RELIEF</div>
        <button className="link" onClick={() => history.back()}>&larr; Back</button>
      </header>

      <main className="wrap">
        <section className="card pay">
          <h1 className="title">Checkout • <span dir="rtl">إتمام الدفع</span></h1>

          <div className="sum card">
            <div className="row">
              <div className="lbl">Total</div>
              <div className="amt">{fmt.format(total || 0)}</div>
            </div>
          </div>

          {/* Hosted Fields UI */}
          <div className="hf" dir="ltr">
            <label className="lab">Card Number</label>
            <div id="card-number" className="hfBox" />

            <div className="row2">
              <div className="half">
                <label className="lab">Expiration (MM/YY)</label>
                <div id="expiration-date" className="hfBox" />
              </div>
              <div className="half">
                <label className="lab">CVV</label>
                <div id="cvv" className="hfBox" />
              </div>
            </div>
          </div>

          <button className="btn" onClick={payNow} disabled={busy || !total}>
            {busy ? "Processing…" : "Pay securely • ادفع بأمان"}
          </button>

          <p className="hint">CVV checks are enabled. Your card data never touches our servers.</p>
        </section>
      </main>

      <style jsx global>{`
        :root { --bg:#f4f7fb; --line:#e3eaf3; --ink:#0e2240; --pri:#0a66c2; --pri-dark:#084f97; }
        *{box-sizing:border-box}
        body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter, system-ui, sans-serif}
        .bar{position:sticky;top:0;z-index:10;display:flex;justify-content:space-between;align-items:center;
             padding:12px 16px;background:#fff;border-bottom:1px solid var(--line)}
        .brand{font-weight:900;letter-spacing:.5px}
        .link{background:transparent;border:0;color:#2b5d8f;cursor:pointer;font-weight:700}
        .wrap{max-width:920px;margin:24px auto;padding:0 16px}
        .card{background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 4px 10px rgba(0,0,0,.04)}
        .pay{padding:18px;}
        .title{margin:0 0 12px}
        .sum{padding:12px;margin-bottom:16px}
        .row{display:flex;justify-content:space-between;align-items:center}
        .lbl{color:#4a678b}
        .amt{font-weight:900}
        .hf{margin:12px 0}
        .lab{display:block;margin:10px 0 6px;color:#4a678b}
        .hfBox{height:44px;border:1px solid var(--line);border-radius:12px;padding:10px;background:#fff}
        .row2{display:flex;gap:12px;margin-top:6px}
        .half{flex:1}
        .btn{width:100%;height:46px;border-radius:12px;border:1px solid var(--pri-dark);
             background:var(--pri);color:#fff;font-weight:900;cursor:pointer}
        .btn:disabled{opacity:.6;cursor:not-allowed}
        .hint{font-size:12px;color:#6a86a8;margin:10px 2px 0}
      `}</style>
    </div>
  );
}
