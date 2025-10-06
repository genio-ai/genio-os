// File: app/api/travel/translate/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GATEWAY_URL = process.env.GATEWAY_URL;       // e.g. https://gateway.genio.systems
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

/**
 * POST /api/travel/translate
 * Body: { text: string, sourceLang?: string, targetLang: string }
 * Returns: { ok: true, text: string }
 */
export async function POST(req) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ ok: false, error: "missing params" }, { status: 400 });
    }

    // Dev fallback if gateway is not configured
    if (!GATEWAY_URL || !GATEWAY_API_KEY) {
      return NextResponse.json({ ok: true, text }, { status: 200 });
    }

    const r = await fetch(`${GATEWAY_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GATEWAY_API_KEY}`,
      },
      body: JSON.stringify({
        text,
        sourceLang: sourceLang || "",
        targetLang,
      }),
    });

    if (!r.ok) {
      const msg = await r.text().catch(() => "");
      return NextResponse.json({ ok: false, error: `Translate ${r.status}: ${msg}` }, { status: 502 });
    }

    const data = await r.json();
    return NextResponse.json({ ok: true, text: data.text || "" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || "failed" }, { status: 500 });
  }
}
