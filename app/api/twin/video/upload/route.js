import { NextResponse } from "next/server";
import crypto from "crypto";

// dev-only in-memory store (shared with voice stubs)
const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

/**
 * PUT /api/twin/video/upload?uploadId=...&partNumber=1
 * Body: binary chunk
 * Returns: { ok: true, etag }
 */
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const uploadId = url.searchParams.get("uploadId") || "";
    const partNumber = Number(url.searchParams.get("partNumber") || "0");

    if (!uploadId || !Number.isInteger(partNumber) || partNumber <= 0) {
      return NextResponse.json({ ok: false, error: "Missing uploadId/partNumber" }, { status: 400 });
    }

    const ab = await req.arrayBuffer();
    if (!ab || ab.byteLength === 0) {
      return NextResponse.json({ ok: false, error: "Empty body" }, { status: 400 });
    }
    // keep each dev-part ≤ ~8MB like voice
    if (ab.byteLength > 8 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Part too large (>8MB)" }, { status: 413 });
    }

    if (!g.__UPLOAD_STORE.has(uploadId)) {
      g.__UPLOAD_STORE.set(uploadId, { kind: "video", parts: new Map() });
    }
    const sess = g.__UPLOAD_STORE.get(uploadId);
    const buf = Buffer.from(ab);
    sess.parts.set(partNumber, buf);

    const etag = crypto.createHash("md5").update(buf).digest("hex");
    return new NextResponse(JSON.stringify({ ok: true, etag }), {
      status: 200,
      headers: { "Content-Type": "application/json", ETag: etag },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
