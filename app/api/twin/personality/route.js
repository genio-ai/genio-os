// File: app/api/twin/personality/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * POST /api/twin/personality
 * Body: { personality: { about: string, tone?: string, ... }, userId?: string }
 * Returns: { ok: true, twinId }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { personality, userId } = body || {};

    if (!personality || typeof personality.about !== "string" || personality.about.trim().length < 10) {
      return NextResponse.json(
        { ok: false, error: "Invalid personality payload" },
        { status: 400 }
      );
    }

    // Save to Supabase (table: twin_personality)
    const twinId = "twin_" + Date.now();
    const { error } = await supabase
      .from("twin_personality")
      .insert([
        {
          id: twinId,
          user_id: userId || null,
          about: personality.about,
          tone: personality.tone || null,
          pace: personality.pace || null,
          emojis: personality.emojis || null,
          languages: personality.languages || null,
          preferred: personality.preferred || null,
          avoided: personality.avoided || null,
          signatures: personality.signatures || null,
          sample1: personality.sample1 || null,
          sample2: personality.sample2 || null,
          sample3: personality.sample3 || null,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;

    return NextResponse.json({ ok: true, twinId });
  } catch (err) {
    console.error("POST /twin/personality error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to save personality" },
      { status: 500 }
    );
  }
}
