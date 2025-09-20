// File: pages/onboarding/personality.js
import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const TWIN_DRAFT_KEY = "twin_ob_draft";
const MIN_WORDS = 30;

const safeGet = (k, f) => {
  try {
    if (typeof window === "undefined") return f;
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : f;
  } catch {
    return f;
  }
};
const safeSet = (k, v) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};
const wordCount = (s) => (s || "").trim().split(/\s+/).filter(Boolean).length;

export default function Personality() {
  const router = useRouter();
  const [desc, setDesc] = useState("");
  const [rules, setRules] = useState("");
  const [likes, setLikes] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState("");
  const [dirty, setDirty] = useState(false);
  const t = useRef(null);

  // Load draft
  useEffect(() => {
    const d = safeGet(TWIN_DRAFT_KEY, {});
    if (d.desc ?? d.about) setDesc(d.desc ?? d.about);
    if (d.rules) setRules(d.rules);
    if (d.likes) setLikes(d.likes);
  }, []);

  // Autosave
  useEffect(() => {
    setDirty(true);
    clearTimeout(t.current);
    t.current = setTimeout(() => {
      const cur = safeGet(TWIN_DRAFT_KEY, {});
      safeSet(TWIN_DRAFT_KEY, {
        ...cur,
        desc,
        rules,
        likes,
        _lastStep: "personality",
      });
      setSavedAt(new Date());
      setDirty(false);
    }, 500);
    return () => clearTimeout(t.current);
  }, [desc, rules, likes]);

  // Warn on leave
  useEffect(() => {
    const h = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const words = useMemo(() => wordCount(desc), [desc]);
  const canNext = words >= MIN_WORDS;

  const goBack = () => router.back();
  const saveNext = () => {
    if (!canNext || busy) return;
    setBusy(true);
    try {
      const cur = safeGet(TWIN_DRAFT_KEY, {});
      safeSet(TWIN_DRAFT_KEY, {
        ...cur,
        desc: desc.trim(),
        rules: rules.trim(),
        likes: likes.trim(),
        _lastStep: "personality",
      });
      setToast("Saved. Moving to Voice…");
      setTimeout(() => router.push("/onboarding/voice"), 260);
    } finally {
      setBusy(false);
    }
  };
  const upgrade = () => {
    setToast("Refine and save anytime to upgrade your Twin.");
    setTimeout(() => setToast(""), 1600);
  };
  const reset = () => {
    setDesc("");
    setRules("");
    setLikes("");
    setToast("Fields cleared.");
    setTimeout(() => setToast(""), 1200);
  };
  const del = () => {
    if (!confirm("Delete your Twin draft? This will remove your current inputs.")) return;
    try {
      localStorage.removeItem(TWIN_DRAFT_KEY);
    } catch {}
    setDesc("");
    setRules("");
    setLikes("");
    setToast("Twin draft deleted.");
    setTimeout(() => setToast(""), 1200);
  };

  return (
    <>
      <Head>
        <title>Describe Yourself — genio os</title>
        <meta
          name="description"
          content="Describe yourself so your Twin learns your tone and language."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Header */}
      <header className="hdr" role="banner">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="genio os home">
            <span className="brand-neon">genio os</span>
          </Link>
          <nav className="links" aria-label="primary">
            <Link href="/chat">Chat</Link>
          </nav>
        </div>
      </header>

      <main className="container main">
        <section className="card" aria-labelledby="title">
          <header className="card-head">
            <h1 id="title">Describe Yourself</h1>
            <p className="sub">
              Write as you normally talk. This helps your Twin learn your tone and language.
            </p>
          </header>

          <div className="form">
            <label className="field">
              <div className="label-row">
                <span>
                  Describe yourself <b>*</b>
                </span>
                <small className={canNext ? "ok" : "warn"}>
                  {words}/{MIN_WORDS} words
                </small>
              </div>
              <textarea
                rows={8}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
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
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="Boundaries your Twin must follow (privacy, topics to avoid, approvals, etc.)"
                />
              </label>

              <label className="field">
                <span>What I like</span>
                <textarea
                  rows={6}
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  placeholder="Preferred tone, phrases, do's, topics to prioritize, favorite sign-offs..."
                />
              </label>
            </div>

            <div className="meta" role="status" aria-live="polite">
              <span>{savedAt ? `Saved · ${savedAt.toLocaleTimeString()}` : "Autosave on"}</span>
              {toast && <span className="note">{toast}</span>}
            </div>
          </div>

          {/* Primary actions */}
          <div className="actions">
            <button type="button" className="btn outline" onClick={goBack}>
              Go Back
            </button>
            <button
              type="button"
              className="btn neon"
              disabled={!canNext || busy}
              onClick={saveNext}
            >
              {busy ? "Saving…" : "Save & Continue — Voice"}
            </button>
          </div>

          {/* Secondary actions */}
          <div className="manage">
            <button type="button" className="btn outline" onClick={upgrade}>
              Upgrade my Twin
            </button>
            <button type="button" className="btn outline" onClick={reset}>
              Reset
            </button>
            <button type="button" className="btn danger" onClick={del}>
              Delete my Twin
            </button>
          </div>
        </section>
      </main>

      <style jsx>{`
        :root{
          --bg:#070d14; --card:#0e1622; --muted:#a7b7c8; --text:#edf3ff;
          --neon1:#20E3B2; --neon2:#6FC3FF; --ink:#071018;
          --stroke:#223145; --stroke-soft:#1e2b3f;
          --shadow: 0 24px 80px rgba(0,0,0,.55);
        }
        .container{width:min(860px,92%); margin-inline:auto}
        a{color:inherit; text-decoration:none}

        /* Header */
        .hdr{
          position:sticky; top:0; z-index:2000;
          background:#0a121c;
          border-bottom:1px solid #1a2640;
          box-shadow:0 10px 28px rgba(0,0,0,.60);
        }
        .nav{display:flex; align-items:center; justify-content:space-between; padding:14px 0}
        .brand{position:relative}
        .brand-neon{
          background:linear-gradient(135deg,var(--neon1),var(--neon2));
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          text-shadow:0 0 10px rgba(111,195,255,.40),0 0 22px rgba(32,227,178,.25);
          font-weight:800
        }
        .brand::after{
          content:""; position:absolute; left:0; right:0; bottom:-6px; height:2px;
          background:linear-gradient(90deg,var(--neon1),var(--neon2));
          opacity:.45; border-radius:2px;
          box-shadow:0 0 12px rgba(111,195,255,.35),0 0 18px rgba(32,227,178,.25);
        }
        .links{display:flex; gap:10px}

        .main{padding:86px 0 70px}

        .card{
          position:relative; overflow:hidden;
          border:1px solid var(--stroke-soft);
          background:linear-gradient(180deg, rgba(17,26,39,.96), rgba(11,18,30,.96));
          border-radius:18px; padding:16px; box-shadow:var(--shadow)
        }
        .card::before{
          content:""; position:absolute; inset:0;
          border-radius:18px; padding:1px;
          background:linear-gradient(135deg, rgba(111,195,255,.28), rgba(32,227,178,.18));
          -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite:xor; mask-composite:exclude;
          pointer-events:none;
        }
        .card-head h1{
          margin:0 0 6px; font-size:clamp(24px,5vw,36px);
          background:linear-gradient(180deg,#f4f8ff,#cfe0ff);
          -webkit-background-clip:text; color:transparent;
          text-shadow:0 0 10px rgba(111,195,255,.20),0 0 22px rgba(32,227,178,.18);
        }
        .sub{color:#c0d0e2; margin:0 0 12px}

        .form{display:flex; flex-direction:column; gap:12px}
        .field{display:flex; flex-direction:column; gap:6px}
        .label-row{display:flex; align-items:center; justify-content:space-between; gap:8px}
        .ok{color:#98ffc7; font-weight:700; font-size:12px}
        .warn{color:#ffd8a8; font-weight:700; font-size:12px}

        textarea{
          background:#0f1828; color:#edf3ff;
          border:1px solid var(--stroke);
          border-radius:12px; padding:12px; resize:vertical; min-height:110px;
          box-shadow:inset 0 1px 0 rgba(255,255,255,.04);
        }
        textarea:focus{
          outline:none; border-color:#58b7ff;
          box-shadow:0 0 0 3px rgba(111,195,255,.10),
                     0 0 0 1px rgba(111,195,255,.20) inset;
        }

        .grid{display:grid; grid-template-columns:1fr 1fr; gap:12px}
        @media (max-width:720px){ .grid{grid-template-columns:1fr} }

        .meta{display:flex; gap:12px; align-items:center; color:#9fb5d1; font-size:12px; margin-top:6px}
        .note{color:#d7f5ff}

        .actions{display:flex; justify-content:space-between; gap:12px; margin-top:14px; padding-top:12px; border-top:1px solid #1a2942; margin-bottom:6px}
        .manage{display:flex; gap:10px; flex-wrap:wrap; margin-top:14px; padding-bottom:calc(env(safe-area-inset-bottom) + 28px)}

        .btn{
          display:inline-flex; align-items:center; justify-content:center;
          border-radius:12px; cursor:pointer; padding:12px 16px; font-weight:700;
          border:1px solid var(--stroke); background:#0f1828; color:var(--text);
          transition:transform .06s ease, filter .12s ease;
          min-height:44px; min-width:44px;
        }
        .btn:active{transform:translateY(1px)}
        .btn.neon{
          border:none; background:linear-gradient(135deg,var(--neon1),var(--neon2)); color:var(--ink);
          box-shadow:0 8px 22px rgba(111,195,255,.28);
        }
        .btn.neon:hover{filter:brightness(.98)}
        .btn.neon:active{filter:brightness(.95); transform:translateY(1px)}
        .btn.neon:focus-visible{outline:3px solid rgba(111,195,255,.55); outline-offset:2px}
        .btn.outline{background:#101a2b; border:1px solid var(--stroke)}

        .btn.danger{
          background:linear-gradient(180deg,#FF3B3F 0%, #E50914 100%);
          color:#fff; border:none;
          box-shadow:0 8px 20px rgba(229,9,20,.45), inset 0 0 0 1px rgba(255,255,255,.06);
          letter-spacing:.2px;
        }
        .btn.danger:hover{filter:brightness(.96)}
        .btn.danger:active{filter:brightness(.9)}

        .btn[disabled]{opacity:.6; cursor:not-allowed}
        .btn:not(.danger):hover{filter:brightness(1.02)}
      `}</style>

      <style jsx global>{`
        body{
          margin:0;
          font:16px/1.55 Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color:#edf3ff;
          background:
            radial-gradient(1200px 700px at 80% -10%, #14263d 0%, rgba(11,17,26,0) 60%),
            radial-gradient(900px 600px at 10% 110%, #0d1b2a 0%, rgba(11,17,26,0) 60%),
            #0b111a;
        }
      `}</style>
    </>
  );
}
