// pages/kyc.js
import { useState } from "react";

export default function KYC() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kyc_status", "Submitted");
    }
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#0B1D3A] text-white p-6 flex items-start justify-center">
      <section className="w-full max-w-2xl rounded-2xl bg-white/5 border border-white/10 p-6 shadow-xl">
        <h2 className="text-3xl font-extrabold mb-1">KYC Verification</h2>
        <p className="opacity-80 mb-6">Complete your verification to enable compliant services.</p>

        {!submitted ? (
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <label className="block text-sm opacity-80 mb-1">Full name</label>
              <input required className="w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm opacity-80 mb-1">Date of birth</label>
                <input type="date" required className="w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="block text-sm opacity-80 mb-1">Nationality</label>
                <input required className="w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm opacity-80 mb-1">Document (passport/ID)</label>
              <input type="file" accept="image/*,.pdf" required className="w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm opacity-80 mb-1">Selfie while holding your document</label>
              <input type="file" accept="image/*" required className="w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2" />
              <p className="text-xs opacity-70 mt-1">Please upload a photo of you holding your ID/passport beside your face.</p>
            </div>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" required className="mt-1" />
              <span>I confirm these are my real documents and ID.</span>
            </label>

            <button className="rounded-xl px-4 py-2 font-semibold text-black bg-gradient-to-r from-[#27E38A] to-[#27D4F0]">
              Submit for Review
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-[#27E38A]/15 border border-[#27E38A]/30">
            ✅ KYC submitted (demo). We’ll notify you when verified.
          </div>
        )}
      </section>
    </main>
  );
}
