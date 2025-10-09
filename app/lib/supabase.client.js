// app/lib/supabase.client.js
"use client";
import { createClient } from "@supabase/supabase-js";
import { getPublicSupabaseEnv } from "./env";

let _client;
export function getBrowserSupabase() {
  if (_client) return _client;
  const { url, anonKey } = getPublicSupabaseEnv();
  _client = createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
    global: { headers: { "X-Client-Info": "genio-os/browser" } },
  });
  return _client;
}
