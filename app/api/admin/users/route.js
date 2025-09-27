import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase";

export const dynamic = "force-dynamic"; // always fetch fresh data

export async function GET() {
  try {
    const supabase = supabaseServer();

    // Expecting table: profiles (id, email, full_name, role, created_at)
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ ok: true, users: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
