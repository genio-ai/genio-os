import { NextResponse } from "next/server";

/**
 * POST /api/twin/personality
 * Body: { personality: { about: string, tone?: string, ... } }
 * Returns: { ok: true, twinId }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { personality } = body || {};

    if (!personality || typeof personality.about !== "string" || personality.about.trim().length < 10) {
      return NextResponse.json(
        { ok: false, error: "Invalid personality payload" },
        { status: 400 }
      );
    }

    // For now just simulate saving to database
    const twinId = "twin_" + Date.now();

    return NextResponse.json({ ok: true, twinId });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Bad request" },
      { status: 400 }
    );
  }
}
