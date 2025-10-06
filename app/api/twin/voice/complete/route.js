// File: app/api/twin/voice/complete/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const g = globalThis;
if (!g.__UPLOAD_STORE) g.__UPLOAD_STORE = new Map();

const BUCKET = "twin-voice";            // make sure this bucket exists
const MAX_BYTES = 64 * 1024 * 1024;     // 64MB safety limit

function extFromMime(mime = "") {
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("webm")) return "webm";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  return "bin";
}

/**
 * POST /api/twin/voice/complete?uploadId=...
 * Combines uploaded parts, stores to Supabase, records DB row.
 * Returns: { ok:true, uploadId, size, path }
 *
 * Expected session shape saved by /voice/init & /voice/upload:
 *  {
 *    kind: "voice",
 *    userId: string|null,
 *    twinId: string|null,
 *    mime: "audio/webm" | "audio/mp4" | ...,
 *    createdAt: number,
 *    parts: Map<number, Buffer>
 *  }
 */
export async function POST(req) {
  try {
    const url = new URL(req.url);
    const uploadId = url.searchParams.get("uploadId") || "";
    if (!uploadId) {
      return NextResponse.json({ ok: false, error: "Missing uploadId" }, { status: 400 });
    }

    const sess = g.__UPLOAD_STORE.get(uploadId);
    if (!sess || sess.kind !== "voice" || !sess.parts || sess.parts.size === 0) {
      return NextResponse.json({ ok: false, error: "Upload session not found" }, { status: 404 });
    }

    // join chunks in ascending order
    const ordered = Array.from(sess.parts.entries())
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, buf]) => buf);

    const total = ordered.reduce((n, b) => n + b.byteLength, 0);
    if (total <= 0) {
      return NextResponse.json({ ok: false, error: "Empty upload" }, { status: 400 });
    }
    if (total > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Upload too large" }, { status: 413 });
    }

    const combined = Buffer.concat(ordered, total);
    const mime = sess.mime || "audio/webm";
    const ext = extFromMime(mime);

    // store in Supabase Storage
    const userPart = sess.userId || "anon";
    const twinPart = sess.twinId || "temp";
    const path = `${userPart}/${twinPart}/${uploadId}.${ext}`;

    const blob = new Blob([combined], { type: mime });
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: mime,
      upsert: true,
    });
    if (upErr) {
      return NextResponse.json({ ok: false, error: `Storage upload failed: ${upErr.message}` }, { status: 500 });
    }

    // record in DB (table: twin_uploads)
    // Schema suggestion:
    // twin_uploads(id text pk, twin_id text, kind text, storage_path text, bytes int8, mime text, created_at timestamptz)
    const { error: dbErr } = await supabase.from("twin_uploads").insert([
      {
        id: uploadId,
        twin_id: sess.twinId || null,
        kind: "voice",
        storage_path: path,
        bytes: total,
        mime,
        created_at: new Date().toISOString(),
      },
    ]);
    if (dbErr) {
      return NextResponse.json({ ok: false, error: `DB insert failed: ${dbErr.message}` }, { status: 500 });
    }

    // cleanup memory
    g.__UPLOAD_STORE.delete(uploadId);

    return NextResponse.json({ ok: true, uploadId, size: total, path });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Complete failed" },
      { status: 500 }
    );
  }
}
