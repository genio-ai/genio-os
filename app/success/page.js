// File: app/success/page.js
export default function Success() {
  return (
    <main style={sx.page}>
      <div style={sx.card}>
        <h1 style={{marginTop:0}}>Thank you • <span dir="rtl">شكرًا لك</span></h1>
        <p>
          I’m <strong>Neo</strong>. Your donation has been received.<br/>
          <span dir="rtl">أنا <strong>نيو</strong>. تم استلام تبرّعك بنجاح.</span>
        </p>
        <p>
          If you opted in, we’ll send delivery proof in your name.  
          <span dir="rtl" style={{display:"block"}}>إذا اخترت ذلك، سنرسل إثبات التسليم باسمك.</span>
        </p>
        <p>
          <strong>EN:</strong> All donations are distributed through <em>official, licensed humanitarian organizations</em> operating in Gaza.<br/>
          <strong dir="rtl">AR:</strong> تُرسل جميع التبرعات عبر <em>مؤسسات ومنظمات إنسانية رسمية ومرخّصة</em> تعمل داخل غزة.
        </p>
        <a href="/" style={sx.btn}>Back to home • الرجوع للصفحة الرئيسية</a>
      </div>
    </main>
  );
}

const sx = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background:
      "radial-gradient(1000px 600px at 50% -15%, rgba(191,234,255,.22), transparent 60%), linear-gradient(135deg, #00AEEF, #008DCB)",
    color: "#E1F3FF",
    fontFamily: "Inter, Noto Sans Arabic, system-ui, sans-serif",
    padding: 16,
  },
  card: {
    width: "min(760px, 92vw)",
    background: "linear-gradient(180deg, rgba(0,36,64,.52), rgba(0,36,64,.36))",
    border: "1px solid rgba(54,212,255,.38)",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 16px 40px rgba(0,174,239,.28)",
    lineHeight: 1.55,
  },
  btn: {
    display: "inline-block",
    marginTop: 16,
    padding: "12px 18px",
    background: "linear-gradient(135deg, #36D4FF, #00AEEF)",
    color: "#003A60",
    borderRadius: 12,
    border: "1px solid rgba(191,234,255,.25)",
    textDecoration: "none",
    fontWeight: 900,
    boxShadow: "0 12px 28px rgba(31,216,255,.35)",
  },
};
