<!-- File: /landing/genio-ai-studio/index.html -->
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>genio ai studio — توين ذكي ينجز شغلك</title>
  <meta name="description" content="genio ai studio: أنشئ توين AI بصوتك وأسلوبك لينفّذ مهامك: رسائل واتساب، إيميلات، بوستات سوشال، تقارير... بكبسة زر." />
  <style>
    :root{
      --bg:#0b0f14; --card:#0f1620; --muted:#a9b4c2; --text:#e9eef5; --brand:#5ee1a1; --brand-2:#6fc3ff; --danger:#ff6b6b;
      --radius:14px; --radius-sm:10px; --shadow:0 10px 30px rgba(0,0,0,.35);
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0; font:16px/1.6 system-ui,-apple-system,Segoe UI,Roboto,"Noto Sans Arabic",Tahoma,Arial;
      color:var(--text); background:radial-gradient(1200px 600px at 80% -10%, #142132 0%, #0b0f14 60%);
      -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
    }
    a{color:inherit; text-decoration:none}
    .container{width:min(1200px,92%); margin-inline:auto}

    /* Header */
    header{
      position:sticky; top:0; z-index:50; backdrop-filter:saturate(140%) blur(10px);
      background:color-mix(in oklab, #0b0f14 85%, #0b0f14 0%); transition:box-shadow .2s ease, background .2s ease;
    }
    header.scrolled{box-shadow:0 6px 18px rgba(0,0,0,.35); background:#0b0f14e6}
    .nav{display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 0}
    .brand{display:flex; align-items:center; gap:12px; font-weight:700; letter-spacing:.4px}
    .brand-badge{
      width:36px; height:36px; border-radius:10px; display:grid; place-items:center;
      background:conic-gradient(from 220deg, var(--brand), var(--brand-2)); box-shadow:var(--shadow);
    }
    .brand-badge svg{filter:drop-shadow(0 4px 10px rgba(0,0,0,.4))}
    nav ul{display:flex; gap:20px; list-style:none; padding:0; margin:0; align-items:center}
    nav a{padding:10px 12px; border-radius:10px; color:var(--muted)}
    nav a:hover, nav a:focus-visible{outline:none; background:#101826; color:var(--text)}
    .nav-cta{display:flex; gap:10px; align-items:center}
    .btn{
      display:inline-flex; align-items:center; justify-content:center; gap:10px; padding:10px 14px; border-radius:12px; border:1px solid #233043;
      background:#111a27; color:var(--text); cursor:pointer; transition:transform .08s ease, background .2s ease, border-color .2s ease;
    }
    .btn:hover{transform:translateY(-1px); background:#132035; border-color:#2b3b53}
    .btn-primary{background:linear-gradient(135deg,var(--brand),var(--brand-2)); border:none; color:#071018; font-weight:700}
    .btn-primary:hover{filter:saturate(110%) brightness(1.04)}
    .menu-toggle{display:none; background:transparent; border:1px solid #233043; border-radius:10px; padding:10px}
    .menu-toggle svg{display:block}

    /* Mobile nav */
    @media (max-width: 940px){
      nav ul{display:none}
      nav.open ul{
        display:flex; position:absolute; inset-inline:4%; top:64px; flex-direction:column; gap:8px; padding:10px;
        background:#0f1620; border:1px solid #1f2a3a; border-radius:14px; box-shadow:var(--shadow)
      }
      .menu-toggle{display:inline-flex}
      .nav-cta{margin-inline-start:auto}
    }

    /* Hero */
    .hero{
      position:relative; padding:72px 0 38px; overflow:hidden;
      display:grid; grid-template-columns:1.2fr .8fr; gap:28px; align-items:center;
    }
    @media (max-width: 940px){ .hero{grid-template-columns:1fr; padding-top:38px} }
    .kicker{color:var(--brand-2); font-weight:700; letter-spacing:.6px; font-size:.95rem}
    .hero h1{
      margin:8px 0 10px; font-size:clamp(28px, 4.8vw, 50px); line-height:1.15;
      background:linear-gradient(180deg, #e9eef5 0%, #bcd2ff 100%); -webkit-background-clip:text; background-clip:text; color:transparent;
    }
    .hero p{color:var(--muted); margin:0 0 18px}
    .points{display:flex; flex-wrap:wrap; gap:8px; margin:14px 0 18px}
    .chip{font-size:.92rem; color:#b7c4d4; padding:8px 12px; border-radius:999px; border:1px dashed #2a3950; background:#0e1724}
    .form{display:flex; gap:10px; flex-wrap:wrap; align-items:center; background:#0f1620; border:1px solid #1f2a3a; border-radius:14px; padding:10px}
    .input{flex:1; min-width:200px; padding:12px 14px; border-radius:10px; border:1px solid #1f2a3a; background:#0b0f14; color:var(--text)}
    .hero-visual{
      position:relative; aspect-ratio:1/1; min-height:340px; border-radius:20px; background:radial-gradient(120px 100px at 65% 30%, #1b2a40 0%, transparent 60%);
      display:grid; place-items:center; isolation:isolate;
    }
    .blob{
      position:absolute; inset:auto; width:560px; height:560px; border-radius:50%;
      background:radial-gradient(circle at 30% 30%, var(--brand), transparent 60%),
                  radial-gradient(circle at 70% 70%, var(--brand-2), transparent 60%);
      filter:blur(40px) saturate(140%); opacity:.35; animation:float 9s ease-in-out infinite alternate; z-index:0;
    }
    @keyframes float{from{transform:translate(10px,0) scale(1)} to{transform:translate(-10px,-20px) scale(1.05)}}
    .twin{position:relative; z-index:1; width:min(420px,86%); filter:drop-shadow(0 10px 30px rgba(0,0,0,.45))}
    .hero-badges{position:absolute; bottom:10px; inset-inline:10px; display:flex; gap:10px; flex-wrap:wrap; justify-content:center}
    .hero-badges .tag{background:#0f1726; border:1px solid #22324a; padding:6px 10px; border-radius:999px; font-size:.85rem; color:#b7c4d4}

    /* Generic sections */
    section{padding:64px 0}
    .card{background:linear-gradient(180deg,#0e1622,#0b1017); border:1px solid #1a283c; border-radius:var(--radius); padding:20px; box-shadow:var(--shadow)}
    .grid{display:grid; gap:16px; grid-template-columns:repeat(3,1fr)}
    @media (max-width: 900px){ .grid{grid-template-columns:1fr} }

    /* HOW IT WORKS */
    #how .steps{display:grid; gap:16px; grid-template-columns:repeat(3,1fr); align-items:stretch}
    @media (max-width: 900px){ #how .steps{grid-template-columns:1fr} }
    .step{
      position:relative; background:linear-gradient(180deg,#0e1623,#0b1118); border:1px solid #1b2940;
      border-radius:16px; padding:18px; box-shadow:var(--shadow); overflow:hidden;
    }
    .step h3{margin:8px 0 6px; font-size:1.15rem}
    .step p{margin:0; color:#b5c2d2}
    .step .num{position:absolute; top:12px; inset-inline-start:12px; width:28px; height:28px; border-radius:999px; background:#0c1522; border:1px solid #22324a;
      display:grid; place-items:center; font-weight:700; color:#a9c8ff; font-size:.9rem}
    .step .cta{margin-top:12px}
    .step-icon{width:36px; height:36px}

    /* Footer/sep */
    footer{padding:40px 0 60px; color:#7e8b9c}
    .sep{height:1px; background:#1a2434; margin:24px 0}
    .visually-hidden{position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap}
  </style>
</head>
<body>
  <!-- Header -->
  <header id="hdr" aria-label="رأس الصفحة">
    <div class="container nav">
      <a href="#home" class="brand" aria-label="الانتقال إلى البداية">
        <span class="brand-badge" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#071018" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12h2m2-3v6m3-9v12m3-7v2m3-9v22M21 12h0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </span>
        <span>genio ai studio</span>
      </a>

      <nav id="nav" aria-label="التنقل الرئيسي">
        <button class="menu-toggle btn" aria-expanded="false" aria-controls="menu" id="menuBtn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#a9b4c2" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <span class="visually-hidden">قائمة</span>
        </button>
        <ul id="menu" role="menubar">
          <li role="none"><a role="menuitem" href="#home">Home</a></li>
          <li role="none"><a role="menuitem" href="#how">كيف يعمل؟</a></li>
          <li role="none"><a role="menuitem" href="#support">Support</a></li>
          <li role="none"><a role="menuitem" href="#chat">Chat</a></li>
          <li role="none"><a role="menuitem" href="#about">About</a></li>
        </ul>
      </nav>

      <div class="nav-cta">
        <a class="btn" href="#login" aria-label="تسجيل الدخول">Login</a>
        <a class="btn btn-primary" href="#signup" aria-label="إنشاء حساب">Signup</a>
      </div>
    </div>
  </header>

  <!-- Hero -->
  <main id="home" class="container hero" aria-label="القسم التعريفي">
    <div>
      <div class="kicker">توينك الذكي، على أسلوبك وصوتك</div>
      <h1>كبسة زر — والتوين <span aria-hidden="true">يفتح واتساب</span>، يكتب إيميل، وينشر بوستات عنك</h1>
      <p>صمّم توين AI يشتغل بدلِك: يرد، ي schedul-e، يرسل، ويحلّل. أنت تعطي الهدف، وهو ينفّذ بطريقة تشبهك.</p>

      <div class="points" aria-label="قدرات سريعة">
        <span class="chip">رسائل واتساب</span>
        <span class="chip">إيميلات احترافية</span>
        <span class="chip">بوستات سوشال</span>
        <span class="chip">تقارير ومتابعة</span>
        <span class="chip">أوامر صوتية</span>
      </div>

      <form class="form" onsubmit="event.preventDefault()" aria-label="إنشاء توين">
        <input class="input" name="twin_name" placeholder="اختر اسم للتوين… مثال: سامر بوت" aria-label="اسم التوين" />
        <button class="btn btn-primary" type="submit">جرّب التوين الآن</button>
        <button class="btn" type="button" onclick="alert('ديمو واجهة فقط')">مشاهدة ديمو</button>
      </form>
    </div>

    <figure class="hero-visual" aria-label="صورة توضيحية للتوين">
      <div class="blob" aria-hidden="true"></div>
      <svg class="twin" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="توأم ذكاء اصطناعي">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#6fc3ff" /><stop offset="1" stop-color="#5ee1a1"/>
          </linearGradient>
          <radialGradient id="g2" cx="50%" cy="10%" r="80%"><stop offset="0" stop-color="#1a2a42"/><stop offset="1" stop-color="#0d1420"/></radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <rect x="0" y="0" width="480" height="480" rx="26" fill="url(#g2)"/>
        <circle cx="240" cy="164" r="74" fill="#0f1726" stroke="url(#g1)" stroke-width="3"/>
        <ellipse cx="218" cy="160" rx="10" ry="12" fill="#9fd1ff"/><ellipse cx="262" cy="160" rx="10" ry="12" fill="#9fd1ff"/>
        <path d="M210 188q30 22 60 0" stroke="url(#g1)" stroke-width="4" fill="none" stroke-linecap="round"/>
        <rect x="168" y="230" width="144" height="150" rx="20" fill="#0f1726" stroke="#233043" />
        <path d="M350 160 q20 20 0 40" stroke="url(#g1)" stroke-width="4" fill="none" filter="url(#glow)"/>
        <path d="M360 150 q32 36 0 72" stroke="url(#g1)" stroke-width="3" fill="none" opacity=".7"/>
        <path d="M370 140 q44 52 0 104" stroke="url(#g1)" stroke-width="2" fill="none" opacity=".5"/>
      </svg>
      <figcaption class="hero-badges">
        <span class="tag">يشبه نبرة صوتك</span>
        <span class="tag">ينفّذ تلقائياً</span>
        <span class="tag">خصوصية عالية</span>
      </figcaption>
    </figure>
  </main>

  <!-- HOW IT WORKS -->
  <section id="how" class="container" aria-label="كيف يعمل">
    <h2 style="margin-top:0">كيف يعمل؟</h2>
    <p style="margin-top:-6px;color:#b7c4d4">ثلاث خطوات سهلة لتحويل مهامك إلى أتمتة ذكية بأسلوبك.</p>
    <div class="steps" role="list">
      <!-- Step 1 -->
      <article class="step" role="listitem">
        <span class="num" aria-hidden="true">1</span>
        <svg class="step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3l3 3-3 3-3-3 3-3Zm0 6v12M6 12l-3 3 3 3 3-3-3-3Zm12 0l-3 3 3 3 3-3-3-3Z" stroke="url(#g1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>أنشئ التوين</h3>
        <p>سمِّه، حمّل عيّنة صوت، وحدد أسلوب الكتابة (رسمي/ودّي/مختصر).</p>
        <div class="cta">
          <a class="btn" href="#signup">ابدأ الآن</a>
        </div>
      </article>

      <!-- Step 2 -->
      <article class="step" role="listitem">
        <span class="num" aria-hidden="true">2</span>
        <svg class="step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 7h16v10H4zM8 7V5a4 4 0 0 1 8 0v2" stroke="url(#g1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>وصّل قنواتك</h3>
        <p>اربط واتساب، الإيميل، وحسابات السوشال. إدارة صلاحيات وموافقات قبل الإرسال.</p>
        <div class="cta">
          <button class="btn" type="button" onclick="alert('تكاملات تجريبية')">استعراض التكاملات</button>
        </div>
      </article>

      <!-- Step 3 -->
      <article class="step" role="listitem">
        <span class="num" aria-hidden="true">3</span>
        <svg class="step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12h8l2-3 2 6 2-3h4" stroke="url(#g1)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>نفّذ وتابع</h3>
        <p>أعطِ الهدف؛ التوين ينفّذ تلقائياً ويعرض لك تقارير وأثر كل نشاط.</p>
        <div class="cta">
          <a class="btn btn-primary" href="#chat">جرّب مهمة الآن</a>
        </div>
      </article>
    </div>
  </section>

  <!-- Sections -->
  <section id="support" class="container">
    <h2>Support</h2>
    <div class="grid">
      <div class="card">قاعدة معرفة</div>
      <div class="card">مركز المساعدة</div>
      <div class="card">تواصل مباشر</div>
    </div>
  </section>

  <section id="chat" class="container">
    <h2>Chat</h2>
    <div class="card">دردشة مع التوين — API وواجهة جاهزة للدمج.</div>
  </section>

  <section id="about" class="container">
    <h2>About</h2>
    <div class="card">genio ai studio: اصنع توين يعمل مكانك — رسائل، بريد، سوشال، أتمتة مهام.</div>
  </section>

  <div class="container sep" role="separator"></div>
  <footer class="container">
    <div id="login"><strong>Login:</strong> قريباً.</div>
    <div id="signup" style="margin-top:6px"><strong>Signup:</strong> قريباً.</div>
  </footer>

  <script>
    // لماذا: تحسين قابلية الاستخدام على الجوال + مؤثرات بسيطة
    const nav = document.getElementById('nav');
    const btn = document.getElementById('menuBtn');
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });

    // تمرير سلس
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        const id = a.getAttribute('href');
        const el = document.querySelector(id);
        if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); nav.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
      });
    });

    // ظل للهيدر عند التمرير
    const hdr = document.getElementById('hdr');
    const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 6);
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  </script>
</body>
</html>
