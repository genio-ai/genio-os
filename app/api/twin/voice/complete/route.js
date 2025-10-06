import { NextResponse } from "next/server";

// reuse in-memory store from /voice/upload
const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

/**
 * POST /api/twin/voice/complete?uploadId=...
 * Combines uploaded parts and finalizes the voice upload.
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
    if (!sess || sess.kind !== "voice" || sess.parts.size === 0) {
      return NextResponse.json({ ok: false, error: "Upload session not found" }, { status: 404 });
    }

    // join chunks in ascending order
    const ordered = Array.from(sess.parts.entries())
      .sort(([a], [b]) => a - b)
      .map(([, buf]) => buf);
    const total = ordered.reduce((n, b) => n + b.byteLength, 0);
    const combined = Buffer.concat(ordered, total);

    // TODO: store 'combined' in real storage and save key to DB
    g.__UPLOAD_STORE.delete(uploadId);

    return NextResponse.json({ ok: true, uploadId, size: combined.byteLength });
  } catch {
    return NextResponse.json({ ok: false, error: "Complete failed" }, { status: 500 });
  }
}
