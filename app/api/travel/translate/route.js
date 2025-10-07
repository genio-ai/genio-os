import { NextResponse } from "next/server";
import { checkRateLimit, tooManyResponse } from "@/app/api/_middleware/ratelimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GATEWAY_URL = process.env.GATEWAY_URL;       // e.g. https://gateway.genio.systems
const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;
const TIMEOUT_MS = 7000;

function joinUrl(base, path) {
  return `${String(base).replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
}

async function fetchWithTimeout(url, init = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

/**
 * POST /api/travel/translate
 * Body: { text: string, sourceLang?: string, targetLang: string }
 * Returns: { ok: true, text: string }
 */
export async function POST(req) {
  // Rate limit to protect backend
  {
    const { ok, remaining, resetAt } = checkRateLimit(req, {
      limit: 12,
      windowMs: 10_000,
      keyExtra: "translate",
    });
    if (!ok) return tooManyResponse(remaining, resetAt);
  }

  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (typeof text !== "string" || !text.trim() || !targetLang) {
      return NextResponse.json({ ok: false, error: "missing params" }, { status: 400 });
    }

    // Dev fallback if gateway is not configured
    if (!GATEWAY_URL || !GATEWAY_API_KEY) {
      return NextResponse.json({ ok: true, text }, { status: 200 });
    }

    const r = await fetchWithTimeout(joinUrl(GATEWAY_URL, "/translate"), {
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
      cache: "no-store",
    }, TIMEOUT_MS);

    if (!r.ok) {
      const msg = await r.text().catch(() => "");
      return NextResponse.json({ ok: false, error: `Translate ${r.status}: ${msg}` }, { status: 502 });
    }

    const data = await r.json().catch(() => ({}));
    return NextResponse.json({ ok: true, text: data.text || "" }, { status: 200 });
  } catch (err) {
    const msg = (err?.message || "failed").slice(0, 200);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
