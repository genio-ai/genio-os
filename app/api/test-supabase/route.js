import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tables = ["app_users", "twin", "payments", "subscriptions"];
    const results = {};

    for (const table of tables) {
      const { data, error } = await supabase.from(table).select("*").limit(1);
      if (error) {
        results[table] = `❌ ${error.message}`;
      } else {
        results[table] = `✅ Connected (${data?.length || 0} rows)`;
      }
    }

    return Response.json({ ok: true, results });
  } catch (err) {
    return Response.json({ ok: false, error: err.message });
  }
}
