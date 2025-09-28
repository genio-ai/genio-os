import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("app_users") // ✅ تعديل اسم الجدول
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ ok: true, users: data ?? [] });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}
