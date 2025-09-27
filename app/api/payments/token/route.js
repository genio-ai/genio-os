import { NextResponse } from "next/server";
import { getBraintreeGateway } from "../../../../lib/braintree";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const gateway = getBraintreeGateway();
    const { clientToken } = await gateway.clientToken.generate({});
    return NextResponse.json({ ok: true, clientToken });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create client token" },
      { status: 500 }
    );
  }
}
