export default function Home() {
  return (
    <div className="wrap">
      <div className="top">
        {/* الشعار يسار */}
        <img className="logo" src="/genio-logo.png" alt="Genio Logo" />

        {/* الماسكوت يمين */}
        <img className="mascot" src="/genio-mascot.png" alt="Genio Mascot" />
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
        .logo {
          height: 90px;
          object-fit: contain;
        }
        .mascot {
          height: 110px;
          object-fit: contain;
        }
        h1 { margin: 8px 0 6px; font-size: 42px; line-height: 1.15; }
        p { margin: 0 0 10px; color: #444; }
        a { color: #0070f3; text-decoration: underline; }

        @media (min-width: 900px) {
          .logo { height: 110px; }
          .mascot { height: 130px; }
          h1 { font-size: 56px; }
        }
      `}</style>
    </div>
  );
}
