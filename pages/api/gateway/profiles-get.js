import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") return res.status(405).json({ ok:false, error:"method_not_allowed" });

    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return res.status(500).json({ ok:false, error:"missing_supabase_env" });

    const supabase = createClient(url, anon, { auth: { persistSession: false } });

    const userId = req.query.user_id || null; // optional filter
    const q = supabase.from("profiles").select("id, full_name, avatar_url").limit(50);
    const { data, error } = userId ? await q.eq("id", userId) : await q;
    if (error) return res.status(500).json({ ok:false, error: error.message });

    return res.status(200).json({ ok:true, profiles:data });
  } catch (e) {
    return res.status(500).json({ ok:false, error: e.message || String(e) });
  }
}
