// app/api/postback/route.js
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(req) {
  try {
    const body = await req.json();
    const { sub, amount = 0, order_id, network } = body || {};
    if(!sub) return new Response(JSON.stringify({ error:'missing sub' }), { status:400 });

    await supabaseAdmin.from('referral_events').insert({
      referral_key: sub,
      event_type: 'conversion',
      amount: Number(amount) || 0,
      metadata: { order_id, network, raw: body }
    });

    return new Response(JSON.stringify({ ok:true }), { status:200 });
  } catch(err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || 'internal' }), { status:500 });
  }
}
