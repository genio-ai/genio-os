// app/api/payments/checkout/route.js
import { NextResponse } from "next/server";
import { getBraintreeGateway } from "../../../../lib/braintree";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { nonce, amount } = await req.json();

    if (!nonce) {
      return NextResponse.json(
        { ok: false, error: "Missing payment nonce" },
        { status: 400 }
      );
    }

    const amt = String(amount || "").trim();
    if (!/^\d+(\.\d{1,2})?$/.test(amt)) {
      return NextResponse.json(
        { ok: false, error: "Invalid amount format" },
        { status: 400 }
      );
    }

    const gateway = getBraintreeGateway();

    const result = await gateway.transaction.sale({
      amount: amt,
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true }, // تبرّع، بدون 3DS
    });

    if (result?.success && result?.transaction) {
      const t = result.transaction;
      return NextResponse.json({
        ok: true,
        txn: { id: t.id, status: t.status, amount: t.amount },
      });
    }

    const deepErrors =
      typeof result?.errors?.deepErrors === "function"
        ? result.errors.deepErrors().map((e) => e.message).join("; ")
        : "";
    const message = result?.message || deepErrors || "Transaction failed";

    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Checkout error" },
      { status: 500 }
    );
  }
}
