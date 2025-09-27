"use client";

import { useEffect, useRef, useState } from "react";

export default function PaymentsPage() {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const [clientToken, setClientToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [amount, setAmount] = useState("10.00");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Load Braintree Drop-in script from CDN once
  async function loadDropinScript() {
    const src = "https://js.braintreegateway.com/web/dropin/1.43.0/js/dropin.min.js";
    if (document.querySelector(`script[src="${src}"]`)) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load Braintree Drop-in script"));
      document.head.appendChild(s);
    });
  }

  // Initialize: fetch client token and create drop-in
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        await loadDropinScript();

        const res = await fetch("/api/payments/token", { cache: "no-store" });
        const json = await res.json();
        if (!json.ok || !json.clientToken) {
          throw new Error(json.error || "No client token");
        }
        if (!active) return;

        setClientToken(json.clientToken);

        // @ts-ignore
        const dropin = await window.braintree.dropin.create({
          authorization: json.clientToken,
          container: containerRef.current,
          paypal: {
            flow: "checkout"
          },
          card: {
            cardholderName: true
          }
        });

        if (!active) {
          dropin.teardown?.();
          return;
        }
        instanceRef.current = dropin;
      } catch (e) {
        setError(e.message || String(e));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
      // Teardown drop-in instance on unmount
      if (instanceRef.current?.teardown) {
        instanceRef.current.teardown().catch(() => {});
      }
    };
  }, []);

  async function handlePay() {
    try {
      setCreating(true);
      setResult(null);
      setError(null);

      if (!instanceRef.current) throw new Error("Payment UI not ready");

      const { nonce } = await instanceRef.current.requestPaymentMethod();

      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, nonce })
      });

      const json = await res.json();
      if (!json.ok) {
        throw new Error(json.error || "Payment failed");
      }

      setResult(json.transaction);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Payments</h1>

      {/* Status line */}
      {loading && <div className="opacity-70 animate-pulse mb-3">Loading payment UI…</div>}
      {error && (
        <div className="mb-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {clientToken && !loading && (
        <div className="mb-3 text-sm opacity-80">
          Client token loaded.
        </div>
      )}

      {/* Amount */}
      <div className="mb-4">
        <label className="block text-sm mb-1">Amount (USD)</label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-40 bg-transparent border border-white/20 rounded px-3 py-2"
          placeholder="10.00"
        />
      </div>

      {/* Drop-in container */}
      <div
        ref={containerRef}
        className="rounded border border-white/10 p-4 bg-white/5"
      />

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={creating || loading || !instanceRef.current}
        className="mt-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded px-4 py-2 text-sm disabled:opacity-50"
      >
        {creating ? "Processing…" : "Pay"}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-6 rounded border border-white/10 p-4 bg-white/5 text-sm">
          <div className="font-semibold mb-1">Payment Success</div>
          <div><span className="opacity-70">ID:</span> {result.id}</div>
          <div><span className="opacity-70">Status:</span> {result.status}</div>
          <div><span className="opacity-70">Amount:</span> {result.amount} {result.currencyIsoCode}</div>
          {result.createdAt && (
            <div><span className="opacity-70">Created:</span> {new Date(result.createdAt).toLocaleString()}</div>
          )}
        </div>
      )}
    </div>
  );
}
