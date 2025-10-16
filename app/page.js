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

        {/* Right: summary */}
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
                  {lines.length === 0 ? (
                    <li style={styles.liMuted}>No items yet • <span dir="rtl">لا عناصر</span></li>
                  ) : (
                    lines.map((l, idx) => (
                      <li key={idx}>{l.name} × {l.qty} — {fmt.format(l.unit * l.qty)}</li>
                    ))
                  )}
                </ul>
              </details>
              <button style={styles.ctaBig} onClick={openDonate}>
                Donate now • تبرّع الآن
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* ======= STICKY BAR (Mobile) ======= */}
      {total > 0 && (
        <div style={styles.sticky}>
          <div style={styles.stickyLeft}>
            <strong>Total • <span dir="rtl">الإجمالي</span></strong>: {fmt.format(total)}
          </div>
          <button style={styles.stickyBtn} onClick={openDonate}>
            Donate now • تبرّع الآن
          </button>
        </div>
      )}

      {/* ======= FOOTER ======= */}
      <footer style={styles.footer}>
        © 2025 Gaza Relief — <a href="#" style={styles.link}>Privacy</a> •{" "}
        <a href="#" style={styles.link}>Transparency</a> •{" "}
        <a href="#" style={styles.link}>Terms</a>
      </footer>

      {/* ======= MOCK MODAL ======= */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Donation Summary • <span dir="rtl">ملخص التبرّع</span></h3>
            <ul style={styles.ul}>
              {lines.map((l, idx) => (
                <li key={idx}>{l.name} × {l.qty} — {fmt.format(l.unit * l.qty)}</li>
              ))}
            </ul>
            <div style={styles.totalRow}>
              <div style={styles.totalLbl}>Total</div>
              <div style={styles.totalAmt}>{fmt.format(total)}</div>
            </div>
            <button style={styles.cta} onClick={() => setShowModal(false)}>
              Close • إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ======= Styles =======
const styles = {
  page: { fontFamily: "Inter, Noto Sans Arabic, sans-serif", background: "#0D1B2A", color: "#F3F5F7", minHeight: "100vh" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", position: "sticky", top: 0, background: "rgba(13,27,42,0.85)", backdropFilter: "blur(6px)", zIndex: 20 },
  brand: { fontWeight: 700, fontSize: "18px", letterSpacing: "1px" },
  navBtn: { background: "#19C28A", border: "none", borderRadius: 8, padding: "8px 16px", color: "#0B2239", fontWeight: 600 },
  hero: { background: "radial-gradient(800px 400px at 50% -10%, rgba(255,255,255,0.1), transparent 60%), linear-gradient(135deg,#0D1B2A,#1B263B)", textAlign: "center", padding: "64px 24px 80px" },
  heroInner: { maxWidth: 680, margin: "0 auto" },
  h1: { fontSize: "40px", fontWeight: 700, marginBottom: 16 },
  subtitle: { fontSize: "18px", color: "#8CA0B3", marginBottom: 8 },
  arLine: { fontSize: "17px", color: "#E0E8EF", marginBottom: 24 },
  cta: { background: "#19C28A", border: "none", borderRadius: 12, padding: "14px 28px", color: "#0B2239", fontWeight: 700, boxShadow: "0 10px 24px rgba(25,194,138,0.28)", cursor: "pointer" },
  ctaBig: { background: "#19C28A", border: "none", borderRadius: 12, padding: "16px 28px", color: "#0B2239", fontWeight: 700, boxShadow: "0 10px 24px rgba(25,194,138,0.28)", cursor: "pointer", width: "100%", marginTop: 20 },
  status: { fontSize: "14px", marginTop: 24, color: "#A8C0D8" },
  dot: { display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#19C28A", marginRight: 6, animation: "pulse 1.8s infinite" },
  infoBar: { display: "flex", justifyContent: "space-around", padding: "12px", background: "rgba(255,255,255,0.05)", borderTop: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" },
  desk: { display: "flex", flexWrap: "wrap", gap: 32, padding: "48px 24px", justifyContent: "center" },
  left: { flex: "1 1 380px", maxWidth: 600 },
  right: { flex: "1 1 320px", maxWidth: 360 },
  cards: { display: "flex", flexDirection: "column", gap: 12 },
  card: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0E1525", border: "1px solid #1F2A3A", borderRadius: 16, padding: "14px 18px", boxShadow: "0 6px 16px rgba(0,0,0,0.22)" },
  stepper: { display: "flex", alignItems: "center", gap: 10 },
  stepBtn: { background: "#12263E", border: "1px solid #2B3A4A", color: "#E6EDF5", borderRadius: 8, width: 30, height: 30, cursor: "pointer" },
  qty: { fontWeight: 600, fontSize: "16px" },
  titleEn: { fontWeight: 600 },
  titleAr: { fontSize: "14px", color: "#E6E8F0" },
  price: { fontSize: "14px", color: "#8CA0B3" },
  customBox: { marginTop: 24 },
  customLabel: { display: "block", marginBottom: 6, fontSize: "14px", color: "#A8C0D8" },
  customInput: { width: "100%", padding: "10px", borderRadius: 8, border: "1px solid #2B3A4A", background: "#0E1525", color: "#FFF" },
  panel: { background: "#0E1525", border: "1px solid #1F2A3A", borderRadius: 16, padding: "20px", boxShadow: "0 10px 24px rgba(0,0,0,0.25)" },
  panelHead: { fontWeight: 700, fontSize: "18px", marginBottom: 12 },
  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  totalLbl: { color: "#A8C0D8" },
  totalAmt: { fontWeight: 700, fontSize: "20px" },
  details: { marginTop: 10 },
  ul: { marginTop: 10, paddingLeft: 20, fontSize: "14px" },
  liMuted: { color: "#8CA0B3", listStyle: "none" },
  sticky: { position: "sticky", bottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", background: "rgba(13,27,42,0.9)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.08)" },
  stickyBtn: { background: "#19C28A", border: "none", borderRadius: 10, padding: "10px 20px", color: "#0B2239", fontWeight: 700 },
  footer: { textAlign: "center", padding: "32px 12px", color: "#8CA0B3", fontSize: "14px" },
  link: { color: "#4CB5F5", textDecoration: "none", margin: "0 4px" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "#0E1525", borderRadius: 16, padding: "24px", width: "90%", maxWidth: 400, border: "1px solid #1F2A3A", boxShadow: "0 10px 24px rgba(0,0,0,0.25)", textAlign: "left" },
};
