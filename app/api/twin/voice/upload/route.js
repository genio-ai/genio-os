// app/api/twin/voice/upload/route.js
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
const BUCKET = "twin_voices";

// ---- In-memory store
const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

function pickExt(type = "") {
  const t = type.split(";")[0];
  if (t === "audio/webm") return ".webm";
  if (t === "audio/mpeg" || t === "audio/mp3") return ".mp3";
  if (t === "audio/ogg" || t === "audio/oga") return ".ogg";
  if (t === "audio/wav") return ".wav";
  if (t === "audio/m4a" || t === "audio/mp4") return ".m4a";
  return "";
}

export async function POST(req) {
  try {
    const ctype = req.headers.get("content-type") || "";
    const isMultipart = ctype.includes("multipart/form-data");

    if (isMultipart) {
      const form = await req.formData();
      const file = form.get("file");
      const userId = form.get("userId") || "anon";

      if (!file || typeof file === "string") {
        return NextResponse.json({ ok: false, error: "Missing file" });
      }

      const ext = pickExt(file.type);
      const bytes = new Uint8Array(await file.arrayBuffer());
      if (bytes.byteLength > MAX_PART_BYTES)
        return NextResponse.json({ ok: false, error: "File too large" });

      const totalKey = `total:${userId}`;
      const total = (g.__UPLOAD_STORE.get(totalKey) || 0) + bytes.byteLength;
      if (total > MAX_TOTAL_BYTES)
        return NextResponse.json({ ok: false, error: "Total upload too big" });
      g.__UPLOAD_STORE.set(totalKey, total);

      const name = `${userId}/raw/${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .upload(name, bytes, { contentType: file.type });

      if (error) return NextResponse.json({ ok: false, error: error.message });

      const { data: publicUrl } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(data.path);

      return NextResponse.json({
        ok: true,
        path: data.path,
        url: publicUrl?.publicUrl || null,
      });
    }

    return NextResponse.json({ ok: false, error: "Invalid upload request" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message || "Upload failed" });
  }
}
