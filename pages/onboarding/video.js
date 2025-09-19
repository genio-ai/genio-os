// File: pages/onboarding/video.js
import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const DRAFT_KEY = "twin_ob_draft";
const MIN_SEC = 20;
const MAX_SEC = 30;
const ACCEPT = ["video/webm", "video/mp4"];

export default function Video() {
  const router = useRouter();

  const [blob, setBlob] = useState(null);
  const [url, setUrl] = useState("");
  const [sec, setSec] = useState(0);
  const [recording, setRecording] = useState(false);
  const [err, setErr] = useState("");

  const recRef = useRef(null);
  const streamRef = useRef(null);
  const t0Ref = useRef(0);

  const videoEl = useRef(null);
  const canvasRef = useRef(null);
  const [coverDataUrl, setCoverDataUrl] = useState("");

  // Load draft
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      if (d.videoUrl) setUrl(d.videoUrl);
      if (d.videoSec) setSec(d.videoSec);
      if (d.videoCover) setCoverDataUrl(d.videoCover);
    } catch {}
  }, []);

  // Autosave (meta only)
  useEffect(() => {
    try {
      const cur = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        ...cur,
        videoReady: !!(url && sec),
        videoUrl: url || "",
        videoSec: sec || 0,
        videoCover: coverDataUrl || ""
      }));
    } catch {}
  }, [url, sec, coverDataUrl]);

  const good = sec >= MIN_SEC && sec <= MAX_SEC;

  const quests = useMemo(() => ([
    { key: "perm", label: "Camera allowed or file uploaded", done: !!(recording || url) },
    { key: "dur", label: `Record ${MIN_SEC}–${MAX_SEC}s`, done: good },
    { key: "cover", label: "Capture a cover frame", done: !!coverDataUrl },
  ]), [recording, url, good, coverDataUrl]);

  const startRecord = async () => {
    setErr("");
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: true
      });
      streamRef.current = stream;
      const mime =
        MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" :
        MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus") ? "video/webm;codecs=vp8,opus" :
        "video/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime });
      recRef.current = rec;
      const chunks = [];
      rec.ondataavailable = (e) => e.data && chunks.push(e.data);
      rec.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const b = new Blob(chunks, { type: rec.mimeType || "video/webm" });
        const u = URL.createObjectURL(b);
        setBlob(b);
        setUrl(u);
        setSec(Math.round((Date.now() - t0Ref.current) / 1000));
        setRecording(false);
        // auto set as player source
        if (videoEl.current) videoEl.current.src = u;
      };
      t0Ref.current = Date.now();
      rec.start();
      setRecording(true);
    } catch {
      setErr("Camera/mic permission denied. You can upload a video file instead.");
    }
  };

  const stopRecord = () => {
    if (!recRef.current || recRef.current.state === "inactive") return;
    recRef.current.stop();
  };

  const onUpload = (file) => {
    setErr("");
    if (!file) return;
    if (!ACCEPT.includes(file.type)) return setErr("Unsupported video format.");
    if (file.size > 80 * 1024 * 1024) return setErr("Video too large (max 80MB).");
    setBlob(file);
    const u = URL.createObjectURL(file);
    setUrl(u);
    const v = document.createElement("video");
    v.src = u;
    v.onloadedmetadata = () => setSec(Math.round(v.duration || 0));
  };

  const captureCover = () => {
    try {
      const v = videoEl.current, c = canvasRef.current;
      if (!v || !c || !v.videoWidth) return;
      c.width = v.videoWidth; c.height = v.videoHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(v, 0, 0, c.width, c.height);
      setCoverDataUrl(c.toDataURL("image/jpeg", 0.85));
    } catch {}
  };

  const next = () => {
    if (!good) return;
    router.push("/onboarding/review");
  };

  useEffect(() => {
    return () => {
      try { streamRef.current?.getTracks().forEach(t => t.stop()); } catch {}
    };
  }, []);

  return (
    <>
      <Head>
        <title>AI Lab — Video</title>
        <meta name="description" content="Step 3 — Record a short video for your digital twin." />
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
            <span className="dot" />
          </div>
        </div>
      </header>

      <main className="container grid">
        <section className="card form">
          <h1>Step 3 — Video</h1>
          <p className="muted">Record {MIN_SEC}–{MAX_SEC} seconds while speaking. Good light, face centered.</p>

          <div className="row">
            {!recording ? (
              <button className="btn" onClick={startRecord}>Start</button>
            ) : (
              <button className="btn btn-neon" onClick={stopRecord}>Stop</button>
            )}
            <label className="file">
              <input type="file" accept={ACCEPT.join(",")} onChange={(e)=>onUpload(e.target.files?.[0])} />
              <span>Upload video</span>
            </label>
          </div>

          <div className="playerWrap">
            <video
              ref={videoEl}
              controls
              src={url}
              onPause={captureCover}
              onSeeked={captureCover}
            />
            <div className="meta">{sec ? `${sec}s` : ""}</div>
          </div>

          <div className="coverRow">
            <button className="btn" onClick={captureCover} disabled={!url}>Capture cover frame</button>
            {coverDataUrl && <img src={coverDataUrl} alt="Cover frame" className="cover" />}
            <canvas ref={canvasRef} style={{ display: "none" }} />
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
            <Link className="btn ghost" href="/onboarding/voice">Back</Link>
            <button className="btn btn-neon" onClick={next} disabled={!good}>Next — Review</button>
          </div>
        </section>

        <aside className="card tips">
          <h3>Tips</h3>
          <ul>
            <li>Use a quiet, well-lit room.</li>
            <li>Keep the camera stable, eye level.</li>
            <li>Speak naturally; smile slightly.</li>
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

        .row{display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin:8px 0}
        .file input{display:none}
        .file span{border:1px dashed #2a3a56; border-radius:10px; padding:10px 12px; cursor:pointer}

        .playerWrap{position:relative; margin:10px 0}
        video{width:100%; border-radius:10px; box-shadow:inset 0 0 0 1px #1a2942; background:#0c1421}
        .meta{position:absolute; right:10px; bottom:10px; font-size:12px; background:#0f1b2d; border:1px solid #20304a; padding:4px 8px; border-radius:999px; color:#cfe6ff}

        .coverRow{display:flex; gap:10px; align-items:center; flex-wrap:wrap; margin:8px 0}
        .cover{width:180px; border-radius:10px; border:1px solid #21314a}

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
