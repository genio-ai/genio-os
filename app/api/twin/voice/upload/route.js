// File: app/api/twin/voice/upload/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);

// ---- Limits
const MAX_PART_BYTES = 8 * 1024 * 1024;   // 8MB per chunk
const MAX_TOTAL_BYTES = 64 * 1024 * 1024; // 64MB total
const BUCKET = "voices";

// ---- In-memory store (best-effort only)
const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

// ---- Helpers
function pickExt(type = "") {
  const t = type.toLowerCase();
  if (t.includes("mp4") || t.includes("m4a")) return "m4a";
  if (t.includes("webm")) return "webm";
  if (t.includes("ogg")) return "ogg";
  return "webm";
}

async function uploadBufferToStorage(buffer, contentType) {
  const ext = pickExt(contentType);
  // "voices/" here is a folder prefix inside the bucket, not the bucket name
  const path = `voices/voice-${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: contentType || "audio/webm",
    upsert: true,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

/**
 * POST /api/twin/voice/upload
 * Body: multipart/form-data -> field "file"
 * Uploads a complete file in one request.
 */
export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!file) {
      return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });
    }

    const ab = await file.arrayBuffer();
    if (!ab || ab.byteLength === 0) {
      return NextResponse.json({ ok: false, error: "Empty file" }, { status: 400 });
    }

    if (ab.byteLength > MAX_TOTAL_BYTES) {
      return NextResponse.json({ ok: false, error: "File too large" }, { status: 413 });
    }

    const { path, url } = await uploadBufferToStorage(Buffer.from(ab), file.type);
    return NextResponse.json({ ok: true, path, url }, { status: 200 });
  } catch (err) {
    console.error("POST /voice/upload error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/twin/voice/upload?uploadId=...&partNumber=1
 * Body: binary chunk
 * If session is missing, treats request as a full single-file upload (fast fallback).
 */
export async function PUT(req) {
  try {
    const url = new URL(req.url);
    const uploadId = url.searchParams.get("uploadId") || "";
    const partNumber = Number(url.searchParams.get("partNumber") || "0");

    const ab = await req.arrayBuffer();
    if (!ab || ab.byteLength === 0) {
      return NextResponse.json({ ok: false, error: "Empty body" }, { status: 400 });
    }
    if (ab.byteLength > MAX_PART_BYTES) {
      return NextResponse.json({ ok: false, error: "Part too large" }, { status: 413 });
    }

    const sess = g.__UPLOAD_STORE.get(uploadId);

    // Fallback path: no session -> upload whole buffer now
    if (
      !uploadId ||
      !sess ||
      sess.kind !== "voice" ||
      !sess.parts ||
      !Number.isInteger(partNumber) ||
      partNumber <= 0
    ) {
      const type = req.headers.get("content-type") || "audio/webm";
      const { path, url: publicUrl } = await uploadBufferToStorage(Buffer.from(ab), type);
      const etag = crypto.createHash("md5").update(Buffer.from(ab)).digest("hex");
      return new NextResponse(
        JSON.stringify({ ok: true, fallback: true, path, url: publicUrl, etag }),
        { status: 200, headers: { "Content-Type": "application/json", ETag: etag } }
      );
    }

    // Original chunked flow
    const buf = Buffer.from(ab);
    const currentTotal =
      Array.from(sess.parts.values()).reduce((n, b) => n + b.byteLength, 0) + buf.byteLength;

    if (currentTotal > MAX_TOTAL_BYTES) {
      return NextResponse.json({ ok: false, error: "Upload exceeds total limit" }, { status: 413 });
    }
    if (sess.parts.has(partNumber)) {
      return NextResponse.json({ ok: false, error: "Part already uploaded" }, { status: 409 });
    }

    sess.parts.set(partNumber, buf);
    const etag = crypto.createHash("md5").update(buf).digest("hex");
    return new NextResponse(JSON.stringify({ ok: true, etag, partNumber }), {
      status: 200,
      headers: { "Content-Type": "application/json", ETag: etag },
    });
  } catch (err) {
    console.error("PUT /voice/upload error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
