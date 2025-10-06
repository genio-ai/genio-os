// File: app/api/twin/sessions/route.js
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function qs(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");
}

/**
 * GET /api/twin/sessions?limit=5&userId=...&twinId=...
 * Returns: { items: [{ id, ts, lang, duration_s, provider }] }
 */
export async function GET(req) {
  try {
    const u = new URL(req.url);
    const limit = Math.max(1, Math.min(20, Number(u.searchParams.get("limit") || "5")));
    const userId = u.searchParams.get("userId") || "";
    const twinId = u.searchParams.get("twinId") || "";

    if (!url || !anon) {
      return NextResponse.json({ items: [], error: "Missing Supabase env" }, { status: 200 });
    }

    // Build REST query
    const table = "twin_sessions";
    const filters = [];
    if (userId) filters.push(`user_id=eq.${userId}`);
    else if (twinId) filters.push(`twin_id=eq.${twinId}`);

    const query = [
      ...filters,
      `order=created_at.desc`,
      `limit=${limit}`,
      `select=id,created_at,lang,duration_s,provider`,
    ].join("&");

    const endpoint = `${url}/rest/v1/${table}?${query}`;

    const r = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: anon,
        Authorization: `Bearer ${anon}`,
        Accept: "application/json",
      },
    });

    if (!r.ok) {
      const txt = await r.text().catch(() => "");
      return NextResponse.json({ items: [], error: `REST ${r.status}: ${txt}` }, { status: 200 });
    }

    const rows = await r.json();
    const items = (rows || []).map((row) => ({
      id: row.id,
      ts: row.created_at,
      lang: row.lang || "en",
      duration_s: Number(row.duration_s) || 0,
      provider: row.provider || "openai",
    }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { items: [], error: err?.message || "unknown" },
      { status: 200 }
    );
  }
}
