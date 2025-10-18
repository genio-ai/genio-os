"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export default function CheckoutPage() {
  // amounts can be passed via query (?total=12.34) or read from localStorage if عندك كارت
  const [total, setTotal] = useState(0);
  const [busy, setBusy] = useState(false);
  const [btReady, setBtReady] = useState(false);
  const dropinRef = useRef(null);
  const instanceRef = useRef(null);

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  // read total from URL or storage
  useEffect(() => {
    const url = new URL(window.location.href);
    const t = url.searchParams.get("total");
    const val = t ? parseFloat(t) : parseFloat(localStorage.getItem("donation_total") || "0");
    setTotal(Number.isFinite(val) ? +val.toFixed(2) : 0);
  }, []);

  // load Braintree Drop-in
  useEffect(() => {
    const src = "https://js.braintreegateway.com/web/dropin/1.39.1/js/dropin.min.js";
    if (document.querySelector(`script[src="${src}"]`)) {
      setBtReady(true);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => setBtReady(true);
    s.onerror = () => console.error("Braintree Drop-in failed to load");
    document.head.appendChild(s);
  }, []);

  // init drop-in
  useEffect(() => {
    if (!btReady || !dropinRef.current) return;
    let mounted = true;

    (async () => {
      try {
        setBusy(true);
        const tok = await fetch("/api/payments/token", { cache: "no-store" }).then((r) => r.json());
        if (!tok?.ok || !tok.clientToken) throw new Error(tok?.error || "No client token");

        // eslint-disable-next-line no-undef
        const inst = await braintree.dropin.create({
          authorization: tok.clientToken,
          container: dropinRef.current,
          locale: "en_US",
          paypal: false,
          card: { cardholderName: true },
          threeDSecure: { amount: (total || 0).toFixed(2) } // 3DS if enabled in dashboard
        });

        if (mounted) instanceRef.current = inst;
      } catch (e) {
        console.error(e);
        alert("Payment init error.");
      } finally {
        setBusy(false);
      }
    })();

    return () => {
      mounted = false;
      const inst = instanceRef.current;
      if (inst) inst.teardown().catch(() => {}).finally(() => (instanceRef.current = null));
    };
  }, [btReady, total]);

  async function payNow() {
    if (!instanceRef.current) return;

    try {
      setBusy(true);

      // request nonce (and trigger 3DS challenge if active)
      const { nonce } = await instanceRef.current.requestPaymentMethod({
        threeDSecure: { amount: (total || 0).toFixed(2) }
      });

      // send to server
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // simple idempotency (improve with UUID on real prod)
          "X-Idempotency-Key": `don-${Date.now()}-${Math.random().toString(36).slice(2)}`
        },
        body: JSON.stringify({ nonce, amount: +Number(total).toFixed(2) })
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

          <div className="dropin" dir="ltr">
            <div ref={dropinRef} />
          </div>

          <button className="btn" onClick={payNow} disabled={busy || !total}>
            {busy ? "Processing…" : "Pay securely • ادفع بأمان"}
          </button>

          <p className="hint">
            CVV/3-D Secure checks are enabled for your security. Your card data never touches our servers.
          </p>
        </section>
      </main>

      <style jsx global>{`
        :root{
          --bg:#F4F7FB; --line:#E3EAF3; --ink:#0E2240;
          --pri:#0A66C2; --pri-dark:#084F97;
        }
        *{box-sizing:border-box}
        body{margin:0; background:var(--bg); color:var(--ink); font-family:Inter, system-ui, sans-serif}
        .bar{position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center;
             padding:12px 16px; background:#fff; border-bottom:1px solid var(--line)}
        .brand{font-weight:900; letter-spacing:.5px}
        .link{background:transparent; border:0; color:#2b5d8f; cursor:pointer; font-weight:700}
        .wrap{max-width:920px; margin:24px auto; padding:0 16px}
        .card{background:#fff; border:1px solid var(--line); border-radius:14px; box-shadow:0 4px 10px rgba(0,0,0,.04)}
        .pay{padding:18px; }
        .title{margin:0 0 12px}
        .sum{padding:12px; margin-bottom:16px}
        .row{display:flex; justify-content:space-between; align-items:center}
        .lbl{color:#4a678b}
        .amt{font-weight:900}
        .dropin{margin:12px 0}
        .btn{
          width:100%; height:46px; border-radius:12px; border:1px solid var(--pri-dark);
          background:var(--pri); color:#fff; font-weight:900; cursor:pointer;
        }
        .btn:disabled{opacity:.6; cursor:not-allowed}
        .hint{font-size:12px; color:#6a86a8; margin:10px 2px 0}
      `}</style>
    </div>
  );
}
