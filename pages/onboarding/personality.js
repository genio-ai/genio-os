// File: pages/onboarding/personality.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const DRAFT_KEY = "twin_ob_draft";

export default function Personality() {
  const router = useRouter();
  const [about, setAbout] = useState("");
  const [rules, setRules] = useState("");
  const [likes, setLikes] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(""); // why: small inline toast (Upgrade/Reset)

  // load previous draft
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      if (d.about) setAbout(d.about);
      if (d.rules) setRules(d.rules);
      if (d.likes) setLikes(d.likes);
    } catch {}
  }, []);

  // autosave (debounced)
  useEffect(() => {
    const h = setTimeout(() => {
      try {
        const cur = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ ...cur, about, rules, likes })
        );
        setSavedAt(new Date());
      } catch {}
    }, 500);
    return () => clearTimeout(h);
  }, [about, rules, likes]);

  const canContinue = useMemo(
    () => about.trim().length >= 30, // minimal bio to proceed
    [about]
  );

  const saveAndNext = async () => {
    if (!canContinue || busy) return;
    setBusy(true);
    try {
      const cur = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          ...cur,
          about: about.trim(),
          rules: rules.trim(),
          likes: likes.trim(),
        })
      );
      router.push("/onboarding/voice");
    } finally {
      setBusy(false);
    }
  };

  const doUpgrade = () => {
    setNote("You can upgrade your Twin anytime — just edit these fields and save.");
    setTimeout(() => setNote(""), 2200);
  };

  const doReset = () => {
    setAbout("");
    setRules("");
    setLikes("");
    setNote("Cleared fields. Draft kept until you save.");
    setTimeout(() => setNote(""), 1800);
  };

  const doDelete = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setAbout(""); setRules(""); setLikes("");
    setNote("Twin draft deleted.");
    setTimeout(() => setNote(""), 1800);
  };

  return (
    <>
      <Head>
        <title>AI Lab — Create your Twin (Step 1)</title>
        <meta name="description" content="Write a short note about yourself so your Twin learns your tone and language." />
      </Head>

      {/* Header */}
      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="genio os">
            <span className="brand-neon">genio os</span>
          </Link>
          <div className="stepper" aria-label="Progress">
            <span className="dot on" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </header>

      {/* Lab stage */}
      <section className="lab">
        <div className="grid-bg" aria-hidden="true" />
        <div className="holo">
          <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
          <div className="core" />
          <div className="dots">
            {Array.from({length:12}).map((_,i)=>(<span key={i} style={{transform:`rotate(${i*30}deg) translateY(-72px)`}} />))}
          </div>
        </div>
      </section>

      {/* Form card */}
      <main className="container">
        <section className="card form">
          <h1>Welcome to your AI Lab — Create your Twin</h1>
          <p className="sub">
            Write a short note about yourself — this helps your Twin learn your tone and language.
          </p>

          <div className="grid">
            <label className="field">
              <div className="label">About me</div>
              <textarea
                rows={7}
                value={about}
                maxLength={4000}
                onChange={(e)=>setAbout(e.target.value)}
                placeholder="Write as you normally talk. Who you are, how you speak, typical phrases…"
              />
            </label>

            <label className="field">
              <div className="label">Rules for your Twin</div>
              <textarea
                rows={5}
                value={rules}
                maxLength={2000}
                onChange={(e)=>setRules(e.target.value)}
                placeholder="What must your Twin avoid? (private info, promises, dates, opinions…)"
              />
            </label>

            <label className="field">
              <div className="label">What I like</div>
              <textarea
                rows={4}
                value={likes}
                maxLength={1500}
                onChange={(e)=>setLikes(e.target.value)}
                placeholder="Preferred tone, do's, topics to prioritize, favorite sign-offs…"
              />
            </label>
          </div>

          <div className="meta">
            <span>Saved {savedAt ? `· ${savedAt.toLocaleTimeString()}` : "· autosave on"}</span>
            {note && <span className="note">{note}</span>}
          </div>

          <div className="actions">
            <button className="btn ghost" type="button" onClick={doUpgrade}>Upgrade my Twin</button>
            <button className="btn ghost" type="button" onClick={doReset}>Reset</button>
            <button className="btn danger" type="button" onClick={doDelete}>Delete my Twin</button>
            <div className="spacer" />
            <button className="btn btn-neon" type="button" disabled={!canContinue || busy} onClick={saveAndNext}>
              {busy ? "Saving…" : "Save & Continue — Voice"}
            </button>
          </div>
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
        .stepper{display:flex; gap:8px; align-items:center}
        .dot{width:8px; height:8px; border-radius:50%; background:#263a59; opacity:.5}
        .dot.on{opacity:1; background:linear-gradient(135deg, var(--neon1), var(--neon2))}

        /* Lab stage */
        .lab{position:relative; height:300px; display:grid; place-items:center; overflow:hidden; border-block:1px solid #132238; background:#091119}
        .grid-bg{position:absolute; inset:0; background:
          linear-gradient(#0f2138 1px, transparent 1px) 0 0/40px 40px,
          linear-gradient(90deg,#0f2138 1px, transparent 1px) 0 0/40px 40px;
          opacity:.25}
        .holo{position:relative; width:240px; height:240px; border-radius:50%; filter:drop-shadow(0 8px 40px rgba(0,0,0,.6))}
        .ring{position:absolute; inset:0; border:2px solid rgba(140,200,255,.18); border-radius:50%}
        .r1{transform:scale(1)}
        .r2{transform:scale(1.25)}
        .r3{transform:scale(1.5)}
        .core{position:absolute; top:50%; left:50%; width:84px; height:84px; margin:-42px; border-radius:50%;
          background:radial-gradient(circle at 30% 30%, var(--neon2), transparent 60%), radial-gradient(circle at 70% 70%, var(--neon1), transparent 60%);
          filter:blur(2px) saturate(160%); animation:pulse 3s ease-in-out infinite}
        .dots{position:absolute; top:50%; left:50%; width:0; height:0}
        .dots span{position:absolute; top:-6px; left:-6px; width:6px; height:6px; border-radius:50%; background:#cfe6ff44; box-shadow:0 0 8px #6fc3ff55}
        @keyframes pulse{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.08)}}

        /* Form card */
        main{padding:22px 0 56px}
        .card{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:16px; padding:16px}
        .form h1{
          margin:0 0 6px; font-size:clamp(22px,4.8vw,36px);
          background:linear-gradient(180deg, #f4f8ff 0%, #cfe0ff 100%);
          -webkit-background-clip:text; color:transparent;
        }
        .sub{color:#c0d0e2; margin:0 0 14px}

        .grid{display:grid; grid-template-columns:1fr; gap:12px}
        @media (min-width:860px){ .grid{grid-template-columns:1fr 1fr} .grid .field:first-child{grid-column:1 / -1} }

        .field{display:flex; flex-direction:column; gap:6px}
        .label{font-weight:700; color:#cfe0ff}
        textarea{
          resize:vertical; min-height:120px; background:#0f1828; color:#edf3ff;
          border:1px solid #223145; border-radius:12px; padding:10px 12px; outline:none;
        }
        textarea:focus{border-color:#2b86c8; box-shadow:0 0 0 3px rgba(111,195,255,.12)}

        .meta{display:flex; gap:12px; align-items:center; color:#9fb5d1; font-size:12px; margin-top:6px}
        .note{color:#d7f5ff}

        .actions{display:flex; gap:8px; align-items:center; margin-top:14px; flex-wrap:wrap}
        .spacer{flex:1}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.ghost{background:#0f1828; border-style:dashed}
        .btn.danger{border-color:#4a2130; background:#1a0f14; color:#ffd6df}
        .btn[disabled]{opacity:.6; cursor:not-allowed}
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
