import { NextResponse } from "next/server";

// reuse the same in-memory store as other upload routes
const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

/**
 * POST /api/twin/video/complete?uploadId=...
 * Combines uploaded video parts and finalizes the upload.
 * Returns: { ok: true, uploadId, size }
 */
export async function POST(req) {
  try {
    const url = new URL(req.url);
    const uploadId = url.searchParams.get("uploadId") || "";

    if (!uploadId) {
      return NextResponse.json({ ok: false, error: "Missing uploadId" }, { status: 400 });
    }

    const sess = g.__UPLOAD_STORE.get(uploadId);
    if (!sess || sess.kind !== "video" || sess.parts.size === 0) {
      return NextResponse.json({ ok: false, error: "Upload session not found" }, { status: 404 });
    }

    // Merge chunks in ascending order
    const ordered = Array.from(sess.parts.entries())
      .sort(([a], [b]) => a - b)
      .map(([, buf]) => buf);
    const total = ordered.reduce((n, b) => n + b.byteLength, 0);
    const combined = Buffer.concat(ordered, total);

    // TODO: Save 'combined' to your real storage (S3, etc.)
    g.__UPLOAD_STORE.delete(uploadId);

    return NextResponse.json({ ok: true, uploadId, size: combined.byteLength });
  } catch {
    return NextResponse.json({ ok: false, error: "Complete failed" }, { status: 500 });
  }
}
