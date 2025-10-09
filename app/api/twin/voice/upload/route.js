// app/api/twin/voice/upload/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSupabase } from "../../../../lib/supabase.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- Config (reverted to original bucket)
const BUCKET = "twin_voices";
const MAX_PART_BYTES = 8 * 1024 * 1024;   // 8MB per part
const MAX_TOTAL_BYTES = 64 * 1024 * 1024; // 64MB total

// Best-effort in-memory tracker (per instance)
const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

// Helpers
function extFromContentType(t = "") {
  const mime = (t || "").split(";")[0].trim().toLowerCase();
  if (mime === "audio/webm") return ".webm";
  if (mime === "audio/ogg" || mime === "audio/oga") return ".ogg";
  if (mime === "audio/mpeg" || mime === "audio/mp3") return ".mp3";
  if (mime === "audio/wav") return ".wav";
  if (mime === "audio/mp4" || mime === "audio/aac" || mime === "audio/m4a") return ".m4a";
  return "";
}

function ok(json, init = {}) {
  return NextResponse.json({ ok: true, ...json }, init);
}
function fail(message, status = 400, extra = {}) {
  return NextResponse.json({ ok: false, error: message, ...extra }, { status });
}

async function uploadBytes(supabase, bytes, name, contentType) {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(name, bytes, { contentType, upsert: false });

  if (error) throw new Error(error.message);

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

  // Return both legacy and new keys so UI stays happy
  return {
    path: data.path,
    publicUrl: pub?.publicUrl || null,
    // legacy aliases (keep both just in case UI expects these)
    url: pub?.publicUrl || null,
    voicePath: data.path,
  };
}

// POST /api/twin/voice/upload
export async function POST(req) {
  try {
    const supabase = getServerSupabase(); // created at runtime

    const ctype = req.headers.get("content-type") || "";
    const isMultipart = ctype.includes("multipart/form-data");

    if (isMultipart) {
      const form = await req.formData();
      const file = form.get("file");
      const userId = String(form.get("userId") || "anon");

      if (!file || typeof file === "string") {
        return fail("Missing 'file' in form-data");
      }

      const type = file.type || "application/octet-stream";
      const ext = extFromContentType(type) || ".webm";

      const bytes = new Uint8Array(await file.arrayBuffer());
      if (bytes.byteLength > MAX_PART_BYTES) {
        return fail(`Part too large (> ${MAX_PART_BYTES} bytes)`, 413);
      }

      const totalKey = `total:${userId}`;
      const total = (g.__UPLOAD_STORE.get(totalKey) || 0) + bytes.byteLength;
      if (total > MAX_TOTAL_BYTES) {
        return fail(`Total upload exceeds ${MAX_TOTAL_BYTES} bytes`, 413);
      }
      g.__UPLOAD_STORE.set(totalKey, total);

      const name = `${userId}/raw/${Date.now()}-${crypto
        .randomBytes(6)
        .toString("hex")}${ext}`;

      const out = await uploadBytes(supabase, bytes, name, type);
      return ok({ ...out, size: bytes.byteLength, contentType: type });
    }

    // Raw body fallback (non-multipart)
    const type = req.headers.get("content-type") || "application/octet-stream";
    const ext = extFromContentType(type) || ".bin";
    const userId = String(req.headers.get("x-user-id") || "anon");

    const buf = new Uint8Array(await req.arrayBuffer());
    if (buf.byteLength === 0) return fail("Empty body");
    if (buf.byteLength > MAX_PART_BYTES) {
      return fail(`Payload too large (> ${MAX_PART_BYTES} bytes)`, 413);
    }

    const name = `${userId}/raw/${Date.now()}-${crypto
      .randomBytes(6)
      .toString("hex")}${ext}`;

    const out = await uploadBytes(supabase, buf, name, type);
    return ok({ ...out, size: buf.byteLength, contentType: type });
  } catch (err) {
    return fail(err?.message || "Upload failed", 500);
  }
}
