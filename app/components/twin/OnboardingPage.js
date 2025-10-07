"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";

/** ---------------------------
 *  Feature Flags
 * --------------------------*/
const ENABLE_VIDEO = false;

/** ---------------------------
 *  Constants
 * --------------------------*/
const VOICE_MIN_SEC = 60;
const VOICE_MAX_SEC = 90;
const VIDEO_MIN_SEC = 20;
const VIDEO_MAX_SEC = 30;
const CHUNK_SIZE = 6 * 1024 * 1024; // ~6MB

const NEUTRAL_SCRIPT = `Please read this paragraph clearly at a normal pace:

Hello, my name is ______. I’m recording this sample to help my digital twin learn my voice.
I usually speak in a calm, friendly tone, and I prefer concise replies.
Here are a few phrases I say often in daily conversations.
This sample is around one minute long. Thank you.`;

/** ---------------------------
 *  State Machine
 * --------------------------*/
const BASE_STEPS = ["CONSENT", "PERSONALITY", "VOICE", "REVIEW"];
const FULL_STEPS = ["CONSENT", "PERSONALITY", "VOICE", "VIDEO", "REVIEW"];
const steps = ENABLE_VIDEO ? FULL_STEPS : BASE_STEPS;

/** shape:
 *  step: "CONSENT" | "PERSONALITY" | "VOICE" | "VIDEO" | "REVIEW"
 *  personality: {...}
 *  voice: { blob, seconds, fileName, mime }
 *  video: { blob, seconds, fileName, mime }
 *  busy: boolean
 *  error: string
 */
function reducer(state, action) {
  switch (action.type) {
    case "NEXT":
      return { ...state, step: steps[Math.min(steps.indexOf(state.step) + 1, steps.length - 1)], error: "" };
    case "BACK":
      return { ...state, step: steps[Math.max(steps.indexOf(state.step) - 1, 0)], error: "" };
    case "SET_PERSONALITY":
      return { ...state, personality: action.payload };
    case "SET_VOICE":
      return { ...state, voice: action.payload };
    case "SET_VIDEO":
      return { ...state, video: action.payload };
    case "BUSY":
      return { ...state, busy: action.payload, error: action.payload ? "" : state.error };
    case "ERROR":
      return { ...state, error: action.payload || "Something went wrong." };
    case "RESET_ERROR":
      return { ...state, error: "" };
    default:
      return state;
  }
}

const initialState = {
  step: steps[0],
  personality: {
    about: "",
    tone: "Friendly",
    pace: "Medium",
    emojis: "Sometimes",
    languages: "English",
    preferred: "",
    avoided: "",
    signatures: "",
    sample1: "",
    sample2: "",
    sample3: "",
  },
  voice: null,
  video: null,
  busy: false,
  error: "",
};

/** ---------------------------
 *  Helpers
 * --------------------------*/
function fmtSeconds(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

async function postJSON(url, body) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`POST ${url} failed: ${r.status} ${txt}`);
  }
  return r.json();
}

// Pick a supported mime type for MediaRecorder on the current browser
function pickSupportedMime(kind) {
  const candidates = kind === "voice"
    ? ["audio/webm;codecs=opus", "audio/webm", "audio/mp4;codecs=mp4a.40.2", "audio/mp4"]
    : ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];
  for (const t of candidates) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) return t;
  }
  return kind === "voice" ? "audio/webm" : "video/webm";
}

function extFromMime(mime) {
  if (!mime) return "bin";
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("webm")) return "webm";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mpeg")) return "mp3";
  return "bin";
}

// Multipart uploader: supports either (a) single PUT (uploadUrl), or (b) multi-part (parts array)
async function multipartUpload({ initEndpoint, blob, kind }) {
  const init = await postJSON(initEndpoint, {
    mime: blob.type || (kind === "voice" ? "audio/webm" : "video/webm"),
    size: blob.size,
    parts: Math.ceil(blob.size / CHUNK_SIZE),
  });

  // Single-URL fast path
  if (init.uploadUrl && !init.parts) {
    const put = await fetch(init.uploadUrl, { method: "PUT", body: blob });
    if (!put.ok) {
      const txt = await put.text().catch(() => "");
      throw new Error(`${kind} upload failed: ${put.status} ${txt}`);
    }
    return { uploadId: init.uploadId || null, etags: null, completeUrl: init.completeUrl || null };
  }

  // Multi-part path
  const parts = init.parts || [];
  const etags = [];
  let offset = 0;

  for (let i = 0; i < parts.length; i++) {
    const chunk = blob.slice(offset, offset + CHUNK_SIZE);
    offset += CHUNK_SIZE;
    const res = await fetch(parts[i].url, { method: "PUT", body: chunk });
    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`${kind} part ${i + 1} failed: ${res.status} ${txt}`);
    }
    const etag = res.headers.get("ETag") || res.headers.get("etag");
    etags.push({ partNumber: parts[i].partNumber || i + 1, etag });
  }

  if (!init.completeUrl) return { uploadId: init.uploadId, etags, completeUrl: null };

  const complete = await fetch(init.completeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uploadId: init.uploadId, parts: etags }),
  });
  if (!complete.ok) {
    const txt = await complete.text().catch(() => "");
    throw new Error(`${kind} complete failed: ${complete.status} ${txt}`);
  }
  return { uploadId: init.uploadId, etags, completeUrl: init.completeUrl };
}

/** ---------------------------
 *  Page
 * --------------------------*/
export default function OnboardingPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Header step={state.step} />
      {state.error ? <Banner type="error" msg={state.error} onClose={() => dispatch({ type: "RESET_ERROR" })} /> : null}

      {state.step === "CONSENT" && (
        <ConsentStep onAgree={() => dispatch({ type: "NEXT" })} />
      )}

      {state.step === "PERSONALITY" && (
        <PersonalityStep
          value={state.personality}
          onChange={(v) => dispatch({ type: "SET_PERSONALITY", payload: v })}
          onNext={() => dispatch({ type: "NEXT" })}
          onBack={() => dispatch({ type: "BACK" })}
        />
      )}

      {state.step === "VOICE" && (
        <VoiceStep
          minSec={VOICE_MIN_SEC}
          maxSec={VOICE_MAX_SEC}
          script={NEUTRAL_SCRIPT}
          value={state.voice}
          onChange={(v) => dispatch({ type: "SET_VOICE", payload: v })}
          onNext={() => dispatch({ type: "NEXT" })}
          onBack={() => dispatch({ type: "BACK" })}
          setError={(m) => dispatch({ type: "ERROR", payload: m })}
        />
      )}

      {ENABLE_VIDEO && state.step === "VIDEO" && (
        <VideoStep
          minSec={VIDEO_MIN_SEC}
          maxSec={VIDEO_MAX_SEC}
          value={state.video}
          onChange={(v) => dispatch({ type: "SET_VIDEO", payload: v })}
          onNext={() => dispatch({ type: "NEXT" })}
          onBack={() => dispatch({ type: "BACK" })}
          setError={(m) => dispatch({ type: "ERROR", payload: m })}
        />
      )}

      {state.step === "REVIEW" && (
        <ReviewStep
          personality={state.personality}
          voice={state.voice}
          video={state.video}
          busy={state.busy}
          onBack={() => dispatch({ type: "BACK" })}
          onSubmit={async () => {
            try {
              dispatch({ type: "BUSY", payload: true });

              // 1) Save personality
              await postJSON("/api/twin/personality", { personality: state.personality });

              // 2) Upload voice (if present)
              if (state.voice?.blob) {
                await multipartUpload({
                  initEndpoint: "/api/twin/voice/init",
                  blob: state.voice.blob,
                  kind: "voice",
                });
              }

              // 3) Upload video (if present)
              if (ENABLE_VIDEO && state.video?.blob) {
                await multipartUpload({
                  initEndpoint: "/api/twin/video/init",
                  blob: state.video.blob,
                  kind: "video",
                });
              }

              // 4) Commit
              await postJSON("/api/twin/commit", { finalize: true });

              // 5) Go to success / dashboard
              window.location.href = "/twin";
            } catch (err) {
              dispatch({ type: "ERROR", payload: err?.message || "Submit failed." });
            } finally {
              dispatch({ type: "BUSY", payload: false });
            }
          }}
        />
      )}
    </main>
  );
}

/** ---------------------------
 *  Header + Banner
 * --------------------------*/
function Header({ step }) {
  const idx = steps.indexOf(step);
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">Create your Twin</h1>
      <p className="mt-1 text-sm text-gray-400">Step {idx + 1} of {steps.length}</p>
      <div className="mt-4 h-2 w-full bg-gray-800 rounded">
        <div className="h-2 rounded bg-gray-200" style={{ width: `${((idx + 1) / steps.length) * 100}%` }} />
      </div>
    </div>
  );
}

function Banner({ type = "info", msg, onClose }) {
  const color = type === "error" ? "bg-red-900/40 text-red-200 border-red-700" : "bg-gray-800 text-gray-100 border-gray-600";
  return (
    <div className={`mb-4 border px-3 py-2 rounded ${color} flex items-start justify-between gap-3`}>
      <span className="text-sm leading-6">{msg}</span>
      <button className="text-xs opacity-70 hover:opacity-100" onClick={onClose}>Close</button>
    </div>
  );
}

/** ---------------------------
 *  Step 0: Consent
 * --------------------------*/
function ConsentStep({ onAgree }) {
  const [checked, setChecked] = useState(false);
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Consent & Privacy</h2>
      <ul className="text-sm text-gray-300 list-disc pl-5 space-y-2">
        <li>We collect audio/video for the purpose of building your twin.</li>
        <li>Data is encrypted in transit and at rest. You can delete it later.</li>
        <li>Processing uses our private gateway with integrated AI/voice providers; your data stays protected and access-controlled.</li>
        <li>You can withdraw consent any time from Settings.</li>
      </ul>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        I agree to biometric processing (voice/video) and the privacy policy.
      </label>
      <div className="flex justify-end">
        <button
          className="px-4 py-2 rounded bg-gray-200 text-black disabled:opacity-40"
          disabled={!checked}
          onClick={onAgree}
        >
          Continue
        </button>
      </div>
    </section>
  );
}

/** ---------------------------
 *  Step 1: Personality
 * --------------------------*/
function PersonalityStep({ value, onChange, onNext, onBack }) {
  const [about, setAbout] = useState(value.about);
  const [tone, setTone] = useState(value.tone);
  const [pace, setPace] = useState(value.pace);
  const [emojis, setEmojis] = useState(value.emojis);
  const [languages, setLanguages] = useState(value.languages);
  const [preferred, setPreferred] = useState(value.preferred);
  const [avoided, setAvoided] = useState(value.avoided);
  const [signatures, setSignatures] = useState(value.signatures);
  const [sample1, setSample1] = useState(value.sample1);
  const [sample2, setSample2] = useState(value.sample2);
  const [sample3, setSample3] = useState(value.sample3);

  const wordCount = useMemo(() => (about.trim() ? about.trim().split(/\s+/).length : 0), [about]);
  const aboutOk = wordCount >= 300 && wordCount <= 800;

  function saveAndNext() {
    onChange({
      about,
      tone,
      pace,
      emojis,
      languages,
      preferred,
      avoided,
      signatures,
      sample1,
      sample2,
      sample3,
    });
    onNext();
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Personality Intake</h2>

      <div className="space-y-2">
        <label className="text-sm">About me (300–800 words)</label>
        <textarea
          className="w-full min-h-[160px] rounded border border-gray-700 bg-black/20 p-3"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Background, voice, audience, do/don't…"
        />
        <div className={`text-xs ${aboutOk ? "text-green-300" : "text-gray-400"}`}>
          Words: {wordCount} — {aboutOk ? "Looks good" : "Target 300–800"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Tone">
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded border border-gray-700 bg-black/20 p-2">
            <option>Friendly</option>
            <option>Direct</option>
            <option>Playful</option>
            <option>Formal</option>
          </select>
        </Field>
        <Field label="Pace">
          <select value={pace} onChange={(e) => setPace(e.target.value)} className="w-full rounded border border-gray-700 bg-black/20 p-2">
            <option>Short</option>
            <option>Medium</option>
            <option>Long</option>
          </select>
        </Field>
        <Field label="Emoji usage">
          <select value={emojis} onChange={(e) => setEmojis(e.target.value)} className="w-full rounded border border-gray-700 bg-black/20 p-2">
            <option>Never</option>
            <option>Sometimes</option>
            <option>Often</option>
          </select>
        </Field>
        <Field label="Languages/Dialects">
          <input value={languages} onChange={(e) => setLanguages(e.target.value)} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
        </Field>
      </div>

      <Field label="Preferred topics">
        <input value={preferred} onChange={(e) => setPreferred(e.target.value)} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
      </Field>
      <Field label="Avoided topics">
        <input value={avoided} onChange={(e) => setAvoided(e.target.value)} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
      </Field>
      <Field label="Signature phrases (comma-separated)">
        <input value={signatures} onChange={(e) => setSignatures(e.target.value)} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Sample reply #1">
          <input value={sample1} onChange={(e) => setSample1(e.target.value)} maxLength={120} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
        </Field>
        <Field label="Sample reply #2">
          <input value={sample2} onChange={(e) => setSample2(e.target.value)} maxLength={120} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
        </Field>
        <Field label="Sample reply #3">
          <input value={sample3} onChange={(e) => setSample3(e.target.value)} maxLength={120} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
        </Field>
      </div>

      <div className="flex justify-between pt-2">
        <button className="px-4 py-2 rounded border border-gray-700" onClick={onBack}>Back</button>
        <button className="px-4 py-2 rounded bg-gray-200 text-black disabled:opacity-40" disabled={!aboutOk} onClick={saveAndNext}>
          Continue
        </button>
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm">{label}</label>
      {children}
    </div>
  );
}

/** ---------------------------
 *  Step 2: Voice
 * --------------------------*/
function VoiceStep({ minSec, maxSec, script, value, onChange, onNext, onBack, setError }) {
  return (
    <MediaCapture
      kind="voice"
      accept="audio/*"
      minSec={minSec}
      maxSec={maxSec}
      help={<VoiceHelp script={script} />}
      value={value}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
      setError={setError}
    />
  );
}

function VoiceHelp({ script }) {
  return (
    <div className="text-xs text-gray-300 space-y-2">
      <p>Tips: quiet room, phone 20–30cm away, normal pace. Target 60–90 seconds.</p>
      <details className="rounded border border-gray-700 p-2">
        <summary className="cursor-pointer">Neutral script (English)</summary>
        <pre className="whitespace-pre-wrap text-gray-200">{script}</pre>
      </details>
    </div>
  );
}

/** ---------------------------
 *  Step 3: Video (optional)
 * --------------------------*/
function VideoStep({ minSec, maxSec, value, onChange, onNext, onBack, setError }) {
  return (
    <MediaCapture
      kind="video"
      accept="video/*"
      minSec={minSec}
      maxSec={maxSec}
      help={<div className="text-xs text-gray-300">Use front lighting, neutral background, eye level framing. Target 20–30 seconds @ 30fps.</div>}
      value={value}
      onChange={onChange}
      onNext={onNext}
      onBack={onBack}
      setError={setError}
    />
  );
}

/** ---------------------------
 *  Reusable MediaCapture (voice/video)
 * --------------------------*/
function MediaCapture({ kind, accept, minSec, maxSec, help, value, onChange, onNext, onBack, setError }) {
  const mediaRef = useRef(null);
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const rafRef = useRef(null);
  const audioCtxRef = useRef(null);
  const revokeUrlRef = useRef(null);

  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(value?.seconds || 0);
  const [chunks, setChunks] = useState([]);
  const [level, setLevel] = useState(0); // VU meter (voice)
  const [fileName, setFileName] = useState(value?.fileName || "");

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && !!navigator.mediaDevices && !!window.MediaRecorder);
    return () => {
      if (revokeUrlRef.current) {
        URL.revokeObjectURL(revokeUrlRef.current);
        revokeUrlRef.current = null;
      }
    };
  }, []);

  // Simple timer
  useEffect(() => {
    let timer;
    if (recording) {
      const start = Date.now() - seconds * 1000;
      timer = setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 250);
    }
    return () => clearInterval(timer);
  }, [recording]);

  async function initAnalyzer(stream) {
    if (kind !== "voice") return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    function loop() {
      analyser.getByteTimeDomainData(data);
      let peak = 0;
      for (let i = 0; i < data.length; i++) {
        const v = Math.abs(data[i] - 128) / 128;
        if (v > peak) peak = v;
      }
      setLevel(peak);
      rafRef.current = requestAnimationFrame(loop);
    }
    loop();
  }

  function stopTracks() {
    streamRef.current?.getTracks()?.forEach((t) => t.stop());
    streamRef.current = null;
    if (audioCtxRef.current) { try { audioCtxRef.current.close(); } catch {} audioCtxRef.current = null; }
    if (kind === "video" && mediaRef.current) mediaRef.current.srcObject = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  async function startRec() {
    try {
      setError("");
      setSeconds(0);
      setChunks([]);

      const constraints = kind === "voice"
        ? { audio: { echoCancellation: true, noiseSuppression: true }, video: false }
        : { audio: true, video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30, max: 30 } } };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (kind === "video") {
        if (mediaRef.current) mediaRef.current.srcObject = stream;
      } else {
        await initAnalyzer(stream);
      }

      const selectedMime = pickSupportedMime(kind);
      const rec = new MediaRecorder(stream, { mimeType: selectedMime });
      recRef.current = rec;

      let autoStopTimer;
      rec.onstart = () => {
        autoStopTimer = setTimeout(() => { try { rec.stop(); } catch {} }, maxSec * 1000);
      };
      rec.ondataavailable = (e) => e.data && setChunks((p) => [...p, e.data]);
      rec.onstop = async () => {
        clearTimeout(autoStopTimer);
        try {
          stopTracks();

          const blob = new Blob(chunks, { type: selectedMime });
          const ok = seconds >= minSec && seconds <= maxSec;
          if (!ok) {
            onChange(null);
            setError(`Please record between ${minSec} and ${maxSec} seconds. You recorded ${seconds}s.`);
            return;
          }

          const ext = extFromMime(selectedMime);
          onChange({ blob, seconds, fileName: fileName || `${kind}-${Date.now()}.${ext}`, mime: selectedMime });
        } catch (err) {
          setError(err?.message || "Failed to finalize recording.");
        } finally {
          setRecording(false);
        }
      };

      rec.start(250);
      setRecording(true);
    } catch (err) {
      setError("Permissions denied or unsupported. Use file upload below.");
    }
  }

  function stopRec() {
    try {
      recRef.current?.stop();
    } catch {
      setRecording(false);
      stopTracks();
    }
  }

  function clearMedia() {
    setSeconds(0);
    setChunks([]);
    if (revokeUrlRef.current) {
      URL.revokeObjectURL(revokeUrlRef.current);
      revokeUrlRef.current = null;
    }
    onChange(null);
  }

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (revokeUrlRef.current) {
      URL.revokeObjectURL(revokeUrlRef.current);
      revokeUrlRef.current = null;
    }
    const url = URL.createObjectURL(f);
    revokeUrlRef.current = url;

    const el = document.createElement(kind === "voice" ? "audio" : "video");
    el.src = url;
    el.addEventListener("loadedmetadata", () => {
      const dur = Math.floor(el.duration || 0);
      if (dur && (dur < minSec || dur > maxSec)) {
        setError(`Please select a ${kind} file between ${minSec} and ${maxSec} seconds.`);
        return;
      }
      onChange({ blob: f, seconds: dur || 0, fileName: f.name, mime: f.type || "" });
      setSeconds(dur || 0);
    }, { once: true });
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{kind === "voice" ? "Voice Capture" : "Video Capture"}</h2>
      <div className="text-sm text-gray-300">{help}</div>

      {/* Recorder */}
      {supported ? (
        <div className="rounded border border-gray-700 p-3 space-y-3">
          {kind === "video" ? (
            <video ref={mediaRef} className="w-full rounded bg-black/40" autoPlay muted playsInline />
          ) : (
            <VU level={level} />
          )}
          <div className="flex items-center gap-3">
            {!recording ? (
              <button className="px-4 py-2 rounded bg-gray-200 text-black" onClick={startRec}>Record</button>
            ) : (
              <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={stopRec}>Stop</button>
            )}
            <span className="text-xs text-gray-400">Duration: {fmtSeconds(seconds)} (target {minSec}-{maxSec}s)</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400">MediaRecorder not available. Use file upload below.</div>
      )}

      {/* Fallback upload */}
      <div className="space-y-2">
        <label className="text-sm">Or upload a file ({accept})</label>
        <input type="file" accept={accept} onChange={onFile} />
      </div>

      {/* Preview */}
      {value?.blob ? (
        <div className="rounded border border-gray-700 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Selected: <span className="font-mono">{value.fileName}</span> — {fmtSeconds(value.seconds)}
            </div>
            <button className="text-xs underline" onClick={clearMedia}>Clear</button>
          </div>
          {kind === "voice" ? (
            <audio controls src={URL.createObjectURL(value.blob)} />
          ) : (
            <video controls className="w-full" src={URL.createObjectURL(value.blob)} />
          )}
          <div className="text-xs text-gray-400">We’ll validate and upload in chunks on submit.</div>
        </div>
      ) : null}

      <div className="flex justify-between pt-2">
        <button className="px-4 py-2 rounded border border-gray-700" onClick={onBack}>Back</button>
        <button className="px-4 py-2 rounded bg-gray-200 text-black disabled:opacity-40" disabled={!value?.blob} onClick={onNext}>
          Continue
        </button>
      </div>
    </section>
  );
}

function VU({ level }) {
  const pct = Math.round(Math.min(100, Math.max(0, level * 100)));
  return (
    <div className="w-full h-2 bg-gray-800 rounded">
      <div className="h-2 rounded bg-gray-200 transition-all" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** ---------------------------
 *  Step 4: Review & Create
 * --------------------------*/
function ReviewStep({ personality, voice, video, busy, onBack, onSubmit }) {
  function line(label, value) {
    return (
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-gray-100 max-w-[70%] text-right">{String(value || "—")}</span>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Review & Create</h2>

      <div className="rounded border border-gray-700 p-3 space-y-3">
        {line("Tone", personality.tone)}
        {line("Pace", personality.pace)}
        {line("Emojis", personality.emojis)}
        {line("Languages", personality.languages)}
        {line("Preferred", personality.preferred)}
        {line("Avoided", personality.avoided)}
        {line("Signature phrases", personality.signatures)}
        {line("Samples", [personality.sample1, personality.sample2, personality.sample3].filter(Boolean).join(" | "))}
        <details className="mt-2">
          <summary className="cursor-pointer text-sm underline">About me (preview)</summary>
          <p className="text-sm whitespace-pre-wrap mt-2">{personality.about || "—"}</p>
        </details>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded border border-gray-700 p-3 space-y-2">
          <div className="text-sm font-medium">Voice</div>
          {voice?.blob ? (
            <>
              <div className="text-xs text-gray-400">Duration: {voice.seconds}s · {voice.fileName}</div>
              <audio controls src={URL.createObjectURL(voice.blob)} />
            </>
          ) : (<div className="text-xs text-gray-400">Not provided</div>)}
        </div>
        {ENABLE_VIDEO && (
          <div className="rounded border border-gray-700 p-3 space-y-2">
            <div className="text-sm font-medium">Video</div>
            {video?.blob ? (
              <>
                <div className="text-xs text-gray-400">Duration: {video.seconds}s · {video.fileName}</div>
                <video controls className="w-full" src={URL.createObjectURL(video.blob)} />
              </>
            ) : (<div className="text-xs text-gray-400">Not provided</div>)}
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button className="px-4 py-2 rounded border border-gray-700" onClick={onBack} disabled={busy}>Back</button>
        <button className="px-4 py-2 rounded bg-gray-200 text-black disabled:opacity-40" onClick={onSubmit} disabled={busy}>
          {busy ? "Creating…" : "Create Twin"}
        </button>
      </div>
    </section>
  );
}
