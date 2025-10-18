// ===== Replace your existing PayOverlay with this Hosted Fields version =====
function PayOverlay({ open, onClose, amount, onSuccess }) {
  const wrapRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [txn, setTxn] = useState(null);
  const hfRef = useRef(null); // hostedFields instance

  // load braintree-web (client + hosted fields) once
  async function loadBraintreeWeb() {
    async function inject(id, src) {
      if (document.getElementById(id)) return;
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.id = id; s.src = src; s.onload = res; s.onerror = () => rej(new Error("Failed to load " + src));
        document.body.appendChild(s);
      });
    }
    await inject("btw-client", "https://js.braintreegateway.com/web/3.98.1/js/client.min.js");
    await inject("btw-hosted", "https://js.braintreegateway.com/web/3.98.1/js/hosted-fields.min.js");
  }

  // init hosted fields when modal opens
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!open) return;
      setErr(""); setTxn(null); setReady(false);

      try {
        await loadBraintreeWeb();

        // get client token
        const tokRes = await fetch("/api/payments/token");
        const { ok, clientToken, error } = await tokRes.json();
        if (!ok) throw new Error(error || "No client token");

        // create client
        const clientInstance = await window.braintree.client.create({ authorization: clientToken });

        // cleanup previous HF
        if (hfRef.current?.teardown) {
          try { await hfRef.current.teardown(); } catch {}
          hfRef.current = null;
        }

        // mount Hosted Fields
        const hf = await window.braintree.hostedFields.create({
          client: clientInstance,
          styles: {
            "input": { fontSize: "16px", color: "#102A43", fontFamily: "Inter, system-ui, sans-serif" },
            ":focus": { color: "#0B66C3" },
            ".invalid": { color: "#C0392B" },
            ".valid": { color: "#2E7D32" },
            "::-webkit-input-placeholder": { color: "#99A3AD" }
          },
          fields: {
            number:   { selector: "#card-number",    placeholder: "•••• •••• •••• ••••" },
            expirationDate: { selector: "#card-expiry",    placeholder: "MM/YY" },
            cvv:      { selector: "#card-cvv",       placeholder: "CVV" }
          }
        });

        hfRef.current = hf;
        if (mounted) setReady(true);
      } catch (e) {
        if (mounted) setErr(e.message || "Payment init error");
      }
    })();

    return () => { mounted = false; };
  }, [open]);

  async function onPay() {
    try {
      setLoading(true); setErr(""); setTxn(null);
      if (!hfRef.current) throw new Error("Payment fields not ready");

      // tokenize -> get nonce
      const { nonce } = await hfRef.current.tokenize({
        cardholderName: document.getElementById("cardholder-name")?.value || ""
      });

      // send to server
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nonce, amount })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Payment failed");

      setTxn(data.txn);
      onSuccess?.(data.txn);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop: close only if clicking the backdrop itself */}
      <div
        onMouseDown={(e)=>{ if (e.target === e.currentTarget) onClose(); }}
        onTouchStart={(e)=>{ if (e.target === e.currentTarget) onClose(); }}
        style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.5)",
          display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000
        }}
      >
        {/* Dialog */}
        <div
          ref={wrapRef}
          role="dialog"
          aria-modal="true"
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

          {/* Brands strip (optional image look) */}
          <div style={{ marginTop:10, border:"1px solid #E3E8EF", borderRadius:10, padding:12 }}>
            <div style={{ fontWeight:700, color:"#334" }}>Pay with card</div>

            {/* Cardholder Name (plain input) */}
            <label style={{ display:"block", marginTop:12, fontSize:13, color:"#445" }}>Cardholder Name</label>
            <input id="cardholder-name" placeholder="Cardholder Name" style={inputStyle} />

            {/* Hosted Fields */}
            <label style={labelStyle}>Card Number</label>
            <div id="card-number" style={hfStyle} />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div>
                <label style={labelStyle}>Expiration Date <span style={{opacity:.6}}>(MM/YY)</span></label>
                <div id="card-expiry" style={hfStyle} />
              </div>
              <div>
                <label style={labelStyle}>CVV</label>
                <div id="card-cvv" style={hfStyle} />
              </div>
            </div>
          </div>

          {/* Total */}
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, fontWeight:700 }}>
            <div>Total</div>
            <div>${Number(amount).toFixed(2)}</div>
          </div>

          {/* Pay Button */}
          <button
            onClick={onPay}
            disabled={!ready || loading}
            style={{
              marginTop:14, width:"100%", padding:14, borderRadius:10, border:"none",
              background:"#0B66C3", color:"#fff", fontWeight:800, fontSize:16,
              cursor: (!ready||loading) ? "not-allowed":"pointer"
            }}
          >
            {loading ? "Processing…" : `Pay securely • ادفع بأمان  • $${Number(amount).toFixed(2)}`}
          </button>

          {err && <div style={{ color:"tomato", marginTop:10 }}>{err}</div>}
          {txn && (
            <div style={{ marginTop:12, fontSize:14 }}>
              <div><strong>Success</strong></div>
              <div>ID: {txn.id}</div>
              <div>Status: {txn.status}</div>
              <div>Amount: {txn.amount}</div>
            </div>
          )}

          {/* Close link */}
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

/* tiny styles used above */
const inputStyle = {
  width:"100%", padding:"12px 12px", border:"1px solid #E3E8EF", borderRadius:10, outline:"none"
};
const labelStyle = { display:"block", marginTop:12, fontSize:13, color:"#445" };
const hfStyle = {
  height:44, display:"flex", alignItems:"center",
  border:"1px solid #E3E8EF", borderRadius:10, padding:"0 12px"
};
