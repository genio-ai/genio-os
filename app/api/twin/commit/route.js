// File: app/api/twin/commit/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * POST /api/twin/commit
 * Body: { twinId: string, voiceUploadId?: string, videoUploadId?: string }
 * Returns: { ok: true, jobId, status, accepted: {...} }
 */
export async function POST(req) {
  try {
    const { twinId, voiceUploadId, videoUploadId } = await req.json();

    if (!twinId || typeof twinId !== "string") {
      return NextResponse.json({ ok: false, error: "Missing twinId" }, { status: 400 });
    }

    // 1) Verify personality exists for this twinId
    const { data: twinRow, error: getErr } = await supabase
      .from("twin_personality")
      .select("id")
      .eq("id", twinId)
      .single();

    if (getErr || !twinRow) {
      return NextResponse.json(
        { ok: false, error: "Twin personality not found. Did you POST /twin/personality first?" },
        { status: 409 }
      );
    }

    // 2) Create a build job row (table: twin_builds)
    // Expected schema (Postgres):
    // twin_builds(id text pk, twin_id text, voice_upload_id text, video_upload_id text,
    //             status text, created_at timestamptz)
    const jobId = "job_" + Date.now();
    const { error: insErr } = await supabase
      .from("twin_builds")
      .insert([
        {
          id: jobId,
          twin_id: twinId,
          voice_upload_id: voiceUploadId || null,
          video_upload_id: videoUploadId || null,
          status: "queued",
          created_at: new Date().toISOString(),
        },
      ]);

    if (insErr) {
      return NextResponse.json(
        { ok: false, error: `Failed to queue build: ${insErr.message}` },
        { status: 500 }
      );
    }

    // 3) (Optional) Mark twin as processing if column exists
    // If your twin_personality has 'build_status' column, this will update it.
    // If not, we ignore the error silently.
    const { error: updErr } = await supabase
      .from("twin_personality")
      .update({ build_status: "processing" })
      .eq("id", twinId);

    // Ignore missing-column errors gracefully
    if (updErr && !String(updErr.message || "").toLowerCase().includes("column")) {
      // Only surface non-column errors
      return NextResponse.json(
        { ok: false, error: `Failed to update twin status: ${updErr.message}` },
        { status: 500 }
      );
    }

    // 4) Return queued response
    return NextResponse.json({
      ok: true,
      jobId,
      status: "queued",
      accepted: {
        twinId,
        voiceUploadId: voiceUploadId || null,
        videoUploadId: videoUploadId || null,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Bad request" },
      { status: 400 }
    );
  }
}
