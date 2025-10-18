"use client";

export default function CheckoutPage() {
  return (
    <>
      <main style={{ padding: 24, fontFamily: "Inter, system-ui, sans-serif", textAlign: "center" }}>
        <h1>Checkout</h1>
        <p>استخدم زر <b>تبرّع الآن</b> في الصفحة الرئيسية لفتح نافذة الدفع.</p>
        <p><a href="/" style={{ textDecoration: "underline", fontWeight: 700 }}>الرجوع للصفحة الرئيسية</a></p>
      </main>

      {/* فرض خلفية فاتحة حتى لو كان في ستايل عالمي ثاني */}
      <style jsx global>{`
        html, body { background: #ffffff !important; color: #111 !important; }
      `}</style>
    </>
  );
}
