import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/twin/video/init
 * Body: { mime: string, size: number, parts?: number }
 *
 * Returns: either
 *  - { uploadId, uploadUrl, completeUrl }  // single file
 *  - { uploadId, parts: [{partNumber, url}], completeUrl }  // multipart
 */
export async function POST(req: NextRequest) {
  try {
    const { mime, size, parts } = await req.json();

    if (!mime || !size || size <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const uploadId = `video_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const USE_MULTIPART = parts && Number.isInteger(parts) && parts > 1;

    if (!USE_MULTIPART) {
      const uploadUrl = `/api/twin/video/upload?uploadId=${encodeURIComponent(uploadId)}&partNumber=1`;
      const completeUrl = `/api/twin/video/complete?uploadId=${encodeURIComponent(uploadId)}`;
      return NextResponse.json({ uploadId, uploadUrl, completeUrl });
    }

    const partCount = Math.max(2, Math.min(10000, Number(parts)));
    const items = Array.from({ length: partCount }, (_, i) => {
      const partNumber = i + 1;
      const url = `/api/twin/video/upload?uploadId=${encodeURIComponent(uploadId)}&partNumber=${partNumber}`;
      return { partNumber, url };
    });
    const completeUrl = `/api/twin/video/complete?uploadId=${encodeURIComponent(uploadId)}`;

    return NextResponse.json({
      uploadId,
      parts: items,
      completeUrl,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
