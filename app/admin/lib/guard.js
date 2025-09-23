import { redirect } from "next/navigation";
import { getSupabaseServer } from "./supabase";

export async function assertAdmin() {
  const supabase = getSupabaseServer();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) redirect("/login?next=/admin");

  const { data: rows } = await supabase
    .from("app_users")
    .select("id, email, role")
    .eq("id", auth.user.id)
    .limit(1);

  if (!rows?.length || rows[0].role !== "admin") redirect("/login?next=/admin");

  return { userId: rows[0].id, email: rows[0].email, role: rows[0].role };
}
