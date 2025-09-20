// File: pages/onboarding/personality.js
import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const TWIN_DRAFT_KEY = "twin_ob_draft";
const MIN_WORDS = 30;

function safeGet(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function safeSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}
function countWords(s) {
  return (s || "").trim().split(/\s+/).filter(Boolean).length;
}

export default function Personality() {
  const router = useRouter();

  const [desc, setDesc] = useState("");
  const [rules, setRules] = useState("");
  const [likes, setLikes] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [dirty, setDirty] = useState(false);
  const saveTimer = useRef(null);

  // Restore draft
  useEffect(() => {
    const d = safeGet(TWIN_DRAFT_KEY, {});
    if (d.desc ?? d.about) setDesc(d.desc ?? d.about);
    if (d.rules) setRules(d.rules);
    if (d.likes) setLikes(d.likes);
  }, []);

  // Autosave
  useEffect(() => {
    setDirty(true);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      const cur = safeGet(TWIN_DRAFT_KEY, {});
      safeSet(TWIN_DRAFT_KEY, { ...cur, desc, rules, likes, _lastStep: "personality" });
      setSavedAt(new Date());
      setDirty(false);
    }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [desc, rules, likes]);

  // Warn before leave
  useEffect(() => {
    const h = (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const words = useMemo(() => countWords(desc), [desc]);
  const canNext = words >= MIN_WORDS;

  const onBack = () => router.back();
  const onUpgrade = () => { setToast("You can refine and save anytime to upgrade your Twin."); setTimeout(()=>setToast(""), 1800); };
  const onReset = () => { setDesc(""); setRules(""); setLikes(""); setToast("Fields cleared."); setTimeout(()=>setToast(""), 1400); };
  const onDelete = () => {
    if (!confirm("Delete your Twin draft?")) return;
    try { localStorage.removeItem(TWIN_DRAFT_KEY); } catch {}
    setDesc(""); setRules(""); setLikes("");
    setToast("Twin draft deleted.");
    setTimeout(()=>setToast(""), 1400);
  };
  const onSaveNext = () => {
    if (!canNext || busy) return;
    setBusy(true);
    try {
      const cur = safeGet(TWIN_DRAFT_KEY, {});
      safeSet(TWIN_DRAFT_KEY, { ...cur, desc: desc.trim(), rules: rules.trim(), likes: likes.trim(), _lastStep: "personality" });
      setToast("Saved. Moving to Voice…");
      setTimeout(()=>router.push("/onboarding/voice"), 260);
    } finally { setBusy(false); }
  };

  return (
    <>
      <Head>
        <title>Describe Yourself — genio os</title>
        <meta name="description" content="Describe yourself so your Twin learns your tone and language." />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand"><span className="brand-neon">genio os</span></Link>
          <nav className="links"><Link href="/chat">Chat</Link></nav>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <div className="card-head">
            <h1>Describe Yourself</h1>
            <p className="sub">Write as you normally talk. This helps your Twin learn your tone and language.</p>
          </div>

          <div className="form">
            <label className="field">
              <div className="label-row">
                <span>Describe yourself <b>*</b></span>
                <small className={canNext ? "ok" : "warn"}>{words}/{MIN_WORDS} words</small>
              </div>
              <textarea
                rows={8}
                value={desc}
                onChange={(e)=>setDesc(e.target.value)}
                placeholder="Who you are, how you speak, typical phrases, what matters to you..."
                required
              />
            </label>

            <div className="grid">
              <label className="field">
                <span>Rules for your Twin</span>
                <textarea
                  rows={6}
                  value={rules}
                  onChange={(e)=>setRules(e.target.value)}
                  placeholder="Boundaries your Twin must follow (privacy, topics to avoid, approvals, etc.)"
                />
              </label>

              <label className="field">
                <span>What I like</span>
                <textarea
                  rows={6}
                  value={likes}
                  onChange={(e)=>setLikes(e.target.value)}
                  placeholder="Preferred tone, phrases, do's, topics to prioritize, favorite sign-offs..."
                />
              </label>
            </div>

            <div className="meta" role="status" aria-live="polite">
              <span>{savedAt ? `Saved · ${savedAt.toLocaleTimeString()}` : "Autosave on"}</span>
              {toast && <span className="note">{toast}</span>}
            </div>
          </div>

          {/* Sticky action bar */}
          <div className="actions">
            <button type="button" className="btn outline" onClick={onBack}>Go Back</button>
            <button type="button" className="btn neon" disabled={!canNext || busy} onClick={onSaveNext}>
              {busy ? "Saving…" : "Save & Continue — Voice"}
            </button>
          </div>

          {/* Secondary actions */}
          <div className="manage">
            <button type="button" className="btn outline" onClick={onUpgrade}>Upgrade my Twin</button>
            <button type="button" className="btn outline" onClick={onReset}>Reset</button>
            <button type="button" className="btn danger" onClick={onDelete}>Delete my Twin</button>
          </div>
        </section>
      </main>

      <style jsx>{`
        :root{
          --bg:#0a1018; --card:#0f1725; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
          --stroke:#223145; --stroke-soft:#20304a;
        }
        .container{width:min(860px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}

        .hdr{position:sticky; top:0; z-index:50; backdrop-filter:saturate(150%) blur(10px); background:#0b111add; border-bottom:1px solid #1b2840}
        .nav{display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0}
        .brand-neon{
          background:linear-gradient(135deg, var(--neon1), var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 8px rgba(111,195,255,.35),0 0 18px rgba(32,227,178,.22);
          font-weight:800;
        }
        .links{display:flex; gap:10px; align-items:center}

        main{padding:24px 0 56px}
        .card{border:1px solid var(--stroke-soft); background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:16px; padding:16px; position:relative}
        .card-head h1{
          margin:0 0 6px; font-size:clamp(24px,5vw,36px);
          background:linear-gradient(180deg,#f4f8ff 0%, #cfe0ff 100%);
          -webkit-background-clip:text; color:transparent;
        }
        .sub{color:#c0d0e2; margin:0 0 12px}

        .form{display:flex; flex-direction:column; gap:12px}
        .field{display:flex; flex-direction:column; gap:6px}
        .label-row{display:flex; align-items:center; justify-content:space-between; gap:8px}
        .ok{color:#98ffc7; font-weight:700; font-size:12px}
        .warn{color:#ffd8a8; font-weight:700; font-size:12px}
        textarea{
          background:#0f1828; color:#edf3ff; border:1px solid var(--stroke); border-radius:12px; padding:10px 12px;
          resize:vertical; min-height:110px;
        }
        textarea:focus{outline:none; border-color:#2b86c8; box-shadow:0 0 0 3px rgba(111,195,255,.12)}

        .grid{display:grid; grid-template-columns:1fr 1fr; gap:12px}
        @media (max-width:720px){ .grid{grid-template-columns:1fr} }

        .meta{display:flex; gap:12px; align-items:center; color:#9fb5d1; font-size:12px; margin-top:4px}
        .note{color:#d7f5ff}

        .actions{
          display:flex; align-items:center; justify-content:space-between; gap:10px;
          position:sticky; bottom:0; padding-top:12px; margin-top:8px;
          background:linear-gradient(180deg, transparent, rgba(12,18,30,.92));
        }
        .manage{display:flex; gap:10px; flex-wrap:wrap; margin-top:12px}

        .btn{
          display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer;
          padding:10px 14px; font-weight:700; border:1px solid var(--stroke); background:#0f1828; color:var(--text);
        }
        .btn.neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.outline{background:#0f1828; border:1px solid var(--stroke)}  /* no dashed */
        .btn.danger{border-color:#4a2130; background:#1a0f14; color:#ffd6df}
        .btn[disabled]{opacity:.6; cursor:not-allowed}
        @media (max-width:480px){
          .actions .btn{flex:1}
        }
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
