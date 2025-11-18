'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Final professional Share-to-Earn page (JS)
 * - Put at: /app/page.js
 * - No logo, English default, Arabic only after toggle
 * - No demo credits, no prefilled personal data
 * - Payout always visible (shows $0.00 when balance is zero)
 */

const MIN_PAYOUT = 100;

function Button({ children, variant = 'primary', onClick, disabled = false, style = {} }) {
  const cls = variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-muted';
  return (
    <button
      className={`btn ${cls}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}

export default function Page() {
  // language: false = English (default), true = Arabic
  const [arabic, setArabic] = useState(false);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0); // USD - default 0
  const [loading, setLoading] = useState(false);
  const lockRef = useRef(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const whatsRef = useRef(null);

  // hydrate localStorage if present
  useEffect(() => {
    try {
      const raw = localStorage.getItem('genio_referral_user_v1');
      if (raw) setUser(JSON.parse(raw));
      const b = Number(localStorage.getItem('genio_referral_balance_v1') || '0');
      setBalance(b);
    } catch (e) {
      // silently ignore
    }
  }, []);

  // set dir when arabic toggled
  useEffect(() => {
    document.documentElement.dir = arabic ? 'rtl' : 'ltr';
  }, [arabic]);

  // click lock utility
  function clickLock(ms = 700) {
    if (lockRef.current) return false;
    lockRef.current = true;
    setTimeout(() => (lockRef.current = false), ms);
    return true;
  }

  function isValidEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  async function handleSaveCreate() {
    if (!clickLock(900)) return;
    const name = nameRef.current?.value?.trim() || '';
    const email = emailRef.current?.value?.trim() || '';
    const whats = whatsRef.current?.value?.trim() || '';

    if (!name || !isValidEmail(email)) {
      alert(arabic ? 'الاسم والإيميل مطلوبان' : 'Name and valid email are required');
      return;
    }

    setLoading(true);
    try {
      // minimal simulated delay, replace with API call in production
      await new Promise((r) => setTimeout(r, 400));
      const key = Math.random().toString(36).slice(2, 9);
      const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/r/${encodeURIComponent(key)}`;
      const newUser = { name, email, whats, link, registered: true, createdAt: Date.now() };
      setUser(newUser);
      localStorage.setItem('genio_referral_user_v1', JSON.stringify(newUser));
      // NO demo credit — keep balance as stored (default 0)
      showToast(arabic ? 'تم إنشاء الرابط' : 'Link created');
      try { await navigator.clipboard.writeText(link); showToast(arabic ? 'تم نسخ الرابط' : 'Link copied'); } catch {}
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    if (!confirm(arabic ? 'هل تريد مسح البيانات المحفوظة؟' : 'Clear saved data?')) return;
    setUser(null);
    localStorage.removeItem('genio_referral_user_v1');
    localStorage.removeItem('genio_referral_balance_v1');
    if (nameRef.current) nameRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (whatsRef.current) whatsRef.current.value = '';
    setBalance(0);
    showToast(arabic ? 'تم المسح' : 'Cleared');
  }

  function handleContact() {
    if (!clickLock(800)) return;
    const to = 'hello@genio.systems';
    const subj = encodeURIComponent(arabic ? 'استفسار شريك' : 'Partner Inquiry');
    const parts = [];
    if (user && user.email) parts.push(`User: ${user.name} (${user.email})`);
    else if (emailRef.current && emailRef.current.value) parts.push(`User: ${nameRef.current.value || ''} (${emailRef.current.value})`);
    if (whatsRef.current && whatsRef.current.value) parts.push(`WhatsApp: ${whatsRef.current.value}`);
    const body = encodeURIComponent(parts.join('\n') + '\n\nMessage:\n');
    window.location.href = `mailto:${to}?subject=${subj}&body=${body}`;
  }

  function handlePayout() {
    if (!clickLock(700)) return;
    if (balance >= MIN_PAYOUT) {
      const ok = confirm(arabic ? `رصيدك $${balance.toFixed(2)}. هل تريد تقديم طلب سحب؟` : `Your balance is $${balance.toFixed(2)}. Request payout now?`);
      if (!ok) return;
      // In production: call /api/payout
      showToast(arabic ? 'تم إرسال طلب السحب' : 'Payout request sent');
      setBalance(0);
      localStorage.setItem('genio_referral_balance_v1', '0');
    } else {
      alert(
        arabic
          ? `الحد الأدنى للسحب ${MIN_PAYOUT}$. تحتاج ${(MIN_PAYOUT - balance).toFixed(2)}$ إضافية.`
          : `Minimum payout is $${MIN_PAYOUT}. You need $${(MIN_PAYOUT - balance).toFixed(2)} more.`
      );
    }
  }

  function handleCopy() {
    const txt = user && user.link ? user.link : '';
    if (!txt) return showToast(arabic ? 'لا يوجد رابط' : 'No link available');
    navigator.clipboard.writeText(txt).then(() => showToast(arabic ? 'تم النسخ' : 'Copied'));
  }

  function handleShare() {
    const txt = user && user.link ? user.link : '';
    if (!txt) return showToast(arabic ? 'لا يوجد رابط للمشاركة' : 'No link to share');
    if (navigator.share) {
      navigator.share({ title: 'My link', text: txt, url: txt }).catch(() => {});
    } else {
      const w = encodeURIComponent((arabic ? 'رابط التسجيل' : 'My link') + ': ' + txt);
      window.open(`https://wa.me/?text=${w}`, '_blank');
    }
  }

  // toast
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);
  function showToast(msg) { setToast(msg); }

  // styles: keep compact and professional
  return (
    <main>
      <style>{`
        :root{--deep-blue:#062a67;--muted:#6b7280;--card:#f6f8fb}
        *{box-sizing:border-box}
        :where(body,html){margin:0;height:100%}
        body{font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial;color:#07122a;background:linear-gradient(180deg,#fbfdff,#fff)}
        .wrap{max-width:980px;margin:24px auto;padding:20px}
        .top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px}
        .brandTitle{margin:0;font-size:18px;font-weight:700}
        .muted{color:var(--muted);font-size:13px}
        .langBtn{padding:8px 12px;border-radius:10px;border:1px solid #eef2ff;background:#fff;cursor:pointer}
        .panel{background:#fff;border-radius:14px;padding:20px;box-shadow:0 8px 30px rgba(6,42,103,0.06);border:1px solid #eef6ff}
        .hero{display:flex;gap:18px;align-items:flex-start}
        .left{flex:1}
        .right{width:360px}
        .headline{font-size:28px;color:var(--deep-blue);margin:0 0 8px;font-weight:800}
        .lead{color:var(--muted);margin:0 0 16px}
        .actions{display:flex;gap:12px;margin-top:12px}
        .btn{flex:1;padding:14px;border-radius:12px;border:0;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px}
        .btn-primary{background:var(--deep-blue);color:#fff;box-shadow:0 8px 24px rgba(6,42,103,0.12)}
        .btn-outline{background:#fff;border:1px solid #e6eefb;color:var(--deep-blue)}
        .btn-muted{background:transparent;border:1px dashed #e8eef9;color:var(--muted)}
        .form{display:flex;flex-direction:column;gap:10px}
        label{font-size:13px;color:var(--muted)}
        input{padding:12px;border-radius:10px;border:1px solid #eef4ff;background:#fbfdff;font-size:14px}
        .linkPreview{background:#f7fbff;padding:12px;border-radius:10px;border:1px solid #e6f0ff;word-break:break-all;margin-top:8px}
        @media (max-width:880px){ .hero{flex-direction:column} .right{width:100%} }
      `}</style>

      <div className="wrap" role="application" aria-label="Share to Earn">
        <div className="top">
          <div>
            <h1 className="brandTitle">{arabic ? 'شارك واربح' : 'Share to Earn'}</h1>
            <div className="muted">{arabic ? 'رابط واحد — دخل فوري' : 'One link — instant income'}</div>
          </div>

          <div>
            <button className="langBtn" onClick={() => setArabic((s) => !s)} aria-pressed={arabic}>
              {arabic ? 'English' : 'عربي'}
            </button>
          </div>
        </div>

        <section className="panel hero" aria-labelledby="heroTitle">
          <div className="left">
            <h2 id="heroTitle" className="headline">{arabic ? 'احصل على رابطك' : 'Get your ready affiliate link'}</h2>
            <p className="lead">{arabic ? 'املأ الاسم والايميل (الواتساب اختياري). سننشئ لك رابط تتبع.' : 'Fill name and email (WhatsApp optional). We will create a tracking link.'}</p>

            <div className="actions" role="group" aria-label="main actions">
              <Button variant="primary" onClick={() => nameRef.current?.focus()}>{arabic ? 'احصل على الرابط' : 'Get My Link'}</Button>
              <Button variant="outline" onClick={handleContact}>{arabic ? 'تواصل' : 'Contact Us'}</Button>
              <Button variant={balance >= MIN_PAYOUT ? 'primary' : 'muted'} onClick={handlePayout}>
                {arabic ? `السحب · $${balance.toFixed(2)}` : `Payout · $${balance.toFixed(2)}`}
              </Button>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:18}}>
              <div style={{padding:12,borderRadius:10,background:'#fff',border:'1px solid #f1f7ff'}}>
                <div style={{fontWeight:700}}>{arabic ? 'تتبع تلقائي' : 'Auto-tracking'}</div>
                <div className="muted">{arabic ? 'نعطيك العمولة حتى للزوار غير المسجلين.' : 'We credit referrals for guest visitors.'}</div>
              </div>
              <div style={{padding:12,borderRadius:10,background:'#fff',border:'1px solid #f1f7ff'}}>
                <div style={{fontWeight:700}}>{arabic ? 'مواد جاهزة' : 'Ready assets'}</div>
                <div className="muted">{arabic ? 'نصوص وصور جاهزة للنشر.' : 'Captions, images and short posts for sharing.'}</div>
              </div>
            </div>
          </div>

          <aside className="right" aria-label="User form">
            <div className="form" id="sideForm">
              <label htmlFor="inputName">{arabic ? 'الاسم الكامل' : 'Full name'}</label>
              <input id="inputName" ref={nameRef} type="text" placeholder={arabic ? 'اكتب اسمك هنا' : 'Your full name'} autoComplete="name" />

              <label htmlFor="inputEmail">{arabic ? 'الإيميل' : 'Email'}</label>
              <input id="inputEmail" ref={emailRef} type="email" placeholder={arabic ? 'الايميل' : 'Email address'} autoComplete="email" />

              <label htmlFor="inputWhats">{arabic ? 'واتساب (اختياري)' : 'WhatsApp (optional)'}</label>
              <input id="inputWhats" ref={whatsRef} type="tel" placeholder={arabic ? 'رقم واتساب' : 'WhatsApp number'} autoComplete="tel" />

              <div style={{display:'flex',gap:12,marginTop:10}}>
                <Button variant="primary" onClick={handleSaveCreate} disabled={loading} style={{flex:1}}>
                  {loading ? (arabic ? 'جاري...' : 'Processing...') : (arabic ? 'حفظ وإنشاء' : 'Save & Create Link')}
                </Button>
                <Button variant="outline" onClick={handleClear} style={{width:120}}>{arabic ? 'مسح' : 'Clear'}</Button>
              </div>

              <div style={{marginTop:14}} className="muted">{arabic ? 'رابط التتبع' : 'Your tracking link'}</div>
              <div className="linkPreview" role="region" aria-live="polite">{user && user.link ? user.link : (arabic ? 'لم يتم إنشاء رابط بعد' : 'No link yet')}</div>

              <div style={{display:'flex',gap:10,marginTop:12}}>
                <Button variant="outline" onClick={handleCopy}>{arabic ? 'نسخ الرابط' : 'Copy link'}</Button>
                <Button variant="muted" onClick={handleShare}>{arabic ? 'مشاركة' : 'Share'}</Button>
              </div>

              <div style={{marginTop:14}} className="muted">{arabic ? 'الحالة' : 'Status'}: <strong style={{marginLeft:8}}>{user && user.registered ? (arabic ? 'مسجل' : 'Registered') : (arabic ? 'غير مسجل' : 'Not registered')}</strong></div>
            </div>
          </aside>
        </section>
      </div>

      {toast && <div style={{position:'fixed',right:20,bottom:20,background:'rgba(6,42,103,0.95)',color:'#fff',padding:'10px 14px',borderRadius:10,zIndex:9999}}>{toast}</div>}
    </main>
  );
}
