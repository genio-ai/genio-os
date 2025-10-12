// File: app/components/twin/OnboardingPage.js
"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getBrowserSupabase } from "../../../lib/supabase.client";

/* --------------------------------
 * Feature Flags
 * -------------------------------- */
const ENABLE_VIDEO = false; // voice only

/* --------------------------------
 * Constants
 * -------------------------------- */
const VOICE_MIN_SEC = 20;
const VOICE_MAX_SEC = 120;

const NEUTRAL_SCRIPT = `Please read this paragraph clearly at a normal pace:

Hello, my name is ______. I’m recording this sample to help my digital twin learn my voice.
I usually speak in a calm, friendly tone, and I prefer concise replies.
Here are a few phrases I say often in daily conversations.
This sample is around one minute long. Thank you.`;

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
      return { ...state, step: steps[Math.min(steps.indexOf(state.step) + 1, steps.length - 1)], error: "" };
    case "BACK":
      return { ...state, step: steps[Math.max(steps.indexOf(state.step) - 1, 0)], error: "" };
    case "SET_PERSONALITY":
      return { ...state, personality: action.payload };
    case "SET_VOICE":
      return { ...state, voice: action.payload };
    case "BUSY":
      return { ...state, busy: action.payload, error: action.payload ? "" : state.error };
    case "ERROR":
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
  voice: null,
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
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);

  const voiceOrder = (isIOS || isSafari)
    ? ["audio/mp4;codecs=mp4a.40.2", "audio/mp4", "audio/webm;codecs=opus", "audio/webm"]
    : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4;codecs=mp4a.40.2", "audio/mp4"];

  for (const t of voiceOrder) {
    if (window.MediaRecorder?.isTypeSupported?.(t)) return t;
  }
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
  return j;
}

/* --------------------------------
 * Page
 * -------------------------------- */
export default function OnboardingPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Header step={state.step} />
      {state.error && <Banner type="error" msg={state.error} onClose={() => dispatch({ type: "RESET_ERROR" })} />}

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

              const supabase = getBrowserSupabase();
              const { data: { user }, error: authErr } = await supabase.auth.getUser();
              if (authErr) throw authErr;
              if (!user?.id) throw new Error("Not signed in");

              const userId = user.id;
              await postJSON("/api/twin/personality", { personality: state.personality, userId });

              if (state.voice?.blob) {
                const file = new File(
                  [state.voice.blob],
                  state.voice.fileName || `voice-${Date.now()}.${extFromMime(state.voice.mime)}`,
                  { type: state.voice.mime || state.voice.blob.type || "audio/webm" }
                );
                if (!file.size) throw new Error("Empty file");
                await uploadVoiceFile(file);
              }

              await postJSON("/api/twin/commit", { finalize: true });
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
