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

    const amtStr = String(amount ?? "").trim();
    if (!/^\d+(\.\d{1,2})?$/.test(amtStr)) {
      return NextResponse.json(
        { ok: false, error: "Invalid amount format" },
        { status: 400 }
      );
    }

    const gateway = getBraintreeGateway();

    // (اختياري) لو عندك merchantAccountId مخصص للعملة
    const merchantAccountId = process.env.BRAINTREE_MERCHANT_ACCOUNT_ID || undefined;

    const result = await gateway.transaction.sale({
      amount: amtStr,
      paymentMethodNonce: nonce,
      merchantAccountId,
      options: { submitForSettlement: true },
    });

    // نجاح
    if (result?.success && result?.transaction) {
      const t = result.transaction;
      return NextResponse.json({
        ok: true,
        txn: {
          id: t.id,
          status: t.status,
          amount: t.amount,
          // 🔎 قيم مفيدة للتشخيص
          cvvResponse: t.cvvResponseCode || t.cvvResponse || null,
          avsPostalCodeResponse: t.avsPostalCodeResponseCode || t.avsPostalCodeResponse || null,
          avsStreetAddressResponse: t.avsStreetAddressResponseCode || t.avsStreetAddressResponse || null,
          processorCode: t.processorResponseCode || null,
          processorText: t.processorResponseText || null,
        },
      });
    }

    // فشل — حاول نطلع رسالة مفيدة
    const deepErrors =
      typeof result?.errors?.deepErrors === "function"
        ? result.errors.deepErrors().map((e) => e.message).join("; ")
        : "";
    const message = result?.message || deepErrors || "Transaction failed";

    // 🔎 ضمّن أي تفاصيل متاحة للتشخيص
    const txn = result?.transaction || {};
    const payload = {
      ok: false,
      error: message,
      cvvResponse: txn.cvvResponseCode || txn.cvvResponse || null,
      avsPostalCodeResponse: txn.avsPostalCodeResponseCode || txn.avsPostalCodeResponse || null,
      avsStreetAddressResponse: txn.avsStreetAddressResponseCode || txn.avsStreetAddressResponse || null,
      processorCode: txn.processorResponseCode || null,
      processorText: txn.processorResponseText || null,
    };

    // 402 أنسب لرفض المعالجة من المعالج
    return NextResponse.json(payload, { status: 402 });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Checkout error" },
      { status: 500 }
    );
  }
}
