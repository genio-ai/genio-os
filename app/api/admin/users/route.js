import { NextResponse } from "next/server";
// FIX: use relative path instead of "@/lib/supabase"
import { supabaseServer } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = supabaseServer();

    // Use a safe query first (no missing columns). We'll refine after it works.
    const { data, error } = await supabase
      .from("profiles")            // change later if your table is different
      .select("*")
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
