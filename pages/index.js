import Image from "next/image";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* الشعار على اليسار */}
        <Image src="/genio-logo.png" alt="Genio Logo" width={100} height={100} />

        {/* الماسكوت على اليمين */}
        <Image src="/genio-mascot.png" alt="Genio Mascot" width={100} height={100} />
      </div>

      <h1 style={{ marginTop: "40px" }}>Welcome to Genio OS</h1>
      <p>Logo left + Mascot right.</p>
      <a href="/test">Go to /test</a>
    </div>
  );
}
