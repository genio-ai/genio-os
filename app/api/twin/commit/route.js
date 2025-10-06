import { NextResponse } from "next/server";

/**
 * POST /api/twin/commit
 * Body: { twinId: string, voiceUploadId?: string, videoUploadId?: string }
 * Purpose:
 *  - Finalize onboarding and enqueue a background processing job.
 *  - In production: verify uploads exist in storage, persist records to DB, enqueue worker job.
 * Returns: { ok: true, jobId, status }
 */
export async function POST(req) {
  try {
    const { twinId, voiceUploadId, videoUploadId } = await req.json();

    if (!twinId || typeof twinId !== "string") {
      return NextResponse.json({ ok: false, error: "Missing twinId" }, { status: 400 });
    }

    // TODO:
    // - Validate that personality exists for twinId in DB
    // - Validate that voice/video were uploaded (check DB/storage)
    // - Persist media references and mark twin status = "processing"
    // - Enqueue background job in your queue (BullMQ/Cloud Tasks/etc.)

    const jobId = "job_" + Date.now();

    // Stub response (no real queue yet)
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
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
