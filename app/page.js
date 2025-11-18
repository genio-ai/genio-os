'use client';

export const dynamic = "force-dynamic";
export const revalidate = 0;

import React, { useEffect, useRef, useState } from 'react';

/**
 * /app/page.js
 * Genio — Minimal Share-to-Earn landing
 * — Updated: unified button sizing (Arabic/EN toggle keeps same shape)
 */

const MIN_PAYOUT = 100;

function Btn({ children, variant = 'primary', onClick, disabled = false, style = {} }) {
  const cls = variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-muted';
  return (
    <button className={`btn ${cls}`} onClick={onClick} disabled={disabled} style={style} aria-disabled={disabled}>
      {children}
    </button>
  );
}

export default function Page() {
  const [arabic, setArabic] = useState(false);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const whatsRef = useRef(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('genio_referral_user_v1');
      if (raw) setUser(JSON.parse(raw));
      const b = Number(localStorage.getItem('genio_referral_balance_v1') || '0');
      setBalance(b);
    } catch (e) {}
  }, []);

  useEffect(() => {
    document.documentElement.dir = arabic ? 'rtl' : 'ltr';
  }, [arabic]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(msg) { setToast(msg); }
  function isValidEmail(v) { return /\S+@\S+\.\S+/.test(v); }

  function openModal() {
    setModalOpen(true);
    setTimeout(() => nameRef.current?.focus?.(), 80);
  }

  async function createPersonalLink() {
    const name = nameRef.current?.value?.trim() || '';
    const email = emailRef.current?.value?.trim() || '';
    const whats = whatsRef.current?.value?.trim() || '';

    if (!name || !isValidEmail(email)) {
      alert(arabic ? 'الاسم والإيميل مطلوبان' : 'Name and valid email are required');
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 350));
      const existingKey = user && user.key ? user.key : null;
      const userKey = existingKey || Math.random().toString(36).slice(2, 9);
      const newUser = { name, email, whats, key: userKey, createdAt: Date.now() };
      setUser(newUser);
      localStorage.setItem('genio_referral_user_v1', JSON.stringify(newUser));
      const personal = `${location.origin}/r/${encodeURIComponent(userKey)}`;
      const linksKey = `genio_user_links_${userKey}`;
      const existingLinks = JSON.parse(localStorage.getItem(linksKey) || '{}');
      existingLinks['main'] = personal;
      localStorage.setItem(linksKey, JSON.stringify(existingLinks));
      showToast(arabic ? 'تم إنشاء الرابط' : 'Link created');
      try { await navigator.clipboard.writeText(personal); showToast(arabic ? 'تم نسخ الرابط' : 'Link copied'); } catch {}
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function handlePayout() {
    if (balance >= MIN_PAYOUT) {
      if (!confirm(arabic ? `رصيدك $${balance.toFixed(2)}. هل تريد طلب سحب؟` : `Your balance is $${balance.toFixed(2)}. Request payout now?`)) return;
      setBalance(0);
      localStorage.setItem('genio_referral_balance_v1', '0');
      showToast(arabic ? 'تم إرسال طلب السحب' : 'Payout request sent');
    } else {
      alert(arabic ? `الحد الأدنى للسحب ${MIN_PAYOUT}$. تحتاج ${(MIN_PAYOUT - balance).toFixed(2)}$ إضافية.` : `Minimum payout is $${MIN_PAYOUT}. You need $${(MIN_PAYOUT - balance).toFixed(2)} more.`);
    }
  }

  function onContact() {
    const to = 'hello@genio.systems';
    const subj = encodeURIComponent(arabic ? 'استفسار شريك' : 'Partner Inquiry');
    const body = encodeURIComponent(user ? `User: ${user.name} (${user.email})\n\nMessage:\n` : '\n\nMessage:\n');
    window.location.href = `mailto:${to}?subject=${subj}&body=${body}`;
  }

  return (
    <main>
      <style>{`
        :root{--deep-blue:#062a67;--muted:#6b7280;--card:#fff;--soft:#f7fbff}
        *{box-sizing:border-box}
        body{margin:0;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial;background:linear-gradient(180deg,#fbfdff,#fff);color:#07122a}
        .wrap{max-width:920px;margin:22px auto;padding:20px}
        .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px}
        .title{font-size:20px;font-weight:800;margin:0}
        .sub{color:var(--muted);font-size:13px}
        .panel{background:var(--card);border-radius:14px;padding:22px;box-shadow:0 8px 30px rgba(6,42,103,0.06);border:1px solid #eef6ff}
        .headline{font-size:28px;color:var(--deep-blue);font-weight:800;margin:0 0 8px}
        .lead{color:var(--muted);margin:0 0 12px}
        .actions{display:flex;gap:12px;margin-top:6px;align-items:center}
        /* BUTTONS: unified sizing so Arabic or English don't change layout */
        .btn {
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          flex:1;
          padding:14px 18px;
          border-radius:12px;
          border:0;
          font-weight:700;
          font-size:15px;
          cursor:pointer;
          min-height:56px;      /* fixed minimum height */
          min-width:120px;      /* fixed minimum width */
          white-space:nowrap;   /* prevent wrapping so size remains consistent */
          box-sizing:border-box;
        }
        .btn-primary{background:var(--deep-blue);color:#fff;box-shadow:0 10px 30px rgba(6,42,103,0.12)}
        .btn-outline{background:#fff;border:1px solid #e6eefb;color:var(--deep-blue)}
        .btn-muted{background:transparent;border:1px dashed #e8eef9;color:var(--muted)}
        .statusBox{padding:12px;border-radius:12px;border:1px dashed #e8eef9;text-align:center;color:var(--muted);font-weight:700;min-height:56px;display:flex;align-items:center;justify-content:center}
        .contactRow{margin-top:14px}
        .contactFull{width:100%;padding:12px;border-radius:12px;border:1px solid #e6eefb;background:#fff;font-weight:700;color:var(--deep-blue);cursor:pointer}
        .modalBack{position:fixed;inset:0;background:rgba(7,18,38,0.45);display:flex;align-items:center;justify-content:center;z-index:60}
        .modal{width:100%;max-width:560px;background:#fff;border-radius:12px;padding:18px;box-shadow:0 12px 40px rgba(6,42,103,0.18)}
        .form{display:flex;flex-direction:column;gap:10px}
        label{font-size:13px;color:var(--muted)}
        input{padding:12px;border-radius:10px;border:1px solid #eef4ff;background:#fbfdff;font-size:14px}
        @media (max-width:880px){ .actions{flex-direction:column} .btn{width:100%;white-space:normal} .modal{margin:16px} }
      `}</style>

      <div className="wrap" role="application" aria-label="Genio Share to Earn">
        <div className="top">
          <div>
            <h1 className="title">{arabic ? 'شارك واربح' : 'Share to Earn'}</h1>
            <div className="sub">{arabic ? 'رابط واحد — دخل فوري' : 'One link — instant income'}</div>
          </div>

          {/* language button uses same Btn component so it's visually identical */}
          <div style={{ width: 120 }}>
            <Btn variant="outline" onClick={() => setArabic((s) => !s)}>
              {arabic ? 'English' : 'عربي'}
            </Btn>
          </div>
        </div>

        <div className="panel" aria-labelledby="heroTitle">
          <div>
            <h2 id="heroTitle" className="headline">{arabic ? 'احصل على رابطك الخاص' : 'Get your affiliate link'}</h2>
            <p className="lead">{arabic ? 'املأ الاسم والايميل — سننشئ رابطك فوراً' : 'Fill name + email — we will create your personal link instantly.'}</p>
          </div>

          <div className="actions" role="group" aria-label="main actions">
            <Btn variant="primary" onClick={openModal}>{arabic ? 'احصل على الرابط' : 'Get My Link'}</Btn>
            <div className="statusBox" aria-hidden="false">{arabic ? `السحب · $${balance.toFixed(2)}` : `Payout · $${balance.toFixed(2)}`}</div>
            <Btn variant="muted" onClick={handlePayout}>{arabic ? 'السحب' : 'Payout'}</Btn>
          </div>

          <div className="contactRow">
            <button className="contactFull" onClick={onContact}>{arabic ? 'تواصل معنا' : 'Contact Us'}</button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modalBack" role="dialog" aria-modal="true">
          <div className="modal">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div style={{fontWeight:800,fontSize:18}}>{arabic ? 'إنشاء رابط' : 'Create your link'}</div>
              <button onClick={() => setModalOpen(false)} style={{background:'transparent',border:'none',cursor:'pointer'}}>✕</button>
            </div>

            <div className="form">
              <label>{arabic ? 'الاسم الكامل' : 'Full name'}</label>
              <input ref={nameRef} type="text" placeholder={arabic ? 'اكتب اسمك هنا' : 'Your full name'} />

              <label>{arabic ? 'الإيميل' : 'Email'}</label>
              <input ref={emailRef} type="email" placeholder={arabic ? 'الايميل' : 'Email address'} />

              <label>{arabic ? 'واتساب (اختياري)' : 'WhatsApp (optional)'}</label>
              <input ref={whatsRef} type="tel" placeholder={arabic ? 'رقم واتساب' : 'WhatsApp number'} />

              <div style={{display:'flex',gap:10,marginTop:10}}>
                <Btn variant="primary" onClick={createPersonalLink} style={{flex:1}}>{loading ? (arabic ? 'جاري...' : 'Processing...') : (arabic ? 'حفظ وإنشاء' : 'Save & Create Link')}</Btn>
                <Btn variant="outline" onClick={() => setModalOpen(false)}>{arabic ? 'إلغاء' : 'Cancel'}</Btn>
              </div>

              <div style={{marginTop:12,color:'var(--muted)',fontSize:13}}>
                {arabic ? 'بعد الحفظ، سيُنشأ رابطك الشخصي ويمكنك نسخه ومشاركته.' : 'After saving, your personal link will be created and you can copy & share it.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{position:'fixed',right:20,bottom:20,background:'rgba(6,42,103,0.95)',color:'#fff',padding:'10px 14px',borderRadius:10,zIndex:9999}}>{toast}</div>}
    </main>
  );
}
