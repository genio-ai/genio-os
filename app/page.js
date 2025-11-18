import React from 'react';

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Share to Earn — شارك واربح</title>
  <style>
    :root{
      --deep-blue:#062a67;
      --gold:#caa520;
      --muted:#6b7280;
      --card:#f6f8fb;
      --radius:12px;
      --max-w:980px;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    }
    *{box-sizing:border-box}
    html,body{height:100%;margin:0;background:linear-gradient(180deg,#fbfdff,#fff);color:#07122a}
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
    .bilingual{display:flex;flex-direction:column;gap:6px}
    .arabic{direction:rtl;font-weight:700;font-size:18px}
    .actions{display:flex;gap:10px;margin-top:14px}
    .btn{
      flex:1;padding:12px 14px;border-radius:12px;border:0;font-weight:700;font-size:15px;cursor:pointer;
      display:inline-flex;align-items:center;justify-content:center;gap:8px;
      transition:transform .08s ease,opacity .12s ease;
    }
    .btn:active{transform:translateY(1px)}
    .btn-primary{background:var(--deep-blue);color:#fff;box-shadow:0 8px 24px rgba(6,42,103,0.12)}
    .btn-outline{background:#fff;border:1px solid #e6eefb;color:var(--deep-blue)}
    .btn-muted{background:transparent;border:1px dashed #e8eef9;color:var(--muted)}
    .actions .btn{min-width:120px}
    .form{display:flex;flex-direction:column;gap:10px}
    label{font-size:13px;color:var(--muted)}
    input{padding:12px;border-radius:10px;border:1px solid #eef4ff;background:#fbfdff;font-size:14px}
    .small{font-size:13px;color:var(--muted)}
    .link-preview{background:#f7fbff;padding:12px;border-radius:10px;border:1px solid #e6f0ff;word-break:break-all}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:16px}
    .card{padding:12px;border-radius:10px;background:#fff;border:1px solid #f1f7ff}
    .muted{color:var(--muted);font-size:13px}
    .modal-backdrop{position:fixed;inset:0;background:rgba(7,18,38,0.45);display:flex;align-items:center;justify-content:center;z-index:60}
    .modal{background:#fff;padding:18px;border-radius:12px;width:420px;max-width:92%}
    .row{display:flex;gap:10px}
    @media (max-width:880px){
      .hero{flex-direction:column}
      .right{width:100%}
      .info-grid{grid-template-columns:1fr}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div class="brand">
        <div class="logo">SE</div>
        <div>
          <h1 id="siteTitle">Share to Earn — شارك واربح</h1>
          <div class="muted" id="siteTag">One link — instant income · رابط واحد — دخل فوري</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px">
        <button class="lang-toggle" id="toggleLang">عربي</button>
      </div>
    </div>

    <div class="panel hero" role="region" aria-label="Share to earn panel">
      <div class="left">
        <h2 class="headline" id="headline">Get your ready affiliate link — احصل على رابطك الآن</h2>
        <p class="lead" id="sub">No signup required. Fill name, email & WhatsApp — we create a smart tracking link you can copy & share. / لا حاجة لتسجيل. املأ الاسم، الإيميل والواتساب — سننشئ رابط تتبع ذكي للنسخ والمشاركة.</p>

        <div class="actions" role="group" aria-label="main actions">
          <button class="btn btn-primary" id="getLinkBtn">Get My Link · احصل على الرابط</button>
          <button class="btn btn-outline" id="contactBtn">Contact Us · تواصل</button>
          <button class="btn btn-muted" id="payoutBtn">Payout · السحب</button>
        </div>

        <div class="info-grid" aria-hidden="false">
          <div class="card">
            <div style="font-weight:700">Auto-tracking · تتبع تلقائي</div>
            <div class="muted">We credit your referral even for guest visitors. / نعطيك العمولة حتى للزوار غير المسجّلين.</div>
          </div>
          <div class="card">
            <div style="font-weight:700">Ready assets · مواد جاهزة</div>
            <div class="muted">Captions, images and short posts for social sharing. / نصوص وصور ومنشورات جاهزة للمشاركة.</div>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="form" id="sideForm">
          <label id="lblName">Full name — الاسم الكامل</label>
          <input id="inputName" type="text" placeholder="Ahmed Ali — أحمد علي" autocomplete="name" />

          <label id="lblEmail">Email — الإيميل</label>
          <input id="inputEmail" type="email" placeholder="name@example.com" autocomplete="email" />

          <label id="lblWhats">WhatsApp — واتساب</label>
          <input id="inputWhats" type="tel" placeholder="+9715xxxxxxxx" autocomplete="tel" />

          <div style="display:flex;gap:10px;margin-top:6px">
            <button class="btn btn-primary" id="saveBtn" style="flex:1">Save & Create Link · حفظ وإنشاء</button>
            <button class="btn btn-outline" id="clearBtn" style="width:110px">Clear · مسح</button>
          </div>

          <div style="margin-top:12px">
            <div class="small">Your tracking link / رابط التتبع</div>
            <div class="link-preview" id="linkPreview">—</div>
            <div style="display:flex;gap:8px;margin-top:8px">
              <button class="btn btn-outline" id="copyBtn">Copy link · نسخ الرابط</button>
              <button class="btn btn-muted" id="shareBtn">Share · مشاركة</button>
            </div>
          </div>

          <div style="margin-top:12px" class="muted small">Status: <span id="status">Not registered / غير مسجل</span></div>
        </div>
      </div>
    </div>
  </div>

  <div id="modalRoot" style="display:none"></div>

  <script>
    (function(){
      // Elements
      const langToggle = document.getElementById('toggleLang');
      const body = document.body;
      const getLinkBtn = document.getElementById('getLinkBtn');
      const contactBtn = document.getElementById('contactBtn');
      const payoutBtn = document.getElementById('payoutBtn');
      const saveBtn = document.getElementById('saveBtn');
      const clearBtn = document.getElementById('clearBtn');
      const copyBtn = document.getElementById('copyBtn');
      const shareBtn = document.getElementById('shareBtn');
      const linkPreview = document.getElementById('linkPreview');
      const status = document.getElementById('status');
      const modalRoot = document.getElementById('modalRoot');

      const inputName = document.getElementById('inputName');
      const inputEmail = document.getElementById('inputEmail');
      const inputWhats = document.getElementById('inputWhats');

      // language state
      let arabic = false;

      // Simulated user data + balance (in production, fetch from server)
      const STORAGE_KEY = 'genio_referral_user_v1';
      const BALANCE_KEY = 'genio_referral_balance_v1';
      let user = loadUser();
      let balance = Number(localStorage.getItem(BALANCE_KEY) || '0'); // in USD

      // init UI
      renderUser();
      updatePayoutUI();

      // language toggle
      langToggle.addEventListener('click', ()=>{
        arabic = !arabic;
        if(arabic){
          body.setAttribute('dir','rtl');
          langToggle.textContent = 'English';
          translateToArabic();
        } else {
          body.setAttribute('dir','ltr');
          langToggle.textContent = 'عربي';
          translateToEnglish();
        }
      });

      function translateToArabic(){
        document.getElementById('siteTitle').textContent = 'شارك واربح — Share to Earn';
        document.getElementById('siteTag').textContent = 'رابط واحد — دخل فوري · One link — instant income';
        document.getElementById('headline').textContent = 'احصل على رابط الربح الخاص بك الآن';
        document.getElementById('sub').textContent = 'لا حاجة لتسجيل. املأ الاسم، الإيميل والواتساب — سننشئ رابط تتبع ذكي للنسخ والمشاركة.';
        getLinkBtn.textContent = 'احصل على الرابط · Get My Link';
        contactBtn.textContent = 'تواصل · Contact Us';
        payoutBtn.textContent = 'السحب · Payout';
        document.getElementById('lblName').textContent = 'الاسم الكامل — Full name';
        document.getElementById('lblEmail').textContent = 'الإيميل — Email';
        document.getElementById('lblWhats').textContent = 'واتساب — WhatsApp';
        saveBtn.textContent = 'حفظ وإنشاء · Save & Create Link';
        clearBtn.textContent = 'مسح · Clear';
        copyBtn.textContent = 'نسخ الرابط · Copy link';
        shareBtn.textContent = 'مشاركة · Share';
        linkPreview.textContent = user && user.link ? user.link : '—';
        status.textContent = user && user.registered ? 'مسجل · Registered' : 'غير مسجل · Not registered';
      }

      function translateToEnglish(){
        document.getElementById('siteTitle').textContent = 'Share to Earn — شارك واربح';
        document.getElementById('siteTag').textContent = 'One link — instant income · رابط واحد — دخل فوري';
        document.getElementById('headline').textContent = 'Get your ready affiliate link — احصل على رابطك الآن';
        document.getElementById('sub').textContent = 'No signup required. Fill name, email & WhatsApp — we create a smart tracking link you can copy & share.';
        getLinkBtn.textContent = 'Get My Link · احصل على الرابط';
        contactBtn.textContent = 'Contact Us · تواصل';
        payoutBtn.textContent = 'Payout · السحب';
        document.getElementById('lblName').textContent = 'Full name — الاسم الكامل';
        document.getElementById('lblEmail').textContent = 'Email — الإيميل';
        document.getElementById('lblWhats').textContent = 'WhatsApp — واتساب';
        saveBtn.textContent = 'Save & Create Link · حفظ وإنشاء';
        clearBtn.textContent = 'Clear · مسح';
        copyBtn.textContent = 'Copy link · نسخ الرابط';
        shareBtn.textContent = 'Share · مشاركة';
        linkPreview.textContent = user && user.link ? user.link : '—';
        status.textContent = user && user.registered ? 'Registered · مسجل' : 'Not registered · غير مسجل';
      }

      // GET LINK main flow: scroll to form or open modal
      getLinkBtn.addEventListener('click', ()=> {
        inputName.focus();
        saveBtn.animate([{transform:'translateY(0)'},{transform:'translateY(-4px)'},{transform:'translateY(0)'}],{duration:350});
      });

      // CONTACT - open mailto with prefilled body; prevent repeated clicks quickly
      contactBtn.addEventListener('click', debounce(()=>{
        const to = 'hello@genio.systems';
        const subj = encodeURIComponent('Partner Inquiry / استفسار شريك');
        const bodyText = encodeURIComponent(buildContactBody());
        window.location.href = `mailto:${to}?subject=${subj}&body=${bodyText}`;
      }, 800));

      // PAYOUT flow
      payoutBtn.addEventListener('click', debounce(()=> {
        openModal(\`
          <div style="font-weight:700;margin-bottom:8px">\${ arabic ? 'السحب / Payout' : 'Payout / السحب' }</div>
          <div class="muted" style="margin-bottom:12px">\${ arabic ? 'رصيدك: ' : 'Your balance: ' }$\${balance.toFixed(2)}</div>
          \${balance >= 100 ? 
            \`<div style="margin-bottom:12px">\${ arabic ? 'يمكنك طلب سحب الآن.' : 'You are eligible to request a payout.' }</div>
            <div style="display:flex;gap:8px">
              <button id="confirmPayout" class="btn btn-primary" style="flex:1">\${ arabic ? 'اطلب سحب' : 'Request Payout' }</button>
              <button id="closeModal" class="btn btn-outline" style="width:110px">\${ arabic ? 'إغلاق' : 'Close' }</button>
            </div>\` :
            \`<div style="margin-bottom:12px">\${ arabic ? 'الحد الأدنى للسحب 100$. تحتاج ' : 'Minimum payout is $100. You need ' }\${ (100 - balance).toFixed(2) }\$ \${ arabic ? ' إضافية.' : ' more.' }</div>
            <div style="display:flex;gap:8px"><button id="closeModal" class="btn btn-outline" style="flex:1">\${ arabic ? 'إغلاق' : 'Close' }</button></div>\`
          }
        \`);

        setTimeout(()=>{
          const c = document.getElementById('confirmPayout');
          const close = document.getElementById('closeModal');
          if(c){
            c.addEventListener('click', debounce(()=> {
              closeModal();
              openModal(\`<div style="font-weight:700">\${ arabic ? 'تم الإرسال' : 'Request sent' }</div><div class="muted" style="margin-top:8px">\${ arabic ? 'استلمنا طلب سحبك. سنراسل الإيميل الخاص بك حال المعالجة.' : 'We received your payout request. We will email you once processed.' }</div><div style="margin-top:12px"><button id="ok" class="btn btn-primary">OK</button></div>\`);
              setTimeout(()=>{document.getElementById('ok').addEventListener('click', closeModal)},120);
              balance = 0;
              localStorage.setItem(BALANCE_KEY, String(balance));
              updatePayoutUI();
            },1000));
          }
          if(close) close.addEventListener('click', closeModal);
        },60);
      }, 800));

      // Save & Create Link
      saveBtn.addEventListener('click', debounce(async ()=>{
        setButtonLoading(saveBtn, true);
        try {
          const name = inputName.value.trim();
          const email = inputEmail.value.trim();
          const whats = inputWhats.value.trim();
          if(!name || !validateEmail(email)){
            alert( arabic ? 'الاسم والايميل مطلوبان' : 'Name and valid email are required' );
            return;
          }
          await sleep(700);
          const key = Math.random().toString(36).slice(2,9);
          const link = location.origin + '/r/' + encodeURIComponent(key);
          user = { name, email, whats, link, registered: true, createdAt: Date.now() };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          if(!localStorage.getItem(BALANCE_KEY)) {
            balance = 12.5;
            localStorage.setItem(BALANCE_KEY, String(balance));
          }
          renderUser();
          updatePayoutUI();
          linkPreview.textContent = link;
          try { await navigator.clipboard.writeText(link); showToast(arabic ? 'تم نسخ الرابط' : 'Link copied to clipboard'); } catch(e){}
        } finally {
          setButtonLoading(saveBtn, false);
        }
      }, 900));

      // Clear stored user
      clearBtn.addEventListener('click', debounce(()=> {
        if(!confirm(arabic ? 'هل تريد مسح البيانات المحفوظة؟' : 'Clear saved data?')) return;
        user = null;
        localStorage.removeItem(STORAGE_KEY);
        renderUser();
        linkPreview.textContent = '—';
        updatePayoutUI();
      },700));

      // Copy & Share
      copyBtn.addEventListener('click', debounce(()=>{
        const txt = (user && user.link) ? user.link : '';
        if(!txt) return showToast(arabic ? 'لا يوجد رابط' : 'No link available');
        navigator.clipboard.writeText(txt).then(()=> showToast(arabic ? 'تم النسخ' : 'Copied'));
      },400));

      shareBtn.addEventListener('click', debounce(()=>{
        const txt = (user && user.link) ? user.link : '';
        if(!txt) return showToast(arabic ? 'لا يوجد رابط للمشاركة' : 'No link to share');
        if(navigator.share){
          navigator.share({ title: 'My link', text: txt, url: txt }).catch(()=> {});
        } else {
          const w = encodeURIComponent(\`\${arabic ? 'رابط التسجيل' : 'My link'}: \${txt}\`);
          window.open(\`https://wa.me/?text=\${w}\`, '_blank');
        }
      },400));

      // helpers
      function renderUser(){
        if(user && user.registered){
          inputName.value = user.name || '';
          inputEmail.value = user.email || '';
          inputWhats.value = user.whats || '';
          linkPreview.textContent = user.link || '—';
          status.textContent = arabic ? 'مسجل · Registered' : 'Registered · مسجل';
        } else {
          inputName.value = '';
          inputEmail.value = '';
          inputWhats.value = '';
          status.textContent = arabic ? 'غير مسجل · Not registered' : 'Not registered · غير مسجل';
        }
      }

      function updatePayoutUI(){
        if(balance >= 100){
          payoutBtn.disabled = false;
          payoutBtn.classList.remove('btn-muted');
          payoutBtn.classList.add('btn-primary');
          payoutBtn.textContent = arabic ? \`السحب · طلب (\${balance.toFixed(0)}$)\` : \`Payout · Request ($\${balance.toFixed(0)})\`;
        } else {
          payoutBtn.disabled = false;
          payoutBtn.classList.remove('btn-primary');
          payoutBtn.classList.add('btn-muted');
          payoutBtn.textContent = arabic ? \`السحب · \${balance.toFixed(2)}$\` : \`Payout · $\${balance.toFixed(2)}\`;
        }
      }

      function loadUser(){
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          return raw ? JSON.parse(raw) : null;
        } catch(e){ return null; }
      }

      function validateEmail(e){
        return /\\S+@\\S+\\.\\S+/.test(e);
      }

      function sleep(ms){ return new Promise(r=>setTimeout(r, ms)); }

      function debounce(fn, wait=600){
        let t;
        return function(...a){
          if(t) return;
          t = setTimeout(()=> t = null, wait);
          try{ return fn.apply(this, a); } catch(e){ t=null; throw e; }
        }
      }

      function setButtonLoading(btn, loading){
        if(loading){
          btn.disabled = true;
          btn.dataset.orig = btn.textContent;
          btn.textContent = arabic ? 'جاري المعالجة...' : 'Processing...';
          btn.style.opacity = '0.8';
        } else {
          btn.disabled = false;
          if(btn.dataset.orig) btn.textContent = btn.dataset.orig;
          btn.style.opacity = '1';
        }
      }

      function openModal(html){
        modalRoot.style.display = 'block';
        modalRoot.innerHTML = '<div class="modal-backdrop" id="mbd"><div class="modal" role="dialog" aria-modal="true">' + html + '</div></div>';
        document.getElementById('mbd').addEventListener('click', (e)=> { if(e.target.id === 'mbd') closeModal(); });
      }
      function closeModal(){ modalRoot.innerHTML=''; modalRoot.style.display='none'; }

      function showToast(msg){
        const t = document.createElement('div');
        t.textContent = msg;
        Object.assign(t.style,{position:'fixed',right:'20px',bottom:'20px',background:'rgba(6,42,103,0.95)',color:'#fff',padding:'10px 14px',borderRadius:'10px',zIndex:1000});
        document.body.appendChild(t);
        setTimeout(()=> t.style.opacity='0.01',2000);
        setTimeout(()=> t.remove(),2600);
      }

      function buildContactBody(){
        let body = '';
        if(user && user.email) body += \`User: \${user.name} (\${user.email})%0D%0A\`;
        else if(inputEmail.value) body += \`User: \${inputName.value || ''} (\${inputEmail.value})%0D%0A\`;
        if(inputWhats.value) body += \`WhatsApp: \${inputWhats.value}%0D%0A\`;
        body += '%0D%0AMessage:%0D%0A';
        return body;
      }

      document.addEventListener('click', (e)=>{
        const btn = e.target.closest('button');
        if(!btn) return;
        if(btn.disabled) e.preventDefault();
      }, true);

    })();
  </script>
</body>
</html>
`;

export default function Page() {
  return React.createElement('div', { dangerouslySetInnerHTML: { __html: html } });
}
