"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      setErr("Invalid email or password.");
      setBusy(false);
      return;
    }

    const { data: profile } = await supabase
      .from("app_users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") {
      router.replace("/admin");
    } else {
      setErr("Not authorized.");
      await supabase.auth.signOut();
    }
    setBusy(false);
  }

  return (
    <div style={{ maxWidth: 420, margin: "72px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Admin Login</h1>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
          required
        />
        {err && <div style={{ color: "crimson", marginBottom: 10 }}>{err}</div>}
        <button
          type="submit"
          disabled={busy}
          style={{ width: "100%", padding: 12, fontWeight: 600 }}
        >
          {busy ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
