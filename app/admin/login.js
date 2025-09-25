import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid credentials.");
      setLoading(false);
      return;
    }

    const { data: rows, error: qErr } = await supabase
      .from("app_users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (qErr || !rows || rows.role !== "admin") {
      setError("Not authorized.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="container">
      <form onSubmit={handleSubmit} className="card form">
        <h1>Admin Login</h1>
        {error && <div className="alert">{error}</div>}

        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #0b111a;
        }
        .card {
          background: #0f1725;
          padding: 2rem;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }
        h1 {
          margin-bottom: 1rem;
          color: #edf3ff;
          text-align: center;
        }
        label {
          display: block;
          margin-bottom: 1rem;
          color: #c0d0e2;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #223145;
          border-radius: 8px;
          background: #0f1828;
          color: #edf3ff;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          background: linear-gradient(135deg, #20e3b2, #6fc3ff);
          color: #071018;
          font-weight: 700;
          cursor: pointer;
        }
        .alert {
          background: #1a0f14;
          color: #ffd6df;
          border: 1px solid #5b2330;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
      `}</style>
    </main>
  );
}
