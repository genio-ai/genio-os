import { redirect } from "next/navigation";
import { getSupabaseServer } from "./supabase";

export async function assertAdmin() {
  const supabase = getSupabaseServer();

  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr || !auth?.user) redirect("/login?next=/admin");

  const { data: rows, error: qErr } = await supabase
    .from("app_users")
    .select("id, email, role")
    .eq("id", auth.user.id)
    .limit(1);

  if (qErr || !rows?.length) redirect("/login?next=/admin");
  const me = rows[0];
  if (me.role !== "admin") redirect("/login?next=/admin");

  // optionally return the context if you need it later:
  return { userId: me.id, email: me.email, role: me.role };
}
