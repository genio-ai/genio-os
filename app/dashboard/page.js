// app/dashboard/page.js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const translations = {
  en: {
    title: "Client Dashboard",
    desc: "Enter your sub-id to view stats",
    placeholder: "your sub-id (e.g. ali007)",
    load: "Load",
    requestPayout: "Request Payout",
  },
  ar: {
    title: "لوحة العميل",
    desc: "أدخل الـ sub-id لعرض الإحصاءات",
    placeholder: "الـ sub-id (مثال: ali007)",
    load: "عرض",
    requestPayout: "طلب سحب",
  },
};

export default function Page() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const [subId, setSubId] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("lc_lang");
    if (saved) setLang(saved);
  }, []);

  async function load() {
    if (!subId) return;
    try {
      const res = await fetch(`/api/stats?subid=${encodeURIComponent(subId)}`);
      if (!res.ok) throw new Error("no data");
      const json = await res.json();
      setData(json);
    } catch (e) {
      // demo fallback
      setData({
        link: `https://offer.example.com/?ref=YOUR_MASTER&subid=${subId}`,
        clicksToday: 5,
        salesToday: 1,
        totalSales: 4,
        earnings: 12,
        pendingPayout: 10,
      });
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="text-sm text-indigo-600 hover:underline">← {lang === "en" ? "Home" : "الرئيسية"}</Link>

        <div className="mt-6 bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-semibold">{t.title}</h1>
          <p className="text-sm text-gray-500 mt-1">{t.desc}</p>

          <div className="mt-4 flex gap-3">
            <input value={subId} onChange={(e) => setSubId(e.target.value)} placeholder={t.placeholder} className="flex-1 border px-3 py-2 rounded" />
            <button onClick={load} className="px-4 py-2 bg-indigo-600 text-white rounded">{t.load}</button>
          </div>

          {data && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <StatCard label={lang === "en" ? "Your Link" : "رابطك"} value={data.link} />
              <StatCard label={lang === "en" ? "Clicks Today" : "النقرات اليوم"} value={data.clicksToday} />
              <StatCard label={lang === "en" ? "Sales Today" : "المبيعات اليوم"} value={data.salesToday} />
              <StatCard label={lang === "en" ? "Total Sales" : "إجمالي المبيعات"} value={data.totalSales} />
              <StatCard label={lang === "en" ? "Earnings" : "أرباحك"} value={`${data.earnings} $`} />
              <StatCard label={lang === "en" ? "Pending Payout" : "المستحق للسحب"} value={`${data.pendingPayout} $`} />

              <div className="col-span-full mt-4 flex gap-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded">{t.requestPayout}</button>
                <button className="px-4 py-2 border rounded">{lang === "en" ? "Share Tips" : "مشاركة نصائح"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="p-4 border rounded">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 font-semibold break-words">{value}</div>
    </div>
  );
}
