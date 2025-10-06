// File: app/api/travel/asr/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GATEWAY_URL = process.env.GATEWAY_URL;       // e.g. https://gateway.genio.systems
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

/**
 * POST /api/travel/asr
 * Body: multipart/form-data  ->  audio: File (webm/mp4/wav), hintLang?: string
 * Returns: { ok:true, text, lang }  // يُستخدم داخليًا فقط (لا نعرض نص على الواجهة)
 */
export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("audio");
    const hint = form.get("hintLang") || "";

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ ok: false, error: "missing audio" }, { status: 400 });
    }

    // Dev fallback لو ما في Gateway
    if (!GATEWAY_URL || !GATEWAY_API_KEY) {
      return NextResponse.json({ ok: true, text: "(speech)", lang: hint || "en" }, { status: 200 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const r = await fetch(`${GATEWAY_URL}/asr`, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "audio/webm",
        "Authorization": `Bearer ${GATEWAY_API_KEY}`,
        "x-hint-lang": hint,
      },
      body: buf,
    });

    if (!r.ok) {
      const msg = await r.text().catch(() => "");
      return NextResponse.json({ ok: false, error: `ASR ${r.status}: ${msg}` }, { status: 502 });
    }

    const data = await r.json();
    // data: { text: "...", lang: "ar" }
    return NextResponse.json({ ok: true, text: data.text || "", lang: data.lang || hint || "en" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || "failed" }, { status: 500 });
  }
}
