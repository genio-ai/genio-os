"use client";

import { useEffect, useRef, useState } from "react";
import dropin from "braintree-web-drop-in";

export default function PaymentsPage() {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);
  const [amount, setAmount] = useState("100.00");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let active = true;

    async function setupDropin() {
      try {
        const res = await fetch("/api/payments/token");
        const data = await res.json();
        if (!data?.clientToken) {
          setMsg("No client token");
          return;
        }

        const inst = await dropin.create({
          authorization: data.clientToken,
          container: containerRef.current,
        });

        if (active) instanceRef.current = inst;
      } catch (e) {
        setMsg(e?.message || "Failed to init drop-in");
      }
    }

    setupDropin();
    return () => {
      active = false;
      if (instanceRef.current) {
        instanceRef.current.teardown();
        instanceRef.current = null;
      }
    };
  }, []);

  const pay = async () => {
    try {
      setLoading(true);
      setMsg("");

      if (!instanceRef.current) {
        setMsg("Drop-in not ready");
        return;
      }

      const { nonce } = await instanceRef.current.requestPaymentMethod();

      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, amount }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Payment failed");

      setMsg(`Success: ${data.txn.id}`);
    } catch (e) {
      setMsg(e?.message || "Payment error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Payments</h1>

      <label className="block text-sm mb-2">Amount (USD)</label>
      <input
        className="w-full max-w-xs rounded bg-black/30 border border-white/10 p-3 mb-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="100.00"
        inputMode="decimal"
      />

      <div
        ref={containerRef}
        className="w-full max-w-md bg-black/20 border border-white/10 rounded p-3 mb-4"
      />

      <button
        onClick={pay}
        disabled={loading}
        className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay"}
      </button>

      {msg && <p className="mt-4 text-sm">{msg}</p>}
    </div>
  );
}
