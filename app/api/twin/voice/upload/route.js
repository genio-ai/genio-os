// File: app/api/twin/voice/upload/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

const MAX_PART_BYTES = 8 * 1024 * 1024; // 8MB safety (client slices ~6MB)
const MAX_TOTAL_BYTES = 64 * 1024 * 1024; // 64MB cap

/**
 * PUT /api/twin/voice/upload?uploadId=...&partNumber=1
 * Body: binary chunk
 * Returns: { ok: true, etag, partNumber }
 */
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const uploadId = url.searchParams.get("uploadId") || "";
    const partNumber = Number(url.searchParams.get("partNumber") || "0");

    if (!uploadId || !Number.isInteger(partNumber) || partNumber <= 0) {
      return NextResponse.json({ ok: false, error: "Missing uploadId/partNumber" }, { status: 400 });
    }

    // Must have been created by /voice/init with full session metadata
    const sess = g.__UPLOAD_STORE.get(uploadId);
    if (!sess || sess.kind !== "voice" || !sess.parts) {
      return NextResponse.json({ ok: false, error: "Upload session not found" }, { status: 404 });
    }

    // Read body
    const ab = await req.arrayBuffer();
    if (!ab || ab.byteLength === 0) {
      return NextResponse.json({ ok: false, error: "Empty body" }, { status: 400 });
    }
    if (ab.byteLength > MAX_PART_BYTES) {
      return NextResponse.json({ ok: false, error: "Part too large" }, { status: 413 });
    }

    // Prevent duplicate parts
    if (sess.parts.has(partNumber)) {
      return NextResponse.json({ ok: false, error: "Part already uploaded" }, { status: 409 });
    }

    // Enforce total cap
    const currentTotal =
      Array.from(sess.parts.values()).reduce((n, b) => n + b.byteLength, 0) + ab.byteLength;
    if (currentTotal > MAX_TOTAL_BYTES) {
      return NextResponse.json({ ok: false, error: "Upload exceeds total limit" }, { status: 413 });
    }

    // Store chunk
    const buf = Buffer.from(ab);
    sess.parts.set(partNumber, buf);

    // ETag for client bookkeeping
    const etag = crypto.createHash("md5").update(buf).digest("hex");
    return new NextResponse(JSON.stringify({ ok: true, etag, partNumber }), {
      status: 200,
      headers: { "Content-Type": "application/json", ETag: etag },
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
