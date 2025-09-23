import { redirect } from "next/navigation";
import { getSupabaseServer } from "./supabase";

export async function assertAdmin() {
  const { supabase, accessToken } = getSupabaseServer();

  // must be signed in
  if (!accessToken) redirect("/login?next=/admin");

  const { data: auth, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !auth?.user) redirect("/login?next=/admin");

  // must be admin in app_users
  const { data: rows, error: qErr } = await supabase
    .from("app_users")
    .select("id, email, role")
    .eq("id", auth.user.id)
    .limit(1);

  if (qErr || !rows?.length || rows[0].role !== "admin") {
    redirect("/login?next=/admin");
  }

  return { userId: rows[0].id, email: rows[0].email, role: rows[0].role };
}
