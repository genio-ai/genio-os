import { NextResponse } from "next/server";
import { getBraintreeGateway } from "../../../../lib/braintree";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { nonce, amount } = await req.json();

    const gateway = getBraintreeGateway();
    const result = await gateway.transaction.sale({
      amount, // e.g. "10.00"
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
    });

    if (!result.success) {
      throw new Error(result.message || "Transaction failed");
    }

    return NextResponse.json({ ok: true, txn: result.transaction });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
