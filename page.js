'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * Production-grade Share-to-Earn page (JavaScript)
 * - Place at: /app/page.js
 * - No template-literal HTML blobs, clean React structure
 * - Replace localStorage calls with API/Supabase in production
 */

const MIN_PAYOUT = 100;

function Button({ children, variant = 'primary', onClick, disabled = false, style }) {
  const base = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-muted';
  return (
    <button
      className={base + ' ' + variantClass}
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
  const [arabic, setArabic] = useState(false);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const lockRef = useRef(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const whatsRef = useRef();

  const STORAGE_KEY = 'genio_referral_user_v1';
  const BALANCE_KEY = 'genio_referral_balance_v1';

  useEffect(() => {
    // hydrate client state from localStorage (replace with server logic later)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
      const b = Number(localStorage.getItem(BALANCE_KEY) || '0');
      setBalance(b);
    } catch (e) {
      // silent
    }
  }, []);

  useEffect(() => {
    document.documentElement.dir = arabic ? 'rtl' : 'ltr';
  }, [arabic]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  // utility: small click lock to prevent double submits
  function clickLock(ms = 700) {
    if (lockRef.current) return false;
    lockRef.current = true;
    setTimeout(() => (lockRef.current = false), ms);
    return true;
  }

  // simple validation
  function isValidEmail(e) {
    return /\S+@\S+\.\S+/.test(e);
  }

  // show notification
  function showToast(msg) {
    setToast(msg);
  }

  // create local test link (production: call server)
  async function handleSaveCreate() {
    if (!clickLock(900)) return;
    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const whats = whatsRef.current.value.trim();

    if (!name || !isValidEmail(email)) {
      alert(arabic ? 'الاسم والإيميل مطلوبان' : 'Name and valid email are required');
      return;
    }

    setLoading(true);
    try {
      // simulate server latency
      await new Promise((r) => setTimeout(r, 600));
      const key = Math.random().toString(36).slice(2, 9);
      const link = `${location.origin}/r/${encodeURIComponent(key)}`;

      const newUser = { name, email, whats, link, registered: true, createdAt: Date.now() };
      setUser(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

      if (!localStorage.getItem(BALANCE_KEY)) {
        setBalance(12.5);
        localStorage.setItem(BALANCE_KEY, '12.5');
      }

      showToast(arabic ? 'تم إنشاء الرابط ونسخه' : 'Link created & copied');

      try {
        await navigator.clipboard.writeText(link);
      } catch (e) {
        // ignore
      }
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    if (!confirm(arabic ? 'هل تريد مسح البيانات المحفوظة؟' : 'Clear saved data?')) return;
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    setBalance(0);
    localStorage.removeItem(BALANCE_KEY);
    showToast(arabic ? 'تم المسح' : 'Cleared');
    nameRef.current.value = '';
    emailRef.current.value = '';
    whatsRef.current.value = '';
  }

  function handleContact() {
    if (!clickLock(800)) return;
    const to = 'hello@genio.systems';
    const subj = encodeURIComponent(arabic ? 'استفسار شريك' : 'Partner Inquiry');
    const parts = [];
    if (user && user.email) parts.push(`User: ${user.name} (${user.email})`);
    else if (emailRef.current.value) parts.push(`User: ${nameRef.current.value || ''} (${emailRef.current.value})`);
    if (whatsRef.current.value) parts.push(`WhatsApp: ${whatsRef.current.value}`);
    const body = encodeURIComponent(parts.join('\n\n') + '\n\nMessage:\n');
    window.location.href = `mailto:${to}?subject=${subj}&body=${body}`;
  }

  function handlePayout() {
    if (!clickLock(700)) return;
    if (balance >= MIN_PAYOUT) {
      // In production: call server endpoint to create payout request, KYC, notify admin
      const ok = confirm(
        arabic
          ? `رصيدك $${balance.toFixed(2)}. هل تريد تقديم طلب سحب؟`
          : `Your balance is $${balance.toFixed(2)}. Request payout now?`
      );
      if (!ok) return;
      // simulate request
      showToast(arabic ? 'تم إرسال طلب السحب' : 'Payout request sent');
      setBalance(0);
      localStorage.setItem(BALANCE_KEY, '0');
    } else {
      alert(
        arabic
          ? `الحد الأدنى للسحب ${MIN_PAYOUT}$. تحتاج ${ (MIN_PAYOUT - balance).toFixed(2) }$ إضافية.`
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

  // render
  return (
    <main>
      <style>{`
        :root{
          --deep-blue:#062a67;
          --gold:#caa520;
          --muted:#6b7280;
          --card:#f6f8fb;
          --radius:12px;
          font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
        }
        *{box-sizing:border-box}
        body{margin:0;background:linear-gradient(180deg,#fbfdff,#fff);color:#07122a}
        .wrap{max-width:980px;margin:28px auto;padding:28px}
        .top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:20px}
        .brand{display:flex;align-items:center;gap:12px}
        .logo{width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,var(--deep-blue),#3b5cff);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800}
        h1{font-size:18px;margin:0}
        .lang-toggle{padding:8px 12px;border-radius:10px;border:1px solid #eef2ff;background:#fff;cursor:pointer}
        .panel{background:#fff;border-radius:14px;padding:24px;box-shadow:0 8px 30px rgba(6,42,103,0.06);border:1px solid #eef6ff}
        .hero{display:flex;flex-direction:row;gap:20px;align-items:center}
        .left{flex:1}
        .right{width:360px}
        .headline{font-size:28px;color:var(--deep-blue);margin:0 0 8px;font-weight:800}
        .lead{color:var(--muted);margin:0 0 16px}
        .actions{display:flex;gap:10px;margin-top:14px}
        .btn{flex:1;padding:12px 14px;border-radius:12px;border:0;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .08s ease,opacity .12s ease}
        .btn:active{transform:translateY(1px)}
        .btn-primary{background:var(--deep-blue);color:#fff;box-shadow:0 8px 24px rgba(6,42,103,0.12)}
        .btn-outline{background:#fff;border:1px solid #e6eefb;color:var(--deep-blue)}
        .btn-muted{background:transparent;border:1px dashed #e8eef9;color:var(--muted)}
        .form{display:flex;flex-direction:column;gap:10px}
        label{font-size:13px;color:var(--muted)}
        input{padding:12px;border-radius:10px;border:1px solid #eef4ff;background:#fbfdff;font-size:14px}
        .link-preview{background:#f7fbff;padding:12px;border-radius:10px;border:1px solid #e6f0ff;word-break:break-all;margin-top:8px}
        .muted{color:var(--muted);font-size:13px}
        @media (max-width:880px){ .hero{flex-direction:column} .right{width:100%} }
      `}</style>

      <div className="wrap" role="application" aria-label={arabic ? 'شارك واربح' : 'Share to Earn'}>
        <div className="top">
          <div className="brand">
            <div className="logo" aria-hidden>SE</div>
            <div>
              <h1 id="siteTitle">{arabic ? 'شارك واربح — Share to Earn' : 'Share to Earn — شارك واربح'}</h1>
              <div className="muted" id="siteTag">{arabic ? 'رابط واحد — دخل فوري' : 'One link — instant income'}</div>
            </div>
          </div>

          <div>
            <button
              className="lang-toggle"
              onClick={() => setArabic((s) => !s)}
              aria-pressed={arabic}
            >
              {arabic ? 'English' : 'عربي'}
            </button>
          </div>
        </div>

        <section className="panel hero" aria-labelledby="heroTitle">
          <div className="left">
            <h2 id="heroTitle" className="headline">{arabic ? 'احصل على رابط الربح الخاص بك الآن' : 'Get your ready affiliate link — احصل على رابطك الآن'}</h2>
            <p className="lead">{arabic ? 'لا حاجة لتسجيل. املأ الاسم، الإيميل والواتساب — سننشئ رابط تتبع ذكي للنسخ والمشاركة.' : 'No signup required. Fill name, email & WhatsApp — we create a smart tracking link you can copy & share.'}</p>

            <div className="actions" role="group" aria-label="main actions">
              <Button variant="primary" onClick={() => nameRef.current.focus()}>{arabic ? 'احصل على الرابط' : 'Get My Link'}</Button>
              <Button variant="outline" onClick={handleContact}>{arabic ? 'تواصل' : 'Contact Us'}</Button>
              <Button variant={balance >= MIN_PAYOUT ? 'primary' : 'muted'} onClick={handlePayout}>{arabic ? `السحب · ${balance.toFixed(2)}$` : `Payout · $${balance.toFixed(2)}`}</Button>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:16}}>
              <div style={{padding:12, borderRadius:10, background:'#fff', border:'1px solid #f1f7ff'}}>
                <div style={{fontWeight:700}}>{arabic ? 'تتبع تلقائي' : 'Auto-tracking'}</div>
                <div className="muted">{arabic ? 'نعطيك العمولة حتى للزوار غير المسجّلين.' : 'We credit your referral even for guest visitors.'}</div>
              </div>
              <div style={{padding:12, borderRadius:10, background:'#fff', border:'1px solid #f1f7ff'}}>
                <div style={{fontWeight:700}}>{arabic ? 'مواد جاهزة' : 'Ready assets'}</div>
                <div className="muted">{arabic ? 'نصوص وصور جاهزة للمشاركة.' : 'Captions, images and short posts for social.'}</div>
              </div>
            </div>
          </div>

          <aside className="right" aria-label={arabic ? 'نموذج المستخدم' : 'User form'}>
            <div className="form" id="sideForm">
              <label htmlFor="inputName">{arabic ? 'الاسم الكامل' : 'Full name'}</label>
              <input id="inputName" ref={nameRef} type="text" placeholder={arabic ? 'أحمد علي' : 'Ahmed Ali'} autoComplete="name" />

              <label htmlFor="inputEmail">{arabic ? 'الإيميل' : 'Email'}</label>
              <input id="inputEmail" ref={emailRef} type="email" placeholder="name@example.com" autoComplete="email" />

              <label htmlFor="inputWhats">{arabic ? 'واتساب' : 'WhatsApp'}</label>
              <input id="inputWhats" ref={whatsRef} type="tel" placeholder="+9715xxxxxxxx" autoComplete="tel" />

              <div style={{display:'flex',gap:10,marginTop:8}}>
                <Button variant="primary" onClick={handleSaveCreate} disabled={loading} style={{flex:1}}>{loading ? (arabic ? 'جاري المعالجة...' : 'Processing...') : (arabic ? 'حفظ وإنشاء' : 'Save & Create Link')}</Button>
                <Button variant="outline" onClick={handleClear} style={{width:110}}>{arabic ? 'مسح' : 'Clear'}</Button>
              </div>

              <div className="muted" style={{marginTop:12}}>{arabic ? 'رابط التتبع' : 'Your tracking link'}</div>
              <div className="link-preview" role="region" aria-live="polite">{user && user.link ? user.link : '—'}</div>

              <div style={{display:'flex',gap:8,marginTop:8}}>
                <Button variant="outline" onClick={handleCopy}>{arabic ? 'نسخ الرابط' : 'Copy link'}</Button>
                <Button variant="muted" onClick={handleShare}>{arabic ? 'مشاركة' : 'Share'}</Button>
              </div>

              <div style={{marginTop:12}} className="muted">Status: <strong style={{marginLeft:8}}>{user && user.registered ? (arabic ? 'مسجل' : 'Registered') : (arabic ? 'غير مسجل' : 'Not registered')}</strong></div>
            </div>
          </aside>
        </section>
      </div>

      {/* toast */}
      {toast && (
        <div style={{position:'fixed',right:20,bottom:20,background:'rgba(6,42,103,0.95)',color:'#fff',padding:'10px 14px',borderRadius:10,zIndex:9999}}>
          {toast}
        </div>
      )}
    </main>
  );
}
