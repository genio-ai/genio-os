"use client";

import { useMemo, useState, useEffect } from "react";

const FEE_RATE = 0.05;

const ITEMS = [
  { id: "bread",     ar: "كيس خبز عائلي (5 أرغفة)",             en: "Family Bread Bag (5 loaves)",         price: 2.5 },
  { id: "veg_meal",  ar: "وجبة ساخنة نباتية (رز + خضار)",        en: "Hot Meal — Veg (Rice + Veg)",         price: 7.5 },
  { id: "meat_meal", ar: "وجبة ساخنة باللحم (رز + لحم + خضار)",  en: "Hot Meal — Meat (Rice + Beef + Veg)", price: 8.5 },
  { id: "cans_box",  ar: "كرتون معلبات غذائية (12 قطعة)",         en: "Canned Food Box (12 pcs)",            price: 28 },
  { id: "flour",     ar: "كيس طحين 25 كغ",                       en: "Flour 25 kg",                          price: 34 },
];

export default function Page() {
  const [q, setQ] = useState(() => Object.fromEntries(ITEMS.map(i => [i.id, 0])));
  const [custom, setCustom] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [nowStr, setNowStr] = useState("");

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

  function goCheckout() {
    if (subtotal <= 0) {
      alert("Add items or enter a custom amount first.");
      return;
    }
    // save total & go to checkout page
    localStorage.setItem("donation_total", String(total));
    window.location.href = "/checkout?total=" + total.toFixed(2);
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
          نرسل لك دليل استلام يثبت وصول تبرعك للحالة المستفيدة، حفاظًا على المصداقية دون مشاركة بيانات حساسة.
          <br/>تُرسل جميع المساعدات عبر <strong>جمعيات مرخّصة فقط</strong>.
        </p>
        <p className="introText">
          <strong>We are independent facilitators</strong> working with licensed charities to deliver transparent aid.
          You’ll receive proof confirming your donation reached its beneficiary, ensuring transparency and trust.
        </p>
      </section>

      {/* HERO */}
      <header className="hero">
        <h1 className="h1">Gaza needs your help — today</h1>
        <p className="subtitle">Your donation becomes food and shelter for displaced families. Transparent, secure, fast.</p>
        <div className="status"><span className="ping"/> Active relief — Last update: {nowStr}</div>
      </header>

      {/* MAIN */}
      <main className="stack">
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
                <span className="qty">{q[i.id]||0}</span>
                <button className="pill" onClick={()=>inc(i.id)}>+</button>
              </div>
            </div>
          ))}

          <div className="customBox card">
            <label className="customLabel">Enter custom amount (USD) • <span dir="rtl">مبلغ مخصّص (دولار)</span></label>
            <input type="number" inputMode="decimal" placeholder="e.g., 50" value={custom} onChange={e=>setCustom(e.target.value)} className="input"/>
          </div>
        </section>

        <aside className="panel card">
          <div className="panelHead">Checkout • <span dir="rtl">إتمام التبرّع</span></div>
          <div className="totalRow"><div>Subtotal</div><div>{fmt.format(subtotal)}</div></div>
          <div className="totalRow"><div>Admin fee ({(FEE_RATE*100).toFixed(0)}%)</div><div>{fmt.format(fee)}</div></div>
          <div className="totalRow totalStrong"><div>Total</div><div>{fmt.format(total)}</div></div>

          <div className="divider"/>
          <div className="formTitle">Proof of delivery (optional)</div>
          <label className="label" dir="rtl">رقم الهاتف</label>
          <input className="input" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="05X XXX XXXX / +9705X…"/>
          <label className="label">Email (optional)</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/>

          <div className="hint">We never share your data. You can request deletion anytime.</div>
        </aside>
      </main>

      {/* STICKY BAR */}
      {subtotal>0 && (
        <div className="sticky">
          <div><strong>Total • <span dir="rtl">الإجمالي</span></strong>: {fmt.format(total)}</div>
          <button className="btnPrimary" onClick={goCheckout}>Donate now • تبرّع الآن</button>
        </div>
      )}

      <style jsx global>{`
        :root{
          --bg:#CFE5FA; --unrwa:#0072CE; --unrwa-dark:#003366; --line:#C5D9EF;
        }
        body{margin:0;background:var(--bg);color:var(--unrwa-dark);font-family:Inter,Noto Sans Arabic,sans-serif;}
        .page{min-height:100vh;}
        .nav{position:sticky;top:0;display:flex;justify-content:space-between;align-items:center;
             padding:12px 16px;background:#fff;border-bottom:1px solid var(--line);}
        .brand{font-weight:900;}
        .btnPrimary,.btnOutline{border-radius:12px;padding:10px 14px;font-weight:800;cursor:pointer;}
        .btnPrimary{background:var(--unrwa);color:#fff;border:1px solid #005BB0;}
        .btnOutline{background:#fff;color:var(--unrwa-dark);border:1px solid var(--line);}
        .card{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 3px 10px rgba(0,0,0,.05);}
        .intro{padding:16px;margin:16px auto 0;width:min(1200px,94vw);}
        .introText{color:#2B4563;line-height:1.6;}
        .hero{text-align:center;padding:22px 0 8px;}
        .h1{font-size:36px;margin:0;color:var(--unrwa-dark);}
        .ping{display:inline-block;width:10px;height:10px;border-radius:50%;background:#2DD07F;margin-right:6px;animation:pulseDot 1.8s infinite;}
        @keyframes pulseDot{0%{opacity:.3}50%{opacity:1}100%{opacity:.3}}
        .stack{width:min(1200px,94vw);margin:0 auto 90px;padding:16px;display:flex;flex-direction:column;gap:16px;}
        .section{display:flex;flex-direction:column;gap:12px;}
        .itemCard{padding:14px 16px;display:flex;justify-content:space-between;align-items:center;}
        .enTitle{font-weight:800;color:var(--unrwa-dark);}
        .arTitle{font-size:14px;color:#355C82;}
        .price{font-size:14px;color:#2B4563;margin-top:6px;}
        .stepper{display:flex;align-items:center;gap:12px;}
        .pill{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;
              font-weight:900;font-size:22px;background:#0072CE;color:#fff;border:1px solid #005BB0;}
        .customBox{padding:12px;}
        .input{width:100%;padding:12px;border:1px solid var(--line);border-radius:12px;}
        .panel{padding:16px;}
        .panelHead{font-weight:900;margin-bottom:8px;font-size:18px;color:var(--unrwa-dark);}
        .totalRow{display:flex;justify-content:space-between;margin-top:8px;}
        .totalStrong{font-weight:800;}
        .divider{height:1px;background:var(--line);margin:12px 0;}
        .hint{margin-top:12px;font-size:12px;color:#6c8fb1;}
        .sticky{position:sticky;bottom:0;display:flex;justify-content:space-between;align-items:center;
                gap:12px;padding:12px 16px;background:#fff;border-top:1px solid var(--line);}
      `}</style>
    </div>
  );
}
