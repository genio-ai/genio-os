// app/page.js
"use client";

import { useMemo, useState, useEffect, useRef } from "react";

const FEE_RATE = 0.05; // 5%

const ITEMS = [
  { id: "bread",    ar: "كيس خبز عائلي (5 أرغفة)",            en: "Family Bread Bag (5 loaves)", price: 2.5 },
  { id: "veg_meal", ar: "وجبة ساخنة نباتية (رز + خضار)",       en: "Hot Meal — Veg (Rice + Veg)", price: 7.5 },
  { id: "meat_meal",ar: "وجبة ساخنة باللحم (رز + لحم + خضار)", en: "Hot Meal — Meat (Rice + Beef + Veg)", price: 8.5 },
  { id: "cans_box", ar: "كرتون معلبات غذائية (12 قطعة)",        en: "Canned Food Box (12 pcs)",    price: 28 },
  { id: "flour",    ar: "كيس طحين 25 كغ",                      en: "Flour 25 kg",                  price: 34 },
];

export default function Page() {
  // cart
  const [q, setQ] = useState(() => Object.fromEntries(ITEMS.map(i => [i.id, 0])));
  const [custom, setCustom] = useState("");

  // donor info (optional)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whats, setWhats] = useState("");
  const [note, setNote] = useState("");
  const [consentUpdates, setConsentUpdates] = useState(false);
  const [consentUseName, setConsentUseName] = useState(false);

  // ui/payments
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

  const lines = useMemo(()=>{
    const L = ITEMS.map(i=>({name:`${i.en} / ${i.ar}`,unit:i.price,qty:q[i.id]||0})).filter(l=>l.qty>0);
    const extra = parseFloat(custom); if(!isNaN(extra)&&extra>0) L.push({name:"Custom donation / تبرّع بمبلغ آخر",unit:extra,qty:1});
    return L;
  },[q,custom]);

  const inc = id => setQ(s=>({...s,[id]:(s[id]||0)+1}));
  const dec = id => setQ(s=>({...s,[id]:Math.max(0,(s[id]||0)-1)}));
  const emailOK = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const whatsOK = !whats || /^[+\d][\d\s-]{5,}$/.test(whats);

  // modal helpers (fullscreen + lock)
  function openModal(){ setShowModal(true); document.body.style.overflow="hidden"; }
  function closeModal(){ setShowModal(false); document.body.style.overflow=""; if(dropinInstanceRef.current){ dropinInstanceRef.current.teardown().then(()=>dropinInstanceRef.current=null); } }

  async function openCheckout(){
    if(subtotal<=0){ alert("Add items or enter a custom amount first."); return; }
    if(!emailOK||!whatsOK){ alert("Check email/WhatsApp format."); return; }
    if(!btReady){ alert("Payment is initializing, try again."); return; }
    openModal();
    if(!dropinInstanceRef.current){
      try{
        setBusy(true);
        const tok = await fetch("/api/payments/token",{cache:"no-store"}).then(r=>r.json());
        // eslint-disable-next-line no-undef
        const inst = await braintree.dropin.create({
          authorization: tok.clientToken,
          container: dropinContainerRef.current,
          card:{cardholderName:true},
          paypal:{flow:"checkout",amount:total,currency:"USD"},
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
      const metadata = {
        name: name||"Kind donor", email: email||"", whatsapp: whats||"", note: note||"",
        consentUpdates, consentUseName, currency:"USD", feeRate:FEE_RATE, subtotal, fee, grandTotal: total, lines
      };
      const res = await fetch("/api/payments/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({ nonce, amount: total, metadata })});
      const j = await res.json(); if(!res.ok || j?.ok===false) throw new Error(j?.error||"Checkout failed");
      window.location.href="/success";
    }catch(e){ console.error(e); alert("Payment failed. Try again."); }
    finally{ setBusy(false); }
  }

  function contactUs(){
    const subject="Gaza Relief — Support / استفسار";
    const body=[
      `Name: ${name}`,`Email: ${email}`,`WhatsApp: ${whats}`,`Note: ${note}`,
      `Subtotal: ${subtotal} USD`,`Admin fee (${(FEE_RATE*100).toFixed(0)}%): ${fee} USD`,`Grand total: ${total} USD`
    ].join("\n");
    window.location.href=`mailto:hello@genio.systems?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="page">
      <nav className="nav">
        <div className="brand">GAZA RELIEF</div>
        <button className="navContact" onClick={contactUs}>Contact us • تواصل معنا</button>
      </nav>

      <div className="container">
        <header className="hero">
          <div className="heroInner">
            <h1 className="h1">Gaza needs your help — today</h1>
            <p className="subtitle">Your donation becomes food and shelter for displaced families. Transparent, secure, fast.</p>
            <div className="arHero" dir="rtl">تبرّعك يتحوّل إلى غذاء ومأوى للعائلات المتضرّرة — شفاف، آمن، وسريع.</div>
            <div className="status"><span className="ping"/> Active relief • <span dir="rtl">عمليات الإغاثة فعّالة الآن</span> — Last update / <span dir="rtl">آخر تحديث</span>: {nowStr}</div>
          </div>
        </header>

        <main className="desk">
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
                    <button className="stepBtn" onClick={()=>dec(i.id)}>-</button>
                    <span className="qty">{q[i.id]||0}</span>
                    <button className="stepBtn" onClick={()=>inc(i.id)}>+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="customBox">
              <label className="customLabel">Or enter your own amount (USD) — <span dir="rtl">أو أدخل مبلغك (دولار)</span></label>
              <input type="number" inputMode="decimal" placeholder="e.g., 50" value={custom} onChange={e=>setCustom(e.target.value)} className="input"/>
            </div>
          </section>

          {/* RIGHT */}
          <aside>
            <div className="panel">
              <div className="panelHead">Checkout • <span dir="rtl">إتمام التبرّع</span></div>
              <div className="totalRow"><div className="totalLbl">Subtotal • <span dir="rtl">المجموع</span></div><div className="totalAmt">{fmt.format(subtotal)}</div></div>
              <div className="totalRow"><div className="totalLbl">Admin fee ({(FEE_RATE*100).toFixed(0)}%) • <span dir="rtl">رسوم إدارية</span></div><div className="totalAmt">{fmt.format(fee)}</div></div>
              <div className="totalRow totalStrong"><div className="totalLbl">Total • <span dir="rtl">الإجمالي</span></div><div className="totalAmt">{fmt.format(total)}</div></div>

              <details className="details">
                <summary>Breakdown • <span dir="rtl">تفاصيل</span></summary>
                <ul className="ul">
                  {lines.length===0 ? <li className="liMuted">No items yet • <span dir="rtl">لا عناصر</span></li> :
                    lines.map((l,i)=><li key={i}>{l.name} × {l.qty} — {fmt.format(l.unit*l.qty)}</li>)}
                </ul>
              </details>

              <div className="formBox">
                <div className="formTitle">Donor info (optional) • <span dir="rtl">بيانات المتبرّع (اختياري)</span></div>

                <label className="label">Full name • <span dir="rtl">الاسم الكامل</span></label>
                <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g., Lina Ahmad"/>

                <label className="label">Email • <span dir="rtl">البريد الإلكتروني</span></label>
                <input className="input" style={{borderColor: emailOK?undefined:"#FF8A8A"}} value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/>

                <label className="label">WhatsApp • <span dir="rtl">واتساب</span></label>
                <input className="input" style={{borderColor: whatsOK?undefined:"#FF8A8A"}} value={whats} onChange={e=>setWhats(e.target.value)} placeholder="+970 5X XXX XXXX"/>

                <label className="label">Note • <span dir="rtl">ملاحظة</span></label>
                <textarea className="input" style={{height:72,resize:"vertical"}} value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g., In memory of..., Zakat..., ..."/>

                <label className="check"><input type="checkbox" checked={consentUpdates} onChange={e=>setConsentUpdates(e.target.checked)}/> <span>Receive photo updates • <span dir="rtl">أرغب بتحديثات وصور التوزيع</span></span></label>
                <label className="check"><input type="checkbox" checked={consentUseName} onChange={e=>setConsentUseName(e.target.checked)}/> <span>Use my name on delivery proof • <span dir="rtl">استخدام اسمي على إثبات التسليم</span></span></label>

                <div className="privacy">
                  We never share your data. Request deletion anytime. • <span dir="rtl">لن نشارك بياناتك، ويمكنك طلب حذفها في أي وقت.</span><br/>
                  <strong>EN:</strong> Distributed via <em>official, licensed humanitarian organizations</em> in Gaza. •
                  <span dir="rtl"> تُرسل عبر <em>مؤسسات إنسانية رسمية ومرخّصة</em> داخل غزة.</span>
                </div>
              </div>

              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <button className="secondary" onClick={contactUs}>Contact us • تواصل معنا</button>
              </div>
              <div className="hint">Use the bottom bar to complete your donation • <span dir="rtl"> لإتمام التبرّع استخدم شريط الإجمالي في الأسفل.</span></div>
            </div>
          </aside>
        </main>
      </div>

      {subtotal>0 && (
        <div className="sticky">
          <div><strong>Total • <span dir="rtl">الإجمالي</span></strong>: {fmt.format(total)} <span style={{marginLeft:8,fontSize:12,opacity:.9}}>({fmt.format(subtotal)} + {fmt.format(fee)} fee)</span></div>
          <button className="stickyBtn" onClick={openCheckout} disabled={busy}>{busy ? "Preparing…" : "Donate now • تبرّع الآن"}</button>
        </div>
      )}

      <a href="mailto:hello@genio.systems" className="fabMail" title="Contact">✉️</a>
      <button onClick={()=>{window.location.href="/nio/chat";}} className="neoPill" aria-label="Open Neo chat">Neo al-Ghazawi</button>

      <footer className="footer">
        © 2025 Gaza Relief — <a href="#" className="link">Privacy</a> • <a href="#" className="link">Transparency</a> • <a href="#" className="link">Terms</a>
      </footer>

      {showModal && (
        <div className="modalOverlay">
          <div className="modal">
            <h3 style={{marginTop:0}}>Donation • <span dir="rtl">الدفع</span></h3>
            <div ref={dropinContainerRef} style={{margin:"12px 0"}}/>
            <div className="totalRow"><div className="totalLbl">Total</div><div className="totalAmt">{fmt.format(total)}</div></div>
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button className="primaryGlow" onClick={confirmPay} disabled={busy}>{busy ? "Processing…" : "Pay securely • ادفع بأمان"}</button>
              <button className="secondary" onClick={closeModal}>Close • إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== styles ===== */}
      <style jsx global>{`
        :root{ --c1:#00AEEF; --c2:#008DCB; --ink:#E1F3FF; --soft:#BFEAFF; --ink2:#D2EEFF; --panel:rgba(0,36,64,.80); }
        body{ background: radial-gradient(1000px 600px at 50% -15%, rgba(191,234,255,.22), transparent 60%), linear-gradient(135deg, var(--c1), var(--c2)); }
        .page{ color:var(--ink); font-family:Inter, Noto Sans Arabic, system-ui, sans-serif; min-height:100vh; }
        .nav{ position:sticky; top:0; z-index:10; display:flex; justify-content:space-between; align-items:center; padding:14px 20px;
              background:linear-gradient(180deg, rgba(0,90,140,.38), rgba(0,90,140,.22)); backdrop-filter:blur(8px); border-bottom:1px solid rgba(54,212,255,.35); }
        .brand{ font-weight:800; letter-spacing:1.2px; }
        .navContact, .secondary{ padding:10px 16px; border-radius:12px; color:var(--ink); background:transparent; border:1px solid rgba(92,200,245,.45); cursor:pointer; }
        .container{ width:min(1200px, 94vw); margin:0 auto; }
        .hero{ text-align:center; padding:48px 0 18px; }
        .heroInner{ max-width:760px; margin:0 auto; padding:0 6px; }
        .h1{ font-size:42px; line-height:1.18; margin:0 0 10px; }
        .subtitle{ color:var(--soft); margin-bottom:6px; font-size:18px; }
        .arHero{ color:var(--ink2); font-size:17px; margin-bottom:10px; }
        .status{ color:var(--soft); margin-top:6px; font-size:14px; }
        .ping{ display:inline-block; width:10px; height:10px; border-radius:50%; background:#52E2B8; margin-right:6px; animation:pulseDot 1.8s infinite; }
        @keyframes pulseDot{0%{opacity:.3}50%{opacity:1}100%{opacity:.3}}

        /* layout: mobile first (stack) */
        .desk{ display:block; padding:20px 0 72px; }
        .h2{ font-size:22px; margin:0 0 12px; }
        .cards{ display:flex; flex-direction:column; gap:12px; }
        .card{ display:flex; justify-content:space-between; align-items:center; background:linear-gradient(180deg, rgba(0,36,64,.50), rgba(0,36,64,.36));
               border:1px solid rgba(54,212,255,.35); border-radius:18px; padding:14px 16px; box-shadow:0 10px 24px rgba(0,174,239,.18); }
        .enTitle{ font-weight:800; color:var(--ink); }
        .arTitle{ font-size:14px; color:var(--ink2); }
        .price{ font-size:14px; color:var(--soft); margin-top:6px; }
        .stepper{ display:flex; align-items:center; gap:8px; }
        .stepBtn{ width:36px; height:36px; background:linear-gradient(180deg, #0B5F86, #0A6FA0); border:1px solid rgba(54,212,255,.45); color:var(--ink);
                  border-radius:12px; cursor:pointer; box-shadow:0 6px 16px rgba(0,100,150,.28); }
        .qty{ width:24px; text-align:center; font-weight:900; }
        .customBox{ margin-top:18px; }
        .customLabel{ display:block; margin-bottom:6px; color:var(--ink2); font-size:14px; }
        .input{ width:100%; padding:12px 12px; border-radius:14px; background:linear-gradient(180deg, rgba(0,36,64,.42), rgba(0,36,64,.30));
                border:1px solid rgba(92,200,245,.45); color:var(--ink); }

        .panel{ background:var(--panel); border:1px solid rgba(54,212,255,.38); border-radius:20px; padding:18px; box-shadow:0 12px 28px rgba(0,174,239,.22); margin-top:20px; }
        .panelHead{ font-weight:900; margin-bottom:8px; font-size:18px; color:var(--ink); }
        .totalRow{ display:flex; justify-content:space-between; align-items:center; margin-top:8px; }
        .totalStrong{ margin-top:10px; font-weight:800; }
        .totalLbl{ color:var(--ink2); }
        .totalAmt{ font-weight:900; font-size:20px; color:var(--ink); }
        .details{ margin-top:8px; }
        .ul{ margin-top:8px; padding-left:20px; color:var(--ink2); }
        .liMuted{ color:var(--soft); list-style:none; }
        .formBox{ margin-top:14px; padding-top:10px; border-top:1px dashed rgba(92,200,245,.45); }
        .formTitle{ font-weight:800; margin-bottom:8px; color:var(--ink); }
        .label{ display:block; margin-top:10px; margin-bottom:6px; color:var(--ink2); font-size:14px; }
        .check{ display:flex; align-items:center; gap:8px; margin-top:8px; font-size:14px; color:var(--ink); }
        .privacy{ margin-top:8px; font-size:12px; color:var(--soft); }
        .hint{ margin-top:10px; font-size:12px; color:var(--soft); }

        /* desktop: two columns only ≥ 992px */
        @media (min-width: 992px){
          .desk{ display:grid; grid-template-columns: 1fr 420px; gap:24px; align-items:start; }
          .panel{ margin-top:0; } /* ما يطلع تحت */
        }

        .sticky{ position:sticky; bottom:0; display:flex; justify-content:space-between; align-items:center; padding:12px 16px;
                 backdrop-filter:blur(12px); background:rgba(0,58,96,.55); border-top:1px solid rgba(54,212,255,.35); }
        .stickyBtn{ background:linear-gradient(135deg, #36D4FF, #00AEEF); color:#003A60; font-weight:900; border:1px solid rgba(191,234,255,.25);
                    border-radius:12px; padding:10px 18px; box-shadow:0 12px 28px rgba(31,216,255,.35); cursor:pointer; }

        .fabMail{ position:fixed; right:18px; bottom:18px; z-index:30; width:48px; height:48px; border-radius:14px; display:grid; place-items:center;
                  background:linear-gradient(135deg, #36D4FF, #00AEEF); color:#003A60; border:1px solid rgba(191,234,255,.25); box-shadow:0 12px 28px rgba(31,216,255,.35); }
        .neoPill{ position:fixed; left:18px; bottom:18px; z-index:30; padding:8px 14px; border-radius:999px;
                  background:linear-gradient(135deg, #36D4FF, #00AEEF); color:#003A60; font-weight:900; border:1px solid rgba(191,234,255,.25);
                  box-shadow:0 10px 24px rgba(31,216,255,.35); }

        .footer{ text-align:center; padding:28px 12px; color:var(--ink2); font-size:14px; }
        .link{ color:var(--soft); text-decoration:none; margin:0 5px; }

        /* fullscreen modal */
        .modalOverlay{ position:fixed; inset:0; z-index:10000; background:rgba(0,20,35,0.75); backdrop-filter:blur(6px);
                       display:flex; align-items:center; justify-content:center; }
        .modal{ width:min(520px, 92vw); padding:18px; border-radius:20px; z-index:10001; background:var(--panel);
                border:1px solid rgba(54,212,255,.38); color:var(--ink); box-shadow:0 16px 40px rgba(0,174,239,.45); }
      `}</style>
    </div>
  );
}
