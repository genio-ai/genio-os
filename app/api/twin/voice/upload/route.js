// app/api/twin/voice/upload/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSupabase } from "@/app/lib/supabase.server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- Config
const BUCKET = "voices";
const MAX_PART_BYTES = 8 * 1024 * 1024;   // 8MB per part
const MAX_TOTAL_BYTES = 64 * 1024 * 1024; // 64MB total

// Simple in-memory tracker (best-effort only)
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

// POST /api/twin/voice/upload
export async function POST(req) {
  try {
    const supabase = getServerSupabase(); // ← created at runtime, not top-level

    const ctype = req.headers.get("content-type") || "";
    const isMultipart = ctype.includes("multipart/form-data");

    if (isMultipart) {
      const form = await req.formData();
      const part = form.get("file");
      const userId = (form.get("userId") || "anon").toString();

      if (!part || typeof part === "string") {
        return fail("Missing 'file' in form-data");
      }
      const type = part.type || "";
      const ext = extFromContentType(type) || ".webm";

      const arrayBuf = await part.arrayBuffer();
      const bytes = new Uint8Array(arrayBuf);

      if (bytes.byteLength > MAX_PART_BYTES) {
        return fail(`Part too large (> ${MAX_PART_BYTES} bytes)`);
      }

      const totalKey = `total:${userId}`;
      const total = (g.__UPLOAD_STORE.get(totalKey) || 0) + bytes.byteLength;
      if (total > MAX_TOTAL_BYTES) {
        return fail(`Total upload exceeds ${MAX_TOTAL_BYTES} bytes`, 413);
      }
      g.__UPLOAD_STORE.set(totalKey, total);

      const name =
        `${userId}/raw/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(name, bytes, {
          contentType: type || "application/octet-stream",
          upsert: false,
        });

      if (error) return fail(error.message, 500);

      const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

      return ok({
        path: data.path,
        publicUrl: publicUrl?.publicUrl || null,
        size: bytes.byteLength,
        contentType: type || null,
      });
    }

    // Fallback: raw body
    const type = req.headers.get("content-type") || "application/octet-stream";
    const ext = extFromContentType(type) || ".bin";
    const userId = (req.headers.get("x-user-id") || "anon").toString();

    const buf = new Uint8Array(await req.arrayBuffer());
    if (buf.byteLength === 0) return fail("Empty body");
    if (buf.byteLength > MAX_PART_BYTES) {
      return fail(`Payload too large (> ${MAX_PART_BYTES} bytes)`, 413);
    }

    const name =
      `${userId}/raw/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;

    const supabase = getServerSupabase();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(name, buf, {
        contentType: type,
        upsert: false,
      });

    if (error) return fail(error.message, 500);

    const { data: publicUrl } = supabase.storage.from(BUCKET).getPublicUrl(data.path);

    return ok({
      path: data.path,
      publicUrl: publicUrl?.publicUrl || null,
      size: buf.byteLength,
      contentType: type,
    });
  } catch (err) {
    const msg = err?.message || "Upload failed";
    return fail(msg, 500);
  }
}
