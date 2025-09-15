// pages/_app.js — Global styles for all pages (index + dashboard)
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Genio KYC OS</title>
      </Head>
      <Component {...pageProps} />

      {/* GLOBAL STYLES (moved from index.js to apply everywhere) */}
      <style jsx global>{`
        :root{
          --bg:#08162e; --text:#e6f0ff; --muted:#cdd8ef;
          --border:rgba(255,255,255,.12); --ring:#38bdf8;
          --cta:linear-gradient(90deg,#2AF598,#009EFD);
          --cta-pressed:linear-gradient(90deg,#25e086,#0b8ee6);
          --grad-hero:linear-gradient(135deg,#0b2a59 0%, #2c2a72 60%, #6e2b8f 100%);
          --grad-blue:linear-gradient(135deg,#1d4ed8,#0ea5e9);
          --grad-green:linear-gradient(135deg,#16a34a,#22c55e);
          --grad-violet:linear-gradient(135deg,#9333ea,#22d3ee);
          --grad-warm:linear-gradient(135deg,#f43f5e,#f59e0b);
          --grad-mix:linear-gradient(135deg, rgba(45,212,191,.10), rgba(147,51,234,.10));
        }

        *{box-sizing:border-box}
        html,body{margin:0;padding:0}
        body{
          background:var(--bg);
          color:var(--text);
          font-family:-apple-system, Segoe UI, Roboto, Arial, sans-serif;
        }

        /* Make all links use the site color (no purple) */
        a, .link { color: rgba(255,255,255,.92); text-decoration:none; }
        a:hover, .link:hover { text-decoration:underline; opacity:.9; }

        .container{max-width:1120px;margin:0 auto;padding:32px 16px}
        .page{min-height:100vh}
        .row{display:flex;gap:12px;flex-wrap:wrap}
        .section{margin:60px auto 0}

        .h1{font-size:44px;line-height:1.08;margin:0 0 12px;font-weight:900}
        .h2{font-size:26px;line-height:1.2;margin:0 0 12px;font-weight:900}
        .h3{font-size:18px;margin:0 0 6px;font-weight:900}
        .muted{color:var(--muted);opacity:.95;line-height:1.65;margin:0 0 16px}

        /* Header / Nav (shared) */
        .site-header{position:sticky;top:0;z-index:60;background:rgba(8,22,46,.85);backdrop-filter:blur(6px);border-bottom:1px solid var(--border)}
        .nav{display:flex;align-items:center;justify-content:space-between;max-width:1120px;margin:0 auto;padding:14px 16px}
        .brand{display:flex;align-items:baseline;gap:8px;text-decoration:none;color:inherit}
        .brand-main{font-weight:900;font-size:20px}
        .brand-sub{font-weight:700;font-size:16px;opacity:.9}

        .nav-links{display:none;align-items:center;gap:22px;list-style:none;margin:0;padding:0}

        .hamburger{display:inline-block;background:transparent;border:0;padding:8px;border-radius:8px;cursor:pointer}
        .hamburger span{display:block;width:22px;height:2px;background:#cfd9ef;margin:4px 0;border-radius:2px}
        .login-mobile{display:inline-block;margin-left:auto;margin-right:8px}

        /* Mobile overlay menu (used on index) */
        .mobile-menu{position:fixed;inset:0;background:rgba(8,22,46,.96);backdrop-filter:blur(6px);z-index:9999}
        .mobile-inner{max-width:1120px;margin:0 auto;padding:20px 16px;display:flex;flex-direction:column;gap:12px}
        .menu-link{color:#e6efff;text-decoration:none;padding:12px 4px;border-bottom:1px solid rgba(255,255,255,.08)}
        .menu-cta{margin-top:6px;align-self:flex-start}

        /* Buttons */
        .btn{display:inline-flex;align-items:center;justify-content:center;font-weight:900;border-radius:12px;padding:12px 16px;text-decoration:none;min-height:44px;transition:filter .15s, transform .06s}
        .btn-primary{background:var(--cta);color:#001219;border:1px solid rgba(255,255,255,.2)}
        .btn-primary:active{transform:translateY(1px);background:var(--cta-pressed)}
        .btn-secondary{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.32)}
        .btn:hover{filter:brightness(1.03)}

        /* Hero */
        .hero{padding-top:10px}
        .hero-card{border-radius:32px;padding:30px 22px;background:var(--grad-hero);border:1px solid var(--border);box-shadow:0 14px 36px rgba(0,0,0,.28)}
        .badges{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
        .badge{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;font-size:12px;font-weight:700;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06)}

        /* Cards */
        .grid{display:grid}
        .gap{gap:18px}
        .card{border-radius:20px;padding:20px;border:1px solid rgba(255,255,255,.14);box-shadow:0 14px 36px rgba(0,0,0,.28)}
        .gradient-blue{background:var(--grad-blue)}
        .gradient-green{background:var(--grad-green)}
        .gradient-violet{background:var(--grad-violet)}
        .gradient-warm{background:var(--grad-warm)}
        .gradient-mix{background:var(--grad-mix)}

        /* Steps */
        .steps{display:grid;gap:18px}
        .step{display:flex;align-items:flex-start;border-radius:20px;padding:20px;border:1px solid var(--border);background:rgba(255,255,255,.03)}
        .step-num{display:inline-flex;min-width:32px;height:32px;align-items:center;justify-content:center;border-radius:9px;font-weight:900;margin-right:10px;color:#0b0f1a}
        .step-green{background:rgba(16,185,129,.85)}
        .step-blue{background:rgba(59,130,246,.85)}
        .step-violet{background:rgba(168,85,247,.85)}

        /* API box */
        .api-box{border-radius:26px;padding:20px;background:linear-gradient(135deg,#0b335a,#0d7a86);border:1px solid var(--border);box-shadow:0 14px 36px rgba(0,0,0,.28)}
        .code{display:block;white-space:pre;overflow-x:auto;margin-top:10px;background:rgba(0,0,0,.35);border-radius:12px;padding:10px 12px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;font-size:13px;color:#dcf1ff}

        /* Support */
        .support-grid{display:grid;gap:20px}
        .list{margin:0 0 14px 18px;line-height:1.8}
        .field{width:100%;background:linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.06));border:1px solid rgba(255,255,255,.32);color:#fff;border-radius:12px;padding:12px 14px;outline:0}
        .field::placeholder{color:#d6e2ff;opacity:.95}
        .field:focus{border-color:#7dd3fc;outline:2px solid #7dd3fc;outline-offset:0}
        .textarea{min-height:140px;resize:vertical}

        /* Footer */
        .footer{margin-top:60px;padding:26px 0;border-top:1px solid var(--border);opacity:.9;font-size:13px;text-align:center}
        .footer-links{display:flex;gap:14px;justify-content:center;margin-bottom:10px;flex-wrap:wrap}

        /* Responsive */
        @media (min-width:900px){
          .nav-links{display:flex}
          .login-mobile, .hamburger{display:none}
        }
        /* Important: hide desktop nav on mobile to avoid overlap */
        @media (max-width:899px){
          .nav-links{display:none !important;}
        }
        @media (min-width:700px){
          .grid{grid-template-columns:repeat(2,1fr)}
        }
        @media (min-width:960px){
          .grid{grid-template-columns:repeat(4,1fr)}
        }
        @media (max-width:360px){
          .container{padding-left:14px;padding-right:14px}
          .h1{font-size:40px}
        }
      `}</style>
    </>
  );
}
