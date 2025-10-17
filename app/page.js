// app/page.js
"use client";

import { useMemo, useState, useEffect, useRef } from "react";

const FEE_RATE = 0.05;

const ITEMS = [
  { id: "bread",     ar: "كيس خبز عائلي (5 أرغفة)",             en: "Family Bread Bag (5 loaves)",         price: 2.5 },
  { id: "veg_meal",  ar: "وجبة ساخنة نباتية (رز + خضار)",        en: "Hot Meal — Veg (Rice + Veg)",         price: 7.5 },
  { id: "meat_meal", ar: "وجبة ساخنة باللحم (رز + لحم + خضار)",  en: "Hot Meal — Meat (Rice + Beef + Veg)", price: 8.5 },
  { id: "cans_box",  ar: "كرتون معلبات غذائية (12 قطعة)",         en: "Canned Food Box (12 pcs)",            price: 28 },
  { id: "flour",     ar: "كيس طحين 25 كغ",                       en: "Flour 25 kg",                          price: 34 },
];

export default function Page() {
  // cart
  const [q, setQ] = useState(() => Object.fromEntries(ITEMS.map(i => [i.id, 0])));
  const [custom, setCustom] = useState("");

  // ui / payment
  const [nowStr, setNowStr] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [btReady, setBtReady] = useState(false);
  const dropinContainerRef = useRef(null);
  const dropinInstanceRef = useRef(null);

  useEffect(() => {
    setNowStr(new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}));
  }, []);

  // load Braintree Drop-in
  useEffect(() => {
    const src="https://js.braintreegateway.com/web/dropin/1.39.1/js/dropin.min.js";
    if (document.querySelector(`script[src="${src}"]`)) { setBtReady(true); return; }
    const s=document.createElement("script"); s.src=src; s.async=true;
    s.onload=()=>setBtReady(true); s.onerror=()=>console.error("BT load failed");
    document.head.appendChild(s);
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
  const dec = id => setQ(s=>({...s,[id]:Math.max(0,(s[id]||0)-1)}));

  // modal helpers
  function openModal(){ setShowModal(true); document.body.style.overflow="hidden"; }
  function closeModal(){ setShowModal(false); document.body.style.overflow=""; if(dropinInstanceRef.current){ dropinInstanceRef.current.teardown().then(()=>dropinInstanceRef.current=null); } }

  async function openCheckout(){
    if(subtotal<=0){ alert("Add items or enter a custom amount first."); return; }
    if(!btReady){ alert("Payment is initializing, try again."); return; }
    openModal();
    if(!dropinInstanceRef.current){
      try{
        setBusy(true);
        const t = await fetch("/api/payments/token",{cache:"no-store"}).then(r=>r.json());
        if(!t?.ok || !t.clientToken) throw new Error(t?.error || "No client token");
        // eslint-disable-next-line no-undef
        const inst = await braintree.dropin.create({
          authorization: t.clientToken,
          container: dropinContainerRef.current,
          paypal:{ flow:"checkout", amount: total.toFixed(2), currency:"USD" },
          locale:"en_US"
        });
        dropinInstanceRef.current=inst;
      }catch(e){ console.error(e); alert("Payment init error."); closeModal(); }
      finally{ setBusy(false); }
    }
  }

  async function confirmPay(){
    try{
      setBusy(true);
      const { nonce } = await dropinInstanceRef.current.requestPaymentMethod();
      const res = await fetch("/api/payments/checkout",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ nonce, amount:+total.toFixed(2) })
      });
      const j = await res.json(); if(!res.ok || j?.ok===false) throw new Error(j?.error||"Checkout failed");
      window.location.href="/success";
    }catch(e){ console.error(e); alert("Payment failed. Try again."); }
    finally{ setBusy(false); }
  }

  return (
    <div className="page">
      {/* NAV */}
      <nav className="nav">
        <div className="brand">GAZA RELIEF</div>
        <button className="btnOutline" onClick={()=>window.location.href="/chat"}>Neo al-Ghazawi</button>
      </nav>

      {/* ABOUT (TOP) */}
      <section className="about card">
        <h3 className="aboutTitle">من نحن</h3>
        <p className="aboutLead"><strong>نحن وسطاء مستقلّون</strong> نتعاون مع جمعيات خيرية مرخّصة لتوصيل المساعدات بشفافية كاملة.</p>
        <p className="aboutText">
          نرسل لك دليل استلام يثبت وصول تبرعك (صورة أو إيصال مختصر) للحالة المستفيدة، حفاظًا على المصداقية والشفافية دون مشاركة بيانات حساسة.<br/>
          You’ll receive a delivery proof confirming your donation reached a beneficiary (photo or brief receipt), ensuring credibility and transparency without sharing sensitive data.
        </p>
      </section>

      {/* HERO */}
      <header className="hero">
        <h1 className="h1">Gaza needs your help — today</h1>
        <p className="subtitle">Your donation becomes food and shelter for displaced families. Transparent, secure, fast.</p>
        <div className="status"><span className="ping"/> Active relief — Last update: {nowStr}</div>
      </header>

      {/* MAIN */}
      <main className="grid">
        {/* LEFT */}
        <section>
          <h2 className="h2">Choose how to help • <span dir="rtl">اختر طريقة دعمك</span></h2>
          <div className="cards">
            {ITEMS.map(i=>(
              <div key={i.id} className="card">
                <div>
                  <div className="enTitle">{i.en}</div>
                  <div className="arTitle" dir="rtl">{i.ar}</div>
                  <div className="price">{fmt.format(i.price)}</div>
                </div>
                <div className="stepper">
                  <button className="pill" onClick={()=>dec(i.id)} aria-label={`Decrease ${i.en}`}>-</button>
                  <span className="qty" aria-live="polite">{q[i.id]||0}</span>
                  <button className="pill" onClick={()=>inc(i.id)} aria-label={`Increase ${i.en}`}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="customBox card">
            <label className="customLabel">Enter custom amount (USD) • <span dir="rtl">مبلغ مخصص (دولار)</span></label>
            <input type="number" inputMode="decimal" placeholder="e.g., 50" value={custom} onChange={e=>setCustom(e.target.value)} className="input"/>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="panel card">
          <div className="panelHead">Checkout • <span dir="rtl">إتمام التبرّع</span></div>
          <div className="totalRow"><div className="totalLbl">Subtotal • <span dir="rtl">المجموع</span></div><div className="totalAmt">{fmt.format(subtotal)}</div></div>
          <div className="totalRow"><div className="totalLbl">Admin fee ({(FEE_RATE*100).toFixed(0)}%) • <span dir="rtl">رسوم إدارية</span></div><div className="totalAmt">{fmt.format(fee)}</div></div>
          <div className="totalRow totalStrong"><div className="totalLbl">Total • <span dir="rtl">الإجمالي</span></div><div className="totalAmt">{fmt.format(total)}</div></div>
          <div className="hint">Use the bottom bar to complete your donation • <span dir="rtl">استخدم شريط الإجمالي في الأسفل.</span></div>
        </aside>
      </main>

      {/* STICKY BAR */}
      {subtotal>0 && (
        <div className="sticky" role="region" aria-label="Donation summary">
          <div><strong>Total • <span dir="rtl">الإجمالي</span></strong>: {fmt.format(total)}</div>
          <button className="btnPrimary" onClick={openCheckout} disabled={busy}>{busy ? "Preparing…" : "Donate now • تبرّع الآن"}</button>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Payment">
          <div className="modal card">
            <h3 className="modalH">Donation • <span dir="rtl">الدفع</span></h3>
            <div ref={dropinContainerRef} style={{margin:"12px 0"}}/>
            <div className="totalRow"><div className="totalLbl">Total</div><div className="totalAmt">{fmt.format(total)}</div></div>
            <div className="rowBtns">
              <button className="btnPrimary" onClick={confirmPay} disabled={busy}>{busy ? "Processing…" : "Pay securely • ادفع بأمان"}</button>
              <button className="btnOutline" onClick={closeModal}>Close • إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Global Styles (UNRWA sky theme + force light) ===== */}
      <style jsx global>{`
        :root{
          --unrwa:#0072CE;        /* الأزرق الأساسي */
          --unrwa-dark:#003366;   /* نص */
          --sky:#E9F3FB;          /* خلفية سماوية فاتحة */
          --line:#D6E6F5;         /* حدود ناعمة */
          --ink:#102A43;          /* نص محايد */
        }
        *{ box-sizing:border-box }
        html, body { height:100%; }
        body{
          margin:0;
          color-scheme: light !important;         /* يمنع نمط الدارك */
          background: var(--sky) !important;      /* يمنع الخلفية السوداء */
          color: var(--unrwa-dark) !important;
          font-family: Inter, Noto Sans Arabic, system-ui, sans-serif;
        }
        .page{ min-height:100vh; }

        .nav{
          position:sticky; top:0; z-index:40; display:flex; justify-content:space-between; align-items:center;
          padding:12px 16px; background:#FFFFFFEE; border-bottom:1px solid var(--line); backdrop-filter: blur(8px);
        }
        .brand{ font-weight:900; letter-spacing:1px; color: var(--unrwa-dark); }
        .btnOutline, .btnPrimary{
          border-radius:12px; padding:10px 14px; font-weight:800; cursor:pointer; border:1px solid transparent;
        }
        .btnOutline{ background:#fff; color:var(--unrwa-dark); border-color: var(--line); }
        .btnPrimary{ background: var(--unrwa); color:#fff; border-color:#005BB0; }

        .container{ width:min(1200px, 94vw); margin:0 auto; }

        .card{ background:#fff; border:1px solid var(--line); border-radius:16px; box-shadow: 0 3px 10px rgba(0,0,0,.05); }

        .about{ padding:16px; margin:16px auto 0; }
        .aboutTitle{ margin:0 0 8px; color: var(--unrwa); }
        .aboutLead{ margin:0 0 6px; font-size:16px; }
        .aboutText{ margin:0; color:#2B4563; }

        .hero{ text-align:center; padding:22px 0 8px; }
        .h1{ margin:0 0 6px; font-size:36px; color: var(--unrwa-dark); }
        .subtitle{ margin:0 0 2px; color:#315B86; }
        .status{ color:#315B86; font-size:14px; }
        .ping{ display:inline-block; width:10px; height:10px; border-radius:50%; background:#2DD07F; margin-right:6px; animation:pulseDot 1.8s infinite; }
        @keyframes pulseDot{0%{opacity:.3}50%{opacity:1}100%{opacity:.3}}

        .grid{ display:block; padding:16px; width:min(1200px, 94vw); margin:0 auto 90px; gap:22px; }
        @media (min-width: 992px){ .grid{ display:grid; grid-template-columns: 1fr 420px; align-items:start; } }

        .h2{ font-size:22px; margin:8px 0 12px; color: var(--unrwa-dark); }
        .cards{ display:flex; flex-direction:column; gap:12px; }
        .card .enTitle{ font-weight:800; color: var(--unrwa-dark); }
        .card .arTitle{ font-size:14px; color:#355C82; margin-top:2px; }
        .card .price{ font-size:14px; color:#2B4563; margin-top:6px; }
        .card{ padding:14px 16px; display:flex; justify-content:space-between; align-items:center; }

        .stepper{ display:flex; align-items:center; gap:10px; }
        .pill{
          width:40px; height:40px; border-radius:10px; display:grid; place-items:center;
          font-weight:900; font-size:20px; line-height:1; background: var(--unrwa); color:#fff; border:1px solid #005BB0;
          transition: transform .06s ease;
        }
        .pill:active{ transform: scale(.96); }
        .qty{ min-width:28px; text-align:center; font-weight:900; color: var(--unrwa-dark); font-variant-numeric: tabular-nums; }

        .customBox{ margin-top:14px; padding:12px; }
        .customLabel{ display:block; margin-bottom:6px; color:#355C82; }
        .input{ width:100%; padding:12px; border:1px solid var(--line); border-radius:12px; }

        .panel{ padding:16px; }
        .panelHead{ font-weight:900; margin-bottom:6px; font-size:18px; color: var(--unrwa-dark); }
        .totalRow{ display:flex; justify-content:space-between; align-items:center; margin-top:6px; }
        .totalStrong{ font-weight:800; }
        .totalLbl{ color:#355C82; }
        .totalAmt{ font-weight:900; color: var(--unrwa-dark); }
        .hint{ margin-top:10px; font-size:12px; color:#6c8fb1; }

        .sticky{
          position:sticky; bottom:0; z-index:30; display:flex; justify-content:space-between; align-items:center; gap:12px;
          padding:12px 16px; background:#FFFFFFEE; border-top:1px solid var(--line); backdrop-filter: blur(6px);
        }

        .modalOverlay{ position:fixed; inset:0; z-index:10000; background:#0007; display:flex; align-items:center; justify-content:center; padding:12px; }
        .modal{ width:min(560px, 96vw); }
        .modalH{ margin:0 0 6px; color: var(--unrwa-dark); }
        .rowBtns{ display:flex; gap:10px; margin-top:14px; flex-wrap:wrap; }
      `}</style>
    </div>
  );
}
