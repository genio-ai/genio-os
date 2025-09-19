// File: pages/onboarding/voice.js
import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const DRAFT_KEY = "twin_ob_draft";
const MIN_SEC = 60;
const MAX_SEC = 90;
const ACCEPT = ["audio/webm", "audio/wav", "audio/ogg"];

export default function Voice() {
  const router = useRouter();

  const [vBlob, setVBlob] = useState(null);
  const [vUrl, setVUrl] = useState("");
  const [sec, setSec] = useState(0);
  const [recording, setRecording] = useState(false);
  const [err, setErr] = useState("");

  const recRef = useRef(null);
  const streamRef = useRef(null);
  const t0Ref = useRef(0);

  const vuCanvas = useRef(null);
  const rafRef = useRef(0);
  const analyserRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Load draft
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      if (d.voiceUrl) setVUrl(d.voiceUrl);
      if (d.voiceSec) setSec(d.voiceSec);
    } catch {}
  }, []);

  // Autosave meta (not the blob)
  useEffect(() => {
    try {
      const cur = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        ...cur,
        voiceReady: !!(vUrl && sec),
        voiceUrl: vUrl || "",
        voiceSec: sec || 0
      }));
    } catch {}
  }, [vUrl, sec]);

  // VU visualizer
  const drawVU = (level = 0) => {
    const c = vuCanvas.current; if (!c) return;
    const ctx = c.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { width } = c.getBoundingClientRect();
    const h = 44;
    c.width = Math.floor(width * dpr);
    c.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, h);

    // bg
    ctx.fillStyle = "#0c1421";
    ctx.fillRect(0, 0, width, h);
    ctx.strokeStyle = "#21314a";
    ctx.strokeRect(0.5, 0.5, width - 1, h - 1);

    // bars
    const bars = 24;
    const gap = 4;
    const bw = (width - gap * (bars + 1)) / bars;
    for (let i = 0; i < bars; i++) {
      const x = gap + i * (bw + gap);
      const t = i / (bars - 1);
      const amp = Math.max(0.08, level * (0.5 + 0.5 * Math.sin((Date.now() / 200) + i)));
      const bh = 8 + amp * (h - 16) * (0.6 + 0.4 * t);
      const y = (h - bh) / 2;
      const g = ctx.createLinearGradient(0, y, 0, y + bh);
      g.addColorStop(0, "#6FC3FF");
      g.addColorStop(1, "#20E3B2");
      ctx.fillStyle = g;
      ctx.fillRect(x, y, bw, bh);
    }
  };

  const startVisualizer = (sourceNode) => {
    const AC = window.AudioContext || window.webkitAudioContext;
    const actx = new AC();
    audioCtxRef.current = actx;
    const analyser = actx.createAnalyser();
    analyser.fftSize = 2048;
    analyserRef.current = analyser;
    sourceNode.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);
    const loop = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length); // 0..~0.5
      const level = Math.min(1, Math.max(0, rms * 3));
      drawVU(level);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  };

  const stopVisualizer = () => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    try { audioCtxRef.current?.close(); } catch {}
    analyserRef.current = null;
    drawVU(0);
  };

  const startRecord = async () => {
    setErr("");
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }, video: false
      });
      streamRef.current = stream;

      // visualizer from mic
      const AC = window.AudioContext || window.webkitAudioContext;
      const actx = new AC();
      audioCtxRef.current = actx;
      const micSrc = actx.createMediaStreamSource(stream);
      startVisualizer(micSrc);

      const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recRef.current = rec;
      const chunks = [];
      rec.ondataavailable = (e) => e.data && chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        stopVisualizer();
        const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setVBlob(blob);
        setVUrl(url);
        setSec(Math.round((Date.now() - t0Ref.current) / 1000));
        setRecording(false);
      };
      t0Ref.current = Date.now();
      rec.start();
      setRecording(true);
    } catch {
      setErr("Mic permission denied. You can upload an audio file instead.");
    }
  };

  const stopRecord = () => {
    if (!recRef.current || recRef.current.state === "inactive") return;
    recRef.current.stop();
  };

  const onUpload = (file) => {
    setErr("");
    if (!file) return;
    if (!ACCEPT.includes(file.type)) return setErr("Unsupported audio format.");
    if (file.size > 20 * 1024 * 1024) return setErr("Audio file too large (max 20MB).");
    setVBlob(file);
    const url = URL.createObjectURL(file);
    setVUrl(url);
    const a = document.createElement("audio");
    a.src = url;
    a.onloadedmetadata = () => setSec(Math.round(a.duration || 0));
    // visualizer from playback
    a.onplay = () => {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        const actx = new AC();
        audioCtxRef.current = actx;
        const src = actx.createMediaElementSource(a);
        startVisualizer(src);
      } catch {}
    };
    a.onpause = () => stopVisualizer();
  };

  const good = sec >= MIN_SEC && sec <= MAX_SEC;

  const quests = useMemo(() => ([
    { key: "perm", label: "Microphone allowed or file uploaded", done: !!(recording || vUrl) },
    { key: "dur", label: `Record at least ${MIN_SEC}s`, done: sec >= MIN_SEC },
    { key: "cap", label: "Avoid clipping (keep level moderate)", done: true }, // hint only
  ]), [recording, vUrl, sec]);

  const next = () => {
    if (!good) return;
    router.push("/onboarding/video");
  };

  useEffect(() => {
    drawVU(0);
    const onResize = () => drawVU(0);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("resize", onResize); stopVisualizer(); streamRef.current?.getTracks().forEach(t=>t.stop()); };
  }, []);

  return (
    <>
      <Head>
        <title>AI Lab — Voice</title>
        <meta name="description" content="Step 2 — Record your voice for your digital twin." />
      </Head>

      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="genio os">
            <span className="brand-name brand-neon">genio os</span>
          </Link>
          <div className="stepper" aria-label="Progress">
            <span className="dot on" />
            <span className="dot on" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </header>

      <main className="container grid">
        <section className="card form">
          <h1>Step 2 — Voice</h1>
          <p className="muted">Speak naturally for {MIN_SEC}–{MAX_SEC} seconds. Keep the mic ~20cm away.</p>

          <div className="vu-wrap">
            <canvas ref={vuCanvas} className="vu" />
            <div className="timer">{sec}s</div>
          </div>

          <div className="row">
            {!recording ? (
              <button className="btn" onClick={startRecord}>Start recording</button>
            ) : (
              <button className="btn btn-neon" onClick={stopRecord}>Stop</button>
            )}
            <label className="file">
              <input type="file" accept={ACCEPT.join(",")} onChange={(e)=>onUpload(e.target.files?.[0])} />
              <span>Upload audio</span>
            </label>
            {vUrl && <audio controls src={vUrl} className="player" />}
          </div>

          <div className="quests">
            <h3>Quests</h3>
            <ul>
              {quests.map(q => (
                <li key={q.key} className={q.done ? "done" : ""}>
                  <span className="chk">{q.done ? "✓" : ""}</span>{q.label}
                </li>
              ))}
            </ul>
          </div>

          {err && <div className="toast err">{err}</div>}

          <div className="actions">
            <Link className="btn ghost" href="/onboarding/personality">Back</Link>
            <button className="btn btn-neon" onClick={next} disabled={!good}>Next — Video</button>
          </div>
        </section>

        <aside className="card tips">
          <h3>Tips</h3>
          <ul>
            <li>Quiet room, steady tone.</li>
            <li>Don’t whisper or shout; aim for consistent levels.</li>
            <li>If you prefer, upload a clear recording instead.</li>
          </ul>
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

        .vu-wrap{position:relative; margin:12px 0}
        .vu{width:100%; height:44px; display:block; border-radius:10px; box-shadow:inset 0 0 0 1px #1a2942; background:#0c1421}
        .timer{position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:12px; color:#cfe0ff; opacity:.8}

        .row{display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin:8px 0}
        .player{flex:1 1 100%; margin-top:8px}
        .file input{display:none}
        .file span{border:1px dashed #2a3a56; border-radius:10px; padding:10px 12px; cursor:pointer}

        .quests{margin:12px 0 2px}
        .quests h3{margin:0 0 8px; font-size:14px; color:#cfe0ff}
        .quests ul{list-style:none; padding:0; margin:0; display:grid; gap:8px}
        .quests li{display:flex; align-items:center; gap:8px; padding:8px 10px; border:1px dashed #2a3a56; border-radius:10px; color:#cfe0ff}
        .quests li.done{border-style:solid; background:#0f1b2d}
        .chk{display:inline-grid; place-items:center; width:18px; height:18px; border-radius:999px; border:1px solid #2a3a56}

        .actions{display:flex; gap:10px; justify-content:flex-end; margin-top:12px}
        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.btn-neon{border:none; background:linear-gradient(135deg, var(--neon1), var(--neon2)); color:var(--ink)}
        .btn.ghost{background:#0f1828; border-style:dashed}

        .tips h3{margin:0 0 8px; font-size:14px; color:#cfe0ff}
        .tips ul{margin:0; padding-left:18px; color:#c0d0e2}
        .toast.err{border:1px solid #5b2330; background:#1a0f14; color:#ffd6df; padding:10px 12px; border-radius:10px; margin:10px 0}
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
