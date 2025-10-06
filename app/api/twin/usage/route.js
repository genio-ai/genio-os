// File: app/api/twin/usage/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/twin/usage?userId=...&twinId=...
 * Returns: { remaining_minutes: number, plan: "Starter"|"Pro"|"DayPass" }
 *
 * Tables (suggested):
 * - subscriptions(user_id uuid, plan text)             // one row per user
 * - usage_minutes(user_id uuid, twin_id text, minutes int4, created_at timestamptz)
 * - twin_personality(id text pk, user_id uuid)         // to resolve userId from twinId if needed
 */
export async function GET(req) {
  try {
    const url = new URL(req.url);
    let userId = url.searchParams.get("userId");
    const twinId = url.searchParams.get("twinId");

    // If only twinId is provided, resolve userId
    if (!userId && twinId) {
      const { data: twin, error: twinErr } = await supabase
        .from("twin_personality")
        .select("user_id")
        .eq("id", twinId)
        .maybeSingle();
      if (!twinErr && twin?.user_id) userId = twin.user_id;
    }

    // 1) Read subscription plan (default Starter)
    const { data: sub, error: subErr } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", userId || null)
      .maybeSingle();

    const plan = (sub && sub.plan) || "Starter";

    // 2) Allowance by plan (edit as you like)
    const ALLOWANCE = { Starter: 60, Pro: 600, DayPass: 120 };
    const allowance = ALLOWANCE[plan] ?? 60;

    // 3) Sum used minutes (by user or by twin)
    let used = 0;
    if (userId) {
      const { data: rows, error: useErr } = await supabase
        .from("usage_minutes")
        .select("minutes")
        .eq("user_id", userId);

      if (!useErr && Array.isArray(rows)) {
        used = rows.reduce((n, r) => n + (Number(r.minutes) || 0), 0);
      }
    } else if (twinId) {
      const { data: rows, error: useErr } = await supabase
        .from("usage_minutes")
        .select("minutes")
        .eq("twin_id", twinId);

      if (!useErr && Array.isArray(rows)) {
        used = rows.reduce((n, r) => n + (Number(r.minutes) || 0), 0);
      }
    }

    const remaining = Math.max(allowance - used, 0);

    return NextResponse.json(
      { remaining_minutes: remaining, plan },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { remaining_minutes: 0, plan: "Starter" },
      { status: 200 }
    );
  }
}
