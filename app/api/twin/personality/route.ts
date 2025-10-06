import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/twin/personality
 * Body: { personality: { about: string, tone?: string, ... } }
 * Returns: { ok: true, twinId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { personality } = await req.json();

    if (!personality || typeof personality.about !== "string" || personality.about.trim().length < 10) {
      return NextResponse.json({ ok: false, error: "Invalid personality payload" }, { status: 400 });
    }

    // TODO: save to your DB here (replace this mock)
    // const twinId = await db.savePersonality(userId, personality);
    const twinId = `twin_${Date.now()}`;

    return NextResponse.json({ ok: true, twinId });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
