import { NextResponse } from "next/server";
import { getBraintreeGateway } from "../../../../lib/braintree";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { amount, nonce } = await req.json();

    if (!amount || !nonce) {
      return NextResponse.json(
        { ok: false, error: "Missing amount or nonce" },
        { status: 400 }
      );
    }

    const gateway = getBraintreeGateway();

    const sale = await gateway.transaction.sale({
      amount: String(amount),
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true }
    });

    if (!sale?.success) {
      return NextResponse.json(
        { ok: false, error: sale?.message || "Payment failed", details: sale },
        { status: 402 }
      );
    }

    return NextResponse.json({ ok: true, transaction: sale.transaction });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Checkout error" },
      { status: 500 }
    );
  }
}
