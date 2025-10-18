import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";
import { getPayPalClient } from "../../../../lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/paypal/order?id=ORDER_ID
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ ok:false, error:"Missing id" }, { status:400 });

    const client = getPayPalClient();
    const reqGet = new paypal.orders.OrdersGetRequest(id);
    const res = await client.execute(reqGet);
    return NextResponse.json({ ok:true, order: res.result });
  } catch (e) {
    return NextResponse.json({ ok:false, error: e.message || "Order fetch failed" }, { status:500 });
  }
}
