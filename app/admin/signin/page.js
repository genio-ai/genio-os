"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase"; // ← مهم: مسار صحيح (طلوع مستويين)

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSignin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push("/admin");
  }

  return (
    <main style={{ maxWidth: 420, margin: "60px auto", padding: 16 }}>
      <h1>Admin Sign In</h1>
      <form onSubmit={handleSignin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
    </main>
  );
}
