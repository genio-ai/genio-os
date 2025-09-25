"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const nextParam = search.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // If already signed in, route by role
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) return;

      const { data: profile } = await supabase
        .from("app_users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    })();
  }, [router]);

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

    // Fetch role
    const { data: profile, error: pErr } = await supabase
      .from("app_users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (pErr) {
      setErr("Unable to load profile.");
      setBusy(false);
      return;
    }

    // Route by role
    if (profile?.role === "admin") {
      router.replace("/admin");
    } else {
      // prevent non-admin from being redirected into /admin even if next=/admin
      const safeNext = nextParam && nextParam !== "/admin" ? nextParam : "/";
      router.replace(safeNext);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "72px auto", padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Sign in</h1>
      <form onSubmit={onSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            autoComplete="email"
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 10, marginTop: 6 }}
            autoComplete="current-password"
          />
        </label>

        {err && (
          <div style={{ color: "crimson", marginBottom: 10 }}>{err}</div>
        )}

        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            padding: 12,
            fontWeight: 600,
            cursor: busy ? "not-allowed" : "pointer",
          }}
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
