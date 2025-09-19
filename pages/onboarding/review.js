// File: pages/onboarding/review.js
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const DRAFT_KEY = "twin_ob_draft";

export default function Review() {
  const router = useRouter();
  const [draft, setDraft] = useState({});

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      setDraft(d);
    } catch {}
  }, []);

  const createTwin = () => {
    // TODO: send draft to backend API instead of localStorage
    localStorage.removeItem(DRAFT_KEY);
    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>AI Lab — Review</title>
        <meta name="description" content="Step 4 — Review and finalize your digital twin." />
      </Head>

      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="genio os">
            <span className="brand-name brand-neon">genio os</span>
          </Link>
          <div className="stepper" aria-label="Progress">
            <span className="dot on" />
            <span className="dot on" />
            <span className="dot on" />
            <span className="dot on" />
          </div>
        </div>
      </header>

      <main className="container grid">
        <section className="card form">
          <h1>Step 4 — Review</h1>
          <p className="muted">Here’s a quick summary of your twin’s foundation. Make sure everything looks right.</p>

          <div className="summary">
            <h3>Personality</h3>
            <p className="text">{draft.about || <em>No text</em>}</p>

            <h3>Voice</h3>
            {draft.voiceUrl ? <audio controls src={draft.voiceUrl} /> : <em>No audio</em>}
            {draft.voiceSec ? <p className="meta">{draft.voiceSec}s</p> : null}

            <h3>Video</h3>
            {draft.videoUrl ? <video controls src={draft.videoUrl} /> : <em>No video</em>}
            {draft.videoSec ? <p className="meta">{draft.videoSec}s</p> : null}
            {draft.videoCover && <img src={draft.videoCover} alt="Cover frame" className="cover" />}
          </div>

          <div className="actions">
            <Link className="btn ghost" href="/onboarding/video">Back</Link>
            <button className="btn btn-neon" onClick={createTwin}>Create Twin</button>
          </div>
        </section>

        <aside className="card tips">
          <h3>Next</h3>
          <p>Once you hit <strong>Create Twin</strong>, your twin will be generated and ready inside your dashboard.</p>
          <p>Later, you can keep training and improving it.</p>
        </aside>
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
        .stepper{display:flex; gap:8px; align-items:center}
        .dot{width:8px; height:8px; border-radius:50%; background:#263a59; opacity:.5}
        .dot.on{opacity:1; background:linear-gradient(135deg, var(--neon1), var(--neon2))}

        /* Layout */
        main.container.grid{display:grid; grid-template-columns:1.1fr .9fr; gap:22px; padding:22px 0 56px}
        @media (max-width:980px){ main.container.grid{grid-template-columns:1fr} }

        .card{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:14px; padding:16px}
        .form h1{margin:0 0 8px; font-size:clamp(22px,4vw,30px); background:linear-gradient(180deg,#f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent;}
        .muted{color:#c0d0e2; font-size:14px}

        .summary h3{margin:16px 0 6px; font-size:14px; color:#cfe0ff}
        .summary p.text{white-space:pre-wrap; background:#0f1828; padding:10px; border-radius:10px; border:1px solid #223145}
        .summary audio,.summary video{display:block; margin:6px 0; max-width:100%}
        .summary .meta{font-size:12px; color:#9fb5d1; margin:0 0 10px}
        .cover{max-width:240px; display:block; margin:8px 0; border-radius:10px; border:1px solid #223145}

        .actions{display:flex; gap:10px; justify-content:flex-end; margin-top:16px}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.ghost{background:#0f1828; border-style:dashed}

        .tips h3{margin:0 0 8px; font-size:14px; color:#cfe0ff}
        .tips p{color:#c0d0e2; margin:0 0 6px}
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
