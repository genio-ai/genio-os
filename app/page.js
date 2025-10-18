// ==== PayPal Overlay (بدون Braintree) ====
function PayOverlay({ open, onClose, amount, onSuccess }) {
  const wrapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const sdkId = "paypal-sdk";

  // حمّل SDK مرة واحدة مع Client ID من البيئة
  useEffect(() => {
    if (!open) return;
    setErr("");

    // لو محمّل مسبقًا
    if (document.getElementById(sdkId)) { setReady(true); return; }

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (!clientId) { setErr("Missing NEXT_PUBLIC_PAYPAL_CLIENT_ID"); return; }

    const s = document.createElement("script");
    s.id = sdkId;
    s.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=USD&intent=capture&components=buttons`;
    s.onload = () => setReady(true);
    s.onerror = () => setErr("Failed to load PayPal SDK");
    document.body.appendChild(s);
  }, [open]);

  // ارسم الأزرار عند الجاهزية
  useEffect(() => {
    if (!open || !ready || !window.paypal || !wrapRef.current) return;

    // نظّف السابق
    wrapRef.current.innerHTML = "";
    setErr("");
    setLoading(false);

    window.paypal.Buttons({
      style: { layout: "vertical", color: "blue", shape: "rect", label: "paypal" },

      // إنشاء طلب على السيرفر
      createOrder: async () => {
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Number(amount).toFixed(2), currency: "USD" })
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error || "createOrder failed");
        return data.id;
      },

      // عند موافقة المستخدم
      onApprove: async (data) => {
        try {
          setLoading(true);
          const res = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderID: data.orderID })
          });
          const out = await res.json();
          if (!out.ok) throw new Error(out.error || "capture failed");
          onSuccess?.(out);
          onClose?.();
          alert(`Paid $${out.amount} • Status: ${out.status}`);
        } catch (e) {
          setErr(e.message || "Capture error");
        } finally {
          setLoading(false);
        }
      },

      onError: (e) => setErr(e?.message || "PayPal error"),
      onCancel: () => {},

    }).render(wrapRef.current);

  }, [open, ready, amount, onSuccess, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onMouseDown={(e)=>{ if (e.target === e.currentTarget) onClose?.(); }}
        onTouchStart={(e)=>{ if (e.target === e.currentTarget) onClose?.(); }}
        style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000
        }}
      >
        {/* Dialog */}
        <div
          role="dialog" aria-modal="true"
          onMouseDown={(e)=>e.stopPropagation()}
          onTouchStart={(e)=>e.stopPropagation()}
          style={{
            width:"min(560px, 92vw)", background:"#fff", color:"#111",
            borderRadius:16, padding:18, boxShadow:"0 12px 30px rgba(0,0,0,0.25)"
          }}
        >
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <h2 style={{ margin:0, color:"#003366" }}>Donation • الدفع</h2>
            <button onClick={onClose} style={{ background:"transparent", border:0, color:"#003366", fontSize:20 }}>✕</button>
          </div>

          <div style={{ marginTop:6, color:"#334" }}>
            Amount: <strong style={{ fontSize:18 }}>${Number(amount).toFixed(2)}</strong>
          </div>

          {/* زر PayPal */}
          <div style={{ marginTop:12, border:"1px solid #E3E8EF", borderRadius:10, padding:12 }}>
            <div style={{ fontWeight:700, color:"#334", marginBottom:6 }}>Pay with PayPal</div>
            <div ref={wrapRef} />
          </div>

          {loading && <div style={{ marginTop:10 }}>Processing…</div>}
          {err && <div style={{ color:"tomato", marginTop:10 }}>{err}</div>}

          <div style={{ textAlign:"center", marginTop:10 }}>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:"#555", textDecoration:"underline" }}>
              Close • إغلاق
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
