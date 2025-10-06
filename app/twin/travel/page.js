"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Twin Travel Mode — Autonomous, Voice-Only, Hands-Free
 * - One toggle (Start/Stop)
 * - VAD (voice activity detection) to auto-start/stop turns
 * - Auto language detection (no manual selection)
 * - Auto partner language learning (remembers the other speaker's language)
 * - Auto translate + reply using the user's cloned voice via /api/twin/say
 * - Auto-ducking while speaking to avoid feedback
 * - Smart turn caps, cooldowns, and error hardening for mobile browsers
 *
 * Backends expected (already added earlier):
 *   POST /api/travel/asr         -> { ok:true, text, lang }
 *   POST /api/travel/translate   -> { ok:true, text }
 *   POST /api/twin/say           -> audio bytes (audio/mpeg|audio/wav) in target language
 *
 * Notes:
 * - Wire real userId/twinId from your auth/session. Placeholders included.
 * - Auto-start supported via ?autostart=1 (for Siri Shortcuts / deep links).
 */

export default function TravelModePage() {
  // Session wiring (replace with real auth state if available)
  const userId = useEnv("NEXT_PUBLIC_TWIN_USER_ID", "demo");
  const twinId = useEnv("NEXT_PUBLIC_TWIN_ID", "twin_demo");

  // Heuristic: user's primary language (only to bias "who spoke")
  const myPrimaryLang = useEnv("NEXT_PUBLIC_TWIN_PRIMARY_LANG", "ar");

  // UI state
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | listening | recording | thinking | speaking
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionStats, setSessionStats] = useState({ turns: 0, lastLangThem: "" });

  // Learned partner language (updated when we observe consistent non-user language)
  const learnedPartnerLangRef = useRef("");

  // I/O + WebAudio
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const srcRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const outRef = useRef(null);

  // VAD parameters (tuned for phone mics + typical indoor SNR)
  const vad = useRef({
    rmsThreshold: 0.016,   // sensitivity (lower => more sensitive)
    startHoldMs: 120,      // ms above threshold to start a turn
    endSilenceMs: 650,     // ms below threshold to end a turn
    maxTurnMs: 8000,       // hard cap per turn to keep flow snappy
    minGapMs: 220,         // guard between turns to avoid chatter
  });

  // VAD state
  const activeRef = useRef(false);
  const startedAtRef = useRef(0);
  const silenceAtRef = useRef(0);
  const lastTurnEndedAtRef = useRef(0);

  // While speaking we fully suspend VAD to avoid self-trigger
  const speakingGuardRef = useRef(false);

  useEffect(() => {
    const qp = new URLSearchParams(window.location.search);
    if (qp.get("autostart") === "1") start().catch(() => {});
    return () => cleanupAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function useEnv(key, fallback) {
    // Read from NEXT_PUBLIC_* at build-time if injected, else fallback
    if (typeof process !== "undefined" && process.env && process.env[key]) {
      return process.env[key];
    }
    return fallback;
  }

  function bumpStats(partnerLangGuess = "") {
    setSessionStats((s) => {
      const lastLangThem = partnerLangGuess || s.lastLangThem || "";
      return { turns: s.turns + 1, lastLangThem };
    });
  }

  async function start() {
    try {
      setErrorMsg("");
      await initIO();
      learnedPartnerLangRef.current = ""; // reset between sessions
      setPhase("listening");
      setRunning(true);
      loopVAD();
    } catch (e) {
      setErrorMsg(normalizeErr(e));
      cleanupAll();
    }
  }

  function stop() {
    setRunning(false);
    setPhase("idle");
    cleanupAll();
  }

  async function initIO() {
    // Microphone with built-in AEC/NS/AGC
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    streamRef.current = stream;

    // Recorder
    const mime = pickMime();
    const rec = new MediaRecorder(stream, { mimeType: mime });
    recRef.current = rec;
    chunksRef.current = [];
    rec.ondataavailable = (e) => e.data && chunksRef.current.push(e.data);
    rec.onstop = () => {
      // Defer to next tick to avoid blocking the stop()
      setTimeout(async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: rec.mimeType });
          chunksRef.current = [];
          await handleTurn(blob);
        } catch (err) {
          setErrorMsg(normalizeErr(err));
        }
      }, 0);
    };

    // WebAudio graph for VAD
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    audioCtxRef.current = ctx;

    const src = ctx.createMediaStreamSource(stream);
    srcRef.current = src;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);
    analyserRef.current = analyser;

    // Output audio
    outRef.current = new Audio();
    outRef.current.preload = "auto";
  }

  function cleanupAll() {
    try { if (rafRef.current) cancelAnimationFrame(rafRef.current); } catch {}
    rafRef.current = null;

    try { recRef.current?.stop(); } catch {}
    recRef.current = null;
    chunksRef.current = [];

    try { streamRef.current?.getTracks()?.forEach((t) => t.stop()); } catch {}
    streamRef.current = null;

    try { srcRef.current?.disconnect(); } catch {}
    srcRef.current = null;

    try { audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;

    analyserRef.current = null;

    activeRef.current = false;
    startedAtRef.current = 0;
    silenceAtRef.current = 0;
    lastTurnEndedAtRef.current = performance.now();
    speakingGuardRef.current = false;
  }

  function pickMime() {
    const cands = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4;codecs=mp4a.40.2",
      "audio/mp4",
    ];
    for (const t of cands) if (window.MediaRecorder?.isTypeSupported?.(t)) return t;
    return "audio/webm";
  }

  /** VAD main loop */
  function loopVAD() {
    const a = analyserRef.current;
    if (!a) return;

    const data = new Uint8Array(a.fftSize);
    const now = () => performance.now();

    const tick = () => {
      if (!running) return;

      // Full ducking while speaking
      if (speakingGuardRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Turn gap guard
      if (now() - lastTurnEndedAtRef.current < vad.current.minGapMs) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      a.getByteTimeDomainData(data);
      // RMS
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      const t = now();
      const { rmsThreshold, startHoldMs, endSilenceMs, maxTurnMs } = mapVad(vad.current);

      if (!activeRef.current) {
        if (rms > rmsThreshold) {
          if (!startedAtRef.current) startedAtRef.current = t;
          if (t - startedAtRef.current >= startHoldMs) {
            activeRef.current = true;
            silenceAtRef.current = 0;
            startedAtRef.current = t;
            startRec();
          }
        } else {
          startedAtRef.current = 0;
        }
      } else {
        if (rms <= rmsThreshold) {
          if (!silenceAtRef.current) silenceAtRef.current = t;
          if (t - silenceAtRef.current >= endSilenceMs) {
            endRec();
          }
        } else {
          silenceAtRef.current = 0;
        }
        if (t - startedAtRef.current >= maxTurnMs) {
          endRec(); // hard stop
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  function startRec() {
    try {
      chunksRef.current = [];
      recRef.current?.start(250);
      setPhase("recording");
    } catch (e) {
      setErrorMsg(normalizeErr(e));
    }
  }

  function endRec() {
    try {
      setPhase("thinking");
      recRef.current?.stop();
      activeRef.current = false;
      lastTurnEndedAtRef.current = performance.now();
      startedAtRef.current = 0;
      silenceAtRef.current = 0;
    } catch {
      // ignore
    }
  }

  /** One complete conversational turn */
  async function handleTurn(blob) {
    try {
      // 1) ASR with auto language detection
      const asr = await callASR(blob);
      const spoken = (asr?.text || "").trim();
      const detected = normLang(asr?.lang || "");

      if (!spoken) {
        setPhase("listening");
        return;
      }

      // Determine speaker: if detected ~ myPrimaryLang => me; else partner
      const meSpoke = sameLang(detected, myPrimaryLang);
      if (!meSpoke) {
        // Learn partner language if consistent
        const prev = learnedPartnerLangRef.current;
        if (!prev || prev !== detected) learnedPartnerLangRef.current = detected;
      }

      // 2) Choose target language
      const target =
        meSpoke
          ? (learnedPartnerLangRef.current || "en")  // speak to partner in their language if known
          : myPrimaryLang;                            // bring partner's speech back to me in my language

      // 3) Translate
      const tr = await callTranslate(spoken, detected, target);
      const outText = (tr?.text || "").trim();
      if (!outText) {
        setPhase("listening");
        return;
      }

      // 4) TTS (always user's cloned voice)
      speakingGuardRef.current = true;
      setPhase("speaking");

      const audioBlob = await callSay(outText, target);
      if (audioBlob) await playAudio(audioBlob);

      // Cooldown to avoid residual self-trigger
      await sleep(160);
      speakingGuardRef.current = false;

      bumpStats(meSpoke ? (learnedPartnerLangRef.current || target) : ""); // update stats
      setPhase("listening");
    } catch (e) {
      setErrorMsg(normalizeErr(e));
      setPhase("listening");
    }
  }

  // ---- Backend calls ----
  async function callASR(blob) {
    const fd = new FormData();
    fd.append("audio", blob, "turn.webm");
    // No hint => allow pure auto-detect. If needed, bias with:
    // fd.append("hintLang", myPrimaryLang);
    const r = await fetch("/api/travel/asr", { method: "POST", body: fd });
    if (!r.ok) throw new Error("ASR failed");
    return r.json();
  }

  async function callTranslate(text, src, tgt) {
    const r = await fetch("/api/travel/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang: src, targetLang: tgt }),
    });
    if (!r.ok) throw new Error("Translate failed");
    return r.json();
  }

  async function callSay(text, targetLang) {
    const r = await fetch("/api/twin/say", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang, userId, twinId }),
    });
    if (!r.ok) throw new Error("TTS failed");
    const ab = await r.arrayBuffer();
    return new Blob([ab], { type: r.headers.get("Content-Type") || "audio/mpeg" });
  }

  async function playAudio(blob) {
    try {
      const url = URL.createObjectURL(blob);
      outRef.current.src = url;
      await outRef.current.play();
      await new Promise((resolve) => {
        const onEnd = () => {
          outRef.current.removeEventListener("ended", onEnd);
          URL.revokeObjectURL(url);
          resolve();
        };
        outRef.current.addEventListener("ended", onEnd);
      });
    } catch {
      // Ignore playback errors
    }
  }

  // ---- Utils ----
  function mapVad(v) {
    // Slightly tighter start/stop if the environment is noisy (mobile)
    return {
      rmsThreshold: v.rmsThreshold ?? v.rms ?? 0.016,
      startHoldMs: v.startHoldMs ?? v.startMs ?? 120,
      endSilenceMs: v.endSilenceMs ?? v.endMs ?? 650,
      maxTurnMs: v.maxTurnMs ?? v.maxMs ?? 8000,
    };
  }

  function sameLang(a, b) {
    return normLang(a) === normLang(b);
  }
  function normLang(x) {
    return String(x || "").toLowerCase().split("-")[0].trim();
  }
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  function normalizeErr(e) {
    const m = (e && (e.message || e.toString())) || "unknown";
    return m.length > 200 ? m.slice(0, 200) + "…" : m;
  }

  // ---- UI ----
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Travel Mode — Autonomous Interpreter</h1>
            <p className="text-sm text-gray-400">
              Hands-free. Auto-listen, auto-translate, and speak back in your own voice.
            </p>
          </div>
          <div>
            {!running ? (
              <button
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"
                onClick={start}
              >
                Start
              </button>
            ) : (
              <button
                className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-400/40 hover:bg-red-500/30"
                onClick={stop}
              >
                Stop
              </button>
            )}
          </div>
        </header>

        {/* Status strip */}
        <div className="mt-6 flex items-center gap-4">
          <StatusLight phase={phase} />
          <div className="text-xs text-gray-400">
            Turns: {sessionStats.turns}
            {sessionStats.lastLangThem
              ? ` • Partner: ${sessionStats.lastLangThem.toUpperCase()}`
              : ""}
          </div>
        </div>

        {/* Minimal errors (not transcripts) */}
        {errorMsg ? (
          <div className="mt-4 text-xs text-red-300">{errorMsg}</div>
        ) : null}
      </section>
    </main>
  );
}

function StatusLight({ phase }) {
  const color =
    {
      idle: "bg-gray-600",
      listening: "bg-emerald-500",
      recording: "bg-yellow-400",
      thinking: "bg-purple-400",
      speaking: "bg-blue-400",
    }[phase] || "bg-gray-600";
  return (
    <div className="flex items-center gap-3">
      <div className={`h-3 w-3 rounded-full ${color} animate-pulse`} />
      <span className="text-xs opacity-70">{phase}</span>
    </div>
  );
}
