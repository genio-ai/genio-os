// app/checkout/page.js
"use client";

import { useEffect, useRef, useState } from "react";

export default function CheckoutPage() {
  const [payload, setPayload] = useState(null);
  const [readyLib, setReadyLib] = useState(false);
  const [busy, setBusy] = useState(false);
  const dropinRef = useRef(null);
  const instRef = useRef(null);

  // Load payload from session (set on /)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gaza_checkout");
      const p = raw ? JSON.parse(raw) : null;
      if (!p || !p.total || p.total <= 0) { window.location.href = "/"; return; }
      setPayload(p);
    } catch { window.location.href = "/"; }
  }, []);

  // Load Braintree drop-in
  useEffect(() => {
    const src = "https://js.braintreegateway.com/web/dropin/1.39.1/js/dropin.min.js";
    if (document.querySelector(`script[src="${src}"]`)) { setReadyLib(true); return; }
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => setReadyLib(true);
    s.onerror = () => alert("Payment library failed to load.");
    document.head.appendChild(s);
  }, []);

  // Init drop-in after lib + payload
  useEffect(() => {
    if (!readyLib || !payload || instRef.current) return;
    (async () => {
      try {
        setBusy(true);
        const tok = await fetch("/api/payments/token", { cache: "no-store" }).then(r => r.json());
        if (!tok?.clientToken) throw new Error("No client token");
        // eslint-disable-next-line no-undef
        const inst = await braintree.dropin.create({
          authorization: tok.clientToken,
          container: dropinRef.current,
          paypal: { flow: "checkout", amount: payload.total.toFixed(2), currency: "USD" },
          locale: "en_US",
          // Enable cards later when Hosted Fields are ready:
          // card: { cardholderName: true }
        });
        instRef.current = inst;
      } catch (e) {
        console.error(e);
        alert("Payment init error. Please go back and try again.");
      } finally {
        setBusy(false);
      }
    })();
  }, [readyLib, payload]);

  async function payNow() {
    try {
      setBusy(true);
      const { nonce } = await instRef.current.requestPaymentMethod();
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Your API expects { nonce, amount }
        body: JSON.stringify({ nonce, amount: +payload.total.toFixed(2) })
      });
      const j = await res.json();
      if (!res.ok || j?.ok === false) throw new Error(j?.error || "Checkout failed");
      sessionStorage.removeItem("gaza_checkout");
      window.location.href = "/success";
    } catch (e) {
      console.error(e);
      alert("Payment failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!payload) return null;

  return (
    <div className="wrap">
      <div className="box">
        <h1>Checkout</h1>
        <p>Total: <strong>${payload.total.toFixed(2)}</strong></p>
        <div ref={dropinRef} style={{ margin: "12px 0" }} />
        <div className="row">
          <button className="btnPrimary" disabled={busy} onClick={payNow}>
            {busy ? "Processing…" : "Pay securely"}
          </button>
          <a className="btnGhost" href="/">Back</a>
        </div>
        <div className="note">We facilitate payments; we’re not an NGO. Provider fees may apply.</div>
      </div>

      <style jsx>{`
        .wrap{ min-height:100vh; display:grid; place-items:center; color:#EAF7FF;
               background: radial-gradient(1200px 700px at 50% -15%, rgba(191,234,255,.22), transparent 60%),
                           linear-gradient(135deg, #00B6FF, #0074FF); }
        .box{ width:min(560px, 92vw); background:rgba(0,36,64,.82); border:1px solid rgba(54,212,255,.38);
              border-radius:22px; padding:20px; box-shadow:0 16px 40px rgba(0,174,239,.35); }
        h1{ margin:0 0 8px; }
        .row{ display:flex; gap:10px; margin-top:16px; }
        .btnPrimary{ background:linear-gradient(135deg, #36D4FF, #00AEEF); color:#003A60; font-weight:900; border:1px solid rgba(191,234,255,.25);
                     border-radius:12px; padding:10px 18px; box-shadow:0 12px 28px rgba(31,216,255,.35); cursor:pointer; }
        .btnGhost{ padding:10px 16px; border-radius:12px; color:#EAF7FF; border:1px solid rgba(92,200,245,.45); text-decoration:none; }
        .note{ margin-top:10px; opacity:.9; font-size:12px; }
      `}</style>
    </div>
  );
}
