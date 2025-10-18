// app/api/paypal/capture-order/route.js
import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";
import { getPayPalClient } from "../../../../lib/paypal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { orderID } = await req.json();
    if (!orderID) {
      return NextResponse.json({ ok: false, error: "Missing orderID" }, { status: 400 });
    }

    const client = getPayPalClient();
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({}); // required by SDK even if empty

    const result = await client.execute(request);
    const status = result?.result?.status || "UNKNOWN";
    const purchase = result?.result?.purchase_units?.[0];
    const captured = purchase?.payments?.captures?.[0];
    const amount = captured?.amount?.value || purchase?.amount?.value;

    return NextResponse.json({ ok: true, status, amount, order: result.result });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Capture failed" },
      { status: 500 }
    );
  }
}
