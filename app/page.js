// File: app/page.js
"use client";

import { useMemo, useState } from "react";

const ITEMS = [
  { id: "bread", label: "Family Bread Bag (5 loaves)", price: 2.5, icon: "🍞" },
  { id: "veg_meal", label: "Hot Meal — Veg (Rice + Veg)", price: 7.5, icon: "🥗" },
  { id: "meat_meal", label: "Hot Meal — Meat (Rice + Beef + Veg)", price: 8.5, icon: "🍛" },
  { id: "cans_box", label: "Canned Food Box (12 pcs)", price: 28, icon: "🥫" },
  { id: "flour", label: "Flour 25 kg", price: 34, icon: "🌾" },
];

export default function Page() {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(ITEMS.map((i) => [i.id, 0]))
  );
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState("paypal"); // "paypal" | "stripe"
  const [busy, setBusy] = useState(false);

  const total = useMemo(() => {
    const itemsTotal = ITEMS.reduce((sum, i) => sum + i.price * (quantities[i.id] || 0), 0);
    const customAmt = parseFloat(custom) || 0;
    return +(itemsTotal + customAmt).toFixed(2);
  }, [quantities, custom]);

  const cartLines = useMemo(() => {
    const lines = ITEMS
      .map((i) => ({ name: i.label, unit_amount: i.price, qty: quantities[i.id] || 0 }))
      .filter((l) => l.qty > 0);
    const customAmt = parseFloat(custom);
    if (!isNaN(customAmt) && customAmt > 0) {
      lines.push({ name: "Custom donation", unit_amount: customAmt, qty: 1 });
    }
    return lines;
  }, [quantities, custom]);

  const inc = (id) => setQuantities((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
  const dec = (id) => setQuantities((q) => ({ ...q, [id]: Math.max(0, (q[id] || 0) - 1) }));

  const checkout = async () => {
    if (total <= 0) {
      alert("Please add at least one item or enter a custom amount.");
      return;
    }
    setBusy(true);
    try {
      const endpoint =
        method === "stripe"
          ? "/api/payments/stripe/checkout"
          : "/api/payments/paypal/create";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ lines: cartLines, total }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();

      // Redirect to provider
      if (method === "stripe" && data.url) {
        window.location.href = data.url;
      } else if (method === "paypal" && data.approveUrl) {
        window.location.href = data.approveUrl;
      } else {
        throw new Error("Missing redirect URL");
      }
    } catch (e) {
      console.error(e);
      alert("Payment init error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.brand}>Gaza Relief</div>
          <h1 style={styles.h1}>Gaza needs your help — today</h1>
          <p style={styles.subtitle}>
            Your donation becomes food and shelter for displaced families. Transparent, secure, fast.
          </p>
          <button
            style={styles.cta}
            onClick={() =>
              document.getElementById("donation-section")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Donate now
          </button>
        </div>
      </header>

      <section style={styles.infoBar}>
        <div><strong>Families supported:</strong> 1,248</div>
        <div><strong>Last update:</strong> 16 Oct 2025</div>
        <div><strong>Admin overhead:</strong> &lt; 5%</div>
      </section>

      <main id="donation-section" style={styles.main}>
        <h2 style={styles.h2}>Choose how to help</h2>

        <div style={styles.cardList}>
          {ITEMS.map((i) => (
            <div key={i.id} style={styles.card}>
              <div style={styles.itemLeft}>
                <div style={styles.icon}>{i.icon}</div>
                <div>
                  <div style={styles.itemTitle}>{i.label}</div>
                  <div style={styles.price}>${i.price.toFixed(2)}</div>
                </div>
              </div>
              <div style={styles.qtyBox}>
                <button style={styles.qtyBtn} onClick={() => dec(i.id)}>-</button>
                <span style={styles.qty}>{quantities[i.id] || 0}</span>
                <button style={styles.qtyBtn} onClick={() => inc(i.id)}>+</button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.customBox}>
          <label style={styles.customLabel}>Or enter your own amount (USD):</label>
          <input
            type="number"
            inputMode="decimal"
            placeholder="e.g., 50"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            style={styles.customInput}
          />
        </div>

        {/* Payment method */}
        <div style={styles.methodRow}>
          <label style={styles.methodLbl}>Payment method:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={styles.methodSel}
          >
            <option value="paypal">PayPal</option>
            <option value="stripe">Card (Stripe)</option>
          </select>
        </div>

        <div style={styles.summaryRow}>
          <div style={styles.summaryText}>Total</div>
          <div style={styles.summaryAmt}>${total.toFixed(2)}</div>
        </div>
        <button style={styles.checkout} onClick={checkout} disabled={busy}>
          {busy ? "Processing..." : "Donate securely"}
        </button>

        <div style={styles.trustRow}>
          <span style={styles.badge}>SSL Secure</span>
          <span style={styles.badge}>Instant receipt</span>
          <span style={styles.badge}>Photo updates</span>
        </div>

        <div style={styles.story}>
          “After displacement, a mother said: <em>Bread and water for the kids came first…</em> Thank you.”
        </div>

        <div style={styles.faq}>
          <details>
            <summary>How do you ensure delivery?</summary>
            <p>We work with trusted local partners and share photo proof of distributions.</p>
          </details>
          <details>
            <summary>Is my donation tax-deductible?</summary>
            <p>Depends on your country. Details appear at checkout.</p>
          </details>
          <details>
            <summary>Can I get updates?</summary>
            <p>Yes. Opt in for email/WhatsApp updates after donating.</p>
          </details>
        </div>
      </main>

      <footer style={styles.footer}>
        <div>© 2025 Gaza Relief — Privacy • Transparency • Terms</div>
      </footer>
    </div>
  );
}

const styles = {
  page: { background: "#f9f9f9", color: "#0f1b2d" },
  hero: { background: "linear-gradient(135deg, #2a4d69, #1e3650)", color: "#fff", padding: "56px 20px 72px", textAlign: "center" },
  heroInner: { maxWidth: 980, margin: "0 auto" },
  brand: { fontSize: 14, letterSpacing: 2, textTransform: "uppercase", opacity: 0.9, marginBottom: 10 },
  h1: { fontSize: 36, lineHeight: 1.2, margin: "0 0 10px" },
  subtitle: { fontSize: 18, opacity: 0.95, marginBottom: 16 },
  cta: { background: "#4cb5f5", color: "#0b2239", border: "none", padding: "12px 20px", borderRadius: 6, fontSize: 16, cursor: "pointer" },
  infoBar: { background: "rgba(255,255,255,0.9)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "12px 16px", maxWidth: 980, margin: "12px auto", borderRadius: 8, border: "1px solid #e6e9ee", fontSize: 14 },
  main: { maxWidth: 980, margin: "20px auto 60px", padding: "0 16px" },
  h2: { fontSize: 24, marginBottom: 12 },
  cardList: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  card: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: 14, borderRadius: 10, border: "1px solid #e6e9ee", background: "#fff" },
  itemLeft: { display: "flex", gap: 12, alignItems: "center" },
  icon: { fontSize: 26, lineHeight: 1 },
  itemTitle: { fontWeight: 600, marginBottom: 4 },
  price: { fontSize: 14, color: "#344a5f" },
  qtyBox: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: { width: 34, height: 34, borderRadius: 8, background: "#eef4fb", border: "1px solid #d7dfeb", cursor: "pointer", fontSize: 18, lineHeight: "0" },
  qty: { minWidth: 18, textAlign: "center", fontWeight: 600 },
  customBox: { marginTop: 18, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", background: "#fff", border: "1px solid #e6e9ee", borderRadius: 10, padding: 14 },
  customLabel: { fontSize: 14, color: "#344a5f" },
  customInput: { width: 160, padding: "10px 12px", borderRadius: 8, border: "1px solid #d7dfeb", outline: "none" },
  methodRow: { marginTop: 12, display: "flex", gap: 10, alignItems: "center" },
  methodLbl: { fontSize: 14, color: "#344a5f" },
  methodSel: { padding: "8px 10px", borderRadius: 8, border: "1px solid #d7dfeb" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, padding: "14px 16px", borderRadius: 10, background: "#f0f5fb", border: "1px solid #d7dfeb" },
  summaryText: { fontWeight: 600 },
  summaryAmt: { fontWeight: 700, fontSize: 18 },
  checkout: { width: "100%", marginTop: 12, padding: "14px 16px", fontSize: 16, background: "#3bb273", color: "#0b2239", border: "none", borderRadius: 10, cursor: "pointer" },
  trustRow: { display: "flex", gap: 10, marginTop: 12, fontSize: 12, color: "#445a73" },
  badge: { background: "#e8eef6", padding: "6px 10px", borderRadius: 20, border: "1px solid #d7dfeb" },
  story: { marginTop: 22, fontSize: 14, color: "#334b63", background: "#fff", border: "1px solid #e6e9ee", borderRadius: 10, padding: 14 },
  faq: { marginTop: 16, background: "#fff", border: "1px solid #e6e9ee", borderRadius: 10, padding: 14, fontSize: 14 },
  footer: { marginTop: 40, padding: "24px 16px", textAlign: "center", fontSize: 13, background: "#102027", color: "#d9e3ee" },
};
