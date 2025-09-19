import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const AUTH_KEY = "auth_user";
const DRAFT_KEY = "twin_ob_draft";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [draft, setDraft] = useState({});

  // auth guard + load data
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      if (!u) {
        router.replace("/login"); // why: block access without session
        return;
      }
      setUser(u);
    } catch {}
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      setDraft(d || {});
    } catch {
      setDraft({});
    }
  }, [router]);

  // compute progress
  const status = useMemo(() => {
    const d = draft || {};
    const personalityDone = (d.about || "").trim().length >= 30;
    const voiceDone = (d.voiceSec || 0) >= 60 || !!d.voiceUrl;
    const videoDone = (d.videoSec || 0) >= 20 || !!d.videoUrl;

    const level = personalityDone ? (voiceDone ? (videoDone ? 3 : 2) : 1) : 0;
    const nextPath =
      level === 0 ? "/onboarding/personality" :
      level === 1 ? "/onboarding/voice" :
      "/onboarding/video";

    const pct = Math.round((level / 3) * 100);

    return { personalityDone, voiceDone, videoDone, level, nextPath, pct };
  }, [draft]);

  const handleContinue = () => router.push(status.nextPath);

  const handleDeleteTwin = () => {
    if (!confirm("Delete your Twin draft? This cannot be undone.")) return;
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setDraft({});
  };

  return (
    <>
      <Head>
        <title>Dashboard — genio os</title>
        <meta name="description" content="Manage and train your digital twin." />
      </Head>

      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand"><span className="brand-neon">genio os</span></Link>
          <nav className="links">
            <Link href="/onboarding/personality">Train</Link>
            <Link href="/support">Support</Link>
            <Link href="/logout">Logout</Link>
          </nav>
        </div>
      </header>

      {/* Lab visual */}
      <section className="lab">
        <div className="grid-bg" aria-hidden="true" />
        <div className="holo">
          <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
          <div className="core" />
        </div>
      </section>

      <main className="container">
        {/* Overview */}
        <section className="card hero">
          <div className="top">
            <h1>{status.level === 3 ? "Your twin is ready" : "Keep building your twin"}</h1>
            <p className="sub">
              {status.level === 3
                ? "You can keep training and refining your twin anytime."
                : "Finish the remaining steps to activate your twin."}
            </p>
          </div>

          {/* Progress bar */}
          <div className="progress" role="progressbar" aria-valuenow={status.pct} aria-valuemin="0" aria-valuemax="100">
            <div className="bar" style={{width: `${status.pct}%`}} />
          </div>

          {/* Step badges */}
          <div className="badges">
            <span className={status.personalityDone ? "badge ok" : "badge"}>Personality {status.personalityDone ? "✓" : "•"}</span>
            <span className={status.voiceDone ? "badge ok" : "badge"}>Voice {status.voiceDone ? "✓" : "•"}</span>
            <span className={status.videoDone ? "badge ok" : "badge"}>Video {status.videoDone ? "✓" : "•"}</span>
            <span className="badge secure">Secure</span>
          </div>

          {/* Actions */}
          <div className="actions">
            {status.level < 3 ? (
              <button className="btn btn-neon" onClick={handleContinue}>Continue onboarding</button>
            ) : (
              <>
                <Link className="btn" href="/chat">Start chat</Link>
                <Link className="btn" href="/onboarding/personality">Train more</Link>
              </>
            )}
            <div className="spacer" />
            <button className="btn danger" onClick={handleDeleteTwin}>Delete my Twin</button>
          </div>
        </section>

        {/* Next steps */}
        <section className="card next">
          <h3>Next steps</h3>
          <ul>
            <li>Connect messaging channels (WhatsApp, email).</li>
            <li>Add more examples and refine rules.</li>
            <li>Review tone & style preferences.</li>
          </ul>
        </section>
      </main>

      {/* Styles */}
      <style jsx>{`
        :root{
          --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
        }
        .container{width:min(1100px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}

        /* Header */
        .hdr{position:sticky; top:0; z-index:40; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; border-bottom:1px solid #1b2840}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0}
        .brand-neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 8px rgba(111,195,255,.35),0 0 18px rgba(32,227,178,.22);
          font-weight:800;
        }
        .links a{margin-left:14px}

        /* Lab visual */
        .lab{position:relative; height:220px; display:grid; place-items:center; overflow:hidden; border-block:1px solid #132238; background:#091119}
        .grid-bg{position:absolute; inset:0; background:
          linear-gradient(#0f2138 1px, transparent 1px) 0 0/40px 40px,
          linear-gradient(90deg,#0f2138 1px, transparent 1px) 0 0/40px 40px;
          opacity:.25}
        .holo{position:relative; width:200px; height:200px; border-radius:50%; filter:drop-shadow(0 8px 40px rgba(0,0,0,.6))}
        .ring{position:absolute; inset:0; border:2px solid rgba(140,200,255,.18); border-radius:50%}
        .r2{transform:scale(1.25)} .r3{transform:scale(1.5)}
        .core{position:absolute; top:50%; left:50%; width:70px; height:70px; margin:-35px; border-radius:50%;
          background:radial-gradient(circle at 30% 30%, var(--neon2), transparent 60%), radial-gradient(circle at 70% 70%, var(--neon1), transparent 60%);
          filter:blur(2px) saturate(160%); animation:pulse 3s ease-in-out infinite}
        @keyframes pulse{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.08)}}

        /* Main */
        main{padding:22px 0 56px}
        .card{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:16px; padding:16px; margin-top:14px}

        .hero h1{
          margin:0 0 6px; font-size:clamp(22px,4.8vw,36px);
          background:linear-gradient(180deg, #f4f8ff 0%, #cfe0ff 100%);
          -webkit-background-clip:text; color:transparent
        }
        .sub{color:#c0d0e2; margin:0 0 12px}

        .progress{height:8px; border-radius:8px; background:#0f1828; border:1px solid #223145; overflow:hidden; margin:6px 0 12px}
        .bar{height:100%; background:linear-gradient(135deg, var(--neon1), var(--neon2))}

        .badges{display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px}
        .badge{padding:8px 12px; border-radius:999px; background:#0f1828; border:1px dashed #2a3a56; color:#cfe6ff}
        .badge.ok{border-style:solid; border-color:#254b2f; background:#0f1c14; color:#d6ffe3}
        .badge.secure{border-color:#264235; background:#11241a; color:#c9f5d7}

        .actions{display:flex; gap:10px; align-items:center; flex-wrap:wrap}
        .spacer{flex:1}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.danger{border-color:#4a2130; background:#1a0f14; color:#ffd6df}

        .next h3{margin:0 0 8px}
        .next ul{margin:0; padding-left:18px; color:#c0d0e2}
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
