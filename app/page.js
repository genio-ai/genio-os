// app/page.js
"use client";

import { useMemo, useState, useEffect, useRef } from "react";

const FEE_RATE = 0.05;
const ITEMS = [
  { id: "bread", ar: "كيس خبز عائلي (5 أرغفة)", en: "Family Bread Bag (5 loaves)", price: 2.5 },
  { id: "veg_meal", ar: "وجبة ساخنة نباتية (رز + خضار)", en: "Hot Meal — Veg (Rice + Veg)", price: 7.5 },
  { id: "meat_meal", ar: "وجبة ساخنة باللحم (رز + لحم + خضار)", en: "Hot Meal — Meat (Rice + Beef + Veg)", price: 8.5 },
  { id: "cans_box", ar: "كرتون معلبات غذائية (12 قطعة)", en: "Canned Food Box (12 pcs)", price: 28 },
  { id: "flour", ar: "كيس طحين 25 كغ", en: "Flour 25 kg", price: 34 },
];

export default function Page() {
  const [q, setQ] = useState(() => Object.fromEntries(ITEMS.map(i => [i.id, 0])));
  const [custom, setCustom] = useState("");
  const [nowStr, setNowStr] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [btReady, setBtReady] = useState(false);
  const dropinContainerRef = useRef(null);
  const dropinInstanceRef = useRef(null);

  useEffect(() => {
    setNowStr(new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}));
  }, []);

  useEffect(() => {
    const src="https://js.braintreegateway.com/web/dropin/1.39.1/js/dropin.min.js";
    if (document.querySelector(`script[src="${src}"]`)) { setBtReady(true); return; }
    const s=document.createElement("script"); s.src=src; s.async=true;
    s.onload=()=>setBtReady(true);
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

  function openModal(){ setShowModal(true); document.body.style.overflow="hidden"; }
  function closeModal(){ setShowModal(false); document.body.style.overflow=""; if(dropinInstanceRef.current){ dropinInstanceRef.current.teardown().then(()=>dropinInstanceRef.current=null); } }

  async function openCheckout(){
    if(subtotal<=0){ alert("Add items first."); return; }
    if(!btReady){ alert("Payment initializing, try again."); return; }
    openModal();
    if(!dropinInstanceRef.current){
      const t = await fetch("/api/payments/token").then(r=>r.json());
      // eslint-disable-next-line no-undef
      const inst = await braintree.dropin.create({
        authorization: t.clientToken,
        container: dropinContainerRef.current,
        paypal:{ flow:"checkout", amount: total, currency:"USD" },
      });
      dropinInstanceRef.current=inst;
    }
  }

  async function confirmPay(){
    setBusy(true);
    try{
      const { nonce } = await dropinInstanceRef.current.requestPaymentMethod();
      const res = await fetch("/api/payments/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ nonce, amount: total })});
      const j = await res.json(); if(!res.ok || j?.ok===false) throw new Error(j?.error||"Error");
      window.location.href="/success";
    }catch{ alert("Payment failed."); }
    finally{ setBusy(false); }
  }

  return (
    <div className="page">
      <nav className="nav">
        <div className="brand">GAZA RELIEF</div>
        <button className="btnOutline" onClick={()=>window.location.href="/chat"}>Neo al-Ghazawi</button>
      </nav>

      <section className="about">
        <h3 className="aboutTitle">من نحن</h3>
        <p><strong>نحن وسطاء مستقلّون</strong> نتعاون مع جمعيات خيرية مرخّصة لتوصيل المساعدات بشفافية كاملة.</p>
        <p>نرسل لك دليل استلام يثبت وصول تبرعك (صورة أو إيصال مختصر) للحالة المستفيدة، حفاظًا على المصداقية والشفافية دون مشاركة بيانات حساسة.<br/>
        You’ll receive a delivery proof confirming your donation reached a beneficiary (photo or brief receipt), ensuring credibility and transparency without sharing sensitive data.</p>
      </section>

      <header className="hero">
        <h1 className="h1">Gaza needs your help — today</h1>
        <p className="subtitle">Your donation becomes food and shelter for displaced families.</p>
        <div className="status"><span className="ping"/> Active relief — Last update: {nowStr}</div>
      </header>

      <main className="grid">
        <section>
          <h2 className="h2">Choose how to help</h2>
          <div className="cards">
            {ITEMS.map(i=>(
              <div key={i.id} className="card">
                <div>
                  <div className="enTitle">{i.en}</div>
                  <div className="arTitle">{i.ar}</div>
                  <div className="price">{fmt.format(i.price)}</div>
                </div>
                <div className="stepper">
                  <button className="pill" onClick={()=>dec(i.id)}>-</button>
                  <span className="qty">{q[i.id]||0}</span>
                  <button className="pill" onClick={()=>inc(i.id)}>+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="customBox">
            <label>Enter custom amount (USD)</label>
            <input type="number" value={custom} onChange={e=>setCustom(e.target.value)} className="input"/>
          </div>
        </section>

        <aside className="panel">
          <div className="panelHead">Checkout</div>
          <div className="totalRow"><span>Subtotal</span><span>{fmt.format(subtotal)}</span></div>
          <div className="totalRow"><span>Admin fee (5%)</span><span>{fmt.format(fee)}</span></div>
          <div className="totalRow totalStrong"><span>Total</span><span>{fmt.format(total)}</span></div>
        </aside>
      </main>

      {subtotal>0 && (
        <div className="sticky">
          <strong>Total: {fmt.format(total)}</strong>
          <button className="btnPrimary" onClick={openCheckout} disabled={busy}>{busy ? "Preparing…" : "Donate now"}</button>
        </div>
      )}

      {showModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h3>Donation</h3>
            <div ref={dropinContainerRef}/>
            <div className="totalRow"><span>Total</span><span>{fmt.format(total)}</span></div>
            <div className="rowBtns">
              <button className="btnPrimary" onClick={confirmPay} disabled={busy}>{busy?"Processing…":"Pay securely"}</button>
              <button className="btnOutline" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        body{margin:0;font-family:Inter,Noto Sans Arabic,sans-serif;background:#E9F3FB;color:#003366;}
        .nav{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;background:#fff;border-bottom:1px solid #cde;}
        .brand{font-weight:900;color:#003366;}
        .btnOutline{background:#fff;color:#003366;border:1px solid #0072CE;border-radius:8px;padding:8px 12px;cursor:pointer;}
        .about{background:#fff;padding:16px;border-radius:12px;width:min(1100px,94vw);margin:16px auto;border:1px solid #d0e2f0;}
        .aboutTitle{margin:0 0 8px;color:#0072CE;}
        .hero{text-align:center;padding:16px;color:#003366;}
        .h1{margin:0;font-size:36px;}
        .subtitle{color:#004c99;}
        .status{font-size:14px;margin-top:8px;}
        .ping{display:inline-block;width:10px;height:10px;border-radius:50%;background:#2DD07F;margin-right:6px;animation:pulse 1.8s infinite;}
        @keyframes pulse{0%{opacity:.3}50%{opacity:1}100%{opacity:.3}}
        .grid{display:block;padding:16px;width:min(1100px,94vw);margin:auto;}
        @media(min-width:992px){.grid{display:grid;grid-template-columns:1fr 380px;gap:20px;}}
        .cards{display:flex;flex-direction:column;gap:12px;}
        .card{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #cde;border-radius:14px;padding:14px;}
        .enTitle{font-weight:700;color:#003366;}
        .arTitle{font-size:14px;color:#005BB0;}
        .price{color:#0072CE;font-size:14px;margin-top:4px;}
        .stepper{display:flex;align-items:center;gap:8px;}
        .pill{width:38px;height:38px;border-radius:10px;border:1px solid #0072CE;background:#0072CE;color:#fff;font-weight:900;font-size:18px;cursor:pointer;}
        .qty{text-align:center;min-width:26px;font-weight:700;}
        .input{width:100%;padding:10px;border:1px solid #cde;border-radius:8px;}
        .panel{background:#fff;border:1px solid #cde;border-radius:12px;padding:14px;}
        .panelHead{font-weight:800;margin-bottom:8px;}
        .totalRow{display:flex;justify-content:space-between;margin-top:6px;}
        .totalStrong{font-weight:800;color:#003366;}
        .sticky{position:sticky;bottom:0;background:#fff;border-top:1px solid #cde;display:flex;justify-content:space-between;align-items:center;padding:12px 16px;}
        .btnPrimary{background:#0072CE;color:#fff;border:none;border-radius:8px;padding:10px 14px;font-weight:700;cursor:pointer;}
        .modalOverlay{position:fixed;inset:0;background:#0008;display:flex;justify-content:center;align-items:center;}
        .modal{background:#fff;padding:16px;border-radius:10px;width:min(500px,94vw);}
        .rowBtns{display:flex;gap:8px;margin-top:12px;}
      `}</style>
    </div>
  );
}
