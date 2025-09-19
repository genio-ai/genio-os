// File: pages/onboarding.js
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const C = {
  personality: { aboutMin: 60, exMin: 30 },
  voice: { min: 30, max: 90, mimes: ["audio/webm", "audio/wav", "audio/ogg"] },
  video: { min: 15, max: 30, mimes: ["video/webm", "video/mp4"] },
};

export default function Onboarding() {
  const r = useRouter();

  const [step, setStep] = useState("personality");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Personality
  const [about, setAbout] = useState("");
  const [values, setValues] = useState("");
  const [examples, setExamples] = useState(["", "", ""]);

  // Voice
  const [vBlob, setVBlob] = useState(null);
  const [vUrl, setVUrl] = useState("");
  const [vSec, setVSec] = useState(0);
  const recVRef = useRef({ rec: null, t0: 0 });

  // Video
  const [vidBlob, setVidBlob] = useState(null);
  const [vidUrl, setVidUrl] = useState("");
  const [vidSec, setVidSec] = useState(0);
  const recVidRef = useRef({ rec: null, t0: 0 });

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem("twin_ob_draft") || "{}");
      if (d.about) setAbout(d.about);
      if (d.values) setValues(d.values);
      if (d.examples) setExamples(d.examples);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("twin_ob_draft", JSON.stringify({ about, values, examples }));
    } catch {}
  }, [about, values, examples]);

  const personalityOK = useMemo(() => {
    const okAbout = about.trim().length >= C.personality.aboutMin;
    const okEx = examples.every((e) => e.trim().length >= C.personality.exMin);
    return okAbout && okEx;
  }, [about, examples]);

  const onNextPersonality = () => {
    if (!personalityOK) return setErr("Please add more about you + 3 short examples.");
    setErr("");
    setStep("voice");
  };

  // ===== Voice =====
  const startVoice = useCallback(async () => {
    setErr("");
    if (recVRef.current.rec) return;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const rec = new MediaRecorder(s, MediaRecorder.isTypeSupported("audio/webm") ? { mimeType: "audio/webm" } : undefined);
      const chunks = [];
      rec.ondataavailable = (e) => e.data && chunks.push(e.data);
      rec.onstop = () => {
        s.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
        setVBlob(blob);
        setVUrl(URL.createObjectURL(blob));
        setVSec(Math.round((Date.now() - recVRef.current.t0) / 1000));
        recVRef.current = { rec: null, t0: 0 };
      };
      recVRef.current = { rec, t0: Date.now() };
      rec.start();
    } catch {
      setErr("Mic denied. You can upload an audio file instead.");
    }
  }, []);
  const stopVoice = () => recVRef.current.rec?.stop();
  const uploadVoice = (f) => {
    if (!f) return;
    if (!C.voice.mimes.includes(f.type)) return setErr("Unsupported audio type.");
    setVBlob(f);
    setVUrl(URL.createObjectURL(f));
    const a = document.createElement("audio");
    a.src = URL.createObjectURL(f);
    a.onloadedmetadata = () => setVSec(Math.round(a.duration || 0));
  };
  const onNextVoice = () => {
    if (!vBlob) return setErr("Please record or upload voice.");
    if (vSec < C.voice.min || vSec > C.voice.max) return setErr(`Voice must be ${C.voice.min}-${C.voice.max}s.`);
    setErr("");
    setStep("video");
  };

  // ===== Video =====
  const startVideo = useCallback(async () => {
    setErr("");
    if (recVidRef.current.rec) return;
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const m =
        MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" :
        MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus") ? "video/webm;codecs=vp8,opus" :
        "video/webm";
      const rec = new MediaRecorder(s, { mimeType: m });
      const chunks = [];
      rec.ondataavailable = (e) => e.data && chunks.push(e.data);
      rec.onstop = () => {
        s.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: rec.mimeType || "video/webm" });
        setVidBlob(blob);
        setVidUrl(URL.createObjectURL(blob));
        setVidSec(Math.round((Date.now() - recVidRef.current.t0) / 1000));
        recVidRef.current = { rec: null, t0: 0 };
      };
      recVidRef.current = { rec, t0: Date.now() };
      rec.start();
    } catch {
      setErr("Camera denied. You can upload a video instead.");
    }
  }, []);
  const stopVideo = () => recVidRef.current.rec?.stop();
  const uploadVideo = (f) => {
    if (!f) return;
    if (!C.video.mimes.includes(f.type)) return setErr("Unsupported video type.");
    setVidBlob(f);
    setVidUrl(URL.createObjectURL(f));
    const v = document.createElement("video");
    v.src = URL.createObjectURL(f);
    v.onloadedmetadata = () => setVidSec(Math.round(v.duration || 0));
  };
  const onNextVideo = () => {
    if (!vidBlob) return setErr("Please record or upload video.");
    if (vidSec < C.video.min || vidSec > C.video.max) return setErr(`Video must be ${C.video.min}-${C.video.max}s.`);
    setErr("");
    setStep("review");
  };

  // ===== Commit (mock) =====
  const commit = async () => {
    setBusy(true);
    try {
      // هنا لاحقًا نوصل API. الآن مجرّد تنقل.
      r.push("/dashboard?twin=new");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Head><title>Onboarding — Create your twin</title></Head>
      <header className="hdr">
        <div className="wrap">
          <Link href="/" className="brand"><span className="neon">genio os</span></Link>
          <div className="stepper">
            <span className={step==="personality"?"dot on":"dot"} />
            <span className={step==="voice"?"dot on":"dot"} />
            <span className={step==="video"?"dot on":"dot"} />
            <span className={step==="review"?"dot on":"dot"} />
          </div>
        </div>
      </header>

      <main className="wrap">
        {err && <div className="alert">{err}</div>}
        {busy && <div className="note">Working…</div>}

        {step==="personality" && (
          <section>
            <h1>Step 1 — Personality</h1>
            <div className="grid">
              <label>About me
                <textarea rows={6} value={about} maxLength={2000} onChange={(e)=>setAbout(e.target.value)} placeholder="Who you are, what you like/dislike, boundaries…" />
              </label>
              <label>Core values
                <input value={values} onChange={(e)=>setValues(e.target.value)} placeholder="Integrity, curiosity, speed…" />
              </label>
            </div>
            <div className="ex">
              <p>3 example replies (short):</p>
              {examples.map((t,i)=>(
                <input key={i} value={t} maxLength={240} onChange={(e)=>{const a=[...examples]; a[i]=e.target.value; setExamples(a);}} placeholder={`Example #${i+1}`} />
              ))}
            </div>
            <div className="actions">
              <button className="btn ghost" onClick={()=>r.push("/")}>Cancel</button>
              <button className="btn" onClick={onNextPersonality} disabled={!personalityOK}>Save & continue</button>
            </div>
          </section>
        )}

        {step==="voice" && (
          <section>
            <h1>Step 2 — Voice</h1>
            <p className="muted">Speak naturally for {C.voice.min}–{C.voice.max}s.</p>
            <div className="card">
              <div className="row">
                <button className="btn" onClick={startVoice}>Start</button>
                <button className="btn" onClick={stopVoice}>Stop</button>
                <label className="upload">
                  <input type="file" accept={C.voice.mimes.join(",")} onChange={(e)=>uploadVoice(e.target.files?.[0])} />
                  <span>Upload audio</span>
                </label>
              </div>
              {vUrl && <div className="prev"><audio controls src={vUrl} /><small>{vSec}s</small></div>}
            </div>
            <div className="actions">
              <button className="btn ghost" onClick={()=>setStep("personality")}>Back</button>
              <button className="btn" onClick={onNextVoice} disabled={!vBlob}>Save & continue</button>
            </div>
          </section>
        )}

        {step==="video" && (
          <section>
            <h1>Step 3 — Video</h1>
            <p className="muted">Record {C.video.min}–{C.video.max}s while speaking, well-lit.</p>
            <div className="card">
              <div className="row">
                <button className="btn" onClick={startVideo}>Start</button>
                <button className="btn" onClick={stopVideo}>Stop</button>
                <label className="upload">
                  <input type="file" accept={C.video.mimes.join(",")} onChange={(e)=>uploadVideo(e.target.files?.[0])} />
                  <span>Upload video</span>
                </label>
              </div>
              {vidUrl && <div className="prev"><video controls src={vidUrl} /><small>{vidSec}s</small></div>}
            </div>
            <div className="actions">
              <button className="btn ghost" onClick={()=>setStep("voice")}>Back</button>
              <button className="btn" onClick={onNextVideo} disabled={!vidBlob}>Save & continue</button>
            </div>
          </section>
        )}

        {step==="review" && (
          <section>
            <h1>Review & Create</h1>
            <ul className="review">
              <li><b>About:</b> {about.slice(0,120)}{about.length>120?"…":""}</li>
              <li><b>Values:</b> {values || "—"}</li>
              <li><b>Examples:</b> {examples.map((e,i)=><span key={i}>[{i+1}] {e || "—"} </span>)}</li>
              <li><b>Voice:</b> {vBlob ? `${(vBlob.size/1024/1024).toFixed(1)}MB • ${vSec}s` : "—"}</li>
              <li><b>Video:</b> {vidBlob ? `${(vidBlob.size/1024/1024).toFixed(1)}MB • ${vidSec}s` : "—"}</li>
            </ul>
            <div className="actions">
              <button className="btn ghost" onClick={()=>setStep("video")}>Back</button>
              <button className="btn" onClick={commit} disabled={busy}>Create twin</button>
            </div>
          </section>
        )}
      </main>

      <style jsx>{`
        .wrap{width:min(1000px,92%);margin-inline:auto}
        .hdr{position:sticky;top:0;background:#0b111add;border-bottom:1px solid #1b2840;backdrop-filter:blur(8px)}
        .brand{font-weight:800}
        .neon{background:linear-gradient(135deg,#20E3B2,#6FC3FF);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .stepper{display:flex;gap:8px;align-items:center}
        .dot{width:8px;height:8px;border-radius:50%;background:#263a59;opacity:.5}
        .dot.on{opacity:1;background:linear-gradient(135deg,#20E3B2,#6FC3FF)}
        main{padding:20px 0 60px}
        h1{margin:8px 0 12px;font-size:clamp(22px,4vw,32px)}
        .muted{color:#c0d0e2;font-size:14px}
        label{display:flex;flex-direction:column;gap:6px;margin:8px 0}
        input,textarea{background:#0f1828;color:#edf3ff;border:1px solid #223145;border-radius:10px;padding:10px 12px}
        .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        @media(max-width:820px){.grid{grid-template-columns:1fr}}
        .ex{display:grid;gap:8px;margin-top:8px}
        .card{border:1px solid #20304a;background:#0f1725;padding:12px;border-radius:12px;margin:12px 0}
        .row{display:flex;gap:10px;flex-wrap:wrap}
        .upload input{display:none}
        .upload span{border:1px dashed #2a3a56;border-radius:10px;padding:10px 12px;cursor:pointer}
        .prev{display:grid;gap:8px;margin-top:8px}
        video,audio{width:100%}
        .actions{display:flex;gap:10px;justify-content:flex-end;margin-top:12px}
        .btn{background:#0f1828;color:#edf3ff;border:1px solid #223145;border-radius:12px;padding:10px 14px;font-weight:700}
        .btn.ghost{background:#0f1828;border-style:dashed}
        .alert{border:1px solid #5b2330;background:#1a0f14;color:#ffd6df;padding:10px 12px;border-radius:10px;margin:10px 0}
        .note{border:1px solid #23485b;background:#0f1a20;color:#d6f2ff;padding:10px 12px;border-radius:10px;margin:10px 0}
        .review{display:grid;gap:6px;margin:12px 0}
      `}</style>
      <style jsx global>{`body{background:#0b111a;color:#edf3ff;font:16px/1.55 Inter, system-ui}`}</style>
    </>
  );
}
