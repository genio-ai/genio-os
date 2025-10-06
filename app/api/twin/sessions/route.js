// File: app/api/twin/sessions/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/twin/sessions?limit=5&userId=...&twinId=...
 * Returns:
 *  { items: [{ id, ts, lang, duration_s, provider }] }
 *
 * Suggested table:
 * twin_sessions(
 *   id text pk,
 *   user_id uuid,
 *   twin_id text,
 *   created_at timestamptz,
 *   lang text,
 *   duration_s int4,
 *   provider text
 * )
 */
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const limitParam = Number(url.searchParams.get("limit") || "5");
    const limit = Math.max(1, Math.min(20, limitParam));
    const userId = url.searchParams.get("userId");
    const twinId = url.searchParams.get("twinId");

    let q = supabase
      .from("twin_sessions")
      .select("id, created_at, lang, duration_s, provider, user_id, twin_id");

    if (userId) q = q.eq("user_id", userId);
    else if (twinId) q = q.eq("twin_id", twinId);

    q = q.order("created_at", { ascending: false }).limit(limit);

    const { data, error } = await q;
    if (error) {
      return NextResponse.json({ items: [], error: error.message }, { status: 200 });
    }

    const items =
      (data || []).map((r) => ({
        id: r.id,
        ts: r.created_at,
        lang: r.lang || "en",
        duration_s: Number(r.duration_s) || 0,
        provider: r.provider || "openai",
      })) ?? [];

    return NextResponse.json({ items }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
