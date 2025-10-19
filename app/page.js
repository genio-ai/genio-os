// app/page.js
"use client";

import { useEffect, useState } from "react";

const DONATION_URL = "https://www.paypal.com/ncp/payment/2RGGUEKB88VA2";

export default function Page() {
  const [nowStr, setNowStr] = useState("");
  useEffect(() => {
    setNowStr(
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="page">
      {/* NAV */}
      <nav className="nav">
        <div className="brand">GAZA RELIEF</div>
        <button
          className="btnOutline"
          onClick={() => (window.location.href = "/chat")}
        >
          Neo al-Ghazawi
        </button>
      </nav>

      {/* INTRO */}
      <section className="intro card">
        <p className="introLead" dir="rtl">
          <strong>نحن وسطاء مستقلّون</strong> نتعاون مع جمعيات خيرية مرخّصة لتوصيل
          المساعدات بشفافية كاملة.
        </p>
        <p className="introText" dir="rtl">
          نرسل لك دليل استلام يثبت وصول تبرعك (صورة أو إيصال مختصر) للحالة
          المستفيدة، حفاظًا على المصداقية والشفافية دون مشاركة بيانات حساسة.
          <br />
          تُرسل جميع المساعدات عبر <strong>جمعيات مرخّصة فقط</strong>.
        </p>
        <p className="introText">
          <strong>We are independent facilitators</strong> working with licensed
          charities to deliver transparent aid. You’ll receive a delivery proof
          confirming your donation reached a beneficiary (photo or brief
          receipt), ensuring credibility and transparency without sharing
          sensitive data.
        </p>
      </section>

      {/* HERO */}
      <header className="hero">
        <h1 className="h1">Gaza needs your help — today</h1>
        <p className="subtitle">
          Choose a relief carton (100 USD). Transparent, secure, fast.
        </p>
        <div className="status">
          <span className="ping" /> Active relief — Last update: {nowStr}
        </div>
      </header>

      {/* MAIN */}
      <main className="stack">
        {/* Relief Carton Block */}
        <section className="section">
          <div className="card" style={{ padding: 16 }}>
            <h2 className="h2">
              Gaza Relief Carton • <span dir="rtl">كرتونة إغاثة</span>
            </h2>

            <p className="introText" dir="rtl" style={{ marginTop: 8 }}>
              تحتوي الكرتونة على{" "}
              <strong>معلبات غذائية أساسية</strong> +{" "}
              <strong>كيس طحين 25 كغ</strong>، وتُسلَّم للأُسر المتضرّرة عبر
              جمعيات مرخّصة وبإشرافنا.
            </p>
            <p className="introText" style={{ marginTop: 4 }}>
              The relief carton includes essential canned food plus a 25&nbsp;kg
              flour bag. Distributed through licensed charities.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              <a
                href={DONATION_URL}
                target="_blank"
                rel="noreferrer"
                className="btnPrimary"
              >
                كرتونة إغاثة — 100 USD
              </a>
            </div>
          </div>
        </section>

        {/* Transparency box */}
        <aside className="panel card">
          <div className="panelHead">الشفافية • Transparency</div>
          <div className="introText" dir="rtl">
            بعد الدفع يصلك إيصال من PayPal. ونرسل لك{" "}
            <strong>دليل استلام</strong> مختصر عند التسليم (عند توفره).
          </div>
          <div className="introText" style={{ marginTop: 6 }}>
            You can request data deletion anytime. We never share your info.
          </div>
        </aside>
      </main>

      {/* ===== Styles (unchanged look & feel) ===== */}
      <style jsx global>{`
        :root {
          --bg: #cfe5fa;
          --unrwa: #0072ce;
          --unrwa-dark: #003366;
          --line: #c5d9ef;
        }
        * {
          box-sizing: border-box;
        }
        html,
        body {
          height: 100%;
        }
        body {
          margin: 0;
          color-scheme: light !important;
          background: var(--bg) !important;
          color: var(--unrwa-dark) !important;
          font-family: Inter, Noto Sans Arabic, system-ui, sans-serif;
        }
        .page {
          min-height: 100vh;
        }
        .nav {
          position: sticky;
          top: 0;
          z-index: 400;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #ffffffee;
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(8px);
        }
        .brand {
          font-weight: 900;
          letter-spacing: 1px;
          color: var(--unrwa-dark);
        }
        .btnOutline,
        .btnPrimary {
          border-radius: 12px;
          padding: 10px 14px;
          font-weight: 800;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .btnOutline {
          background: #fff;
          color: var(--unrwa-dark);
          border-color: var(--line);
        }
        .btnPrimary {
          background: var(--unrwa);
          color: #fff;
          border-color: #005bb0;
          text-decoration: none;
          display: inline-block;
        }
        .card {
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 16px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
        }
        .intro {
          padding: 16px;
          margin: 16px auto 0;
          width: min(1200px, 94vw);
        }
        .introLead {
          margin: 0 0 6px;
          font-size: 16px;
        }
        .introText {
          margin: 0 0 6px;
          color: #2b4563;
          line-height: 1.6;
        }
        .hero {
          text-align: center;
          padding: 22px 0 8px;
        }
        .h1 {
          margin: 0 0 6px;
          font-size: 36px;
          color: var(--unrwa-dark);
        }
        .subtitle {
          margin: 0 0 2px;
          color: #315b86;
        }
        .status {
          color: #315b86;
          font-size: 14px;
        }
        .ping {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #2dd07f;
          margin-right: 6px;
          animation: pulseDot 1.8s infinite;
        }
        @keyframes pulseDot {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }
        .stack {
          width: min(1200px, 94vw);
          margin: 0 auto 90px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .panel {
          padding: 16px;
        }
        .panelHead {
          font-weight: 900;
          margin-bottom: 8px;
          font-size: 18px;
          color: var(--unrwa-dark);
        }
      `}</style>
    </div>
  );
}
