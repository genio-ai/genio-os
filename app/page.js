// File: app/page.js
"use client";

import { useMemo, useState, useEffect } from "react";

/**
 * Gaza Relief — Sky Gradient (UNRWA style) — AR+EN
 * - No CTA in hero/navbar
 * - Checkout button only in panel + sticky bar when total > 0
 * - Optional donor info form (name, email, WhatsApp, note, consents)
 */

const ITEMS = [
  { id: "bread", ar: "كيس خبز عائلي (5 أرغفة)", en: "Family Bread Bag (5 loaves)", price: 2.5 },
  { id: "veg_meal", ar: "وجبة ساخنة نباتية (رز + خضار)", en: "Hot Meal — Veg (Rice + Veg)", price: 7.5 },
  { id: "meat_meal", ar: "وجبة ساخنة باللحم (رز + لحم مفروم + خضار)", en: "Hot Meal — Meat (Rice + Beef + Veg)", price: 8.5 },
  { id: "cans_box", ar: "كرتون معلبات غذائية (12 قطعة)", en: "Canned Food Box (12 pcs)", price: 28 },
  { id: "flour", ar: "كيس طحين 25 كغ", en: "Flour 25 kg", price: 34 },
];

export default function Page() {
  // Quantities and amounts
  const [q, setQ] = useState(() => Object.fromEntries(ITEMS.map(i => [i.id, 0])));
  const [custom, setCustom] = useState("");

  // Donor info (all optional)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whats, setWhats] = useState("");
  const [note, setNote] = useState("");
  const [consentUpdates, setConsentUpdates] = useState(false);
  const [consentUseName, setConsentUseName] = useState(false);

  const [nowStr, setNowStr] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const d = new Date();
    setNowStr(d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }));
  }, []);

  const fmt = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    []
  );

  const total = useMemo(() => {
    const itemsTotal = ITEMS.reduce((s, i) => s + i.price * (q[i.id] || 0), 0);
    const extra = parseFloat(custom) || 0;
    return +(itemsTotal + extra).toFixed(2);
  }, [q, custom]);

  const lines = useMemo(() => {
    const L = ITEMS.map(i => ({ name: `${i.en} / ${i.ar}`, unit: i.price, qty: q[i.id] || 0 }))
      .filter(l => l.qty > 0);
    const extra = parseFloat(custom);
    if (!isNaN(extra) && extra > 0) L.push({ name: "Custom donation / تبرّع بمبلغ آخر", unit: extra, qty: 1 });
    return L;
  }, [q, custom]);

  const inc = (id) => setQ(s => ({ ...s, [id]: (s[id] || 0) + 1 }));
  const dec = (id) => setQ(s => ({ ...s, [id]: Math.max(0, (s[id] || 0) - 1) }));

  // Simple email/whats format checks (optional fields)
  const emailLooksOk = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const whatsLooksOk = !whats || /^[+\d][\d\s-]{5,}$/.test(whats);

  const openCheckout = () => {
    if (total <= 0) {
      alert("Add items or enter a custom amount first.");
      return;
    }
    if (!emailLooksOk || !whatsLooksOk) {
      alert("Please check email/WhatsApp format if provided.");
      return;
    }
    // UI only: show summary modal. (Later: send along donor info to gateway)
    setShowModal(true);
  };

  return (
    <div style={sx.page}>
      {/* NAV — no CTA */}
      <nav style={sx.nav}>
        <div style={sx.brand}>GAZA RELIEF</div>
      </nav>

      {/* HERO — sky gradient, no CTA */}
      <header style={sx.hero}>
        <div style={sx.heroInner}>
          <h1 style={sx.h1}>Gaza needs your help — today</h1>
          <p style={sx.subtitle}>
            Your donation becomes food and shelter for displaced families. Transparent, secure, fast.
          </p>
          <div style={sx.arHero} dir="rtl">
            تبرّعك يتحوّل إلى غذاء ومأوى للعائلات المتضرّرة — شفاف، آمن، وسريع.
          </div>
          <div style={sx.status}>
            <span style={sx.ping} /> Active relief • <span dir="rtl">عمليات الإغاثة فعّالة الآن</span> — Last update / <span dir="rtl">آخر تحديث</span>: {nowStr}
          </div>
        </div>
      </header>

      {/* INFO STRIP */}
      <section style={sx.infoBar}>
        <div><strong>Families supported</strong> / <strong dir="rtl">عائلات مُدعومة</strong>: 1,248</div>
        <div><strong>Admin overhead</strong> / <strong dir="rtl">مصاريف إدارية</strong>: &lt; 5%</div>
        <div><strong>Currency</strong>: USD</div>
      </section>

      {/* DESK */}
      <main style={sx.desk}>
        {/* LEFT: items + custom */}
        <section style={sx.left}>
          <h2 style={sx.h2}>Choose how to help • <span dir="rtl">اختر طريقة دعمك</span></h2>
          <div style={sx.cards}>
            {ITEMS.map(i => (
              <div key={i.id} style={sx.card}>
                <div>
                  <div style={sx.enTitle}>{i.en}</div>
                  <div style={sx.arTitle} dir="rtl">{i.ar}</div>
                  <div style={sx.price}>{fmt.format(i.price)}</div>
                </div>
                <div style={sx.stepper}>
                  <button style={sx.stepBtn} onClick={() => dec(i.id)}>-</button>
                  <span style={sx.qty}>{q[i.id] || 0}</span>
                  <button style={sx.stepBtn} onClick={() => inc(i.id)}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom amount */}
          <div style={sx.customBox}>
            <label style={sx.customLabel}>
              Or enter your own amount (USD) — <span dir="rtl">أو أدخل مبلغك (دولار)</span>
            </label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="e.g., 50"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              style={sx.input}
            />
          </div>
        </section>

        {/* RIGHT: checkout + donor info */}
        <aside style={sx.right}>
          <div style={sx.panel}>
            <div style={sx.panelHead}>Checkout • <span dir="rtl">إتمام التبرّع</span></div>

            <div style={sx.totalRow}>
              <div style={sx.totalLbl}>Total • <span dir="rtl">الإجمالي</span></div>
              <div style={sx.totalAmt}>{fmt.format(total)}</div>
            </div>

            <details style={sx.details}>
              <summary>Breakdown • <span dir="rtl">تفاصيل</span></summary>
              <ul style={sx.ul}>
                {lines.length === 0 ? (
                  <li style={sx.liMuted}>No items yet • <span dir="rtl">لا عناصر</span></li>
                ) : (
                  lines.map((l, i) => (
                    <li key={i}>{l.name} × {l.qty} — {fmt.format(l.unit * l.qty)}</li>
                  ))
                )}
              </ul>
            </details>

            {/* Donor info (optional) */}
            <div style={sx.formBox}>
              <div style={sx.formTitle}>Donor info (optional) • <span dir="rtl">بيانات المتبرّع (اختياري)</span></div>

              <label style={sx.label}>Full name • <span dir="rtl">الاسم الكامل</span></label>
              <input style={sx.input} value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Lina Ahmad" />

              <label style={sx.label}>Email • <span dir="rtl">البريد الإلكتروني</span></label>
              <input style={{...sx.input, borderColor: emailLooksOk ? sx.input.borderColor : "#FF7A7A"}} value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="name@example.com" />

              <label style={sx.label}>WhatsApp • <span dir="rtl">واتساب</span></label>
              <input style={{...sx.input, borderColor: whatsLooksOk ? sx.input.borderColor : "#FF7A7A"}} value={whats} onChange={(e)=>setWhats(e.target.value)} placeholder="+970 5X XXX XXXX" />

              <label style={sx.label}>Note • <span dir="rtl">ملاحظة</span></label>
              <textarea style={{...sx.input, height: 72, resize: "vertical"}} value={note} onChange={(e)=>setNote(e.target.value)} placeholder="e.g., In memory of..., Zakat..., ..."></textarea>

              <label style={sx.check}>
                <input type="checkbox" checked={consentUpdates} onChange={(e)=>setConsentUpdates(e.target.checked)} />
                <span>Receive photo updates • <span dir="rtl">أرغب بتحديثات وصور التوزيع</span></span>
              </label>
              <label style={sx.check}>
                <input type="checkbox" checked={consentUseName} onChange={(e)=>setConsentUseName(e.target.checked)} />
                <span>Use my name on delivery proof • <span dir="rtl">استخدام اسمي على إثبات التسليم</span></span>
              </label>

              <div style={sx.privacy}>
                We never share your data. You can request deletion anytime. • <span dir="rtl">لن نشارك بياناتك، ويمكنك طلب حذفها في أي وقت.</span>
              </div>
            </div>

            <button style={sx.primaryGlow} onClick={openCheckout}>
              Donate now • تبرّع الآن
            </button>
          </div>
        </aside>
      </main>

      {/* STICKY BAR (only when total > 0) */}
      {total > 0 && (
        <div style={sx.sticky}>
          <div><strong>Total • <span dir="rtl">الإجمالي</span></strong>: {fmt.format(total)}</div>
          <button style={sx.stickyBtn} onClick={openCheckout}>Donate now • تبرّع الآن</button>
        </div>
      )}

      {/* FOOTER */}
      <footer style={sx.footer}>
        © 2025 Gaza Relief — <a href="#" style={sx.link}>Privacy</a> • <a href="#" style={sx.link}>Transparency</a> • <a href="#" style={sx.link}>Terms</a>
      </footer>

      {/* MOCK checkout modal (UI only) */}
      {showModal && (
        <div style={sx.modalOverlay}>
          <div style={sx.modal}>
            <h3 style={{marginTop:0}}>Donation Summary • <span dir="rtl">ملخص التبرّع</span></h3>
            <ul style={sx.ul}>
              {lines.map((l, i) => (
                <li key={i}>{l.name} × {l.qty} — {fmt.format(l.unit * l.qty)}</li>
              ))}
              {(!lines || lines.length===0) && <li style={sx.liMuted}>No items • <span dir="rtl">لا عناصر</span></li>}
            </ul>
            <div style={sx.totalRow}>
              <div style={sx.totalLbl}>Total</div>
              <div style={sx.totalAmt}>{fmt.format(total)}</div>
            </div>

            <div style={sx.modalNote}>
              {/* Preview donor info */}
              <div><strong>Name:</strong> {name || "Kind donor"}</div>
              {email && <div><strong>Email:</strong> {email}</div>}
              {whats && <div><strong>WhatsApp:</strong> {whats}</div>}
              {note && <div><strong>Note:</strong> {note}</div>}
              <div><strong>Updates:</strong> {consentUpdates ? "Yes" : "No"}</div>
              <div><strong>Use name on proof:</strong> {consentUseName ? "Yes" : "No"}</div>
            </div>

            <div style={{display:"flex", gap:10, marginTop:16}}>
              <button style={sx.primaryGlow} onClick={()=>{ alert("Payment gateway not connected yet."); }}>
                Proceed to payment • المتابعة للدفع
              </button>
              <button style={sx.secondary} onClick={()=>setShowModal(false)}>Close • إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ====== Styles (UNRWA sky gradient, no white) ====== */
const sx = {
  page: {
    fontFamily: "Inter, Noto Sans Arabic, system-ui, sans-serif",
    color: "#E1F3FF",
    background:
      "radial-gradient(1000px 600px at 50% -15%, rgba(191,234,255,0.16), rgba(0,0,0,0) 60%), linear-gradient(135deg, #00AEEF, #008DCB)",
    minHeight: "100vh",
  },
  nav: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 20px", position: "sticky", top: 0, zIndex: 10,
    background: "rgba(0, 86, 140, 0.28)", backdropFilter: "blur(6px)",
    borderBottom: "1px solid rgba(92,200,245,0.25)",
  },
  brand: { fontWeight: 800, letterSpacing: 1.2 },
  hero: { textAlign: "center", padding: "56px 18px 64px" },
  heroInner: { maxWidth: 760, margin: "0 auto" },
  h1: { fontSize: 42, lineHeight: 1.18, margin: "0 0 10px" },
  subtitle: { color: "#B3DBF3", marginBottom: 6, fontSize: 18 },
  arHero: { color: "#D2EEFF", fontSize: 17, marginBottom: 14 },
  status: { color: "#B3DBF3", marginTop: 10, fontSize: 14 },
  ping: { display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#52E2B8", marginRight: 6, boxShadow: "0 0 0 6px rgba(82,226,184,0.15)" },

  infoBar: {
    display: "flex", justifyContent: "space-around", gap: 12, padding: "10px 12px",
    background: "rgba(0, 86, 140, 0.10)",
    borderTop: "1px solid rgba(92,200,245,0.25)",
    borderBottom: "1px solid rgba(92,200,245,0.25)",
    fontSize: 14,
  },

  desk: { display: "flex", flexWrap: "wrap", gap: 28, padding: "36px 18px 72px", justifyContent: "center" },
  left: { flex: "1 1 380px", maxWidth: 620 },
  right: { flex: "1 1 320px", maxWidth: 420 },

  h2: { fontSize: 22, margin: "0 0 12px" },

  cards: { display: "flex", flexDirection: "column", gap: 12 },
  card: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    background: "rgba(0,36,64,0.35)",
    border: "1px solid rgba(92,200,245,0.30)",
    borderRadius: 16, padding: "14px 16px",
    boxShadow: "0 10px 24px rgba(0, 174, 239, 0.18)",
    transition: "transform .15s ease, box-shadow .15s ease",
  },
  enTitle: { fontWeight: 700, color: "#E1F3FF" },
  arTitle: { fontSize: 14, color: "#D2EEFF" },
  price: { fontSize: 14, color: "#B3DBF3", marginTop: 6 },

  stepper: { display: "flex", alignItems: "center", gap: 8 },
  stepBtn: {
    width: 32, height: 32, background: "#0B5F86",
    border: "1px solid rgba(92,200,245,0.45)", color: "#E1F3FF",
    borderRadius: 10, cursor: "pointer",
  },
  qty: { width: 24, textAlign: "center", fontWeight: 700 },

  customBox: { marginTop: 18 },
  customLabel: { display: "block", marginBottom: 6, color: "#D2EEFF", fontSize: 14 },
  input: {
    width: "100%", padding: "12px 12px", borderRadius: 12,
    background: "rgba(0,36,64,0.35)",
    border: "1px solid rgba(92,200,245,0.35)", color: "#E1F3FF",
    outline: "none",
  },

  panel: {
    background: "rgba(0,36,64,0.42)",
    border: "1px solid rgba(92,200,245,0.38)",
    borderRadius: 18, padding: 18,
    boxShadow: "0 12px 28px rgba(0, 174, 239, 0.22)",
  },
  panelHead: { fontWeight: 800, marginBottom: 8, fontSize: 18, color: "#E1F3FF" },

  totalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  totalLbl: { color: "#D2EEFF" },
  totalAmt: { fontWeight: 800, fontSize: 20, color: "#E1F3FF" },

  details: { marginTop: 8 },
  ul: { marginTop: 8, paddingLeft: 20, color: "#D2EEFF" },
  liMuted: { color: "#B3DBF3", listStyle: "none" },

  formBox: { marginTop: 14, paddingTop: 10, borderTop: "1px dashed rgba(92,200,245,0.35)" },
  formTitle: { fontWeight: 700, marginBottom: 8, color: "#E1F3FF" },
  label: { display: "block", marginTop: 10, marginBottom: 6, color: "#D2EEFF", fontSize: 14 },
  check: { display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontSize: 14, color: "#E1F3FF" },
  privacy: { marginTop: 8, fontSize: 12, color: "#B3DBF3" },

  primaryGlow: {
    marginTop: 14, width: "100%", padding: "14px 18px",
    background: "#19D4FF", color: "#003A60", fontWeight: 800,
    border: "none", borderRadius: 14, cursor: "pointer",
    boxShadow: "0 12px 28px rgba(25,212,255,0.35)",
  },
  secondary: {
    padding: "12px 16px", background: "transparent", color: "#E1F3FF",
    border: "1px solid rgba(92,200,245,0.35)", borderRadius: 12, cursor: "pointer",
  },

  sticky: {
    position: "sticky", bottom: 0, display: "flex",
    justifyContent: "space-between", alignItems: "center",
    padding: "12px 16px", backdropFilter: "blur(10px)",
    background: "rgba(0,58,96,0.55)", borderTop: "1px solid rgba(92,200,245,0.35)",
  },
  stickyBtn: {
    background: "#19D4FF", color: "#003A60", fontWeight: 800,
    border: "none", borderRadius: 12, padding: "10px 18px",
    boxShadow: "0 10px 24px rgba(25,212,255,0.35)", cursor: "pointer",
  },

  footer: {
    textAlign: "center", padding: "28px 12px",
    color: "#D2EEFF", fontSize: 14,
  },
  link: { color: "#BFEAFF", textDecoration: "none", margin: "0 5px" },

  modalOverlay: {
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
  },
  modal: {
    width: "92%", maxWidth: 460, padding: 18,
    background: "rgba(0,36,64,0.42)",
    border: "1px solid rgba(92,200,245,0.38)",
    borderRadius: 18, color: "#E1F3FF",
    boxShadow: "0 16px 40px rgba(0, 174, 239, 0.28)",
  },
  modalNote: { marginTop: 10, paddingTop: 10, borderTop: "1px dashed rgba(92,200,245,0.35)", color: "#D2EEFF", fontSize: 14 },
};
