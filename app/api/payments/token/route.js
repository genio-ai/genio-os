// app/api/payments/token/route.js
import { NextResponse } from "next/server";
import { getBraintreeGateway } from "../../../../lib/braintree";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const gateway = getBraintreeGateway();
    const { clientToken } = await gateway.clientToken.generate({});
    const env = process.env.BRAINTREE_ENVIRONMENT || process.env.BRAINTREE_ENV || "Sandbox";
    return NextResponse.json({ ok: true, clientToken, env });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create client token" },
      { status: 500 }
    );
  }
}
