// app/page.js
"use client";

import { useMemo, useState, useEffect, useRef } from "react";

/* -----------------------
 * Config
 * ----------------------*/
const FEE_RATE = 0.05;
const ITEMS = [
  { id: "bread",     ar: "كيس خبز عائلي (5 أرغفة)",             en: "Family Bread Bag (5 loaves)",         price: 2.5 },
  { id: "veg_meal",  ar: "وجبة ساخنة نباتية (رز + خضار)",        en: "Hot Meal — Veg (Rice + Veg)",         price: 7.5 },
  { id: "meat_meal", ar: "وجبة ساخنة باللحم (رز + لحم + خضار)",  en: "Hot Meal — Meat (Rice + Beef + Veg)", price: 8.5 },
  { id: "cans_box",  ar: "كرتون معلبات غذائية (12 قطعة)",         en: "Canned Food Box (12 pcs)",            price: 28 },
  { id: "flour",     ar: "كيس طحين 25 كغ",                       en: "Flour 25 kg",                          price: 34 },
];

/* -----------------------
 * Payment Modal (Hosted Fields)
 * ----------------------*/
function PayOverlay({ open, onClose, amount, onSuccess }) {
  const hfRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [txn, setTxn] = useState(null);

  // load braintree-web once
  async function loadBraintreeWeb() {
    async function inject(id, src) {
      if (document.getElementById(id)) return;
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.id = id;
        s.src = src;
        s.onload = res;
        s.onerror = () => rej(new Error("Failed to load " + src));
        document.body.appendChild(s);
      });
    }
    await inject("btw-client", "https://js.braintreegateway.com/web/3.98.1/js/client.min.js");
    await inject("btw-hosted", "https://js.braintreegateway.com/web/3.98.1/js/hosted-fields.min.js");
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!open) return;
      setErr(""); setTxn(null); setReady(false);

      try {
        await loadBraintreeWeb();

        // get client token
        const tokRes = await fetch("/api/payments/token");
        const { ok, clientToken, error } = await tokRes.json();
        if (!ok) throw new Error(error || "No client token");

        // create client
        const clientInstance = await window.braintree.client.create({ authorization: clientToken });

        // teardown previous
        if (hfRef.current?.teardown) {
          try { await hfRef.current.teardown(); } catch {}
          hfRef.current = null;
        }

        // mount hosted fields
        const hf = await window.braintree.hostedFields.create({
          client: clientInstance,
          styles: {
            "input": { fontSize: "16px", color: "#102A43", fontFamily: "Inter, system-ui, sans-serif" },
            ":focus": { color: "#0B66C3" },
            ".invalid": { color: "#C0392B" },
            ".valid": { color: "#2E7D32" },
            "::-webkit-input-placeholder": { color: "#99A3AD" }
          },
          fields: {
            number:         { selector: "#card-number",       placeholder: "•••• •••• •••• ••••" },
            expirationDate: { selector: "#card-expiry",       placeholder: "MM/YY" },
            cvv:            { selector: "#card-cvv",          placeholder: "CVV" }
          }
        });

        hfRef.current = hf;
        if (mounted) setReady(true);
      } catch (e) {
        if (mounted) setErr(e.message || "Payment init error");
      }
    })();

    return () => { mounted = false; };
  }, [open]);

  async function onPay() {
    try {
      setLoading(true); setErr(""); setTxn(null);
      if (!hfRef.current) throw new Error("Payment fields not ready");

      const cardholderName = document.getElementById("cardholder-name")?.value || "";

      // tokenize
      const { nonce } = await hfRef.current.tokenize({ cardholderName });

      // send to server
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, amount })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Payment failed");

      setTxn(data.txn);
      onSuccess?.(data.txn);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop: close only if clicking the backdrop itself */}
      <div
        onMouseDown={(e)=>{ if (e.target === e.currentTarget) onClose(); }}
        onTouchStart={(e)=>{ if (e.target === e.currentTarget) onClose(); }}
        style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000
        }}
      >
        {/* Dialog */}
        <div
          role="dialog"
          aria-modal="true"
          onMouseDown={(e)=>e.stopPropagation()}
          onTouchStart={(e)=>e.stopPropagation()}
          style={{
            width:"min(560px, 92vw)", background:"#fff", color:"#111",
            borderRadius:16, padding:18, boxShadow:"0 12px 30px rgba(0,0,0,0.25)"
          }}
        >
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <h2 style={{ margin:0, color:"#003366" }}>Donation • الدفع</h2>
            <button onClick={onClose} style={{ background:"transparent", border:0, color:"#003366", fontSize:20 }}>✕</button>
          </div>

          <div style={{ marginTop:6, color:"#334" }}>
            Amount: <strong style={{ fontSize:18 }}>${Number(amount).toFixed(2)}</strong>
          </div>

          <div style={{ marginTop:10, border:"1px solid #E3E8EF", borderRadius:10, padding:12 }}>
            <div style={{ fontWeight:700, color:"#334", marginBottom:6 }}>Pay with card</div>

            <label style={{ display:"block", marginTop:6, fontSize:13, color:"#445" }}>Cardholder Name</label>
            <input id="cardholder-name" placeholder="Cardholder Name" style={inputStyle} />

            <label style={labelStyle}>Card Number</label>
            <div id="card-number" style={hfStyle} />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={labelStyle}>Expiration Date <span style={{opacity:.6}}>(MM/YY)</span></label>
                <div id="card-expiry" style={hfStyle} />
              </div>
              <div>
                <label style={labelStyle}>CVV</label>
                <div id="card-cvv" style={hfStyle} />
              </div>
            </div>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, fontWeight:700 }}>
            <div>Total</div>
            <div>${Number(amount).toFixed(2)}</div>
          </div>

          <button
            onClick={onPay}
            disabled={!ready || loading}
            style={{
              marginTop:14, width:"100%", padding:14, borderRadius:10, border:"none",
              background:"#0B66C3", color:"#fff", fontWeight:800, fontSize:16,
              cursor: (!ready||loading) ? "not-allowed":"pointer"
            }}
          >
            {loading ? "Processing…" : `Pay securely • ادفع بأمان  • $${Number(amount).toFixed(2)}`}
          </button>

          {err && <div style={{ color:"tomato", marginTop:10 }}>{err}</div>}
          {txn && (
            <div style={{ marginTop:12, fontSize:14 }}>
              <div><strong>Success</strong></div>
              <div>ID: {txn.id}</div>
              <div>Status: {txn.status}</div>
              <div>Amount: {txn.amount}</div>
            </div>
          )}

          <div style={{ textAlign:"center", marginTop:10 }}>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#555", textDecoration:"underline" }}>
              Close • إغلاق
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const inputStyle = {
  width:"100%", padding:"12px 12px", border:"1px solid #E3E8EF", borderRadius:10, outline:"none"
};
const labelStyle = { display:"block", marginTop:12, fontSize:13, color:"#445" };
const hfStyle = {
  height:44, display:"flex", alignItems:"center",
  border:"1px solid #E3E8EF", borderRadius:10, padding:"0 12px"
};

/* -----------------------
 * Page
 * ----------------------*/
export default function Page() {
  // cart
  const [q, setQ] = useState(() => Object.fromEntries(ITEMS.map(i => [i.id, 0])));
  const [custom, setCustom] = useState("");

  // optional contact (delivery proof)
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // ui
  const [nowStr, setNowStr] = useState("");
  const [payOpen, setPayOpen] = useState(false);

  useEffect(() => {
    setNowStr(new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}));
  }, []);

  const fmt = useMemo(()=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}),[]);
  const subtotal = useMemo(()=>{
    const itemsTotal = ITEMS.reduce((s,i)=>s+i.price*(q[i.id]||0),0);
    const extra = parseFloat(custom)||0;
    return +(itemsTotal+extra).toFixed(2);
  },[q,custom]);
  const fee   = useMemo(()=>+(subtotal*FEE_RATE).toFixed(2),[subtotal]);
  const total = useMemo(()=>+(subtotal+fee).toFixed(2),[subtotal,fee]);

  const inc = id => setQ(s=>({...s,[id]:(s[id]||0)+1}));

  // open modal (delay prevents click bubbling from closing instantly)
  function openPay() {
    if (subtotal <= 0) {
      alert("Add items or enter a custom amount first.");
      return;
    }
    setTimeout(() => setPayOpen(true), 0);
  }

  function handlePaid() {
    // optional: clear cart after success
    // setQ(Object.fromEntries(ITEMS.map(i => [i.id, 0])));
    // setCustom(""); setPhone(""); setEmail("");
  }

  return (
    <div className="page">
      {/* NAV */}
      <nav className="nav">
        <div className="brand">GAZA RELIEF</div>
        <button className="btnOutline" onClick={()=>window.location.href="/chat"}>Neo al-Ghazawi</button>
      </nav>

      {/* INTRO */}
      <section className="intro card">
        <p className="introLead" dir="rtl"><strong>نحن وسطاء مستقلّون</strong> نتعاون مع جمعيات خيرية مرخّصة لتوصيل المساعدات بشفافية كاملة.</p>
        <p className="introText" dir="rtl">
          نرسل لك دليل استلام يثبت وصول تبرعك (صورة أو إيصال مختصر) للحالة المستفيدة، حفاظًا على المصداقية والشفافية دون مشاركة بيانات حساسة.
          <br/>تُرسل جميع المساعدات عبر <strong>جمعيات مرخّصة فقط</strong>.
        </p>
        <p className="introText">
          <strong>We are independent facilitators</strong> working with licensed charities to deliver transparent aid.
          You’ll receive a delivery proof confirming your donation reached a beneficiary (photo or brief receipt), ensuring credibility and transparency without sharing sensitive data.
        </p>
      </section>

      {/* HERO */}
      <header className="hero">
        <h1 className="h1">Gaza needs your help — today</h1>
        <p className="subtitle">Your donation becomes food and shelter for displaced families. Transparent, secure, fast.</p>
        <div className="status"><span className="ping"/> Active relief — Last update: {nowStr}</div>
      </header>

      {/* MAIN (STACKED ALWAYS) */}
      <main className="stack">
        {/* ITEMS */}
        <section className="section">
          <h2 className="h2">Choose how to help • <span dir="rtl">اختر طريقة دعمك</span></h2>

          {ITEMS.map(i=>(
            <div key={i.id} className="card itemCard">
              <div>
                <div className="enTitle">{i.en}</div>
                <div className="arTitle" dir="rtl">{i.ar}</div>
                <div className="price">{fmt.format(i.price)}</div>
              </div>
              <div className="stepper">
                <span className="qty" aria-live="polite">{q[i.id]||0}</span>
                <button className="pill" onClick={()=>inc(i.id)} aria-label={`Increase ${i.en}`}>+</button>
              </div>
            </div>
          ))}

          <div className="customBox card">
            <label className="customLabel">Enter custom amount (USD) • <span dir="rtl">مبلغ مخصّص (دولار)</span></label>
            <input type="number" inputMode="decimal" placeholder="e.g., 50" value={custom} onChange={e=>setCustom(e.target.value)} className="input"/>
          </div>
        </section>

        {/* CHECKOUT */}
        <aside className="panel card">
          <div className="panelHead">Checkout • <span dir="rtl">إتمام التبرّع</span></div>

          <div className="totalRow"><div className="totalLbl">Subtotal • <span dir="rtl">المجموع</span></div><div className="totalAmt">{fmt.format(subtotal)}</div></div>
          <div className="totalRow"><div className="totalLbl">Admin fee ({(FEE_RATE*100).toFixed(0)}%) • <span dir="rtl">رسوم إدارية</span></div><div className="totalAmt">{fmt.format(fee)}</div></div>
          <div className="totalRow totalStrong"><div className="totalLbl">Total • <span dir="rtl">الإجمالي</span></div><div className="totalAmt">{fmt.format(total)}</div></div>

          <div className="divider"/>
          <div className="formTitle">لإرسال دليل استلام التبرع إليك (اختياري)</div>
          <label className="label" dir="rtl">رقم الهاتف</label>
          <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05X XXX XXXX / +9705X…"/>
          <label className="label">Email (optional)</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/>

          <div className="hint">We never share your data. You can request deletion anytime.</div>
        </aside>
      </main>

      {/* STICKY BAR */}
      {subtotal>0 && (
        <div className="sticky" role="region" aria-label="Donation summary">
          <div><strong>Total • <span dir="rtl">الإجمالي</span></strong>: {fmt.format(total)}</div>
          <button className="btnPrimary" onClick={openPay}>Donate now • تبرّع الآن</button>
        </div>
      )}

      {/* Payment Modal */}
      <PayOverlay
        open={payOpen}
        onClose={()=>setPayOpen(false)}
        amount={total}
        onSuccess={handlePaid}
      />

      {/* ===== Styles ===== */}
      <style jsx global>{`
        :root{
          --bg:#CFE5FA;
          --unrwa:#0072CE;
          --unrwa-dark:#003366;
          --line:#C5D9EF;
        }
        *{ box-sizing:border-box }
        html, body { height:100%; }
        body{
          margin:0; color-scheme: light !important;
          background: var(--bg) !important; color: var(--unrwa-dark) !important;
          font-family: Inter, Noto Sans Arabic, system-ui, sans-serif;
        }
        .page{ min-height:100vh; }

        .nav{
          position:sticky; top:0; z-index:400; display:flex; justify-content:space-between; align-items:center;
          padding:12px 16px; background:#FFFFFFEE; border-bottom:1px solid var(--line); backdrop-filter: blur(8px);
        }
        .brand{ font-weight:900; letter-spacing:1px; color: var(--unrwa-dark); }
        .btnOutline, .btnPrimary{
          border-radius:12px; padding:10px 14px; font-weight:800; cursor:pointer; border:1px solid transparent;
        }
        .btnOutline{ background:#fff; color:var(--unrwa-dark); border-color: var(--line); }
        .btnPrimary{ background: var(--unrwa); color:#fff; border-color:#005BB0; }

        .card{ background:#fff; border:1px solid var(--line); border-radius:16px; box-shadow: 0 3px 10px rgba(0,0,0,.05); }

        .intro{ padding:16px; margin:16px auto 0; width:min(1200px,94vw); }
        .introLead{ margin:0 0 6px; font-size:16px; }
        .introText{ margin:0 0 6px; color:#2B4563; line-height:1.6; }

        .hero{ text-align:center; padding:22px 0 8px; }
        .h1{ margin:0 0 6px; font-size:36px; color: var(--unrwa-dark); }
        .subtitle{ margin:0 0 2px; color:#315B86; }
        .status{ color:#315B86; font-size:14px; }
        .ping{ display:inline-block; width:10px; height:10px; border-radius:50%; background:#2DD07F; margin-right:6px; animation:pulseDot 1.8s infinite; }
        @keyframes pulseDot{0%{opacity:.3}50%{opacity:1}100%{opacity:.3}}

        .stack{ width:min(1200px,94vw); margin:0 auto 90px; padding:16px; display:flex; flex-direction:column; gap:16px; }
        .section{ display:flex; flex-direction:column; gap:12px; }

        .itemCard{ padding:14px 16px; display:flex; justify-content:space-between; align-items:center; }
        .enTitle{ font-weight:800; color: var(--unrwa-dark); }
        .arTitle{ font-size:14px; color:#355C82; margin-top:2px; }
        .price{ font-size:14px; color:#2B4563; margin-top:6px; }

        .stepper{ display:flex; align-items:center; gap:12px; }
        .pill{
          width:44px; height:44px; border-radius:12px;
          display:grid; place-items:center;
          font-weight:900; font-size:22px; line-height:1;
          background:#0072CE; color:#fff; border:1px solid #005BB0;
          transition:transform .06s ease, filter .06s ease;
          user-select:none;
        }
        .pill:active{ transform:scale(.96); filter:brightness(.95); }
        .qty{ min-width:32px; text-align:center; font-weight:900;
              color:#003366; font-variant-numeric:tabular-nums; }

        .customBox{ padding:12px; }
        .customLabel{ display:block; margin-bottom:6px; color:#355C82; }
        .input{ width:100%; padding:12px; border:1px solid var(--line); border-radius:12px; }

        .panel{ padding:16px; }
        .panelHead{ font-weight:900; margin-bottom:8px; font-size:18px; color: var(--unrwa-dark); }
        .totalRow{ display:flex; justify-content:space-between; align-items:center; gap:10px; margin-top:8px; flex-wrap:wrap; }
        .totalStrong{ font-weight:800; }
        .totalLbl{ color:#355C82; }
        .totalAmt{ font-weight:900; color: var(--unrwa-dark); }
        .divider{ height:1px; background:var(--line); margin:12px 0; }
        .formTitle{ font-weight:700; color:#2B4563; margin-bottom:6px; }
        .label{ display:block; margin:8px 0 6px; color:#2B4563; font-size:14px; }
        .hint{ margin-top:12px; font-size:12px; color:#6c8fb1; }

        .sticky{
          position:sticky; bottom:0; z-index:500; display:flex; justify-content:space-between; align-items:center; gap:12px;
          padding:12px 16px; background:#FFFFFFEE; border-top:1px solid var(--line); backdrop-filter: blur(6px);
        }
      `}</style>
    </div>
  );
}
