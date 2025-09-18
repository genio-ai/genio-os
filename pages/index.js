// File: pages/index.js
import { useEffect, useState, useCallback } from "react";
import Head from "next/head";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Header shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll + close mobile menu
  const handleAnchorClick = useCallback((e) => {
    const href = e.currentTarget.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  }, []);

  return (
    <>
      <Head>
        <title>genio ai studio — Your personal AI twin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Build your AI twin that sounds like you and gets work done across WhatsApp, email, and social — with one click."
        />
        {/* Web font for cleaner English UI */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <header id="hdr" className={scrolled ? "scrolled" : ""} aria-label="site header">
        <div className="container nav">
          <a href="#home" className="brand" onClick={handleAnchorClick} aria-label="Go to start">
            <span className="brand-badge" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#071018" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12h2m2-3v6m3-9v12m3-7v2m3-9v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </span>
            <span>genio ai studio</span>
          </a>

          <nav id="nav" aria-label="primary" className={menuOpen ? "open" : ""}>
            <button
              className="menu-toggle btn"
              aria-expanded={menuOpen}
              aria-controls="menu"
              id="menuBtn"
              onClick={() => setMenuOpen((s) => !s)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#a9b4c2" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="visually-hidden">Menu</span>
            </button>
            <ul id="menu" role="menubar">
              <li role="none"><a role="menuitem" href="#home" onClick={handleAnchorClick}>Home</a></li>
              <li role="none"><a role="menuitem" href="#how" onClick={handleAnchorClick}>How it works</a></li>
              <li role="none"><a role="menuitem" href="#support" onClick={handleAnchorClick}>Support</a></li>
              <li role="none"><a role="menuitem" href="#chat" onClick={handleAnchorClick}>Chat</a></li>
              <li role="none"><a role="menuitem" href="#about" onClick={handleAnchorClick}>About</a></li>
            </ul>
          </nav>

          <div className="nav-cta">
            <a className="btn" href="#login" onClick={handleAnchorClick}>Login</a>
            <a className="btn btn-primary" href="#signup" onClick={handleAnchorClick}>Signup</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main id="home" className="container hero" aria-label="hero">
        <div>
          <div className="kicker">Your AI twin, your tone</div>
          <h1>One click — your twin sends WhatsApp, writes email, and posts for you</h1>
          <p>Design an AI twin that answers, schedules, sends, and analyzes — in your voice and style.</p>

          <div className="points" aria-label="capabilities">
            <span className="chip">WhatsApp messages</span>
            <span className="chip">Professional emails</span>
            <span className="chip">Social posts</span>
            <span className="chip">Reports & follow-ups</span>
            <span className="chip">Voice commands</span>
          </div>

          <form className="form" onSubmit={(e)=>e.preventDefault()} aria-label="create twin">
            <input className="input" name="twin_name" placeholder="Give your twin a name… e.g., Samer Bot" aria-label="Twin name" />
            <button className="btn btn-primary" type="submit">Try it now</button>
            <button className="btn" type="button" onClick={()=>alert("Demo only")}>Watch demo</button>
          </form>
        </div>

        <figure className="hero-visual" aria-label="twin illustration">
          <div className="blob" aria-hidden="true" />
          <svg className="twin" viewBox="0 0 480 480" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI twin">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6fc3ff" /><stop offset="1" stopColor="#5ee1a1"/>
              </linearGradient>
              <radialGradient id="g2" cx="50%" cy="10%" r="80%"><stop offset="0" stopColor="#1a2a42"/><stop offset="1" stopColor="#0d1420"/></radialGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <rect x="0" y="0" width="480" height="480" rx="26" fill="url(#g2)"/>
            <circle cx="240" cy="164" r="74" fill="#0f1726" stroke="url(#g1)" strokeWidth="3"/>
            <ellipse cx="218" cy="160" rx="10" ry="12" fill="#9fd1ff"/><ellipse cx="262" cy="160" rx="10" ry="12" fill="#9fd1ff"/>
            <path d="M210 188q30 22 60 0" stroke="url(#g1)" strokeWidth="4" fill="none" strokeLinecap="round"/>
            <rect x="168" y="230" width="144" height="150" rx="20" fill="#0f1726" stroke="#233043" />
            <path d="M350 160 q20 20 0 40" stroke="url(#g1)" strokeWidth="4" fill="none" filter="url(#glow)"/>
            <path d="M360 150 q32 36 0 72" stroke="url(#g1)" strokeWidth="3" fill="none" opacity=".7"/>
            <path d="M370 140 q44 52 0 104" stroke="url(#g1)" strokeWidth="2" fill="none" opacity=".5"/>
          </svg>
          <figcaption className="hero-badges">
            <span className="tag">Your tone</span>
            <span className="tag">Auto actions</span>
            <span className="tag">Private by default</span>
          </figcaption>
        </figure>
      </main>

      {/* HOW IT WORKS */}
      <section id="how" className="container" aria-label="how it works">
        <h2 style={{marginTop:0}}>How it works</h2>
        <p style={{marginTop:-6, color:"#b7c4d4"}}>Three simple steps to automate your day.</p>
        <div className="steps" role="list">
          <article className="step" role="listitem">
            <span className="num" aria-hidden="true">1</span>
            <svg className="step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3l3 3-3 3-3-3 3-3Zm0 6v12M6 12l-3 3 3 3 3-3-3-3Zm12 0l-3 3 3 3 3-3-3-3Z" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Create your twin</h3>
            <p>Name it, add a short voice sample, pick a writing style (formal/casual/brief).</p>
            <div className="cta"><a className="btn" href="#signup" onClick={handleAnchorClick}>Get started</a></div>
          </article>

          <article className="step" role="listitem">
            <span className="num" aria-hidden="true">2</span>
            <svg className="step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16v10H4zM8 7V5a4 4 0 0 1 8 0v2" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Connect channels</h3>
            <p>Link WhatsApp, email, and social. Optional approvals before sending.</p>
            <div className="cta"><button className="btn" type="button" onClick={()=>alert("Integrations preview")}>View integrations</button></div>
          </article>

          <article className="step" role="listitem">
            <span className="num" aria-hidden="true">3</span>
            <svg className="step-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 12h8l2-3 2 6 2-3h4" stroke="url(#g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3>Execute & track</h3>
            <p>Give a goal; your twin completes it and shows clear impact reports.</p>
            <div className="cta"><a className="btn btn-primary" href="#chat" onClick={handleAnchorClick}>Run a task</a></div>
          </article>
        </div>
      </section>

      {/* Remaining sections */}
      <section id="support" className="container">
        <h2>Support</h2>
        <div className="grid">
          <div className="card">Knowledge base</div>
          <div className="card">Help center</div>
          <div className="card">Direct contact</div>
        </div>
      </section>

      <section id="chat" className="container">
        <h2>Chat</h2>
        <div className="card">Chat with your twin — simple API & embeddable UI.</div>
      </section>

      <section id="about" className="container">
        <h2>About</h2>
        <div className="card">genio ai studio: build an AI twin that works like you — messaging, email, socials, automation.</div>
      </section>

      <div className="container sep" role="separator"></div>
      <footer className="container">
        <div id="login"><strong>Login:</strong> coming soon.</div>
        <div id="signup" style={{marginTop:6}}><strong>Signup:</strong> coming soon.</div>
      </footer>

      {/* Global CSS */}
      <style jsx global>{`
        :root{
          --bg:#0b0f14; --card:#0f1620; --muted:#a9b4c2; --text:#e9eef5; --brand:#5ee1a1; --brand-2:#6fc3ff;
          --radius:14px; --shadow:0 10px 30px rgba(0,0,0,.35);
        }
        *{box-sizing:border-box}
        html,body{height:100%}
        body{
          direction: ltr;
          margin:0; font:16px/1.55 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color:var(--text); background:radial-gradient(1200px 600px at 80% -10%, #142132 0%, #0b0f14 60%);
          -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
        }
        a{color:inherit; text-decoration:none}
        .container{width:min(1200px,92%); margin-inline:auto}

        header{
          position:sticky; top:0; z-index:50; backdrop-filter:saturate(140%) blur(10px);
          background:color-mix(in oklab, #0b0f14 85%, #0b0f14 0%); transition:box-shadow .2s ease, background .2s ease;
        }
        header.scrolled{box-shadow:0 6px 18px rgba(0,0,0,.35); background:#0b0f14e6}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:16px; padding:14px 0}
        .brand{display:flex; align-items:center; gap:12px; font-weight:700; letter-spacing:.2px}
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

        @media (max-width: 940px){
          nav ul{display:none}
          nav.open ul{
            display:flex; position:absolute; inset-inline:4%; top:64px; flex-direction:column; gap:8px; padding:10px;
            background:#0f1620; border:1px solid #1f2a3a; border-radius:14px; box-shadow:var(--shadow)
          }
          .menu-toggle{display:inline-flex}
          .nav-cta{margin-inline-start:auto}
        }

        .hero{
          position:relative; padding:72px 0 38px; overflow:hidden;
          display:grid; grid-template-columns:1.2fr .8fr; gap:28px; align-items:center;
        }
        @media (max-width: 940px){ .hero{grid-template-columns:1fr; padding-top:38px} }
        .kicker{color:var(--brand-2); font-weight:700; letter-spacing:.3px; font-size:.95rem}
        .hero h1{
          margin:8px 0 10px; font-size:clamp(28px, 4.6vw, 50px); line-height:1.15;
          background:linear-gradient(180deg, #e9eef5 0%, #bcd2ff 100%); -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .hero p{color:var(--muted); margin:0 0 18px; max-width:52ch}
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

        section{padding:64px 0}
        .card{background:linear-gradient(180deg,#0e1622,#0b1017); border:1px solid #1a283c; border-radius:var(--radius); padding:20px; box-shadow:var(--shadow)}
        .grid{display:grid; gap:16px; grid-template-columns:repeat(3,1fr)}
        @media (max-width: 900px){ .grid{grid-template-columns:1fr} }

        #how .steps{display:grid; gap:16px; grid-template-columns:repeat(3,1fr); align-items:stretch}
        @media (max-width: 900px){ #how .steps{grid-template-columns:1fr} }
        .step{
          position:relative; background:linear-gradient(180deg,#0e1623,#0b1118); border:1px solid #1b2940;
          border-radius:16px; padding:18px; box-shadow:var(--shadow); overflow:hidden;
        }
        .step h3{margin:8px 0 6px; font-size:1.15rem}
        .step p{margin:0; color:#b5c2d2}
        .step .num{position:absolute; top:12px; left:12px; width:28px; height:28px; border-radius:999px; background:#0c1522; border:1px solid #22324a;
          display:grid; place-items:center; font-weight:700; color:#a9c8ff; font-size:.9rem}
        .step .cta{margin-top:12px}
        .step-icon{width:36px; height:36px}

        footer{padding:40px 0 60px; color:#7e8b9c}
        .sep{height:1px; background:#1a2434; margin:24px 0}
        .visually-hidden{position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px,1px,1px,1px);white-space:nowrap}
      `}</style>
    </>
  );
}
