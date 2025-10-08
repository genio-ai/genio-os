// File: app/api/twin/personality/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSb() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

function buildAbout(p = {}) {
  const parts = [];
  if (p.about && typeof p.about === "string" && p.about.trim().length >= 10) {
    return p.about.trim();
  }
  if (p.tone) parts.push(`Tone: ${p.tone}`);
  if (p.pace) parts.push(`Pace: ${p.pace}`);
  if (p.emojis) parts.push(`Emojis: ${p.emojis}`);
  if (p.languages) parts.push(`Languages: ${p.languages}`);
  if (p.preferred) parts.push(`Preferred: ${p.preferred}`);
  if (p.avoided) parts.push(`Avoided: ${p.avoided}`);
  if (p.signatures) parts.push(`Signatures: ${p.signatures}`);
  const fallback = parts.join(" · ") || "Default personality";
  return fallback.slice(0, 2000);
}

/**
 * POST /api/twin/personality
 * Body: { personality: {...}, userId? }
 * Returns: { ok: true, twinId }
 */
export async function POST(req) {
  try {
    const { personality = {}, userId = null } = await req.json();
    const about = buildAbout(personality);

    const sb = getSb();
    const twinId = "twin_" + Date.now();

    const { error } = await sb.from("twin_personality").insert({
      id: twinId,
      user_id: userId,
      about,
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
    return NextResponse.json(
      { ok: false, error: String(err?.message || err) },
      { status: 500 }
    );
  }
}
