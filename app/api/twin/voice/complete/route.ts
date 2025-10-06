import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/twin/voice/complete?uploadId=...
 * Body: optional { parts: [{ partNumber, etag }] } (ignored in this stub)
 * Returns: { ok: true, uploadId, size }
 *
 * NOTE:
 * - Dev-only: reads parts from process memory (set by /voice/upload).
 * - Replace with a call to your storage provider's "complete multipart upload".
 */

// Reuse the same global store created in /voice/upload
type UploadSession = { kind: "voice"; parts: Map<number, Buffer> };
const g = globalThis as unknown as { __UPLOAD_STORE?: Map<string, UploadSession> };
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uploadId = searchParams.get("uploadId") || "";
    if (!uploadId) {
      return NextResponse.json({ ok: false, error: "Missing uploadId" }, { status: 400 });
    }

    const store = g.__UPLOAD_STORE!;
    const sess = store.get(uploadId);
    if (!sess || sess.kind !== "voice" || sess.parts.size === 0) {
      return NextResponse.json({ ok: false, error: "Upload session not found" }, { status: 404 });
    }

    // Concatenate parts in ascending order
    const ordered = Array.from(sess.parts.entries())
      .sort(([a], [b]) => a - b)
      .map(([, buf]) => buf);

    const totalSize = ordered.reduce((n, b) => n + b.byteLength, 0);
    const combined = Buffer.concat(ordered, totalSize);

    // TODO: persist "combined" to your storage and get a storageKey/url
    // const storageKey = await putToStorage(uploadId, combined);

    // Cleanup session
    store.delete(uploadId);

    return NextResponse.json({
      ok: true,
      uploadId,
      size: combined.byteLength,
      // storageKey,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Complete failed" }, { status: 500 });
  }
}
