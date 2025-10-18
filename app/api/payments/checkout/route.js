import { NextResponse } from "next/server";
import { getBraintreeGateway } from "../../../../lib/braintree";

// مهم: خليه يشتغل على Node.js وليس Edge
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { nonce, amount, orderId, customer } = await req.json();

    if (!nonce) {
      return NextResponse.json({ ok: false, error: "Missing payment nonce" }, { status: 400 });
    }

    const amt = String(amount ?? "").trim();
    if (!/^\d+(\.\d{1,2})?$/.test(amt)) {
      return NextResponse.json({ ok: false, error: "Invalid amount format" }, { status: 400 });
    }

    const gateway = getBraintreeGateway();

    // (اختياري) عيّن merchantAccountId إذا عندك عملة/حساب مخصص في Braintree
    const merchantAccountId = process.env.BRAINTREE_MERCHANT_ACCOUNT_ID || undefined;

    const result = await gateway.transaction.sale({
      amount: amt,
      paymentMethodNonce: nonce,
      merchantAccountId,             // يترك undefined إذا مش مضاف
      options: {
        submitForSettlement: true,   // تَسوية مباشرة (تبرعات)
        // threeDSecure: { required: false }, // فعّلها لو مزوّدك يشترط 3DS
      },
      orderId: orderId || undefined, // مرّر رقم الطلب إن وجد
      customer: customer || undefined,
      customFields: undefined,       // أضف حقولًا مخصّصة من لوحة Braintree إن رغبت
    });

    if (result?.success && result?.transaction) {
      const t = result.transaction;
      return NextResponse.json({
        ok: true,
        txn: { id: t.id, status: t.status, amount: t.amount },
      });
    }

    // تجميع رسائل الخطأ من Braintree بشكل أوضح
    const deepErrors =
      typeof result?.errors?.deepErrors === "function"
        ? result.errors.deepErrors().map((e) => `${e.code || ""} ${e.message}`).join("; ")
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
