// File: app/page.js
"use client";

import { useMemo, useState, useEffect } from "react";
import { Inter } from "next/font/google";
import { Noto_Sans_Arabic } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const noto = Noto_Sans_Arabic({ subsets: ["arabic"], display: "swap" });

const ITEMS = [
  {
    id: "bread",
    ar: "كيس خبز عائلي (5 أرغفة)",
    en: "Family Bread Bag (5 loaves)",
    price: 2.5,
  },
  {
    id: "veg_meal",
    ar: "وجبة ساخنة نباتية (رز + خضار)",
    en: "Hot Meal — Veg (Rice + Veg)",
    price: 7.5,
  },
  {
    id: "meat_meal",
    ar: "وجبة ساخنة باللحم (رز + لحم مفروم + خضار)",
    en: "Hot Meal — Meat (Rice + Beef + Veg)",
    price: 8.5,
  },
  {
    id: "cans_box",
    ar: "كرتون معلبات غذائية (12 قطعة)",
    en: "Canned Food Box (12 pcs)",
    price: 28,
  },
  {
    id: "flour",
    ar: "كيس طحين 25 كغ",
    en: "Flour 25 kg",
    price: 34,
  },
];

export default function Page() {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(ITEMS.map((i) => [i.id, 0]))
  );
  const [custom, setCustom] = useState("");
  const [method, setMethod] = useState("paypal"); // "paypal" | "stripe"
  const [busy, setBusy] = useState(false);
  const [nowStr, setNowStr] = useState("");

  useEffect(() => {
    const d = new Date();
    setNowStr(
      d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    );
  }, []);

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  const total = useMemo(() => {
    const itemsTotal = ITEMS.reduce((sum, i) => sum + i.price * (quantities[i.id] || 0), 0);
    const customAmt = parseFloat(custom) || 0;
    return +(itemsTotal + customAmt).toFixed(2);
  }, [quantities, custom]);

  const cartLines = useMemo(() => {
    const lines = ITEMS
      .map((i) => ({ name: `${i.en} / ${i.ar}`, unit_amount: i.price, qty: quantities[i.id] || 0 }))
      .filter((l) => l.qty > 0);
    const customAmt = parseFloat(custom);
    if (!isNaN(customAmt) && customAmt > 0)
      lines.push({ name: "Custom donation / تبرّع بمبلغ آخر", unit_amount: customAmt, qty: 1 });
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
      if (method === "stripe" && data.url) window.location.href = data.url;
      else if (method === "paypal" && data.approveUrl) window.location.href = data.approveUrl;
      else throw new Error("Missing redirect URL");
    } catch (e) {
      console.error(e);
      alert("Payment init error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`${inter.className} ${noto.className}`} style={styles.page}>
      {/* Hero */}
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.brand}>GAZA RELIEF</div>
          <h1 style={styles.h1}>
            Gaza needs your help — today
          </h1>
          <p style={styles.subtitle}>
            Your donation becomes food and shelter for displaced families. Transparent, secure, fast.
          </p>

          {/* Arabic line shown together */}
          <div style={styles.arLine} dir="rtl">
            غزّة تحتاج دعمك اليوم — تبرّعك يتحوّل إلى غذاء ومأوى للعائلات المتضرّرة.
          </div>

          <button
            style={styles.cta}
            onClick={() =>
              document.getElementById("donation-section")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Donate now • تبرّع الآن
          </button>
        </div>
      </header>

      {/* Transparency strip (bilingual labels) */}
      <section style={styles.infoBar}>
        <div>
          <strong>Families supported</strong> / <strong dir="rtl">عائلات مُدعومة</strong>: 1,248
        </div>
        <div>
          <strong>Last update</strong> / <strong dir="rtl">آخر تحديث</strong>: {nowStr}
        </div>
        <div>
          <strong>Admin overhead</strong> / <strong dir="rtl">مصاريف إدارية</strong>: &lt; 5%
        </div>
      </section>

      <main id="donation-section" style={styles.main}>
        <h2 style={styles.h2}>
          Choose how to help <span style={styles.sep}>•</span>{" "}
          <span dir="rtl">اختر طريقة دعمك</span>
        </h2>

        {/* Items */}
        <div style={styles.cardList}>
          {ITEMS.map((i) => (
            <div key={i.id} style={styles.card}>
              <div style={styles.itemLeft}>
                <div>
                  <div style={styles.itemTitleEn}>{i.en}</div>
                  <div style={styles.itemTitleAr} dir="rtl">{i.ar}</div>
                  <div style={styles.price}>{fmt.format(i.price)}</div>
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

        {/* Custom amount */}
        <div style={styles.customBox}>
          <label style={styles.customLabel}>
            Or enter your own amount (USD) —{" "}
            <span dir="rtl">أو أدخل المبلغ الذي ترغب به (دولار)</span>
          </label>
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
          <label style={styles.methodLbl}>
            Payment method <span style={styles.sep}>•</span>{" "}
            <span dir="rtl">طريقة الدفع</span>:
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            style={styles.methodSel}
          >
            <option value="paypal">PayPal</option>
            <option value="stripe">Card (Stripe)</option>
          </select>
        </div>

        {/* Summary */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryText}>
            Total <span style={styles.sep}>•</span> <span dir="rtl">الإجمالي</span>
          </div>
          <div style={styles.summaryAmt}>{fmt.format(total)}</div>
        </div>
        <button style={styles.checkout} onClick={checkout} disabled={busy}>
          {busy ? "Processing..." : "Donate securely • تبرّع بأمان"}
        </button>

        {/* Trust */}
        <div style={styles.trustRow}>
          <span style={styles.badge}>SSL Secure</span>
          <span style={styles.badge}>Instant receipt</span>
          <span style={styles.badge}>Photo updates</span>
        </div>

        {/* Short story bilingual */}
        <div style={styles.story}>
          “After displacement, a mother said: <em>Bread and water for the kids came first…</em> Thank you.”
          <div dir="rtl" style={{ marginTop: 6 }}>
            «بعد النزوح، قالت إحدى الأمهات: <em>الخبز والماء للأطفال كانا أول ما احتجناه…</em> شكرًا لكم».
          </div>
        </div>

        {/* FAQ bilingual */}
        <div style={styles.faq}>
          <details>
            <summary>How do you ensure delivery? / <span dir="rtl">كيف نضمن وصول التبرّع؟</span></summary>
            <p>We work with trusted local partners and share photo proof of distributions.</p>
            <p dir="rtl">نعمل مع شركاء محليين موثوقين ونشارك صورًا لتوثيق التسليمات.</p>
          </details>
          <details>
            <summary>Is my donation tax-deductible? / <span dir="rtl">هل التبرّع مخصوم ضريبيًا؟</span></summary>
            <p>Depends on your country. Details appear at checkout.</p>
            <p dir="rtl">يعتمد على بلد المتبرّع. التفاصيل تظهر عند الدفع.</p>
          </details>
          <details>
            <summary>Can I get updates? / <span dir="rtl">هل يمكنني استلام تحديثات؟</span></summary>
            <p>Yes. Opt in for email/WhatsApp updates after donating.</p>
            <p dir="rtl">نعم. يمكنك تفعيل التحديثات عبر البريد/واتساب بعد التبرّع.</p>
          </details>
        </div>
      </main>

      <footer style={styles.footer}>
        <div>© 2025 Gaza Relief — Privacy • Transparency • Terms</div>
        <div dir="rtl" style={{ opacity: 0.85, marginTop: 4 }}>
          © ٢٠٢٥ إغاثة غزّة — الخصوصية • الشفافية • الشروط
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: { background: "#f6f8fb", color: "#0f1b2d" },
  hero: {
    background: "linear-gradient(135deg, #20415a, #162a3f)",
    color: "#fff",
    padding: "56px 20px 72px",
    textAlign: "center",
  },
  heroInner: { maxWidth: 980, margin: "0 auto" },
  brand: { fontSize: 12, letterSpacing: 3, textTransform: "uppercase", opacity: 0.9, marginBottom: 12 },
  h1: { fontSize: 32, lineHeight: 1.25, margin: "0 0 8px" },
  subtitle: { fontSize: 16, opacity: 0.95 },
  arLine: { marginTop: 8, fontSize: 15, opacity: 0.95 },
  cta: {
    marginTop: 14, background: "#4cb5f5", color: "#0b2239", border: "none",
    padding: "12px 20px", borderRadius: 8, fontSize: 16, cursor: "pointer",
  },
  infoBar: {
    background: "#fff",
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12, padding: "12px 16px",
    maxWidth: 980, margin: "12px auto",
    borderRadius: 10, border: "1px solid #e5ebf2", boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
    fontSize: 14,
  },
  main: { maxWidth: 980, margin: "20px auto 80px", padding: "0 16px" },
  h2: { fontSize: 22, marginBottom: 12 },
  sep: { opacity: 0.5, margin: "0 6px" },
  cardList: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  card: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: 14, borderRadius: 12, border: "1px solid #e5ebf2", background: "#fff",
    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
  },
  itemLeft: { display: "flex", gap: 10, alignItems: "center" },
  itemTitleEn: { fontWeight: 600, marginBottom: 2 },
  itemTitleAr: { fontWeight: 600, fontSize: 14, opacity: 0.95 },
  price: { fontSize: 14, color: "#35506a", marginTop: 4 },
  qtyBox: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 34, height: 34, borderRadius: 8, background: "#eef4fb",
    border: "1px solid #d7dfeb", cursor: "pointer", fontSize: 18, lineHeight: "0",
  },
  qty: { minWidth: 18, textAlign: "center", fontWeight: 600 },
  customBox: {
    marginTop: 18, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
    background: "#fff", border: "1px solid #e5ebf2", borderRadius: 12, padding: 14,
  },
  customLabel: { fontSize: 14, color: "#35506a" },
  customInput: {
    width: 160, padding: "10px 12px", borderRadius: 8, border: "1px solid #d7dfeb", outline: "none",
  },
  methodRow: { marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  methodLbl: { fontSize: 14, color: "#35506a" },
  methodSel: { padding: "8px 10px", borderRadius: 8, border: "1px solid #d7dfeb" },
  summaryRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: 16, padding: "14px 16px", borderRadius: 12, background: "#f0f6ff",
    border: "1px solid #d7e7ff",
  },
  summaryText: { fontWeight: 700 },
  summaryAmt: { fontWeight: 800, fontSize: 18 },
  checkout: {
    width: "100%", marginTop: 12, padding: "14px 16px", fontSize: 16,
    background: "#3bb273", color: "#0b2239", border: "none", borderRadius: 12, cursor: "pointer",
  },
  trustRow: { display: "flex", gap: 10, marginTop: 12, fontSize: 12, color: "#445a73", flexWrap: "wrap" },
  badge: { background: "#e8eef6", padding: "6px 10px", borderRadius: 20, border: "1px solid #d7dfeb" },
  story: {
    marginTop: 22, fontSize: 14, color: "#334b63", background: "#fff",
    border: "1px solid #e5ebf2", borderRadius: 12, padding: 14,
  },
  faq: {
    marginTop: 16, background: "#fff", border: "1px solid #e5ebf2",
    borderRadius: 12, padding: 14, fontSize: 14,
  },
  footer: {
    marginTop: 40, padding: "24px 16px", textAlign: "center", fontSize: 13,
    background: "#102027", color: "#d9e3ee",
  },
};
