import { redirect } from "next/navigation";
import { getSupabaseServer } from "./supabase";

export async function assertAdmin() {
  const { supabase, accessToken } = getSupabaseServer();

  if (!accessToken) {
    redirect("/admin/login?next=/admin");
  }

  const { data: auth, error: authErr } = await supabase.auth.getUser(accessToken);
  if (authErr || !auth?.user) {
    redirect("/admin/login?next=/admin");
  }

  const { data: profile, error: profileErr } = await supabase
    .from("app_users")
    .select("role")
    .eq("id", auth.user.id)
    .single();

  if (profileErr || !profile || profile.role !== "admin") {
    redirect("/");
  }

  return true;
}
