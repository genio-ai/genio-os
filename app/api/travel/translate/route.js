// File: app/api/travel/translate/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GATEWAY_URL = process.env.GATEWAY_URL;
const GATEWAY_KEY = process.env.GATEWAY_API_KEY;

export async function POST(req) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ ok:false, error: "missing params" }, { status: 400 });
    }

    if (!GATEWAY_URL || !GATEWAY_KEY) {
      // Dev fallback: echo text
      return NextResponse.json({ ok:true, text }, { status: 200 });
    }

    const r = await fetch(`${GATEWAY_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GATEWAY_KEY}`,
      },
      body: JSON.stringify({ text, sourceLang: sourceLang || "", targetLang }),
    });

    if (!r.ok) {
      const txt = await r.text().catch(()=> "");
      return NextResponse.json({ ok:false, error: `Translate ${r.status}: ${txt}` }, { status: 502 });
    }

    const json = await r.json();
    return NextResponse.json({ ok:true, text: json.text || "" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok:false, error: err?.message || "failed" }, { status: 500 });
  }
}
