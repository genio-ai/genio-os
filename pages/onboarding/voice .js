import { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const AUTH_KEY = "auth_user";
const DRAFT_KEY = "twin_ob_draft";

export default function Voice() {
  const router = useRouter();

  // draft
  const [voiceUrl, setVoiceUrl] = useState("");
  const [voiceSec, setVoiceSec] = useState(0);

  // recording
  const [supported, setSupported] = useState(false);
  const [perm, setPerm] = useState("unknown"); // "unknown" | "granted" | "denied"
  const [recState, setRecState] = useState("idle"); // "idle" | "recording" | "stopped"
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const startAtRef = useRef(0);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // auth guard + load draft
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
      if (!u) {
        router.replace("/login");
        return;
      }
    } catch {}
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      if (d.voiceUrl) setVoiceUrl(d.voiceUrl);
      if (d.voiceSec) setVoiceSec(d.voiceSec);
    } catch {}
  }, [router]);

  // feature support
  useEffect(() => {
    const ok = typeof window !== "undefined" && !!navigator.mediaDevices && !!window.MediaRecorder;
    setSupported(ok);
  }, []);

  // request mic permission lazily
  const askPermission = async () => {
    setErr("");
    if (perm === "granted") return true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      setPerm("granted");
      return true;
    } catch {
      setPerm("denied");
      setErr("Microphone permission denied. Enable it from browser settings.");
      return false;
    }
  };

  // start recording
  const startRec = async () => {
    setErr("");
    if (!supported) return setErr("Recording is not supported on this device/browser.");
    const ok = await askPermission();
    if (!ok) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mrRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setVoiceUrl((old) => {
          if (old) URL.revokeObjectURL(old);
          return url;
        });
        setRecState("stopped");
        saveDraft({ voiceUrl: url, voiceSec });
      };
      mr.start(50);
      startAtRef.current = Date.now();
      setRecState("recording");
      timerRef.current = setInterval(() => {
        const s = Math.floor((Date.now() - startAtRef.current) / 1000);
        setVoiceSec(s);
      }, 250);
    } catch {
      setErr("Cannot start recording. Please try again.");
    }
  };

  // stop recording
  const stopRec = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    try { mrRef.current?.stop(); } catch {}
  };

  // delete current take
  const deleteTake = () => {
    if (!voiceUrl) return;
    if (!confirm("Delete this voice sample?")) return;
    try { URL.revokeObjectURL(voiceUrl); } catch {}
    setVoiceUrl("");
    setVoiceSec(0);
    saveDraft({ voiceUrl: "", voiceSec: 0 });
  };

  // save draft merged
  const saveDraft = (patch) => {
    try {
      const cur = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...cur, ...patch }));
    } catch {}
  };

  // save & continue
  const saveAndNext = async () => {
    setBusy(true);
    try {
      saveDraft({ voiceUrl, voiceSec });
      router.push("/onboarding/video");
    } finally {
      setBusy(false);
    }
  };

  // display helpers
  const durLabel = useMemo(() => {
    const s = Math.max(0, Number(voiceSec) || 0);
    const m = Math.floor(s / 60).toString().padStart(1, "0");
    const r = (s % 60).toString().padStart(2, "0");
    return `${m}:${r}`;
  }, [voiceSec]);

  const canSave = useMemo(() => voiceSec >= 10 || !!voiceUrl, [voiceSec, voiceUrl]);

  return (
    <>
      <Head>
        <title>AI Lab — Voice (Step 2)</title>
        <meta name="description" content="Record your voice so your Twin can learn your tone and cadence." />
      </Head>

      {/* Header */}
      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand"><span className="brand-neon">genio os</span></Link>
          <div className="stepper" aria-label="Progress">
            <span className="dot ok" />
            <span className="dot on" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </header>

      {/* Lab stage */}
      <section className="lab">
        <div className="grid-bg" aria-hidden="true" />
        <div className={`holo ${recState === "recording" ? "live" : ""}`}>
          <div className="ring r1" /><div className="ring r2" /><div className="ring r3" />
          <div className="core" />
        </div>
      </section>

      {/* Content */}
      <main className="container">
        <section className="card form">
          <h1>Record your voice</h1>
          <p className="sub">
            Speak for 30–60 seconds as you normally would. This helps your Twin learn your tone, pace, and pronunciation.
          </p>

          {err && <div className="alert">{err}</div>}
          {!supported && <div className="note">Recording is not supported on this device. You can upload audio in the next build.</div>}

          <div className="rec-wrap">
            <div className="timer" aria-live="polite">{durLabel}</div>

            {recState !== "recording" ? (
              <button className="btn btn-neon big" disabled={!supported} onClick={startRec}>
                Start recording
              </button>
            ) : (
              <button className="btn danger big" onClick={stopRec}>
                Stop
              </button>
            )}

            <div className="row">
              <button className="btn ghost" onClick={askPermission} type="button">Check mic</button>
              <button className="btn ghost" onClick={deleteTake} type="button" disabled={!voiceUrl && voiceSec === 0}>
                Delete take
              </button>
            </div>

            <div className="player">
              <audio ref={audioRef} src={voiceUrl || undefined} controls preload="metadata" />
              <small className="hint">{voiceUrl ? "Preview your sample." : "No sample yet."}</small>
            </div>
          </div>

          <div className="actions">
            <Link className="btn" href="/onboarding/personality">Back</Link>
            <div className="spacer" />
            <button className="btn btn-neon" disabled={!canSave || busy} onClick={saveAndNext}>
              {busy ? "Saving…" : "Save & Continue — Video"}
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
        .container{width:min(860px,92%); margin-inline:auto}
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
        .dot.ok{opacity:1; background:#2b8a57}

        /* Lab */
        .lab{position:relative; height:260px; display:grid; place-items:center; overflow:hidden; border-block:1px solid #132238; background:#091119}
        .grid-bg{position:absolute; inset:0; background:
          linear-gradient(#0f2138 1px, transparent 1px) 0 0/40px 40px,
          linear-gradient(90deg,#0f2138 1px, transparent 1px) 0 0/40px 40px; opacity:.25}
        .holo{position:relative; width:220px; height:220px; border-radius:50%; filter:drop-shadow(0 8px 40px rgba(0,0,0,.6))}
        .holo.live .core{animation:pulse 0.9s ease-in-out infinite}
        .ring{position:absolute; inset:0; border:2px solid rgba(140,200,255,.18); border-radius:50%}
        .r2{transform:scale(1.25)} .r3{transform:scale(1.5)}
        .core{position:absolute; top:50%; left:50%; width:80px; height:80px; margin:-40px; border-radius:50%;
          background:radial-gradient(circle at 30% 30%, var(--neon2), transparent 60%), radial-gradient(circle at 70% 70%, var(--neon1), transparent 60%);
          filter:blur(2px) saturate(160%); animation:pulse 3s ease-in-out infinite}
        @keyframes pulse{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.08)}}

        /* Card */
        main{padding:22px 0 56px}
        .card{border:1px solid #20304a; background:linear-gradient(180deg, rgba(15,23,37,.92), rgba(12,18,30,.92)); border-radius:16px; padding:16px}
        .form h1{margin:0 0 6px; font-size:clamp(22px,4.8vw,32px); background:linear-gradient(180deg,#f4f8ff 0%, #cfe0ff 100%); -webkit-background-clip:text; color:transparent}
        .sub{color:#c0d0e2; margin:0 0 12px}
        .alert{border:1px solid #5b2330; background:#1a0f14; color:#ffd6df; padding:10px 12px; border-radius:10px; margin:8px 0}
        .note{border:1px solid #23485b; background:#0f1a20; color:#d6f2ff; padding:10px 12px; border-radius:10px; margin:8px 0}

        .rec-wrap{display:flex; flex-direction:column; gap:10px; align-items:center; padding:6px}
        .timer{font-size:28px; letter-spacing:1px; color:#cfe6ff}
        .row{display:flex; gap:8px; flex-wrap:wrap}
        .player{width:100%; display:flex; flex-direction:column; gap:4px; align-items:center}
        .hint{color:#9fb5d1; font-size:12px}

        .actions{display:flex; gap:10px; align-items:center; margin-top:14px}
        .spacer{flex:1}

        .btn{display:inline-flex; align-items:center; justify-content:center; border-radius:12px; cursor:pointer; padding:10px 14px; font-weight:700; border:1px solid #223145; background:#0f1828; color:#edf3ff}
        .btn.big{padding:14px 18px; font-size:16px}
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
