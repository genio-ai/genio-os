// File: pages/dashboard.js
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

const DRAFT_KEY = "twin_ob_draft";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    about: "",
    voiceSec: 0,
    videoSec: 0,
    videoCover: "",
  });

  useEffect(() => {
    // بعد Review من المفترض المسودّة تُمسح، لكن إن وُجدت نعرضها.
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      setSummary({
        about: d.about || "",
        voiceSec: d.voiceSec || 0,
        videoSec: d.videoSec || 0,
        videoCover: d.videoCover || "",
      });
    } catch {}
  }, []);

  const shortAbout =
    summary.about?.trim()?.length
      ? (summary.about.length > 160 ? summary.about.slice(0, 160) + "…" : summary.about)
      : "You can keep training and refining your twin anytime.";

  return (
    <>
      <Head>
        <title>genio os — Dashboard</title>
        <meta name="description" content="Your digital twin is ready. Manage, chat, and keep training it." />
      </Head>

      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="genio os">
            <span className="brand-name brand-neon">genio os</span>
          </Link>
          <nav className="links">
            <Link href="/onboarding/personality">Train</Link>
            <Link href="/support">Support</Link>
          </nav>
        </div>
      </header>

      <main className="container grid">
        <section className="card hero">
          <div className="media">
            {summary.videoCover ? (
              <img src={summary.videoCover} alt="Twin cover" />
            ) : (
              <div className="placeholder" aria-hidden="true">
                <div className="orb" />
              </div>
            )}
          </div>
          <div className="meta">
            <h1>Your twin is ready</h1>
            <p className="muted">{shortAbout}</p>
            <div className="chips">
              <span className="chip">Voice {summary.voiceSec ? `${summary.voiceSec}s` : "✓"}</span>
              <span className="chip">Video {summary.videoSec ? `${summary.videoSec}s` : "✓"}</span>
              <span className="chip ok">Secure</span>
            </div>
            <div className="actions">
              <Link href="/chat" className="btn btn-neon">Start chat</Link>
              <Link href="/settings" className="btn">Manage twin</Link>
              <Link href="/onboarding/personality" className="btn ghost">Train more</Link>
            </div>
          </div>
        </section>

        <section className="card col">
          <h2>Next steps</h2>
          <ul className="todo">
            <li>Connect messaging channels (WhatsApp, email).</li>
            <li>Add example replies and boundaries.</li>
            <li>Review tone & style preferences.</li>
          </ul>
        </section>

        <section className="card col">
          <h2>Safety & privacy</h2>
          <p className="muted">
            Your data stays private. You control what your twin can say and where it can respond.
          </p>
          <div className="actions end">
            <Link href="/support" className="btn">Read policy</Link>
          </div>
        </section>
      </main>

      <style jsx>{`
        :root{
          --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
        }
        .container{width:min(1200px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}

        /* Header */
        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; border-bottom:1px solid #1b2840}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0}
        .brand-name{font-weight:800; letter-spacing:.2px}
        .brand-neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 8px rgba(111,195,255,.35),0 0 18px rgba(32,227,178,.22);
        }
        .links{display:flex; gap:14px}
        .links a{opacity:.9}
        .links a:hover{opacity:1}

        /* Layout */
        main.container.grid{display:grid; grid-template-columns:1.25fr .75fr; gap:22px; padding:22px 0 56px}
        @media (max-width:980px){ main.container.grid{grid-template-columns:1fr} }

        .card{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:14px; padding:16px}
        .hero{display:grid; grid-template-columns:0.9fr 1.1fr; gap:18px; align-items:center}
        @media (max-width:980px){ .hero{grid-template-columns:1fr} }

        .media{position:relative; min-height:220px; display:grid; place-items:center}
        .media img{width:100%; border-radius:12px; border:1px solid #21314a}
        .placeholder{width:100%; height:100%; min-height:260px; border-radius:12px; border:1px solid #21314a; display:grid; place-items:center; background:#0c1421}
        .orb{width:140px; height:140px; border-radius:50%;
          background:radial-gradient(circle at 30% 30%, var(--neon2), transparent 60%),
                     radial-gradient(circle at 70% 70%, var(--neon1), transparent 60%);
          filter:blur(10px) saturate(160%); opacity:.8;
          animation:pulse 3s ease-in-out infinite;
        }
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}

        .meta h1{margin:0 0 6px; font-size:clamp(22px,4vw,30px);
          background:linear-gradient(180deg,#f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;}
        .muted{color:#c0d0e2; font-size:14px}
        .chips{display:flex; gap:8px; flex-wrap:wrap; margin:10px 0}
        .chip{border:1px solid #1f2c44; background:#0f1b2d; color:#cfe6ff; padding:6px 10px; border-radius:999px; font-size:12px}
        .chip.ok{border-color:#1f3e34; background:#0f1f1b}

        .actions{display:flex; gap:10px; flex-wrap:wrap; margin-top:12px}
        .actions.end{justify-content:flex-end}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.ghost{background:#0f1828; border-style:dashed}

        .col h2{margin:0 0 8px; font-size:16px; color:#cfe0ff}
        .todo{margin:6px 0 0; padding-left:18px; color:#c0d0e2}
      `}</style>
      <style jsx global>{`
        body{
          margin:0; font:16px/1.55 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color:#edf3ff; background:radial-gradient(1200px 600px at 80% -10%, #14263d 0%, #0b111a 60%), #0b111a;
        }
      `}</style>
    </>
  );
}
