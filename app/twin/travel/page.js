"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Twin Travel Mode — Autonomous, Voice-Only, Hands-Free
 * Production-ready single page with:
 * - Health preflight to gateway before starting
 * - Strong VAD (voice activity detection) with calibration & sensitivity knob
 * - Auto language detection (ASR), auto partner-language learning (persisted)
 * - Translate -> Speak with user's cloned voice (/api/twin/say)
 * - Auto-ducking (mic muted during playback) to avoid echo/feedback
 * - Device pickers (microphone/speaker) and autostart via ?autostart=1 (Siri)
 * - Safety caps, cooldowns, and visibility handling
 *
 * Backends expected:
 *   POST /api/travel/asr         -> { ok:true, text, lang }
 *   POST /api/travel/translate   -> { ok:true, text }
 *   POST /api/twin/say           -> audio bytes (tts in target language)
 *   GET  /api/travel/health      -> { ok:true }
 *
 * NOTE:
 * Replace userId/twinId with real auth/session if available.
 */

export default function TravelModePage() {
  // Session wiring (replace with real auth state if available)
  const userId = readEnv("NEXT_PUBLIC_TWIN_USER_ID", "demo");
  const twinId = readEnv("NEXT_PUBLIC_TWIN_ID", "twin_demo");
  const myPrimaryLang = readEnv("NEXT_PUBLIC_TWIN_PRIMARY_LANG", "ar"); // heuristic

  // UI state
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | preflight | listening | recording | thinking | speaking
  const [errorMsg, setErrorMsg] = useState("");
  const [stats, setStats] = useState({ turns: 0, partner: "" });

  // Device state
  const [mics, setMics] = useState([]);
  const [sinks, setSinks] = useState([]);
  const [micId, setMicId] = useState("");
  const [sinkId, setSinkId] = useState("");

  // Learned partner language (persisted)
  const learnedPartnerLangRef = useRef(localStorage.getItem("twin.partnerLang") || "");

  // IO/WebAudio
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const srcRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const outRef = useRef(null);

  // VAD configuration (tuned for mobile mics)
  const vad = useRef({
    rmsThreshold: 0.016,  // sensitivity baseline; lower => more sensitive
    startHoldMs: 120,     // ms above threshold to start a turn
    endSilenceMs: 650,    // ms below threshold to end a turn
    maxTurnMs: 8000,      // hard cap per turn
    minGapMs: 220,        // guard time between turns
  });

  // VAD state
  const activeRef = useRef(false);
  const startedAtRef = useRef(0);
  const silenceAtRef = useRef(0);
  const lastTurnEndedAtRef = useRef(0);

  // speaking guard (ducking)
  const speakingRef = useRef(false);

  // Visibility guard
  useEffect(() => {
    const onVis = () => {
      if (document.hidden && running) {
        // Auto-stop when tab hidden/locked to avoid ghost listening
        silentStop();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [running]);

  // Autostart via query (?autostart=1)
  useEffect(() => {
    const qp = new URLSearchParams(window.location.search);
    if (qp.get("autostart") === "1") start().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enumerate devices (mic/speaker)
  useEffect(() => {
    (async () => {
      try {
        const ok = await navigator.mediaDevices?.getUserMedia?.({ audio: true });
        ok?.getTracks()?.forEach(t => t.stop()); // just to unlock enumerateDevices on some browsers
        const list = await navigator.mediaDevices.enumerateDevices();
        const micList = list.filter(d => d.kind === "audioinput");
        const sinkList = list.filter(d => d.kind === "audiooutput");
        setMics(micList);
        setSinks(sinkList);
        if (!micId && micList[0]?.deviceId) setMicId(micList[0].deviceId);
        if (!sinkId && sinkList[0]?.deviceId) setSinkId(sinkList[0].deviceId);
      } catch {}
    })();
  }, []);

  function persistPartnerLang(lang) {
    learnedPartnerLangRef.current = lang;
    try { localStorage.setItem("twin.partnerLang", lang); } catch {}
    setStats(s => ({ ...s, partner: lang.toUpperCase() }));
  }

  async function start() {
    try {
      setErrorMsg("");
      setPhase("preflight");
      // 0) Preflight gateway
      const ok = await preflight();
      if (!ok) throw new Error("Gateway not reachable");

      // 1) IO init
      await initIO();

      // 2) Start VAD loop
      speakingRef.current = false;
      setStats(s => ({ ...s, turns: 0 }));
      setPhase("listening");
      setRunning(true);
      loopVAD();
    } catch (e) {
      setErrorMsg(trimErr(e));
      cleanupAll();
      setPhase("idle");
    }
  }

  function stop() {
    setRunning(false);
    setPhase("idle");
    cleanupAll();
  }

  // stop without changing UI if visibility lost
  function silentStop() {
    setRunning(false);
    cleanupAll();
    setPhase("idle");
  }

  async function preflight() {
    try {
      const r = await fetch("/api/travel/health", { cache: "no-store" });
      if (!r.ok) return false;
      const j = await r.json();
      return !!j?.ok;
    } catch {
      return false;
    }
  }

  async function initIO() {
    // Microphone with device selection
    const constraints = {
      audio: {
        deviceId: micId ? { exact: micId } : undefined,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    streamRef.current = stream;

    // Recorder
    const mime = pickMime();
    const rec = new MediaRecorder(stream, { mimeType: mime });
    recRef.current = rec;
    chunksRef.current = [];
    rec.ondataavailable = (e) => e.data && chunksRef.current.push(e.data);
    rec.onstop = () => setTimeout(async () => {
      try {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType });
        chunksRef.current = [];
        await handleTurn(blob);
      } catch (err) {
        setErrorMsg(trimErr(err));
      }
    }, 0);

    // WebAudio for VAD
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    audioCtxRef.current = ctx;

    const src = ctx.createMediaStreamSource(stream);
    srcRef.current = src;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);
    analyserRef.current = analyser;

    // Output element with optional sink (if browser supports setSinkId)
    const a = new Audio();
    try {
      if (sinkId && typeof a.setSinkId === "function") {
        await a.setSinkId(sinkId);
      }
    } catch {}
    outRef.current = a;

    // Ambient calibration (quick)
    await quickCalibrate();
  }

  async function quickCalibrate() {
    // Sample ambient RMS to set threshold slightly above noise floor
    const a = analyserRef.current;
    if (!a) return;
    const data = new Uint8Array(a.fftSize);
    let samples = 0, sumRms = 0;
    const start = performance.now();
    while (performance.now() - start < 400) {
      a.getByteTimeDomainData(data);
      let s = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        s += v * v;
      }
      const rms = Math.sqrt(s / data.length);
      sumRms += rms;
      samples++;
      await sleep(16);
    }
    const ambient = samples ? (sumRms / samples) : 0.01;
    const margin = 0.007; // bump above ambient
    const thr = clamp(ambient + margin, 0.006, 0.045);
    vad.current.rmsThreshold = thr;
  }

  function cleanupAll() {
    try { if (rafRef.current) cancelAnimationFrame(rafRef.current); } catch {}
    rafRef.current = null;

    try { recRef.current?.stop(); } catch {}
    recRef.current = null;
    chunksRef.current = [];

    try { streamRef.current?.getTracks()?.forEach(t => t.stop()); } catch {}
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
    speakingRef.current = false;
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
      if (speakingRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Gap guard
      if (now() - lastTurnEndedAtRef.current < vad.current.minGapMs) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      a.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / data.length);

      const t = now();
      const { rmsThreshold, startHoldMs, endSilenceMs, maxTurnMs } = vad.current;

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
      setErrorMsg(trimErr(e));
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

  /** One full conversational turn */
  async function handleTurn(blob) {
    try {
      // 1) ASR with language detection
      const asr = await callASR(blob);
      const spoken = (asr?.text || "").trim();
      const detected = normLang(asr?.lang || "");

      if (!spoken) {
        setPhase("listening");
        return;
      }

      // Decide speaker
      const meSpoke = sameLang(detected, myPrimaryLang);
      if (!meSpoke && detected) {
        // learn partner language once consistent
        if (!learnedPartnerLangRef.current || learnedPartnerLangRef.current !== detected) {
          persistPartnerLang(detected);
        }
      }

      // 2) Choose target language
      const target = meSpoke
        ? (learnedPartnerLangRef.current || "en") // speak to partner
        : myPrimaryLang;                           // translate back to me

      // 3) Translate
      const tr = await callTranslate(spoken, detected, target);
      const outText = (tr?.text || "").trim();
      if (!outText) {
        setPhase("listening");
        return;
      }

      // 4) Speak (user's cloned voice), with strong ducking
      speakingRef.current = true;
      setPhase("speaking");
      const audioBlob = await callSay(outText, target);
      if (audioBlob) await playAudio(audioBlob);

      // cooldown to avoid residual triggers
      await sleep(160);
      speakingRef.current = false;

      setStats(s => ({ ...s, turns: s.turns + 1 }));
      setPhase("listening");
    } catch (e) {
      setErrorMsg(trimErr(e));
      setPhase("listening");
    }
  }

  // ---- Backend calls ----
  async function callASR(blob) {
    const fd = new FormData();
    fd.append("audio", blob, "turn.webm");
    // optional bias:
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

  // Strong ducking: disable mic tracks during playback
  async function playAudio(blob) {
    try {
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(t => (t.enabled = false));
      }
      const url = URL.createObjectURL(blob);
      outRef.current.src = url;
      await outRef.current.play();
      await new Promise((resolve) => {
        const onEnd = () => {
          outRef.current.removeEventListener("ended", onEnd);
          URL.revokeObjectURL(url);
          if (streamRef.current) {
            streamRef.current.getAudioTracks().forEach(t => (t.enabled = true));
          }
          resolve();
        };
        outRef.current.addEventListener("ended", onEnd);
      });
    } catch {
      // ignore
    }
  }

  // ---- Utils ----
  function sameLang(a, b) { return normLang(a) === normLang(b); }
  function normLang(x) { return String(x || "").toLowerCase().split("-")[0].trim(); }
  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function trimErr(e) {
    const m = (e && (e.message || e.toString())) || "unknown";
    return m.length > 180 ? m.slice(0, 180) + "…" : m;
  }
  function readEnv(key, fallback) {
    if (typeof process !== "undefined" && process.env && process.env[key]) return process.env[key];
    return fallback;
  }

  // ---- UI ----
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Travel Mode — Autonomous Interpreter</h1>
            <p className="text-xs text-gray-400">
              Hands-free. Auto-listen, auto-translate, auto-speak in your voice.
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

        {/* Status */}
        <div className="mt-6 flex items-center gap-4">
          <StatusLight phase={phase} />
          <div className="text-xs text-gray-400">
            Turns: {stats.turns}{stats.partner ? ` • Partner: ${stats.partner}` : ""}
          </div>
        </div>

        {/* Advanced Controls (collapsed) */}
        <details className="mt-6 rounded-lg border border-white/10 p-4">
          <summary className="cursor-pointer text-sm opacity-80">Advanced (Calibrate & Devices)</summary>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div>
              <label className="text-xs text-gray-400">Sensitivity</label>
              <input
                type="range"
                min="0.006"
                max="0.045"
                step="0.001"
                defaultValue={vad.current.rmsThreshold}
                onChange={(e) => (vad.current.rmsThreshold = Number(e.target.value))}
                className="w-full"
              />
              <div className="text-[10px] opacity-60 mt-1">
                Threshold: {vad.current.rmsThreshold.toFixed(3)}
              </div>
              <button
                className="mt-2 text-xs px-2 py-1 rounded border border-white/20 hover:bg-white/10"
                onClick={() => quickCalibrate()}
                disabled={!analyserRef.current}
              >
                Calibrate Ambient
              </button>
            </div>

            <div>
              <label className="text-xs text-gray-400">Microphone</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm mt-1"
                value={micId}
                onChange={(e) => setMicId(e.target.value)}
              >
                {mics.map(m => (
                  <option key={m.deviceId} value={m.deviceId}>
                    {m.label || `Mic ${m.deviceId.slice(0, 6)}…`}
                  </option>
                ))}
              </select>
              <div className="text-[10px] opacity-60 mt-1">Re-click Start to apply.</div>
            </div>

            <div>
              <label className="text-xs text-gray-400">Speaker</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded p-2 text-sm mt-1"
                value={sinkId}
                onChange={async (e) => {
                  setSinkId(e.target.value);
                  try {
                    if (typeof outRef.current?.setSinkId === "function") {
                      await outRef.current.setSinkId(e.target.value);
                    }
                  } catch {}
                }}
              >
                {sinks.map(s => (
                  <option key={s.deviceId} value={s.deviceId}>
                    {s.label || `Out ${s.deviceId.slice(0, 6)}…`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </details>

        {errorMsg ? <div className="mt-4 text-xs text-red-300">{errorMsg}</div> : null}
      </section>
    </main>
  );
}

function StatusLight({ phase }) {
  const color =
    {
      idle: "bg-gray-600",
      preflight: "bg-slate-400",
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
