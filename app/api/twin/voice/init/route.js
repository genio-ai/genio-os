import { NextResponse } from "next/server";

/**
 * POST /api/twin/voice/init
 * Body: { mime: string, size: number, parts?: number }
 * Returns:
 *  - { uploadId, uploadUrl, completeUrl }  (single upload)
 *  - { uploadId, parts:[{partNumber,url}], completeUrl }  (multipart)
 */
export async function POST(req) {
  try {
    const { mime, size, parts } = await req.json();

    if (!mime || !size || size <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const uploadId = `voice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const multi = parts && Number.isInteger(parts) && parts > 1;

    if (!multi) {
      const uploadUrl = `/api/twin/voice/upload?uploadId=${encodeURIComponent(uploadId)}&partNumber=1`;
      const completeUrl = `/api/twin/voice/complete?uploadId=${encodeURIComponent(uploadId)}`;
      return NextResponse.json({ uploadId, uploadUrl, completeUrl });
    }

    const partCount = Math.max(2, Math.min(10000, Number(parts)));
    const list = Array.from({ length: partCount }, (_, i) => {
      const n = i + 1;
      const url = `/api/twin/voice/upload?uploadId=${encodeURIComponent(uploadId)}&partNumber=${n}`;
      return { partNumber: n, url };
    });
    const completeUrl = `/api/twin/voice/complete?uploadId=${encodeURIComponent(uploadId)}`;

    return NextResponse.json({ uploadId, parts: list, completeUrl });
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
