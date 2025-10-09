// File: app/twin/create/page.js
"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Public client (browser) — requires NEXT_PUBLIC_* vars set
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreateTwinPage() {
  const [form, setForm] = useState({
    tone: "Friendly",
    pace: "Medium",
    emojis: "Sometimes",
    languages: "English",
    about_me: "",
    voice_path: "", // set this after your voice upload finishes
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");

  async function createTwinFromClient() {
    setBusy(true);
    setError("");
    setOkMsg("");

    // 1) Ensure user exists on this domain
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      setBusy(false);
      setError("Not authenticated");
      return;
    }

    // 2) Pass the access token to the API so the server can verify auth
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) {
      setBusy(false);
      setError("No session token");
      return;
    }

    try {
      const res = await fetch("/api/twin/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // critical: allow server to verify you via Supabase JWT
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          user_id: user.id,
          tone: form.tone,
          pace: form.pace,
          emojis: form.emojis,
          languages: form.languages,
          about_me: form.about_me || "",
          voice_path: form.voice_path || null,
        }),
      });

      const json = await res.json();
      setBusy(false);

      if (!res.ok || !json.ok) {
        setError(json.error || "Create twin failed");
        return;
      }

      setOkMsg("Twin created successfully");
      // TODO: router.push("/twin")
    } catch (e) {
      setBusy(false);
      setError(e?.message || "Network error");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Review & Create</h1>

      {/* Simple preview fields */}
      <div className="space-y-3 mb-8">
        <div>Tone: {form.tone}</div>
        <div>Pace: {form.pace}</div>
        <div>Emojis: {form.emojis}</div>
        <div>Languages: {form.languages}</div>
        <div>About me: {form.about_me || "-"}</div>
        <div>Voice path: {form.voice_path || "-"}</div>
      </div>

      {error ? <p className="text-red-500 mb-4">{error}</p> : null}
      {okMsg ? <p className="text-green-500 mb-4">{okMsg}</p> : null}

      <button
        onClick={createTwinFromClient}
        disabled={busy}
        className="rounded bg-white/10 px-4 py-2 hover:bg-white/20 disabled:opacity-50"
      >
        {busy ? "Creating..." : "Continue"}
      </button>
    </main>
  );
}
