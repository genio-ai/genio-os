// app/lib/env.js
export function requireEnv(name) {
  const v = process.env[name];
  if (!v || `${v}`.trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return v;
}

export function getPublicSupabaseEnv() {
  return {
    url: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    anonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  };
}

export function getServerSupabaseEnv() {
  // Only used on the server (API routes, server actions, cron)
  return {
    url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRole: requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  };
}
