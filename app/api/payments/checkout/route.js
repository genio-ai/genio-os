import { NextResponse } from "next/server";
import { gateway } from "../../../../lib/braintree";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { nonce, amount } = await req.json();

    if (!nonce) {
      return NextResponse.json({ ok: false, error: "Missing nonce" }, { status: 400 });
    }

    // Braintree expects amount as a string like "100.00"
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid amount" }, { status: 400 });
    }
    const formatted = num.toFixed(2);

    const result = await gateway.transaction.sale({
      amount: formatted,
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
    });

    if (!result.success) {
      return NextResponse.json({ ok: false, error: result.message || "Charge failed" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, txn: result.transaction });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
