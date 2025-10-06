// File: app/api/twin/say/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Env for your gateway (set them in Vercel)
const GATEWAY_URL = process.env.GATEWAY_URL;         // e.g. https://gateway.genio.systems
const GATEWAY_KEY = process.env.GATEWAY_API_KEY;     // bearer token

// naive estimate if gateway doesn't return duration
function estimateSecondsFromText(t = "") {
  const wpm = 150; // normal pace
  const words = (t || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(5, Math.round((words / wpm) * 60));
}

/**
 * POST /api/twin/say
 * Body: { text: string, targetLang?: string, userId?: string, twinId?: string }
 * Returns: audio/mpeg (or audio/webm) stream
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const text = (body?.text || "").toString();
    const targetLang = (body?.targetLang || "en").toString();
    const userId = body?.userId || null;
    const twinId = body?.twinId || null;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ ok: false, error: "Missing text" }, { status: 400 });
    }

    // 1) Call Gateway TTS
    // Expected: returns audio bytes + header X-Audio-Duration (sec) if available
    let ttsRes, audioBuf, audioType = "audio/mpeg";
    if (GATEWAY_URL && GATEWAY_KEY) {
      const r = await fetch(`${GATEWAY_URL}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GATEWAY_KEY}`,
        },
        body: JSON.stringify({ text, lang: targetLang, voice: "twin-default" }),
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => "");
        return NextResponse.json({ ok: false, error: `Gateway ${r.status}: ${txt}` }, { status: 502 });
      }
      audioType = r.headers.get("Content-Type") || "audio/mpeg";
      const ab = await r.arrayBuffer();
      audioBuf = Buffer.from(ab);
    } else {
      // Fallback dev mode: return 1-second beep so the UI pipeline works
      const sine = new Uint8Array(44100).fill(0).map((_, i) =>
        128 + Math.round(127 * Math.sin((2 * Math.PI * 440 * i) / 44100))
      );
      audioBuf = Buffer.from(sine);
      audioType = "audio/wav";
    }

    // 2) Duration (sec) to log usage
    let durationSec = 0;
    try {
      const gatewayDur =  Number.isFinite(+req.headers.get("x-audio-duration"))
        ? +req.headers.get("x-audio-duration")
        : null;
      if (gatewayDur && gatewayDur > 0) durationSec = Math.round(gatewayDur);
    } catch {}
    if (!durationSec) durationSec = estimateSecondsFromText(text);

    // 3) Save session + usage (best-effort, do not break audio on DB errors)
    try {
      // twin_sessions row
      if (twinId || userId) {
        await supabase.from("twin_sessions").insert([{
          id: "sess_" + Date.now(),
          user_id: userId,
          twin_id: twinId,
          created_at: new Date().toISOString(),
          lang: targetLang,
          duration_s: durationSec,
          provider: "gateway",
        }]);
      }
      // usage_minutes row (round up to minutes)
      const minutes = Math.max(1, Math.ceil(durationSec / 60));
      await supabase.from("usage_minutes").insert([{
        user_id: userId,
        twin_id: twinId,
        minutes,
        created_at: new Date().toISOString(),
      }]);
    } catch (e) {
      // don't block audio on DB issues
      console.error("usage/session insert failed:", e?.message || e);
    }

    // 4) Return audio stream to client
    return new Response(audioBuf, {
      status: 200,
      headers: {
        "Content-Type": audioType,
        "Content-Length": String(audioBuf.length),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || "failed" }, { status: 500 });
  }
}
