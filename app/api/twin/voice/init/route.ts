import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/twin/voice/init
 * Body: { mime: string, size: number, parts?: number }
 *
 * Returns either:
 *  A) Single-URL upload plan:
 *     { uploadId, uploadUrl, completeUrl }
 *
 *  B) Multipart upload plan:
 *     { uploadId, parts: [{ partNumber, url }...], completeUrl }
 *
 * Notes:
 * - This is a stub that issues app-local URLs so you can copy-paste and run.
 * - In production, replace the URLs with real S3/minio signed URLs.
 */
export async function POST(req: NextRequest) {
  try {
    const { mime, size, parts } = await req.json();

    if (!mime || !size || size <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    // Create a fake upload session id
    const uploadId = `voice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Simple rule: small files => single URL; larger => multipart
    const USE_MULTIPART = parts && Number.isInteger(parts) && parts > 1;

    if (!USE_MULTIPART) {
      // Single URL plan (client will PUT the whole blob to this URL)
      const uploadUrl = `/api/twin/voice/upload?uploadId=${encodeURIComponent(uploadId)}&partNumber=1`;
      const completeUrl = `/api/twin/voice/complete?uploadId=${encodeURIComponent(uploadId)}`;
      return NextResponse.json({ uploadId, uploadUrl, completeUrl });
    }

    // Multipart plan: generate app-local PUT URLs for each part
    const partCount = Math.max(2, Math.min(10000, Number(parts)));
    const items = Array.from({ length: partCount }, (_, i) => {
      const partNumber = i + 1;
      const url = `/api/twin/voice/upload?uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`;
      return { partNumber, url };
    });
    const completeUrl = `/api/twin/voice/complete?uploadId=${encodeURIComponent(uploadId)}`;

    return NextResponse.json({
      uploadId,
      parts: items,
      completeUrl,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
