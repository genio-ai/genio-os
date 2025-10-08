// File: app/api/twin/personality/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getServerSupabase() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase env vars missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Production."
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * POST /api/twin/personality
 * Body: { personality: { about: string, tone?, pace?, ... }, userId? }
 * Returns: { ok: true, twinId }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { personality, userId } = body || {};

    if (
      !personality ||
      typeof personality.about !== "string" ||
      personality.about.trim().length < 10
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid personality payload" },
        { status: 400 }
      );
    }

    const supabase = getServerSupabase();
    const twinId = "twin_" + Date.now();

    const { error } = await supabase.from("twin_personality").insert({
      id: twinId,
      user_id: userId || null,
      about: personality.about.trim(),
      tone: personality.tone ?? null,
      pace: personality.pace ?? null,
      emojis: personality.emojis ?? null,
      languages: personality.languages ?? null,
      preferred: personality.preferred ?? null,
      avoided: personality.avoided ?? null,
      signatures: personality.signatures ?? null,
      sample1: personality.sample1 ?? null,
      sample2: personality.sample2 ?? null,
      sample3: personality.sample3 ?? null,
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return NextResponse.json({ ok: true, twinId });
  } catch (err) {
    console.error("POST /api/twin/personality failed:", err);
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
