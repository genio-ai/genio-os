// app/lib/supabase.server.js
import { createClient } from "@supabase/supabase-js";
import { getServerSupabaseEnv } from "./env";

export function getServerSupabase() {
  const { url, serviceRole } = getServerSupabaseEnv();
  // Create the client lazily per invocation
  return createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "X-Client-Info": "genio-os/server" } },
  });
}
