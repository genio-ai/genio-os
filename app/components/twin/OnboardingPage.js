// File: app/components/twin/OnboardingPage.js
"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";

/* --------------------------------
 * Feature Flags
 * -------------------------------- */
const ENABLE_VIDEO = false; // voice only

/* --------------------------------
 * Constants
 * -------------------------------- */
const VOICE_MIN_SEC = 20;
const VOICE_MAX_SEC = 120;

const NEUTRAL_SCRIPT = [
  "Please read this paragraph clearly at a normal pace:",
  "",
  "Hello, my name is ______. I’m recording this sample to help my digital twin learn my voice.",
  "I usually speak in a calm, friendly tone, and I prefer concise replies.",
  "Here are a few phrases I say often in daily conversations.",
  "This sample is around one minute long. Thank you."
].join("\n");

/* --------------------------------
 * Steps
 * -------------------------------- */
const BASE_STEPS = ["CONSENT", "PERSONALITY", "VOICE", "REVIEW"];
const steps = BASE_STEPS;

/* --------------------------------
 * Reducer
 * -------------------------------- */
function reducer(state, action) {
  switch (action.type) {
    case "NEXT":
      return {
        ...state,
        step: steps[Math.min(steps.indexOf(state.step) + 1, steps.length - 1)],
        error: ""
      };
    case "BACK":
      return {
        ...state,
        step: steps[Math.max(steps.indexOf(state.step) - 1, 0)],
        error: ""
      };
    case "SET_PERSONALITY":
      return { ...state, personality: action.payload };
    case "SET_VOICE":
      return { ...state, voice: action.payload };
    case "BUSY":
      return { ...state, busy: action.payload, error: action.payload ? "" : state.error };
    case "ERROR":
      // do not force a default when payload is empty/null
      return { ...state, error: action.payload ?? "" };
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
    sample3: ""
  },
  voice: null, // { blob, seconds, fileName, mime }
  busy: false,
  error: ""
};

/* --------------------------------
 * Helpers
 * -------------------------------- */
function fmtSeconds(s) {
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

async function postJSON(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) {
    const txt = await r.text().catch(() => "");
    throw new Error(`POST ${url} failed: ${r.status} ${txt}`);
  }
  return r.json();
}

function pickSupportedMime(kind) {
  // voice only here; keep generic for future
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  const voiceOrder = (isIOS || isSafari)
    ? ["audio/mp4;codecs=mp4a.40.2", "audio/mp4", "audio/webm;codecs=opus", "audio/webm"]
    : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4;codecs=mp4a.40.2", "audio/mp4"];

  for (const t of voiceOrder) {
    if (window.MediaRecorder?.isTypeSupported?.(t)) return t;
  }
  // safe default
  return "audio/webm";
}

function extFromMime(mime) {
  if (!mime) return "bin";
  if (mime.includes("mp4")) return "m4a";
  if (mime.includes("webm")) return "webm";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mpeg")) return "mp3";
  return "bin";
}

async function uploadVoiceFile(file) {
  const fd = new FormData();
  fd.append("file", file);
  const r = await fetch("/api/twin/voice/upload", { method: "POST", body: fd });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j?.ok) throw new Error(j?.error || "Voice upload failed");
  return j; // { ok, path, url }
}

/* --------------------------------
 * Safe ObjectURL Hook
 * -------------------------------- */
function useObjectURL(blob) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!blob || typeof window === "undefined") {
      setUrl("");
      return;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => {
      try { URL.revokeObjectURL(u); } catch {}
    };
  }, [blob]);
  return url;
}

/* --------------------------------
 * Page
 * -------------------------------- */
export default function OnboardingPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Header step={state.step} />
      {state.error ? (
        <Banner type="error" msg={state.error} onClose={() => dispatch({ type: "RESET_ERROR" })} />
      ) : null}

      {state.step === "CONSENT" && <ConsentStep onAgree={() => dispatch({ type: "NEXT" })} />}

      {state.step === "PERSONALITY" && (
        <PersonalityStep
          value={state.personality}
          onChange={(v) => dispatch({ type: "SET_PERSONALITY", payload: v })}
          onNext={() => dispatch({ type: "NEXT" })}
          onBack={() => dispatch({ type: "BACK" })}
          setError={(m) => dispatch({ type: "ERROR", payload: m })}
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

      {state.step === "REVIEW" && (
        <ReviewStep
          personality={state.personality}
          voice={state.voice}
          busy={state.busy}
          onBack={() => dispatch({ type: "BACK" })}
          onSubmit={async () => {
            try {
              dispatch({ type: "BUSY", payload: true });

              // Fetch userId from Supabase and pass to API
              const { getBrowserSupabase } = await import("../../lib/supabase.client.js");
              const supabase = getBrowserSupabase();
              const { data: { user }, error: authErr } = await supabase.auth.getUser();
              if (authErr) throw authErr;
              if (!user?.id) throw new Error("Not signed in");
              const userId = user.id;

              // 1) personality with userId
              await postJSON("/api/twin/personality", { personality: state.personality, userId });

              // 2) voice upload (single POST)
              if (state.voice?.blob) {
                const file = new File(
                  [state.voice.blob],
                  state.voice.fileName || `voice-${Date.now()}.${extFromMime(state.voice.mime)}`,
                  { type: state.voice.mime || state.voice.blob.type || "audio/webm" }
                );
                if (!file.size) throw new Error("Empty file");
                await uploadVoiceFile(file);
              }

              // 3) finalize
              await postJSON("/api/twin/commit", { finalize: true });

              // 4) redirect
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

/* --------------------------------
 * Header + Banner
 * -------------------------------- */
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

/* --------------------------------
 * Step 0: Consent
 * -------------------------------- */
function ConsentStep({ onAgree }) {
  const [checked, setChecked] = useState(false);
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Consent & Privacy</h2>
      <ul className="text-sm text-gray-300 list-disc pl-5 space-y-2">
        <li>We collect audio only for building your twin.</li>
        <li>Data is encrypted in transit and at rest. You can delete it later.</li>
        <li>Processing uses our private gateway with integrated AI/voice providers; your data stays protected.</li>
        <li>You can withdraw consent any time from Settings.</li>
      </ul>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
        I agree to biometric processing (voice) and the privacy policy.
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

/* --------------------------------
 * Step 1: Personality
 * -------------------------------- */
function PersonalityStep({ value, onChange, onNext, onBack, setError }) {
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
  const aboutOk = wordCount >= 50 || about.trim().length >= 300;
  const aboutMsg = aboutOk ? "Looks good" : "Recommended ≈50+ words (you can continue)";

  function saveAndNext() {
    if (!aboutOk) {
      setError?.("Short bio is okay for now. You can refine later.");
    }
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
      sample3
    });
    onNext();
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Personality Intake</h2>

      <div className="space-y-2">
        <label className="text-sm">About me (≈50+ words, can edit later)</label>
        <textarea
          className="w-full min-h-[160px] rounded border border-gray-700 bg-black/20 p-3"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Background, voice, audience, do/don't…"
        />
        <div className={`text-xs ${aboutOk ? "text-green-300" : "text-gray-400"}`}>
          Words: {wordCount} — {aboutMsg}
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
        <Field label="Sample reply #1 (optional)">
          <input value={sample1} onChange={(e) => setSample1(e.target.value)} maxLength={120} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
        </Field>
        <Field label="Sample reply #2 (optional)">
          <input value={sample2} onChange={(e) => setSample2(e.target.value)} maxLength={120} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
        </Field>
        <Field label="Sample reply #3 (optional)">
          <input value={sample3} onChange={(e) => setSample3(e.target.value)} maxLength={120} className="w-full rounded border border-gray-700 bg-black/20 p-2" />
        </Field>
      </div>

      <div className="flex justify-between pt-2">
        <button className="px-4 py-2 rounded border border-gray-700" onClick={onBack}>Back</button>
        <button className="px-4 py-2 rounded bg-gray-200 text-black" onClick={saveAndNext}>
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

/* --------------------------------
 * Step 2: Voice
 * -------------------------------- */
function VoiceStep({ minSec, maxSec, script, value, onChange, onNext, onBack, setError }) {
  return (
    <MediaCapture
      minSec={minSec}
      maxSec={maxSec}
      script={script}
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
      <p>Tips: quiet room, phone 20–30cm away, normal pace. Recommended 60–90 seconds.</p>
      <details className="rounded border border-gray-700 p-2">
        <summary className="cursor-pointer">Neutral script (English)</summary>
        <pre className="whitespace-pre-wrap text-gray-200">{script}</pre>
      </details>
    </div>
  );
}

/* --------------------------------
 * MediaCapture (voice-only)
 * -------------------------------- */
function MediaCapture({ minSec, maxSec, script, value, onChange, onNext, onBack, setError }) {
  const recRef = useRef(null);           // MediaRecorder
  const streamRef = useRef(null);        // MediaStream
  const chunksRef = useRef([]);          // chunks (avoid state races on iOS)
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);
  const revokeUrlRef = useRef(null);
  const startTimeRef = useRef(0);

  const [supported, setSupported] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(value?.seconds || 0);
  const [level, setLevel] = useState(0); // VU meter
  const [fileName, setFileName] = useState(value?.fileName || "");
  const [chunks, setChunks] = useState([]); // UI-only (optional)

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && !!navigator.mediaDevices && !!window.MediaRecorder);
    return () => {
      if (revokeUrlRef.current) {
        URL.revokeObjectURL(revokeUrlRef.current);
        revokeUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let timer;
    if (recording) {
      const start = Date.now();
      startTimeRef.current = start;
      timer = setInterval(() => {
        setSeconds(Math.floor((Date.now() - start) / 1000));
      }, 250);
    }
    return () => clearInterval(timer);
  }, [recording]);

  async function initAnalyzer(stream) {
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
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  async function startRec() {
    try {
      setError?.(null);
      setSeconds(0);
      chunksRef.current = [];
      setChunks([]);

      if (!window.isSecureContext || !navigator?.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        throw new Error("Microphone not available in this context.");
      }

      // iOS/Safari friendly: try advanced, then fallback
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: false
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }
      streamRef.current = stream;

      await initAnalyzer(stream).catch(() => {});

      const mime = pickSupportedMime("voice");
      const rec = new MediaRecorder(stream, { mimeType: mime });
      recRef.current = rec;

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size) {
          chunksRef.current.push(e.data);
          setChunks((p) => [...p, e.data]);
        }
      };

      rec.onstop = async () => {
        try {
          try { rec.requestData?.(); } catch {}
          await new Promise((r) => setTimeout(r, 40)); // flush last chunk on Safari

          stopTracks();

          const blob = new Blob(chunksRef.current, { type: mime });
          if (!blob || !blob.size) throw new Error("Empty file");

          // derive seconds (fallback to elapsed time)
          const secondsRecorded = Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000));

          const ext = extFromMime(mime);
          onChange({
            blob,
            seconds: secondsRecorded,
            fileName: fileName || `voice-${Date.now()}.${ext}`,
            mime
          });

          if (secondsRecorded < minSec || secondsRecorded > maxSec) {
            setError?.(`Recommended length ${minSec}-${maxSec}s. Yours is ${secondsRecorded}s.`);
          }
        } catch (err) {
          onChange(null);
          setError?.(err?.message || "Failed to finalize recording.");
        } finally {
          setRecording(false);
        }
      };

      rec.start(250); // required for Safari to emit dataavailable
      setRecording(true);
    } catch (e) {
      onChange(null);
      setRecording(false);
      setError?.("Microphone permission is blocked by the browser.");
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
    chunksRef.current = [];
    setChunks([]);
    if (revokeUrlRef.current) {
      URL.revokeObjectURL(revokeUrlRef.current);
      revokeUrlRef.current = null;
    }
    onChange(null);
  }

  function onFile(e) {
    setError?.(null);
    const f = e.target.files?.[0];
    if (!f) return;

    if (revokeUrlRef.current) {
      URL.revokeObjectURL(revokeUrlRef.current);
      revokeUrlRef.current = null;
    }
    const url = URL.createObjectURL(f);
    revokeUrlRef.current = url;

    const el = document.createElement("audio");
    el.preload = "metadata";
    el.src = url;

    el.addEventListener(
      "loadedmetadata",
      () => {
        const dur = Math.floor(el.duration || 0);
        if (dur && (dur < minSec || dur > maxSec)) {
          setError?.(`Recommended length ${minSec}-${maxSec}s. Yours is ${dur}s.`);
        }
        onChange({ blob: f, seconds: dur || 0, fileName: f.name, mime: f.type || "" });
        setSeconds(dur || 0);
      },
      { once: true }
    );

    el.addEventListener(
      "error",
      () => {
        setError?.("Could not read duration; you can still continue.");
        onChange({ blob: f, seconds: 0, fileName: f.name, mime: f.type || "" });
      },
      { once: true }
    );
  }

  const previewUrl = useObjectURL(value?.blob);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Voice Capture</h2>
      <div className="text-sm text-gray-300"><VoiceHelp script={script} /></div>

      {supported ? (
        <div className="rounded border border-gray-700 p-3 space-y-3">
          <VU level={level} />
          <div className="flex items-center gap-3">
            {!recording ? (
              <button className="px-4 py-2 rounded bg-gray-200 text-black" onClick={startRec}>Record</button>
            ) : (
              <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={stopRec}>Stop</button>
            )}
            <span className="text-xs text-gray-400">
              Duration: {fmtSeconds(seconds)} (recommended {minSec}-{maxSec}s)
            </span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-400">MediaRecorder not available. Use file upload below.</div>
      )}

      <div className="space-y-2">
        <label className="text-sm">Or upload a file (audio only)</label>
        <input type="file" accept="audio/*" onChange={onFile} />
      </div>

      {value?.blob ? (
        <div className="rounded border border-gray-700 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              Selected: <span className="font-mono">{value.fileName}</span> — {fmtSeconds(value.seconds)}
            </div>
            <button className="text-xs underline" onClick={clearMedia}>Clear</button>
          </div>
          {previewUrl ? <audio controls src={previewUrl} /> : null}
          <div className="text-xs text-gray-400">This will upload on the final submit.</div>
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

/* --------------------------------
 * Step 3: Review & Create
 * -------------------------------- */
function ReviewStep({ personality, voice, busy, onBack, onSubmit }) {
  function line(label, value) {
    return (
      <div className="flex items-start justify-between gap-4">
        <span className="text-sm text-gray-400">{label}</span>
        <span className="text-sm text-gray-100 max-w-[70%] text-right">{String(value || "—")}</span>
      </div>
    );
  }

  const previewUrl = useObjectURL(voice?.blob);

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
              {previewUrl ? <audio controls src={previewUrl} /> : null}
            </>
          ) : (
            <div className="text-xs text-gray-400">Not provided</div>
          )}
        </div>
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
