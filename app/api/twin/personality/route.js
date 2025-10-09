// File: app/api/twin/personality/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// -------- Helper: Fetch with timeout --------
function makeTimedFetch(ms = 15000) {
  return async (input, init = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    try {
      return await fetch(input, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(id);
    }
  };
}

// -------- Supabase Client --------
function getSupabase() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase environment variables");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
    global: { fetch: makeTimedFetch(15000) },
  });
}

// -------- Helper: Build about text --------
function buildAbout(p = {}) {
  if (typeof p.about === "string" && p.about.trim().length >= 10) {
    return p.about.trim().slice(0, 2000);
  }

  const parts = [];
  if (p.tone) parts.push(`Tone: ${p.tone}`);
  if (p.pace) parts.push(`Pace: ${p.pace}`);
  if (p.emojis) parts.push(`Emojis: ${p.emojis}`);
  if (p.languages) parts.push(`Languages: ${p.languages}`);
  if (p.preferred) parts.push(`Preferred: ${p.preferred}`);
  if (p.avoided) parts.push(`Avoided: ${p.avoided}`);
  if (p.signatures) parts.push(`Signatures: ${p.signatures}`);
  const txt = parts.join(" · ") || "Default personality";
  return txt.slice(0, 2000);
}

// -------- POST /api/twin/personality --------
export async function POST(req) {
  const start = Date.now();

  try {
    const { personality = {}, userId = null } = await req.json();
    const sb = getSupabase();
    const about = buildAbout(personality);
    const twinId = `twin_${Date.now()}`;

    const row = {
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
    };

    const { error } = await sb.from("twin_personality").insert(row);

    if (error) {
      return NextResponse.json(
        { ok: false, error: `Supabase insert error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, twinId, took_ms: Date.now() - start },
      { status: 200 }
    );
  } catch (err) {
    const msg =
      err?.message ||
      (typeof err === "string" ? err : "Internal error while creating personality");
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
