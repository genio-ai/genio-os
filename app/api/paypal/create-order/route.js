// app/api/paypal/create-order/route.js
import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";
import { getPayPalClient } from "../../../../lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { amount, currency = "USD" } = await req.json();
    const clean = String(amount ?? "").trim();
    if (!/^\d+(\.\d{1,2})?$/.test(clean)) {
      return NextResponse.json({ ok: false, error: "Invalid amount" }, { status: 400 });
    }

    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: { currency_code: currency, value: clean },
        },
      ],
      application_context: { shipping_preference: "NO_SHIPPING" },
    });

    const order = await client.execute(request);
    return NextResponse.json({ ok: true, id: order.result.id });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Create order failed" },
      { status: 500 }
    );
  }
}
