import { NextResponse } from "next/server";
import crypto from "crypto";

// In-memory temporary store (for dev/testing only)
const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

/**
 * PUT /api/twin/voice/upload?uploadId=...&partNumber=1
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
    if (ab.byteLength > 8 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Part too large (>8MB)" }, { status: 413 });
    }

    if (!g.__UPLOAD_STORE.has(uploadId)) {
      g.__UPLOAD_STORE.set(uploadId, { kind: "voice", parts: new Map() });
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
