import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * PUT /api/twin/voice/upload?uploadId=...&partNumber=1
 * Body: binary chunk
 * Returns: 200 + { ok: true, etag }
 *
 * NOTE:
 * - This uses a process-memory store for dev only.
 * - In production, you should PUT directly to a signed storage URL (S3/minio).
 */

// Global in-memory store (dev only)
type UploadSession = { kind: "voice"; parts: Map<number, Buffer> };
const g = globalThis as unknown as { __UPLOAD_STORE?: Map<string, UploadSession> };
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uploadId = searchParams.get("uploadId") || "";
    const partNumber = Number(searchParams.get("partNumber") || "0");

    if (!uploadId || !Number.isInteger(partNumber) || partNumber <= 0) {
      return NextResponse.json({ ok: false, error: "Missing uploadId/partNumber" }, { status: 400 });
    }

    // Read chunk
    const ab = await req.arrayBuffer();
    if (!ab || ab.byteLength === 0) {
      return NextResponse.json({ ok: false, error: "Empty body" }, { status: 400 });
    }
    // Optional: limit each part to ~8MB for this stub
    if (ab.byteLength > 8 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Part too large (>8MB)" }, { status: 413 });
    }

    // Ensure session
    const store = g.__UPLOAD_STORE!;
    if (!store.has(uploadId)) {
      store.set(uploadId, { kind: "voice", parts: new Map() });
    }
    const sess = store.get(uploadId)!;

    // Save part
    const buf = Buffer.from(ab);
    sess.parts.set(partNumber, buf);

    // Generate a fake ETag (md5 of content) for client bookkeeping
    const etag = crypto.createHash("md5").update(buf).digest("hex");

    // Return JSON and also set ETag header (like S3 does)
    return new NextResponse(JSON.stringify({ ok: true, etag }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ETag: etag,
      },
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Upload failed" }, { status: 500 });
  }
}
