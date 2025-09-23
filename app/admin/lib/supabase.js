import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// No @supabase/ssr needed
export function getSupabaseServer() {
  const cookieStore = cookies();
  // Supabase cookie key in Next.js (sb-access-token)
  const accessToken =
    cookieStore.get("sb-access-token")?.value ||
    cookieStore.get("sb:token")?.value ||
    null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { auth: { persistSession: false } }
  );

  return { supabase, accessToken };
}
