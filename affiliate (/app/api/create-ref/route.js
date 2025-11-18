// app/api/create-ref/route.js
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, whatsapp } = body || {};
    if(!name || !email) return new Response(JSON.stringify({ error: 'name and email required' }), { status:400 });

    const { data: exist } = await supabaseAdmin.from('affiliates').select('id,user_key').eq('email', email).limit(1).maybeSingle();
    if (exist && exist.user_key) return new Response(JSON.stringify({ ok:true, user_key: exist.user_key }), { status:200 });

    let user_key;
    for(let i=0;i<8;i++){
      user_key = Math.random().toString(36).slice(2,9);
      const { data: dup } = await supabaseAdmin.from('affiliates').select('id').eq('user_key', user_key).limit(1);
      if (!dup || dup.length===0) break;
      user_key = null;
    }
    if(!user_key) return new Response(JSON.stringify({ error:'key generation failed' }), { status:500 });

    const { data: inserted, error } = await supabaseAdmin.from('affiliates').insert({ name, email, whatsapp, user_key }).select('user_key').single();
    if(error) return new Response(JSON.stringify({ error: error.message }), { status:500 });
    return new Response(JSON.stringify({ ok:true, user_key: inserted.user_key }), { status:200 });
  } catch(err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || 'internal' }), { status:500 });
  }
}
