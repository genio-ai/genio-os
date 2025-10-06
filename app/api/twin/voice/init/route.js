// File: app/api/twin/voice/init/route.js
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

const MAX_BYTES = 64 * 1024 * 1024; // 64MB safety limit
const CHUNK_MIN = 2;
const CHUNK_MAX = 10_000;

/**
 * POST /api/twin/voice/init
 * Body: { mime: string, size: number, parts?: number, userId?: string, twinId?: string }
 * Returns:
 *  - { uploadId, uploadUrl, completeUrl }                    // single-part
 *  - { uploadId, parts:[{partNumber,url}], completeUrl }     // multi-part
 */
export async function POST(req) {
  try {
    const { mime, size, parts, userId, twinId } = await req.json();

    // Basic validation
    if (!mime || typeof mime !== "string" || !size || size <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }
    if (size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Upload too large" }, { status: 413 });
    }

    // Decide single vs multipart
    const isMulti = Number.isInteger(parts) && parts > 1;
    const uploadId = `voice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Create an in-memory session used by /voice/upload and /voice/complete
    g.__UPLOAD_STORE.set(uploadId, {
      kind: "voice",
      userId: userId || null,
      twinId: twinId || null,
      mime,
      size,
      createdAt: Date.now(),
      parts: new Map(), // partNumber -> Buffer (filled by /voice/upload)
    });

    // Return URLs the client will hit to upload parts, then finalize
    const completeUrl = `/api/twin/voice/complete?uploadId=${encodeURIComponent(uploadId)}`;

    if (!isMulti) {
      const uploadUrl = `/api/twin/voice/upload?uploadId=${encodeURIComponent(uploadId)}&partNumber=1`;
      return NextResponse.json({ uploadId, uploadUrl, completeUrl });
    }

    const count = Math.max(CHUNK_MIN, Math.min(CHUNK_MAX, Number(parts)));
    const list = Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      return {
        partNumber: n,
        url: `/api/twin/voice/upload?uploadId=${encodeURIComponent(uploadId)}&partNumber=${n}`,
      };
    });

    return NextResponse.json({ uploadId, parts: list, completeUrl });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err?.message || "Bad request" }, { status: 400 });
  }
}
