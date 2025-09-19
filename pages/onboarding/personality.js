// File: pages/onboarding/personality.js
import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const DRAFT_KEY = "twin_ob_draft";
const TARGET_CHARS = 300; // الهدف للوصول لـ 100% XP

export default function Personality() {
  const router = useRouter();
  const [about, setAbout] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [typing, setTyping] = useState(false);

  // Load draft on mount
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      if (d.about) setAbout(d.about);
    } catch {}
  }, []);

  // Debounced autosave
  useEffect(() => {
    if (about == null) return;
    setTyping(true);
    const t = setTimeout(() => {
      try {
        const cur = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
        localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...cur, about }));
        setSavedAt(new Date());
      } catch {}
      setTyping(false);
    }, 500);
    return () => clearTimeout(t);
  }, [about]);

  // Game-like progress
  const xp = useMemo(() => Math.min(1, (about.trim().length || 0) / TARGET_CHARS), [about]);
  const level = xp >= 1 ? 3 : xp >= 0.5 ? 2 : xp >= 0.25 ? 1 : 0;

  // Simple quest checks (light heuristics)
  const quests = useMemo(() => {
    const txt = about.toLowerCase();
    return [
      { key: "about", label: "Write a short bio", done: about.trim().length >= 100 },
      { key: "likes", label: "Mention what you like", done: /\blike|love|enjoy\b/.test(txt) },
      { key: "dislikes", label: "Mention what you avoid", done: /\bdon't|do not|hate|avoid|dislike\b/.test(txt) },
      { key: "tone", label: "Describe your style (short/long, funny/serious)", done: /\bshort|long|funny|serious|direct|friendly\b/.test(txt) },
    ];
  }, [about]);

  const allGood = quests.every(q => q.done) && xp >= 0.5;

  // Orb canvas animation
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const onR = () => resize();
    window.addEventListener("resize", onR);

    let t = 0;
    const loop = () => {
      t += 0.016;
      const W = canvas.width / dpr;
      const H = canvas.height / dpr;
      ctx.clearRect(0, 0, W, H);

      // bg grid
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.strokeStyle = "rgba(25,45,78,0.6)";
      const g = 24;
      const ox = (t * 20) % g;
      const oy = (t * 12) % g;
      for (let x = -g; x < W + g; x += g) {
        ctx.beginPath(); ctx.moveTo(x + ox, 0); ctx.lineTo(x + ox, H); ctx.stroke();
      }
      for (let y = -g; y < H + g; y += g) {
        ctx.beginPath(); ctx.moveTo(0, y + oy); ctx.lineTo(W, y + oy); ctx.stroke();
      }
      ctx.restore();

      // orb
      const cx = W * 0.5, cy = H * 0.5;
      const base = 70;
      const pulse = base + Math.sin(t * (2 + xp * 6)) * (6 + xp * 12);

      // outer glow
      const grd = ctx.createRadialGradient(cx, cy, 10, cx, cy, 140);
      grd.addColorStop(0, "rgba(111,195,255,0.14)");
      grd.addColorStop(1, "rgba(32,227,178,0.00)");
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(cx, cy, 140, 0, Math.PI * 2); ctx.fill();

      // rings (speed up with xp)
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const radius = pulse + i * 12;
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(111,195,255,${0.45 - i * 0.15})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // inner core
      ctx.beginPath();
      ctx.arc(cx, cy, 24 + xp * 10, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(32,227,178,0.8)";
      ctx.fill();

      // tiny sparks
      const sparks = 12;
      for (let i = 0; i < sparks; i++) {
        const ang = (i / sparks) * Math.PI * 2 + t * (0.5 + xp);
        const r = 48 + Math.sin(t * 2 + i) * 12 + xp * 22;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(207,240,255,0.9)";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onR); };
  }, [xp]);

  const goNext = () => {
    if (!allGood) return;
    router.push("/onboarding/voice");
  };

  return (
    <>
      <Head>
        <title>AI Lab — Personality</title>
        <meta name="description" content="Step 1 — Describe yourself to craft your digital twin." />
      </Head>

      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="genio os">
            <span className="brand-name brand-neon">genio os</span>
          </Link>
          <div className="stepper" aria-label="Progress">
            <span className="dot on" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </header>

      <main className="container grid">
        {/* Left: form (quests + xp) */}
        <section className="card form">
          <h1>Step 1 — Tell us about yourself</h1>
          <p className="muted">
            Think of this as your **character creation** — help your twin learn your voice and boundaries.
          </p>

          {/* XP bar */}
          <div className="xp">
            <div className="xp-top">
              <span>XP</span>
              <span>{Math.round(xp * 100)}%</span>
            </div>
            <div className="xp-bar" aria-valuenow={Math.round(xp * 100)} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${xp * 100}%` }} />
            </div>
            <div className="lvl">
              <span className={level>=0?"on":""}>Lv.0</span>
              <span className={level>=1?"on":""}>Lv.1</span>
              <span className={level>=2?"on":""}>Lv.2</span>
              <span className={level>=3?"on":""}>Lv.3</span>
            </div>
          </div>

          {/* textarea */}
          <label className="field">
            <span>About me</span>
            <textarea
              rows={8}
              value={about}
              maxLength={2000}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Example: I'm a startup founder who loves technology and design. I like direct, clear communication and I avoid fluff. My twin should be friendly, concise, and never promise dates without checking my calendar…"
            />
            <div className="help">
              {typing ? "Saving…" : savedAt ? `Saved · ${savedAt.toLocaleTimeString()}` : "Autosave on"}
            </div>
          </label>

          {/* quests */}
          <div className="quests">
            <h3>Quests</h3>
            <ul>
              {quests.map(q => (
                <li key={q.key} className={q.done ? "done" : ""}>
                  <span className="chk">{q.done ? "✓" : ""}</span>
                  {q.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="actions">
            <Link className="btn ghost" href="/">Back</Link>
            <button className="btn btn-neon" onClick={goNext} disabled={!allGood}>
              Next — Voice
            </button>
          </div>
        </section>

        {/* Right: orb / lab feel */}
        <aside className="card orb">
          <div className="hud">
            <span className="badge">Secure</span>
            <span className="badge">Step 1/4</span>
            <span className="badge">{Math.round(xp * 100)}% XP</span>
          </div>
          <canvas ref={canvasRef} className="orb-canvas" />
          <p className="hint">Type more details to charge the orb and level up.</p>
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

        /* XP */
        .xp{margin:10px 0 12px}
        .xp-top{display:flex; justify-content:space-between; font-weight:700}
        .xp-bar{height:10px; background:#0c1421; border:1px solid #21314a; border-radius:999px; overflow:hidden; margin:6px 0 6px}
        .xp-bar>span{display:block; height:100%; width:0; background:linear-gradient(90deg, var(--neon2), var(--neon1)); transition:width .2s ease}
        .lvl{display:flex; gap:8px; font-size:12px; color:#87a0be}
        .lvl .on{color:#e8f3ff; font-weight:700}

        /* Field */
        .field{display:flex; flex-direction:column; gap:6px; margin:10px 0}
        textarea{background:#0f1828; color:#edf3ff; border:1px solid #223145; border-radius:10px; padding:10px 12px; min-height:160px}
        .help{color:#9fb5d1; font-size:12px; margin-top:4px}

        /* Quests */
        .quests{margin:12px 0 2px}
        .quests h3{margin:0 0 8px; font-size:14px; color:#cfe0ff}
        .quests ul{list-style:none; padding:0; margin:0; display:grid; gap:8px}
        .quests li{display:flex; align-items:center; gap:8px; padding:8px 10px; border:1px dashed #2a3a56; border-radius:10px; color:#cfe0ff}
        .quests li.done{border-style:solid; background:#0f1b2d}
        .chk{display:inline-grid; place-items:center; width:18px; height:18px; border-radius:999px; border:1px solid #2a3a56}

        /* Actions */
        .actions{display:flex; gap:10px; justify-content:flex-end; margin-top:12px}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.ghost{background:#0f1828; border-style:dashed}

        /* ORB panel */
        .orb{display:grid; grid-template-rows:auto 1fr auto; gap:10px; min-height:360px}
        .hud{display:flex; gap:8px; flex-wrap:wrap}
        .badge{border:1px solid #1f2c44; background:#0f1b2d; color:#cfe6ff; padding:6px 10px; border-radius:999px; font-size:12px}
        .orb-canvas{width:100%; height:100%; border-radius:10px; background:radial-gradient(1200px 600px at 80% -10%, #14263d 0%, #0b111a 60%), #0b111a; box-shadow:inset 0 0 0 1px #1a2942}
        .hint{color:#9fb5d1; font-size:12px; text-align:center}
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
