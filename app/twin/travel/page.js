"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Twin Travel Mode v3 — Autonomous Interpreter
 * - One toggle (Start/Stop)
 * - Voice Activity Detection (VAD) to auto-start/stop turns
 * - Auto language detection (no manual selection)
 * - Auto translate to the other speaker's language
 * - Always speaks back in the user's cloned voice via /api/twin/say
 * - Auto-ducking: pause listening while speaking to avoid feedback
 * - Minimal, professional UI
 *
 * Backend requirements already covered in your project:
 *   POST /api/travel/asr         -> { ok:true, text, lang }   (lang like "ar", "en", ...)
 *   POST /api/travel/translate   -> { ok:true, text }
 *   POST /api/twin/say           -> audio bytes (tts in targetLang, user's voice)
 *
 * TODO (wire from auth/session later): userId / twinId
 */

export default function TravelModePage() {
  // You can wire these from session/user settings later
  const userId = "demo";
  const twinId = "twin_demo";
  const myPrimaryLang = "ar"; // user's native language (used only to bias "who spoke")

  // Runtime UI state
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("idle"); // idle | listening | recording | thinking | speaking
  const [hint, setHint] = useState("Activate to start the autonomous interpreter.");
  const [log, setLog] = useState([]); // latest first: {id, role:"me"|"them", text, src?, tgt?}
  const [errorMsg, setErrorMsg] = useState("");

  // Media/WebAudio refs
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const audioCtxRef = useRef(null);
  const sourceRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);
  const outAudioRef = useRef(null);

  // VAD tuning
  const vadRef = useRef({
    rmsThreshold: 0.016,   // sensitivity (lower = more sensitive)
    startHoldMs: 120,      // need this many ms of activity to start
    endSilenceMs: 650,     // end turn after silence
    maxTurnMs: 8000,       // hard cap per turn
  });

  // VAD state
  const activeRef = useRef(false);
  const startAtRef = useRef(0);
  const silenceAtRef = useRef(0);

  // speaking guard (ducking)
  const speakingGuardRef = useRef(false);

  useEffect(() => {
    return () => cleanupAll();
  }, []);

  function pushLog(entry) {
    setLog((prev) => [{ id: Date.now() + Math.random(), ...entry }, ...prev].slice(0, 32));
  }

  async function start() {
    try {
      setErrorMsg("");
      setLog([]);
      await initIO();
      speakingGuardRef.current = false;
      setPhase("listening");
      setHint("Listening… speak naturally. The twin will translate and reply automatically.");
      setRunning(true);
      runVAD();
    } catch (e) {
      setErrorMsg(e?.message || "Failed to access microphone.");
      cleanupAll();
    }
  }

  function stop() {
    setRunning(false);
    setPhase("idle");
    setHint("Session ended.");
    cleanupAll();
  }

  async function initIO() {
    // Microphone (AEC/NS enabled)
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
    streamRef.current = stream;

    // Recorder
    const mime = pickMime();
    const rec = new MediaRecorder(stream, { mimeType: mime });
    recRef.current = rec;
    rec.ondataavailable = (e) => e.data && chunksRef.current.push(e.data);
    rec.onstop = async () => {
      try {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType });
        chunksRef.current = [];
        await handleTurn(blob);
      } catch (e) {
        setErrorMsg(e?.message || "Failed to process turn.");
      }
    };

    // WebAudio for VAD
    const AC = window.AudioContext || window.webkitAudioContext;
    const ctx = new AC();
    audioCtxRef.current = ctx;

    const src = ctx.createMediaStreamSource(stream);
    sourceRef.current = src;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    src.connect(analyser);
    analyserRef.current = analyser;

    // Output audio element
    outAudioRef.current = new Audio();
  }

  function cleanupAll() {
    try { if (rafRef.current) cancelAnimationFrame(rafRef.current); } catch {}
    rafRef.current = null;

    try { recRef.current?.stop(); } catch {}
    recRef.current = null;
    chunksRef.current = [];

    try { streamRef.current?.getTracks()?.forEach(t => t.stop()); } catch {}
    streamRef.current = null;

    try { sourceRef.current?.disconnect(); } catch {}
    sourceRef.current = null;

    try { audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;

    analyserRef.current = null;
    activeRef.current = false;
    startAtRef.current = 0;
    silenceAtRef.current = 0;
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
  function runVAD() {
    const a = analyserRef.current;
    if (!a) return;

    const data = new Uint8Array(a.fftSize);
    const now = () => performance.now();

    const tick = () => {
      if (!running) return;

      // If we are speaking, pause listening completely
      if (speakingGuardRef.current) {
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
      const { rmsThreshold, startHoldMs, endSilenceMs, maxTurnMs } = vadRef.current;

      if (!activeRef.current) {
        if (rms > rmsThreshold) {
          if (!startAtRef.current) startAtRef.current = t;
          if (t - startAtRef.current >= startHoldMs) {
            // begin a turn
            activeRef.current = true;
            silenceAtRef.current = 0;
            startAtRef.current = t;
            beginRecord();
          }
        } else {
          startAtRef.current = 0;
        }
      } else {
        // within a turn
        if (rms <= rmsThreshold) {
          if (!silenceAtRef.current) silenceAtRef.current = t;
          if (t - silenceAtRef.current >= endSilenceMs) {
            endRecord();
            activeRef.current = false;
            startAtRef.current = 0;
            silenceAtRef.current = 0;
          }
        } else {
          silenceAtRef.current = 0;
        }
        if (t - startAtRef.current >= maxTurnMs) {
          endRecord(); // hard-stop to keep flow snappy
          activeRef.current = false;
          startAtRef.current = 0;
          silenceAtRef.current = 0;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  function beginRecord() {
    try {
      chunksRef.current = [];
      recRef.current?.start(250);
      setPhase("recording");
      setHint("Recording…");
    } catch (e) {
      setErrorMsg(e?.message || "Recorder start failed.");
    }
  }

  function endRecord() {
    try {
      setPhase("thinking");
      setHint("Translating…");
      recRef.current?.stop();
    } catch {
      // ignore
    }
  }

  /** One full turn: ASR -> translate -> TTS (user's voice) */
  async function handleTurn(blob) {
    try {
      // 1) ASR with language detection
      const asr = await callASR(blob);
      const spoken = (asr?.text || "").trim();
      const detected = (asr?.lang || "").toLowerCase();

      if (!spoken) {
        setPhase("listening");
        setHint("Listening…");
        return;
      }

      // Decide who spoke (heuristic): if lang ~ myPrimaryLang => "me", else "them"
      const meSpoke = langEq(detected, myPrimaryLang);
      const speaker = meSpoke ? "me" : "them";
      pushLog({ role: speaker, text: spoken, src: detected });

      // 2) Target language = the other's language
      const target = meSpoke ? pickPartnerLang(detected) : myPrimaryLang;

      // 3) Translate
      const tr = await callTranslate(spoken, detected, target);
      const outText = tr?.text || "";
      pushLog({ role: meSpoke ? "them" : "me", text: outText, src: detected, tgt: target });

      // 4) Speak (always user's cloned voice, in target language)
      speakingGuardRef.current = true;      // pause listening/recording
      setPhase("speaking");
      setHint("Speaking…");
      const audioBlob = await callSay(outText, target);
      if (audioBlob) await play(audioBlob);

      // brief cooldown to avoid VAD false triggers from residual audio
      await sleep(160);
      speakingGuardRef.current = false;

      setPhase("listening");
      setHint("Listening…");
    } catch (e) {
      setErrorMsg(e?.message || "Turn failed.");
      setPhase("listening");
      setHint("Listening…");
    }
  }

  function langEq(a = "", b = "") {
    const n = (x) => (x || "").split("-")[0].trim();
    return n(a) === n(b);
  }

  function pickPartnerLang(srcDetected) {
    // If I spoke (srcDetected ~ myPrimaryLang), default partner language is English.
    // You can make this smarter by caching last detected "them" language.
    if (langEq(srcDetected, myPrimaryLang)) return "en";
    // If not me, mirror partner's detected language
    return srcDetected || "en";
  }

  // --- Backend calls ---
  async function callASR(blob) {
    const fd = new FormData();
    fd.append("audio", blob, "turn.webm");
    // No hint to let server auto-detect; optionally bias with myPrimaryLang via fd.append("hintLang", myPrimaryLang)
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

  async function play(blob) {
    try {
      const url = URL.createObjectURL(blob);
      outAudioRef.current.src = url;
      await outAudioRef.current.play();
      await new Promise((res) => {
        const onEnd = () => {
          outAudioRef.current.removeEventListener("ended", onEnd);
          URL.revokeObjectURL(url);
          res();
        };
        outAudioRef.current.addEventListener("ended", onEnd);
      });
    } catch {
      // ignore
    }
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // --- UI ---
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
              <button className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20" onClick={start}>
                Start
              </button>
            ) : (
              <button className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-400/40 hover:bg-red-500/30" onClick={stop}>
                Stop
              </button>
            )}
          </div>
        </header>

        {/* Status */}
        <div className="mt-6 flex items-center gap-4">
          <StatusLight phase={phase} />
          <div className="text-sm text-gray-300">{hint}</div>
        </div>

        {/* Live transcript */}
        <section className="mt-8">
          <h3 className="text-sm text-gray-300 mb-2">Live transcript</h3>
          <ul className="space-y-2">
            {log.map((l) => (
              <li key={l.id} className="text-sm">
                <span className={l.role === "me" ? "text-blue-300" : "text-green-300"}>
                  {l.role === "me" ? "You" : "Them"}:
                </span>{" "}
                <span>{l.text}</span>
                {l.tgt ? <span className="opacity-60">  → {l.tgt.toUpperCase()}</span> : null}
              </li>
            ))}
          </ul>
        </section>

        {errorMsg ? <div className="mt-6 text-sm text-red-300">{errorMsg}</div> : null}
      </section>
    </main>
  );
}

function StatusLight({ phase }) {
  const color = {
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
