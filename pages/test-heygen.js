// pages/test-heygen.js
import { useEffect, useState } from "react";

export default function TestHeygen() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://genio-gateway.vercel.app/api/heygen-test");
        const data = await res.json();
        setResult(data);
      } catch (e) {
        setResult({ ok: false, error: e.message });
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>HeyGen API Test</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
