import { NextResponse } from "next/server";
import { checkRateLimit, tooManyResponse } from "@/app/api/_middleware/ratelimit";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Config ---
const GATEWAY_URL = process.env.GATEWAY_URL;          // e.g. https://gateway.genio.systems
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;  // bearer token
const TIMEOUT_MS = 12000;
const DEFAULT_CT = "audio/mpeg";

// --- Utils ---
function joinUrl(a, b) {
  return `${String(a).replace(/\/+$/, "")}/${String(b).replace(/^\/+/, "")}`;
}
async function fetchWithTimeout(url, init = {}, ms = TIMEOUT_MS) {
  const ctl = new AbortController();
  const id = setTimeout(() => ctl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctl.signal, cache: "no-store" });
  } finally {
    clearTimeout(id);
  }
}
function estimateSecondsFromText(t = "") {
  const wpm = 150; // ~normal speech
  const words = (t || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.round((words / wpm) * 60));
}
// Tiny 1s beep wav (fallback dev)
function makeBeepWav(sec = 1, hz = 440) {
  const sampleRate = 44100;
  const len = Math.max(1, sec) * sampleRate;
  const header = new ArrayBuffer(44);
  const view = new DataView(header);
  const data = new Int16Array(len);
  for (let i = 0; i < len; i++) {
    data[i] = Math.round(0.25 * 32767 * Math.sin((2 * Math.PI * hz * i) / sampleRate));
  }
  const dataBytes = new Uint8Array(data.buffer);

  // RIFF/WAVE header
  const blockAlign = 2; // mono 16-bit
  const byteRate = sampleRate * blockAlign;
  const dataSize = dataBytes.byteLength;
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataSize, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // bits
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true);

  const out = new Uint8Array(44 + dataSize);
  out.set(new Uint8Array(header), 0);
  out.set(dataBytes, 44);
  return Buffer.from(out.buffer);
}

/**
 * POST /api/twin/say
 * Body: { text: string, targetLang: string, userId: string, twinId: string, provider?: string, voiceId?: string }
 * Returns: audio bytes (audio/mpeg by default)
 */
export async function POST(req) {
  // --- rate limit (TTS is expensive) ---
  {
    const { ok, remaining, resetAt } = checkRateLimit(req, {
      limit: 6,
      windowMs: 10_000,
      keyExtra: "tts",
    });
    if (!ok) return tooManyResponse(remaining, resetAt);
  }

  try {
    const { text, targetLang, userId, twinId, provider, voiceId } = await req.json();

    if (!text || !targetLang || !userId || !twinId) {
      return NextResponse.json(
        { ok: false, error: "missing text/targetLang/userId/twinId" },
        { status: 400 }
      );
    }

    let audioBuf;
    let contentType = DEFAULT_CT;
    let durationSec = 0;

    if (GATEWAY_URL && GATEWAY_API_KEY) {
      const resp = await fetchWithTimeout(
        joinUrl(GATEWAY_URL, "/twin/say"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GATEWAY_API_KEY}`,
          },
          body: JSON.stringify({
            text,
            targetLang,
            userId,
            twinId,
            ...(provider ? { provider } : {}),
            ...(voiceId ? { voiceId } : {}),
          }),
        },
        TIMEOUT_MS
      );

      if (!resp.ok) {
        const msg = await resp.text().catch(() => "");
        return NextResponse.json({ ok: false, error: `TTS ${resp.status}: ${msg}` }, { status: 502 });
      }

      contentType = resp.headers.get("Content-Type") || DEFAULT_CT;
      const durHeader = resp.headers.get("x-audio-duration"); // seconds (if gateway sets it)
      if (durHeader && !Number.isNaN(Number(durHeader))) {
        durationSec = Math.max(0, Math.round(Number(durHeader)));
      }

      const ab = await resp.arrayBuffer();
      audioBuf = Buffer.from(ab);
    } else {
      // Dev fallback (no gateway): 1-second beep WAV
      audioBuf = makeBeepWav(1);
      contentType = "audio/wav";
    }

    if (!durationSec) durationSec = estimateSecondsFromText(text);

    // --- best-effort logging (do not block audio on DB errors) ---
    try {
      if (supabase) {
        const minutes = Math.max(1, Math.ceil(durationSec / 60));

        await supabase.from("twin_sessions").insert([
          {
            id: "sess_" + Date.now(),
            user_id: userId,
            twin_id: twinId,
            created_at: new Date().toISOString(),
            lang: targetLang,
            duration_s: durationSec,
            provider: provider || "gateway",
          },
        ]);

        await supabase.from("usage_minutes").insert([
          {
            user_id: userId,
            twin_id: twinId,
            minutes,
            created_at: new Date().toISOString(),
            provider: provider || "gateway",
          },
        ]);
      }
    } catch (e) {
      console.error("usage/session insert failed:", e?.message || e);
    }

    // --- return audio bytes ---
    return new Response(audioBuf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(audioBuf.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    const msg = (e?.message || "failed").slice(0, 200);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
