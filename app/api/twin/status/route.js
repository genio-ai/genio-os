// File: app/api/twin/status/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * GET /api/twin/status?userId=...
 * Returns: { built: boolean, language: string, provider: string }
 */
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || null;

    // 1) Find latest twin by user (you can adapt if you use a direct twinId)
    const { data: twin, error: twinErr } = await supabase
      .from("twin_personality")
      .select("id, build_status, languages")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (twinErr) {
      return NextResponse.json({ built: false, language: "en", provider: "openai" }, { status: 200 });
    }
    if (!twin) {
      return NextResponse.json({ built: false, language: "en", provider: "openai" }, { status: 200 });
    }

    // 2) If build_status says ready, we're built. Else check last build job
    let built = twin.build_status === "ready";
    if (!built) {
      const { data: build, error: buildErr } = await supabase
        .from("twin_builds")
        .select("status")
        .eq("twin_id", twin.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!buildErr && build && build.status === "completed") built = true;
    }

    // 3) Language from personality.languages (fallback "en")
    const language =
      (typeof twin.languages === "string" && twin.languages.split(",")[0]?.trim()) ||
      "en";

    // 4) Provider: read from a settings table if you have one; fallback
    // If you have `twin_settings` with provider, read it. For now default:
    const provider = "openai";

    return NextResponse.json({ built, language, provider }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { built: false, language: "en", provider: "openai" },
      { status: 200 }
    );
  }
}
