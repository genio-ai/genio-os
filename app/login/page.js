"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    document.title = "Login — genio os";
    try {
      const hint = JSON.parse(localStorage.getItem("auth_hint") || "{}");
      if (hint.email) setEmail(hint.email);
    } catch {}
  }, []);

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!validateEmail(email)) return setErr("Enter a valid email.");
    if (password.length < 8) return setErr("Password must be at least 8 characters.");

    setBusy(true);
    try {
      const { supabase } = await import("@/lib/supabase");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error || !data?.user) {
        setErr("Incorrect email or password.");
        return;
      }
      const user = data.user;

      try {
        if (remember && user.email) {
          localStorage.setItem("auth_hint", JSON.stringify({ email: user.email }));
        }
      } catch {}

      const nextUrl = searchParams.get("next") || "";
      if (nextUrl) {
        router.replace(nextUrl);
        return;
      }

      const { data: row } = await supabase
        .from("app_users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (row?.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch {
      setErr("Login failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand">
            <span className="brand-neon">genio os</span>
          </Link>
          <nav className="links">
            <Link href="/signup">Create account</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <form className="card form" onSubmit={onSubmit} noValidate>
          <h1>Welcome back</h1>
          <p className="sub">Sign in to access your twin and dashboard.</p>

          {msg && <div className="note">{msg}</div>}
          {err && <div className="alert">{err}</div>}

          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <div className="pw">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
              <button type="button" className="toggle" onClick={() => setShow((s) => !s)}>
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <div className="row">
            <label className="check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <Link className="forgot" href="/reset">
              Forgot password?
            </Link>
          </div>

          <div className="actions">
            <Link className="btn ghost" href="/">
              Cancel
            </Link>
            <button className="btn btn-neon" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Login"}
            </button>
          </div>

          <p className="tos">
            New here? <Link href="/signup">Create an account</Link>.
          </p>
        </form>
      </main>
    </>
  );
}
