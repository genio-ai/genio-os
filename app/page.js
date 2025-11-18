'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Updated professional page:
 * - initial view: Title + 3 equal buttons (Get My Link, Payout, Language)
 * - Contact Us moved under the info cards (not centered)
 * - Form & link preview hidden by default inside modal opened by Get My Link
 * - Language button same style/size as other buttons
 * - No demo data, no prefilled personal values
 */

const MIN_PAYOUT = 100;

function Btn({ children, variant = 'primary', onClick, disabled = false, style = {} }) {
  const cls =
    variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-muted';
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
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const whatsRef = useRef(null);

  // hydrate client (no demo credit)
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

  function showToast(msg) {
    setToast(msg);
  }

  function isValidEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function onSaveCreate() {
    if (loading) return;
    const name = nameRef.current?.value?.trim() || '';
    const email = emailRef.current?.value?.trim() || '';
    const whats = whatsRef.current?.value?.trim() || '';

    if (!name || !isValidEmail(email)) {
      alert(arabic ? 'الاسم والإيميل مطلوبان' : 'Name and valid email are required');
      return;
    }

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500)); // replace with API call
      const key = Math.random().toString(36).slice(2, 9);
      const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${encodeURIComponent(key)}`;
      const newUser = { name, email, whats, link, registered: true, createdAt: Date.now() };
      setUser(newUser);
      localStorage.setItem('genio_referral_user_v1', JSON.stringify(newUser));
      showToast(arabic ? 'تم إنشاء الرابط' : 'Link created');
      try { await navigator.clipboard.writeText(link); showToast(arabic ? 'تم نسخ الرابط' : 'Link copied'); } catch {}
      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function onClear() {
    if (!confirm(arabic ? 'هل تريد مسح البيانات؟' : 'Clear saved data?')) return;
    setUser(null);
    localStorage.removeItem('genio_referral_user_v1');
    localStorage.removeItem('genio_referral_balance_v1');
    if (nameRef.current) nameRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (whatsRef.current) whatsRef.current.value = '';
    setBalance(0);
    showToast(arabic ? 'تم المسح' : 'Cleared');
  }

  function onPayout() {
    if (balance >= MIN_PAYOUT) {
      if (!confirm(arabic ? `رصيدك $${balance.toFixed(2)}. هل تريد طلب سحب؟` : `Your balance is $${balance.toFixed(2)}. Request payout now?`)) return;
      // TODO: call /api/payout
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
    const bodyParts = [];
    if (user && user.email) bodyParts.push(`User: ${user.name} (${user.email})`);
    else if (emailRef.current && emailRef.current.value) bodyParts.push(`User: ${nameRef.current.value || ''} (${emailRef.current.value})`);
    if (whatsRef.current && whatsRef.current.value) bodyParts.push(`WhatsApp: ${whatsRef.current.value}`);
    const body = encodeURIComponent(bodyParts.join('\n') + '\n\nMessage:\n');
    window.location.href = `mailto:${to}?subject=${subj}&body=${body}`;
  }

  // Button uniform size helper — CSS handles visuals
  return (
    <main>
      <style>{`
        :root{--deep-blue:#062a67;--muted:#6b7280;--card:#fff;--soft:#f7fbff}
        *{box-sizing:border-box}
        body{margin:0;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial;background:linear-gradient(180deg,#fbfdff,#fff);color:#07122a}
        .wrap{max-width:980px;margin:24px auto;padding:20px}
        .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;gap:12px}
        .title{font-size:20px;font-weight:800;margin:0}
        .sub{color:var(--muted);font-size:13px}
        /* buttons row */
        .panel{background:var(--card);border-radius:14px;padding:18px;box-shadow:0 8px 30px rgba(6,42,103,0.06);border:1px solid #eef6ff}
        .hero{display:flex;flex-direction:column;gap:14px}
        .headline{font-size:26px;color:var(--deep-blue);font-weight:800;margin:0}
        .lead{color:var(--muted);margin:0}
        .actions{display:flex;gap:12px;margin-top:6px}
        .btn{flex:1;padding:14px;border-radius:12px;border:0;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
        .btn-primary{background:var(--deep-blue);color:#fff;box-shadow:0 8px 24px rgba(6,42,103,0.12)}
        .btn-outline{background:#fff;border:1px solid #e6eefb;color:var(--deep-blue)}
        .btn-muted{background:transparent;border:1px dashed #e8eef9;color:var(--muted)}
        /* info cards and contact */
        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
        .card{padding:12px;border-radius:10px;background:var(--soft);border:1px solid #eef6ff}
        .cardTitle{font-weight:700}
        .contactRow{margin-top:14px}
        .contactFull{width:100%;padding:12px;border-radius:12px;border:1px solid #e6eefb;background:#fff;font-weight:700;color:var(--deep-blue);cursor:pointer}
        /* modal */
        .modalBack{position:fixed;inset:0;background:rgba(7,18,38,0.45);display:flex;align-items:center;justify-content:center;z-index:60}
        .modal{width:100%;max-width:620px;background:#fff;border-radius:12px;padding:18px;box-shadow:0 12px 40px rgba(6,42,103,0.18)}
        .form{display:flex;flex-direction:column;gap:10px}
        label{font-size:13px;color:var(--muted)}
        input{padding:12px;border-radius:10px;border:1px solid #eef4ff;background:#fbfdff;font-size:14px}
        .linkPreview{background:#f7fbff;padding:12px;border-radius:10px;border:1px solid #e6f0ff;word-break:break-all}
        @media (max-width:880px){ .grid2{grid-template-columns:1fr} .modal{margin:20px} }
      `}</style>

      <div className="wrap" role="application" aria-label="Share to Earn">
        <div className="top">
          <div>
            <h1 className="title">{arabic ? 'شارك واربح' : 'Share to Earn'}</h1>
            <div className="sub">{arabic ? 'رابط واحد — دخل فوري' : 'One link — instant income'}</div>
          </div>

          {/* Language button uses same btn-outline style and same size visually */}
          <div style={{ width: 140 }}>
            <Btn variant="outline" onClick={() => setArabic((s) => !s)}>
              {arabic ? 'English' : 'عربي'}
            </Btn>
          </div>
        </div>

        <div className="panel" aria-labelledby="heroTitle">
          <div className="hero">
            <div>
              <h2 id="heroTitle" className="headline">{arabic ? 'احصل على رابطك' : 'Get your ready affiliate link'}</h2>
              <p className="lead">{arabic ? 'اضغط "احصل على الرابط" لبدء.' : 'Click "Get My Link" to get started.'}</p>
            </div>

            {/* main actions: equal size buttons */}
            <div className="actions" role="group" aria-label="main actions">
              <Btn variant="primary" onClick={() => setModalOpen(true)}>{arabic ? 'احصل على الرابط' : 'Get My Link'}</Btn>
              <Btn variant="muted" onClick={onPayout}>{arabic ? `السحب · $${balance.toFixed(2)}` : `Payout · $${balance.toFixed(2)}`}</Btn>
              {/* language button duplicated in header; keep actions balanced - add a placeholder action to match sizing */}
              <div style={{ width: 0, display: 'none' }} />
            </div>

            {/* info cards */}
            <div className="grid2" aria-hidden={false}>
              <div className="card">
                <div className="cardTitle">{arabic ? 'تتبع تلقائي' : 'Auto-tracking'}</div>
                <div className="sub">{arabic ? 'نعطيك العمولة حتى للزوار غير المسجلين.' : 'We credit referrals for guest visitors.'}</div>
              </div>
              <div className="card">
                <div className="cardTitle">{arabic ? 'مواد جاهزة' : 'Ready assets'}</div>
                <div className="sub">{arabic ? 'نصوص وصور جاهزة للنشر.' : 'Captions, images and short posts for sharing.'}</div>
              </div>
            </div>

            {/* CONTACT US placed under cards, full width button */}
            <div className="contactRow">
              <button className="contactFull" onClick={onContact}>
                {arabic ? 'تواصل معنا' : 'Contact Us'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: appears only when Get My Link clicked */}
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

              <div style={{display:'flex',gap:12,marginTop:10}}>
                <Btn variant="primary" onClick={onSaveCreate} style={{flex:1}}>{loading ? (arabic ? 'جاري...' : 'Processing...') : (arabic ? 'حفظ وإنشاء' : 'Save & Create Link')}</Btn>
                <Btn variant="outline" onClick={() => { setModalOpen(false); }}>{arabic ? 'إلغاء' : 'Cancel'}</Btn>
              </div>

              <div style={{marginTop:12}} className="sub">{arabic ? 'رابط التتبع' : 'Your tracking link'}</div>
              <div className="linkPreview" role="region" aria-live="polite">{user && user.link ? user.link : (arabic ? 'لم يتم إنشاء رابط بعد' : 'No link yet')}</div>

              <div style={{display:'flex',gap:10,marginTop:12}}>
                <Btn variant="outline" onClick={() => { if (user && user.link) navigator.clipboard.writeText(user.link).then(()=>showToast(arabic ? 'تم النسخ' : 'Copied')); }}>{arabic ? 'نسخ الرابط' : 'Copy link'}</Btn>
                <Btn variant="muted" onClick={() => { if (user && user.link) { const w = encodeURIComponent((arabic ? 'رابط التسجيل' : 'My link') + ': ' + user.link); window.open('https://wa.me/?text=' + w, '_blank'); } }}>{arabic ? 'مشاركة' : 'Share'}</Btn>
              </div>

              <div style={{marginTop:12}} className="sub">{arabic ? 'الحالة' : 'Status'}: <strong style={{marginLeft:8}}>{user && user.registered ? (arabic ? 'مسجل' : 'Registered') : (arabic ? 'غير مسجل' : 'Not registered')}</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* toast */}
      {toast && <div style={{position:'fixed',right:20,bottom:20,background:'rgba(6,42,103,0.95)',color:'#fff',padding:'10px 14px',borderRadius:10,zIndex:9999}}>{toast}</div>}
    </main>
  );
}
