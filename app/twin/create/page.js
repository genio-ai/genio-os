// app/twin/create/page.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreateTwinPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    tone: "",
    pace: "",
    emojis: "",
    languages: "",
    about_me: "",
    voice_path: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const onboarding = JSON.parse(localStorage.getItem("twin_onboarding") || "{}");
      const voice = JSON.parse(localStorage.getItem("twin_voice") || "{}");
      const data = {
        tone: onboarding.tone || "Friendly",
        pace: onboarding.pace || "Medium",
        emojis: onboarding.emojis || "Sometimes",
        languages: onboarding.languages || "English",
        about_me: onboarding.about_me || "",
        voice_path: voice.path || voice.url || "",
      };
      setForm(data);
    } catch (e) {
      console.warn("Failed to load twin draft", e);
    }
  }, []);

  async function handleCreate() {
    setBusy(true);
    setError("");

    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
      setBusy(false);
      setError("Not authenticated");
      return;
    }

    const res = await fetch("/api/twin/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, user_id: user.id }),
    });

    const json = await res.json();
    setBusy(false);

    if (!json.ok) {
      setError(json.error || "Failed to create twin");
      return;
    }

    localStorage.removeItem("twin_onboarding");
    localStorage.removeItem("twin_voice");
    router.push("/twin");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Review & Create</h1>
      <div className="space-y-2 mb-6">
        <div>Tone: {form.tone}</div>
        <div>Pace: {form.pace}</div>
        <div>Emojis: {form.emojis}</div>
        <div>Languages: {form.languages}</div>
        <div>About me: {form.about_me || "-"}</div>
        <div>Voice path: {form.voice_path || "-"}</div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <button
        onClick={handleCreate}
        disabled={busy}
        className="rounded bg-white/10 px-4 py-2 hover:bg-white/20 disabled:opacity-50"
      >
        {busy ? "Creating..." : "Continue"}
      </button>
    </main>
  );
}
