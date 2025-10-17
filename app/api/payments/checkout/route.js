// app/checkout/page.js
"use client";

import { useEffect, useRef, useState } from "react";

export default function CheckoutPage() {
  const [payload, setPayload] = useState(null);
  const [loadingLib, setLoadingLib] = useState(true);
  const [busy, setBusy] = useState(false);
  const dropinRef = useRef(null);
  const instRef = useRef(null);

  // 1) Load payload from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("gaza_checkout");
      const p = raw ? JSON.parse(raw) : null;
      if (!p || !p.total || p.total <= 0) {
        window.location.href = "/";
        return;
      }
      // normalize total to 2 decimals
      p.total = +(+p.total).toFixed(2);
      setPayload(p);
    } catch {
      window.location.href = "/";
    }
  }, []);

  // 2) Load Braintree drop-in script once
  useEffect(() => {
    const src = "https://js.braintreegateway.com/web/dropin/1.39.1/js/dropin.min.js";
    if (document.querySelector(`script[src="${src}"]`)) {
      setLoadingLib(false);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => setLoadingLib(false);
    s.onerror = () => {
      alert("Failed to load payment library.");
      setLoadingLib(false);
    };
    document.head.appendChild(s);
  }, []);

  // 3) Init drop-in after lib + payload
  useEffect(() => {
    if (loadingLib || !payload || instRef.current) return;
    (async () => {
      try {
        setBusy(true);
        const t = await fetch("/api/payments/token", { cache: "no-store" }).then((r) => r.json());
        if (!t?.ok || !t.clientToken) throw new Error(t?.error || "No client token");
        // eslint-disable-next-line no-undef
        const inst = await braintree.dropin.create({
          authorization: t.clientToken,
          container: dropinRef.current,
          paypal: { flow: "checkout", amount: payload.total.toFixed(2), currency: "USD" },
          locale: "en_US",
          // Enable cards later when Hosted Fields are configured:
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
  }, [loadingLib, payload]);

  async function payNow() {
    try {
      if (!instRef.current) return;
      setBusy(true);
      const { nonce } = await instRef.current.requestPaymentMethod();
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, amount: +payload.total.toFixed(2) }),
      });
      const j = await res.json();
      if (!res.ok || j?.ok === false) throw new Error(j?.error || "Checkout failed");
      sessionStorage.removeItem("gaza_checkout");
      window.location.href = "/success";
    } catch (e) {
      console.error(e);
      alert(e.message || "Payment failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!payload) return null;

  return (
    <div className="wrap">
      <div className="box">
        <h1 className="title">Checkout</h1>

        <div className="summary">
          <div className="row">
            <span>Subtotal</span>
            <strong>${(+payload.subtotal || 0).toFixed(2)}</strong>
          </div>
          <div className="row">
            <span>Fee</span>
            <strong>${(+payload.fee || 0).toFixed(2)}</strong>
          </div>
          <div className="row total">
            <span>Total</span>
            <strong>${payload.total.toFixed(2)}</strong>
          </div>

          {Array.isArray(payload.lines) && payload.lines.length > 0 && (
            <details className="details">
              <summary>Breakdown</summary>
              <ul>
                {payload.lines.map((l, i) => (
                  <li key={i}>
                    {l.name} × {l.qty} — ${(+(l.unit * l.qty)).toFixed(2)}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>

        <div ref={dropinRef} className="dropin" />

        <div className="actions">
          <button className="btnPrimary" disabled={busy} onClick={payNow}>
            {busy ? "Processing…" : "Pay securely"}
          </button>
          <a className="btnGhost" href="/">
            Back
          </a>
        </div>

        <div className="note">
          We facilitate payments; we’re not an NGO. Provider fees may apply. Distribution summaries will
          be published periodically.
        </div>
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: grid;
          place-items: center;
          color: #eaf7ff;
          background:
            radial-gradient(1200px 700px at 50% -15%, rgba(191, 234, 255, 0.22), transparent 60%),
            linear-gradient(135deg, #00b6ff, #00ffd1);
          padding: 24px 12px;
        }
        .box {
          width: min(640px, 96vw);
          background: rgba(0, 36, 64, 0.82);
          border: 1px solid rgba(54, 212, 255, 0.38);
          border-radius: 22px;
          padding: 20px;
          box-shadow: 0 16px 40px rgba(0, 174, 239, 0.35);
        }
        .title {
          margin: 0 0 8px;
        }
        .summary {
          margin-bottom: 12px;
          padding: 12px;
          border-radius: 16px;
          background: linear-gradient(180deg, rgba(0, 36, 64, 0.5), rgba(0, 36, 64, 0.36));
          border: 1px solid rgba(54, 212, 255, 0.35);
        }
        .row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 6px 0;
        }
        .row.total {
          margin-top: 8px;
          font-weight: 900;
        }
        .details {
          margin-top: 8px;
        }
        .details summary {
          cursor: pointer;
        }
        .details ul {
          margin: 8px 0 0 18px;
        }
        .dropin {
          margin: 14px 0 10px;
        }
        .actions {
          display: flex;
          gap: 10px;
          margin-top: 6px;
        }
        .btnPrimary {
          background: linear-gradient(135deg, #36d4ff, #00aeef);
          color: #003a60;
          font-weight: 900;
          border: 1px solid rgba(191, 234, 255, 0.25);
          border-radius: 12px;
          padding: 10px 18px;
          box-shadow: 0 12px 28px rgba(31, 216, 255, 0.35);
          cursor: pointer;
          transition: transform 0.06s ease, box-shadow 0.2s ease;
        }
        .btnPrimary:active {
          transform: scale(0.98);
        }
        .btnGhost {
          padding: 10px 16px;
          border-radius: 12px;
          color: #eaf7ff;
          border: 1px solid rgba(92, 200, 245, 0.45);
          text-decoration: none;
        }
        .note {
          margin-top: 10px;
          opacity: 0.9;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
