import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anon) {
      return res.status(500).json({
        ok: false,
        step: "env",
        error: "Missing Supabase environment variables"
      });
    }

    const supabase = createClient(url, anon, { auth: { persistSession: false } });
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    if (error) {
      return res.status(500).json({
        ok: false,
        step: "supabase",
        error: error.message || JSON.stringify(error)
      });
    }

    return res.status(200).json({
      ok: true,
      supabase: { reachable: true, rows: data?.length || 0 }
    });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      step: "catch",
      error: e.message || JSON.stringify(e)
    });
  }
}
