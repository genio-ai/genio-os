"use client";

import { useEffect, useRef, useState } from "react";

export default function TravelModePage() {
  const [meLang, setMeLang] = useState("ar");       // your listening language
  const [themLang, setThemLang] = useState("en");   // target person's language
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState([]);
  const mediaRef = useRef(null);      // audio element for playback
  const recRef = useRef(null);        // MediaRecorder
  const streamRef = useRef(null);     // mic stream
  const chunksRef = useRef([]);

  useEffect(() => {
    return () => stopStream();
  }, []);

  function appendLog(role, text) {
    setLog((l) => [{ id: Date.now() + Math.random(), role, text }, ...l].slice(0, 20));
  }

  async function startRec(direction) {
    try {
      setBusy(true);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      const rec = new MediaRecorder(stream, { mimeType: pickMime() });
      recRef.current = rec;

      rec.ondataavailable = (e) => e.data && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: rec.mimeType });
          await handleTurn(direction, blob);
        } finally {
          stopStream();
          setBusy(false);
        }
      };

      rec.start(250);
      // auto stop after 8s to keep turns snappy
      setTimeout(() => safeStop(), 8000);
    } catch (err) {
      console.error(err);
      setBusy(false);
      alert("Mic permission denied or unsupported.");
    }
  }

  function safeStop() {
    try { recRef.current?.stop(); } catch {}
  }

  function stopStream() {
    try { recRef.current?.stop(); } catch {}
    try { streamRef.current?.getTracks()?.forEach(t => t.stop()); } catch {}
    recRef.current = null;
    streamRef.current = null;
  }

  function pickMime() {
    const cands = ["audio/webm;codecs=opus","audio/webm","audio/mp4;codecs=mp4a.40.2","audio/mp4"];
    for (const t of cands) {
      if (window.MediaRecorder?.isTypeSupported?.(t)) return t;
    }
    return "audio/webm";
  }

  async function handleTurn(direction, blob) {
    // 1) speech-to-text
    const stt = await asr(blob, direction === "me2them" ? meLang : themLang);
    if (!stt?.text) {
      appendLog(direction === "me2them" ? "me" : "them", "…");
      return;
    }
    appendLog(direction === "me2them" ? "me" : "them", stt.text);

    // 2) translate
    const src = direction === "me2them" ? meLang : themLang;
    const tgt = direction === "me2them" ? themLang : meLang;
    const tr = await translate(stt.text, src, tgt);
    if (!tr?.text) return;
    appendLog(direction === "me2them" ? "them" : "me", tr.text);

    // 3) speak with twin voice
    // twin voice always speaks (for both directions) so it sounds like you
    const audioBlob = await say(tr.text, tgt);
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      if (!mediaRef.current) mediaRef.current = new Audio();
      mediaRef.current.src = url;
      mediaRef.current.play().catch(() => {});
    }
  }

  // --- API calls ---
  async function asr(blob, expectLang) {
    const fd = new FormData();
    fd.append("audio", blob, "turn.webm");
    fd.append("hintLang", expectLang || "");
    const r = await fetch("/api/travel/asr", { method: "POST", body: fd });
    if (!r.ok) return null;
    return r.json();
  }

  async function translate(text, src, tgt) {
    const r = await fetch("/api/travel/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang: src, targetLang: tgt }),
    });
    if (!r.ok) return null;
    return r.json();
  }

  async function say(text, targetLang) {
    const r = await fetch("/api/twin/say", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang, userId: "demo", twinId: "twin_demo" }),
    });
    if (!r.ok) return null;
    const ab = await r.arrayBuffer();
    return new Blob([ab], { type: r.headers.get("Content-Type") || "audio/mpeg" });
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold">Travel Mode — Smart Interpreter</h1>
        <p className="mt-2 text-gray-400">Speak and get instant translation in your own voice.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 p-4">
            <h3 className="text-sm text-gray-300">Your language</h3>
            <select className="mt-2 w-full bg-white/5 border border-white/10 rounded p-2"
              value={meLang} onChange={(e)=>setMeLang(e.target.value)}>
              <LangOptions />
            </select>
            <button
              disabled={busy}
              onClick={()=>startRec("me2them")}
              className="mt-4 w-full rounded bg-white/10 border border-white/20 px-4 py-3 hover:bg-white/20 disabled:opacity-40">
              🎤 Me → Them
            </button>
          </div>

          <div className="rounded-xl border border-white/10 p-4">
            <h3 className="text-sm text-gray-300">Their language</h3>
            <select className="mt-2 w-full bg-white/5 border border-white/10 rounded p-2"
              value={themLang} onChange={(e)=>setThemLang(e.target.value)}>
              <LangOptions />
            </select>
            <button
              disabled={busy}
              onClick={()=>startRec("them2me")}
              className="mt-4 w-full rounded bg-white/10 border border-white/20 px-4 py-3 hover:bg-white/20 disabled:opacity-40">
              🎤 Them → Me
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-sm text-gray-300 mb-2">Live log</h3>
          <ul className="space-y-2">
            {log.map((l)=>(
              <li key={l.id} className="text-sm">
                <span className="opacity-60">{l.role === "me" ? "You" : "Them"}: </span>
                <span>{l.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function LangOptions() {
  const langs = [
    ["ar","Arabic"],["en","English"],["fr","French"],["de","German"],
    ["es","Spanish"],["it","Italian"],["tr","Turkish"],["ru","Russian"],
    ["zh","Chinese"],["ja","Japanese"],["ko","Korean"],["pt","Portuguese"]
  ];
  return langs.map(([v,l])=> <option key={v} value={v}>{l}</option>);
}
