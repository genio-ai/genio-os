// File: app/api/twin/create/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // service role: bypasses RLS
  { auth: { persistSession: false } }
);

export async function POST(req) {
  try {
    const body = await req.json();

    // expected payload fields from client:
    const {
      user_id,         // required
      tone,            // e.g. "Friendly"
      pace,            // e.g. "Medium"
      emojis,          // e.g. "Sometimes"
      languages,       // e.g. "English"
      about_me,        // string (optional)
      voice_path       // storage path like "voices/voice-....m4a" (optional)
    } = body;

    if (!user_id) {
      return NextResponse.json({ ok: false, error: "Missing user_id" }, { status: 400 });
    }

    // TODO: adjust table/column names to match your schema
    const { data, error } = await supabase
      .from("twins")
      .insert({
        user_id,
        tone,
        pace,
        emojis,
        languages,
        about_me,
        voice_path
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ ok: true, twin: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create twin" },
      { status: 500 }
    );
  }
}
