// app/admin/page.js
"use client";
import { useEffect, useState } from "react";

const translations = {
  en: { title: "Admin Panel", desc: "Manage clients and payouts", markPaid: "Mark Paid" },
  ar: { title: "لوحة التحكم", desc: "إدارة العملاء والسحوبات", markPaid: "تأشير مدفوع" },
};

export default function AdminPage() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("lc_lang");
    if (saved) setLang(saved);
    // demo clients - replace with fetch('/api/clients')
    setClients([
      { subId: "ali007", totalSales: 7, earnings: 19, pending: 15, paid: false },
      { subId: "manar01", totalSales: 3, earnings: 8, pending: 8, paid: false },
    ]);
  }, []);

  function markPaid(index) {
    const copy = [...clients];
    copy[index].paid = true;
    setClients(copy);
    // TODO: call API to mark paid
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="text-sm text-gray-500">{t.desc}</p>

        <div className="mt-6 bg-white rounded shadow p-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-gray-500">
              <tr>
                <th className="pb-2">SubID</th>
                <th className="pb-2">Total Sales</th>
                <th className="pb-2">Earnings</th>
                <th className="pb-2">Pending</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={c.subId} className="border-t">
                  <td className="py-3">{c.subId}</td>
                  <td className="py-3">{c.totalSales}</td>
                  <td className="py-3">{c.earnings} $</td>
                  <td className="py-3">{c.pending} $</td>
                  <td className="py-3">
                    <button onClick={() => markPaid(i)} className="px-3 py-1 bg-indigo-600 text-white rounded">
                      {t.markPaid}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
