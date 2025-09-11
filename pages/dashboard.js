// pages/dashboard.js
const events = [
  { id: "EV-101", time: "2025-09-10 19:34", type: "Document Uploaded", detail: "Passport photo submitted" },
  { id: "EV-102", time: "2025-09-10 19:36", type: "Selfie Check", detail: "Selfie with ID submitted" },
  { id: "EV-103", time: "2025-09-10 19:38", type: "Sanctions Scan", detail: "No matches found" },
];

export default function Dashboard() {
  const kycStatus = typeof window !== "undefined" && window.localStorage.getItem("kyc_status") || "Submitted";
  return (
    <main className="min-h-screen bg-[#0B1D3A] text-white p-6">
      <section className="mx-auto max-w-5xl rounded-2xl bg-white/5 border border-white/10 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold">KYC Dashboard</h2>
          <span className="text-sm opacity-80">Status: <strong>{kycStatus}</strong></span>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href="/kyc" className="rounded-xl px-4 py-2 font-semibold bg-gradient-to-r from-[#27E38A] to-[#27D4F0] text-black">
            Add Document
          </a>
          <a href="/kyc" className="rounded-xl px-4 py-2 font-semibold bg-white/10 border border-white/15">
            Update Verification
          </a>
          <button className="rounded-xl px-4 py-2 font-semibold bg-white/5 border border-white/10">
            Export Compliance Report
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="p-3">Event</th>
                <th className="p-3">Time</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} className="border-t border-white/10">
                  <td className="p-3">{e.type}</td>
                  <td className="p-3">{e.time}</td>
                  <td className="p-3">{e.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {kycStatus !== "Verified" && (
          <div className="rounded-xl border border-yellow-300/30 bg-yellow-300/10 p-4 text-sm">
            Complete your verification to unlock more features. <a className="underline" href="/kyc">Begin Verification</a>
          </div>
        )}
      </section>
    </main>
  );
}
