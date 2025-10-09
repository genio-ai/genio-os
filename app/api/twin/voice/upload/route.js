// app/api/twin/create/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// adjust this table name if your table is different
const TABLE = "twin_profiles";

function fail(message, status = 400, extra = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

export async function POST(req) {
  try {
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return fail("Missing Supabase service environment variables", 500);
    }

    // create admin client using service role key
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const body = await req.json();

    if (!body?.user_id) return fail("Missing user_id");

    const row = {
      user_id: body.user_id,
      tone: body.tone ?? null,
      pace: body.pace ?? null,
      emojis: body.emojis ?? null,
      languages: body.languages ?? null,
      about_me: body.about_me ?? null,
      voice_path: body.voice_path ?? null,
      // add any other columns your table expects
    };

    const { data, error } = await admin
      .from(TABLE)
      .insert(row)
      .select()
      .single();

    if (error) return fail(error.message, 401);

    return NextResponse.json({ ok: true, twin: data }, { status: 200 });
  } catch (err) {
    return fail(err?.message || "Create twin failed", 500);
  }
}
