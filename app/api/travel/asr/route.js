import { NextResponse } from "next/server";
import { checkRateLimit, tooManyResponse } from "@/app/api/_middleware/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- Config ----
const MAX_BYTES = 10 * 1024 * 1024; // 10MB max upload
const ACCEPT_MIME = new Set([
  "audio/webm",
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/mp4;codecs=mp4a.40.2",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
]);

/**
 * POST /api/travel/asr
 * body: multipart/form-data
 *   - audio: File (webm/mp4/wav/ogg/mpeg)
 *   - hintLang?: string (optional bias, e.g., "ar")
 * returns: { ok:true, text:string, lang:string }
 */
export async function POST(req) {
  // --- Rate limit (ASR is expensive) ---
  {
    const { ok, remaining, resetAt } = checkRateLimit(req, {
      limit: 8,
      windowMs: 10_000,
      keyExtra: "asr",
    });
    if (!ok) return tooManyResponse(remaining, resetAt);
  }

  try {
    const form = await req.formData();
    const file = form.get("audio");
    const hintLang = (form.get("hintLang") || "").toString().trim();

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ ok: false, error: "Missing 'audio' file" }, { status: 400 });
    }

    if (file.size <= 0) {
      return NextResponse.json({ ok: false, error: "Empty audio" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Audio too large (>10MB)" }, { status: 413 });
    }

    const type = (file.type || "").toLowerCase();
    // Some browsers omit codecs—normalize for checks
    const bareType = type.split(";")[0];
    if (!ACCEPT_MIME.has(type) && !ACCEPT_MIME.has(bareType)) {
      return NextResponse.json({ ok: false, error: `Unsupported content-type: ${type || "unknown"}` }, { status: 415 });
    }

    const GATEWAY_URL = process.env.GATEWAY_URL;
    const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

    // Dev fallback (no gateway configured)
    if (!GATEWAY_URL || !GATEWAY_API_KEY) {
      // Return a dummy transcript so the client flow continues in dev
      return NextResponse.json(
        { ok: true, text: "(speech)", lang: hintLang || "en" },
        { status: 200 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());

    const r = await fetch(slashJoin(GATEWAY_URL, "/asr"), {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GATEWAY_API_KEY}`,
        "Content-Type": type || "application/octet-stream",
        ...(hintLang ? { "x-hint-lang": hintLang } : {}),
      },
      body: buf,
      // Avoid caching/transforms
      cache: "no-store",
    });

    if (!r.ok) {
      const msg = await safeText(r);
      return NextResponse.json(
        { ok: false, error: `ASR ${r.status}: ${msg || "failed"}` },
        { status: 502 }
      );
    }

    const data = await safeJson(r);
    // Expecting { text: "...", lang: "ar" }
    const text = (data?.text || "").toString();
    const lang = (data?.lang || hintLang || "en").toString();

    return NextResponse.json({ ok: true, text, lang }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: (e?.message || "ASR error").slice(0, 200) },
      { status: 500 }
    );
  }
}

// ---- helpers ----
function slashJoin(a, b) {
  return `${String(a).replace(/\/+$/, "")}/${String(b).replace(/^\/+/, "")}`;
}
async function safeText(res) {
  try { return await res.text(); } catch { return ""; }
}
async function safeJson(res) {
  try { return await res.json(); } catch { return {}; }
}
