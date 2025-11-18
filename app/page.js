'use client';

import React, { useEffect, useRef, useState } from 'react';

/**
 * /app/page.js
 * Genio — Offers landing (client)
 * - English default, Arabic toggled on demand
 * - Offers grid, modal form, create personal link (localStorage fallback)
 * - No demo data, fields empty by default
 *
 * Replace OFFERS with real offers (base_tracking_url from networks).
 */

const MIN_PAYOUT = 100;

// Replace these example offers with your real partner links (base_tracking_url).
const OFFERS = [
  { id: 'offer-1', title: 'Sample Offer 1', desc: 'High-conversion sample', baseTrackingUrl: 'https://track.partner.com/o123?aff=GENIO' },
  { id: 'offer-2', title: 'Sample Offer 2', desc: 'Popular digital course', baseTrackingUrl: 'https://track.partner.com/o456?aff=GENIO' },
  { id: 'offer-3', title: 'Sample Offer 3', desc: 'Top beauty product', baseTrackingUrl: 'https://track.partner.com/o789?aff=GENIO' }
];

function Btn({ children, variant = 'primary', onClick, disabled = false, style = {} }) {
  const cls = variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-muted';
  return (
    <button className={`btn ${cls}`} onClick={onClick} disabled={disabled} style={style} aria-disabled={disabled}>
      {children}
    </button>
  );
}

export default function Page() {
  const [arabic, setArabic] = useState(false); // default English
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const whatsRef = useRef(null);

  useEffect(() => {
    // hydrate existing user & balance (optional)
    try {
      const raw = localStorage.getItem('genio_referral_user_v1');
      if (raw) setUser(JSON.parse(raw));
      const b = Number(localStorage.getItem('genio_referral_balance_v1') || '0');
      setBalance(b);
    } catch (e) {
      // ignore
    }
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

  function isValidEmail(v) {
    return /\S+@\S+\.\S+/.test(v);
  }

  function openOfferModal(offer = null) {
    setSelectedOffer(offer);
    setModalOpen(true);
    // focus name after next tick
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
      // simulate minimal server delay — replace with server API call in production
      await new Promise((r) => setTimeout(r, 350));

      // generate or reuse user key
      const existingKey = user && user.key ? user.key : null;
      const userKey = existingKey || Math.random().toString(36).slice(2, 9);

      const newUser = { name, email, whats, key: userKey, createdAt: Date.now() };
      setUser(newUser);
      localStorage.setItem('genio_referral_user_v1', JSON.stringify(newUser));

      // build personal tracking link for selected offer or generic placeholder
      const offer = selectedOffer || OFFERS[0];
      const sep = offer.baseTrackingUrl.includes('?') ? '&' : '?';
      // Use 'sub' as default sub parameter; change to 'subId' / 'sub1' per network requirements
      const personal = `${offer.baseTrackingUrl}${sep}sub=${encodeURIComponent(userKey)}&utm_source=genio`;

      // save per-user links
      const linksKey = `genio_user_links_${userKey}`;
      const existingLinks = JSON.parse(localStorage.getItem(linksKey) || '{}');
      existingLinks[offer.id] = personal;
      localStorage.setItem(linksKey, JSON.stringify(existingLinks));

      showToast(arabic ? 'تم إنشاء الرابط' : 'Link created');
      try { await navigator.clipboard.writeText(personal); showToast(arabic ? 'تم نسخ الرابط' : 'Link copied'); } catch {}

      setModalOpen(false);
    } finally {
      setLoading(false);
    }
  }

  function copyLinkForOffer(offerId) {
    if (!user || !user.key) return showToast(arabic ? 'لا رابط' : 'No link available');
    const linksKey = `genio_user_links_${user.key}`;
    const existing = JSON.parse(localStorage.getItem(linksKey) || '{}');
    const link = existing[offerId];
    if (!link) return showToast(arabic ? 'لم يتم إنشاء رابط لهذا العرض' : 'No link created for this offer');
    navigator.clipboard.writeText(link).then(() => showToast(arabic ? 'تم النسخ' : 'Copied'));
  }

  function shareLinkForOffer(offerId) {
    if (!user || !user.key) return showToast(arabic ? 'لا رابط' : 'No link available');
    const linksKey = `genio_user_links_${user.key}`;
    const existing = JSON.parse(localStorage.getItem(linksKey) || '{}');
    const link = existing[offerId];
    if (!link) return showToast(arabic ? 'لم يتم إنشاء رابط لهذا العرض' : 'No link created for this offer');
    if (navigator.share) {
      navigator.share({ title: 'My link', text: link, url: link }).catch(() => {});
    } else {
      const w = encodeURIComponent((arabic ? 'رابط' : 'My link') + ': ' + link);
      window.open(`https://wa.me/?text=${w}`, '_blank');
    }
  }

  function handlePayout() {
    if (balance >= MIN_PAYOUT) {
      if (!confirm(arabic ? `رصيدك $${balance.toFixed(2)}. هل تريد طلب سحب؟` : `Your balance is $${balance.toFixed(2)}. Request payout now?`)) return;
      // In production: call API to create payout request
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

  // constants inside component so linter doesn't complain
  const MIN_PAYOUT = MIN_PAYOUT || 100;

  return (
    <main>
      <style>{`
        :root{--deep-blue:#062a67;--muted:#6b7280;--card:#fff;--soft:#f7fbff}
        *{box-sizing:border-box}
        body{margin:0;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Arial;background:linear-gradient(180deg,#fbfdff,#fff);color:#07122a}
        .wrap{max-width:980px;margin:22px auto;padding:18px}
        .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
        .title{font-size:20px;font-weight:800;margin:0}
        .sub{color:var(--muted);font-size:13px}
        .panel{background:var(--card);border-radius:12px;padding:18px;box-shadow:0 8px 30px rgba(6,42,103,0.06);border:1px solid #eef6ff}
        .headline{font-size:24px;color:var(--deep-blue);font-weight:800;margin:0}
        .lead{color:var(--muted);margin:6px 0 12px}
        .actions{display:flex;gap:12px;margin-top:10px}
        .btn{flex:1;padding:12px;border-radius:12px;border:0;font-weight:700;font-size:15px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
        .btn-primary{background:var(--deep-blue);color:#fff;box-shadow:0 8px 24px rgba(6,42,103,0.12)}
        .btn-outline{background:#fff;border:1px solid #e6eefb;color:var(--deep-blue)}
        .btn-muted{background:transparent;border:1px dashed #e8eef9;color:var(--muted)}
        .gridOffers{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-top:16px}
        .offerCard{padding:14px;border-radius:10px;background:#fff;border:1px solid #eef4ff;display:flex;flex-direction:column;gap:8px;min-height:110px;justify-content:space-between}
        .offerTitle{font-weight:800}
        .offerDesc{color:var(--muted);font-size:13px}
        .smallActions{display:flex;gap:8px;margin-top:8px}
        .contactRow{margin-top:14px}
        .contactFull{width:100%;padding:12px;border-radius:12px;border:1px solid #e6eefb;background:#fff;font-weight:700;color:var(--deep-blue);cursor:pointer}
        .modalBack{position:fixed;inset:0;background:rgba(7,18,38,0.45);display:flex;align-items:center;justify-content:center;z-index:60}
        .modal{width:100%;max-width:620px;background:#fff;border-radius:12px;padding:18px;box-shadow:0 12px 40px rgba(6,42,103,0.18)}
        .form{display:flex;flex-direction:column;gap:10px}
        label{font-size:13px;color:var(--muted)}
        input{padding:12px;border-radius:10px;border:1px solid #eef4ff;background:#fbfdff;font-size:14px}
        .linkPreview{background:#f7fbff;padding:12px;border-radius:10px;border:1px solid #e6f0ff;word-break:break-all}
        @media (max-width:880px){ .gridOffers{grid-template-columns:1fr} .modal{margin:16px} }
      `}</style>

      <div className="wrap" role="application" aria-label="Share to Earn - Offers">
        <div className="top">
          <div>
            <h1 className="title">{arabic ? 'شارك واربح' : 'Share to Earn'}</h1>
            <div className="sub">{arabic ? 'رابط واحد — دخل فوري' : 'One link — instant income'}</div>
          </div>

          <div style={{ width: 140 }}>
            <Btn variant="outline" onClick={() => setArabic((s) => !s)}>
              {arabic ? 'English' : 'عربي'}
            </Btn>
          </div>
        </div>

        <div className="panel" aria-labelledby="heroTitle">
          <div>
            <h2 id="heroTitle" className="headline">{arabic ? 'اختر عرضاً وابدأ المشاركة' : 'Choose an offer & start sharing'}</h2>
            <p className="lead">{arabic ? 'اضغط على العرض الذي تريد، املأ بياناتك، وابدأ المشاركة.' : 'Click an offer, fill your info and start sharing.'}</p>
          </div>

          <div className="actions" role="group" aria-label="main actions">
            <Btn variant="primary" onClick={() => { setSelectedOffer(null); setModalOpen(true); }}>{arabic ? 'احصل على الرابط' : 'Get My Link'}</Btn>
            <Btn variant="muted" onClick={handlePayout}>{arabic ? `السحب · $${balance.toFixed(2)}` : `Payout · $${balance.toFixed(2)}`}</Btn>
            <div style={{ width: 0 }} />
          </div>

          <div className="gridOffers" role="list" aria-label="offers list">
            {OFFERS.map((offer) => (
              <div className="offerCard" key={offer.id} role="listitem">
                <div>
                  <div className="offerTitle">{offer.title}</div>
                  <div className="offerDesc">{offer.desc}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Btn variant="primary" onClick={() => openOfferModal(offer)} style={{ flex: 1 }}>{arabic ? 'اختر' : 'Select'}</Btn>
                    <Btn variant="outline" onClick={() => copyLinkForOffer(offer.id)}>{arabic ? 'نسخ' : 'Copy'}</Btn>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <small style={{ color: 'var(--muted)' }}>{arabic ? 'الشبكة: مثال' : 'Network: Example'}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="contactRow">
            <button className="contactFull" onClick={onContact}>{arabic ? 'تواصل معنا' : 'Contact Us'}</button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="modalBack" role="dialog" aria-modal="true">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>{arabic ? 'أنشئ رابطك' : (selectedOffer ? `Create link for "${selectedOffer.title}"` : 'Create your link')}</div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div className="form">
              <label>{arabic ? 'الاسم الكامل' : 'Full name'}</label>
              <input ref={nameRef} type="text" placeholder={arabic ? 'اكتب اسمك هنا' : 'Your full name'} />

              <label>{arabic ? 'الإيميل' : 'Email'}</label>
              <input ref={emailRef} type="email" placeholder={arabic ? 'الايميل' : 'Email address'} />

              <label>{arabic ? 'واتساب (اختياري)' : 'WhatsApp (optional)'}</label>
              <input ref={whatsRef} type="tel" placeholder={arabic ? 'رقم واتساب' : 'WhatsApp number'} />

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <Btn variant="primary" onClick={createPersonalLink} style={{ flex: 1 }}>{loading ? (arabic ? 'جاري...' : 'Processing...') : (arabic ? 'حفظ وإنشاء' : 'Save & Create Link')}</Btn>
                <Btn variant="outline" onClick={() => setModalOpen(false)}>{arabic ? 'إلغاء' : 'Cancel'}</Btn>
              </div>

              <div style={{ marginTop: 12 }} className="linkPreview" aria-live="polite">
                {user && user.key ? (
                  (function(){
                    const linksKey = `genio_user_links_${user.key}`;
                    const existing = JSON.parse(localStorage.getItem(linksKey) || '{}');
                    if (selectedOffer) {
                      return existing[selectedOffer.id] || (arabic ? 'لم يتم إنشاء رابط بعد لهذا العرض' : 'No link yet for this offer');
                    }
                    return Object.keys(existing).length ? Object.values(existing).join('\\n') : (arabic ? 'لم يتم إنشاء روابط بعد' : 'No links yet');
                  })()
                ) : (arabic ? 'لم يتم إنشاء روابط بعد' : 'No link yet')}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <Btn variant="outline" onClick={() => {
                  if (!user || !user.key) return showToast(arabic ? 'لا رابط' : 'No link');
                  const linksKey = `genio_user_links_${user.key}`;
                  const existing = JSON.parse(localStorage.getItem(linksKey) || '{}');
                  const link = selectedOffer ? existing[selectedOffer.id] : Object.values(existing)[0];
                  if (!link) return showToast(arabic ? 'لا رابط' : 'No link');
                  navigator.clipboard.writeText(link).then(()=> showToast(arabic ? 'تم النسخ' : 'Copied'));
                }}>{arabic ? 'نسخ الرابط' : 'Copy link'}</Btn>

                <Btn variant="muted" onClick={() => {
                  if (!user || !user.key) return showToast(arabic ? 'لا رابط' : 'No link');
                  const linksKey = `genio_user_links_${user.key}`;
                  const existing = JSON.parse(localStorage.getItem(linksKey) || '{}');
                  const link = selectedOffer ? existing[selectedOffer.id] : Object.values(existing)[0];
                  if (!link) return showToast(arabic ? 'لا رابط' : 'No link');
                  if (navigator.share) navigator.share({ title: 'My link', text: link, url: link }).catch(()=>{});
                  else { const w = encodeURIComponent((arabic ? 'رابط' : 'My link') + ': ' + link); window.open('https://wa.me/?text=' + w, '_blank'); }
                }}>{arabic ? 'مشاركة' : 'Share'}</Btn>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div style={{position:'fixed',right:20,bottom:20,background:'rgba(6,42,103,0.95)',color:'#fff',padding:'10px 14px',borderRadius:10,zIndex:9999}}>{toast}</div>}
    </main>
  );
}
