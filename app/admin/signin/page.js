"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminSigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.user) {
      setErr("Invalid email or password.");
      setBusy(false);
      return;
    }

    const { data: profile, error: pErr } = await supabase
      .from("app_users").select("role").eq("id", data.user.id).single();

    if (pErr) {
      setErr("Unable to load profile.");
      setBusy(false);
      return;
    }

    if (profile?.role === "admin") {
      router.replace("/admin");
    } else {
      setErr("Not authorized.");
      await supabase.auth.signOut();
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "72px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Admin Sign in</h1>
      <form onSubmit={onSubmit}>
        <input type="email" placeholder="Email" value={email}
               onChange={(e) => setEmail(e.target.value)} required
               style={{ width:"100%", padding:10, marginBottom:12 }} />
        <input type="password" placeholder="Password" value={password}
               onChange={(e) => setPassword(e.target.value)} required
               style={{ width:"100%", padding:10, marginBottom:12 }} />
        {err && <div style={{ color:"crimson", marginBottom:10 }}>{err}</div>}
        <button type="submit" disabled={busy}
                style={{ width:"100%", padding:12, fontWeight:600 }}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
