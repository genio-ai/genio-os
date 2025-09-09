export default function Home() {
  return (
    <div className="wrap">
      <div className="top">
        {/* الشعار يسار */}
        <div className="badge white">
          <img src="/genio-logo.png" alt="Genio Logo" />
        </div>

        {/* الماسكوت يمين */}
        <div className="badge">
          <img src="/genio-mascot.png" alt="Genio Mascot" />
        </div>
      </div>

      <h1>Welcome to Genio OS</h1>
      <p>Logo left + Mascot right.</p>
      <a href="/test">Go to /test</a>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          font-family: system-ui; text-align: center;
          padding: 32px;
        }
        .top {
          width: min(820px, 92%);
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 36px;
        }
        .badge {
          width: 96px; height: 96px;
          border-radius: 50%; overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,.15);
          border: 2px solid #e9e9e9;
          background: #0b1020;
          display: grid; place-items: center;
        }
        .badge.white { background: #fff; }

        .badge img {
          width: 100%; height: 100%;
          object-fit: contain; /* يحافظ على الشعار بدون تمديد مشوّه */
        }

        h1 { margin: 8px 0 6px; font-size: 42px; line-height: 1.15; }
        p { margin: 0 0 10px; color: #444; }

        /* مقاس أكبر على الشاشات الواسعة */
        @media (min-width: 900px) {
          .badge { width: 120px; height: 120px; }
          h1 { font-size: 56px; }
        }
      `}</style>
    </div>
  );
}
