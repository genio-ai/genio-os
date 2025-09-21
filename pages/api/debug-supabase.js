import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const hasUrl = Boolean(url);
  const hasKey = Boolean(key);

  let dbOk = false;
  let dbError = null;

  try {
    if (hasUrl && hasKey) {
      const supabase = createClient(url, key);
      const { error } = await supabase.from("profiles").select("id").limit(1);
      if (!error) {
        dbOk = true;
      } else {
        dbError = error.message;
      }
    }
  } catch (e) {
    dbError = e.message;
  }

  res.status(200).json({ hasUrl, hasKey, dbOk, dbError });
}
