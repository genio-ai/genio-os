// File: app/page.js
"use client";

import { useMemo, useState, useEffect } from "react";

// ======= Data (bilingual items) =======
const ITEMS = [
  { id: "bread", ar: "كيس خبز عائلي (5 أرغفة)", en: "Family Bread Bag (5 loaves)", price: 2.5 },
  { id: "veg_meal", ar: "وجبة ساخنة نباتية (رز + خضار)", en: "Hot Meal — Veg (Rice + Veg)", price: 7.5 },
  { id: "meat_meal", ar: "وجبة ساخنة باللحم (رز + لحم مفروم + خضار)", en: "Hot Meal — Meat (Rice + Beef + Veg)", price: 8.5 },
  { id: "cans_box", ar: "كرتون معلبات غذائية (12 قطعة)", en: "Canned Food Box (12 pcs)", price: 28 },
  { id: "flour", ar: "كيس طحين 25 كغ", en: "Flour 25 kg", price: 34 },
];

export default function Page() {
  // Quantities per item
  const [q, setQ] = useState(() => Object.fromEntries(ITEMS.map(i => [i.id, 0])));
  const [custom, setCustom] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [nowStr, setNowStr] = useState("");

  useEffect(() => {
    const d = new Date();
    setNowStr(d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
  }, []);

  const fmt = useMemo(() => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }), []);

  const total = useMemo(() => {
    const itemsTotal = ITEMS.reduce((sum, i) => sum + i.price * (q[i.id] || 0), 0);
    const customAmt = parseFloat(custom) || 0;
    return +(itemsTotal + customAmt).toFixed(2);
  }, [q, custom]);

  const lines = useMemo(() => {
    const L = ITEMS.map(i => ({ name: `${i.en} / ${i.ar}`, unit: i.price, qty: q[i.id] || 0 }))
      .filter(l => l.qty > 0);
    const customAmt = parseFloat(custom);
    if (!isNaN(customAmt) && customAmt > 0) L.push({ name: "Custom donation / تبرّع بمبلغ آخر", unit: customAmt, qty: 1 });
    return L;
  }, [q, custom]);

  const inc = (id) => setQ(s => ({ ...s, [id]: (s[id] || 0) + 1 }));
  const dec = (id) => setQ(s => ({ ...s, [id]: Math.max(0, (s[id] || 0) - 1) }));

  const openDonate = () => {
    if (total <= 0) { alert("Add items or enter a custom amount first."); return; }
    setShowModal(true); // UI-only now. We'll plug Braintree here.
  };

  return (
    <div style={styles.page}>
      {/* ======= NAVBAR ======= */}
      <nav style={styles.nav}>
        <div style={styles.brand}>GAZA RELIEF</div>
        <button style={styles.navBtn} onClick={() => document.getElementById("desk")?.scrollIntoView({behavior:"smooth"})}>
          Donate now • تبرّع الآن
        </button>
      </nav>

      {/* ======= HERO ======= */}
      <header style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.h1}>Gaza needs your help — today</h1>
          <p style={styles.subtitle}>
            Your donation becomes food and shelter for displaced families. Transparent, secure, fast.
          </p>
          <div style={styles.arLine} dir="rtl">
            تبرّعك يتحوّل إلى غذاء ومأوى للعائلات المتضرّرة — شفاف، آمن، وسريع.
          </div>
          <button style={styles.cta} onClick={openDonate}>Donate now • تبرّع الآن</button>
          <div style={styles.status}>
            <span style={styles.dot} /> Active relief • <span dir="rtl">عمليات الإغاثة فعّالة الآن</span> — Last update / <span dir="rtl">آخر تحديث</span>: {nowStr}
          </div>
        </div>
      </header>

      {/* ======= INFO STRIP ======= */}
      <section style={styles.infoBar}>
        <div><strong>Families supported</strong> / <strong dir="rtl">عائلات مُدعومة</strong>: 1,248</div>
        <div><strong>Admin overhead</strong> / <strong dir="rtl">مصاريف إدارية</strong>: &lt; 5%</div>
        <div><strong>Currency</strong>: USD</div>
      </section>

      {/* ======= DONATION DESK ======= */}
      <main id="desk" style={styles.desk}>
        {/* Left: items */}
        <section style={styles.left}>
          <h2 style={styles.h2}>Choose how to help • <span dir="rtl">اختر طريقة دعمك</span></h2>
          <div style={styles.cards}>
            {ITEMS.map(i => (
              <div key={i.id} style={styles.card}>
                <div>
                  <div style={styles.titleEn}>{i.en}</div>
                  <div style={styles.titleAr} dir="rtl">{i.ar}</div>
                  <div style={styles.price}>{fmt.format(i.price)}</div>
                </div>
                <div style={styles.stepper}>
                  <button style={styles.stepBtn} onClick={() => dec(i.id)}>-</button>
                  <span style={styles.qty}>{q[i.id] || 0}</span>
                  <button style={styles.stepBtn} onClick={() => inc(i.id)}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom amount */}
          <div style={styles.customBox}>
            <label style={styles.customLabel}>
              Or enter your own amount (USD) — <span dir="rtl">أو أدخل مبلغك (دولار)</span>
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
        </section>

        {/* Right: summary panel */}
        <aside style={styles.right}>
          <div style={styles.panel}>
            <div style={styles.panelHead}>Checkout • <span dir="rtl">إتمام التبرّع</span></div>
            <div style={styles.panelBody}>
              <div style={styles.totalRow}>
                <div style={styles.totalLbl}>Total • <span dir="rtl">الإجمالي</span></div>
                <div style={styles.totalAmt}>{fmt.format(total)}</div>
              </div>
              <details style={styles.details}>
                <summary>Breakdown • <span dir="rtl">تفاصيل</span></summary>
                <ul style={styles.ul}>
                  {lines.length === 0 ? <li style={styles.liMuted}>No items yet • <span dir="rtl">لا عناصر</span></li> :
                    lines.map((l, idx) =>
