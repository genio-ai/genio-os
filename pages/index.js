// pages/index.js
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  // Ripple effect
  useEffect(() => {
    const handler = (e) => {
      const target = e.target.closest(".btn");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = (e.clientX || 0) - rect.left - size / 2;
      const y = (e.clientY || 0) - rect.top - size / 2;
      const circle = document.createElement("span");
      circle.className = "ripple";
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${x}px`;
      circle.style.top = `${y}px`;
      target.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <Head>
        <title>Genio OS — Route payments smartly</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Top Bar */}
      <div className="topbar">
        <div className="wrap topbarRow">
          <div className="brand">Genio OS</div>
          <nav className="nav">
            <a href="#how">How it works</a>
            <a href="#security">Security</a>
            <a href="#contact">Contact</a>
            <a href="/login" className="btn small">Login</a>
          </nav>
        </div>
      </div>

      <main className="page">
        {/* Hero */}
        <section className="wrap hero" id="home">
          <div className="panel">
            <div className="heroText">
              <h1>
                Route payments <span className="accent">smartly</span>.
              </h1>
              <p className="muted">
                Send & accept payments globally — faster, cheaper, smarter.
              </p>

              <div className="actions">
                <Link href="/login" className="btn">Get Started</Link>
                <Link href="/dashboard" className="btn">Open Dashboard</Link>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid">
              <Link href="/router" className="btn">Send Money</Link>
              <Link href="/router" className="btn">Receive Money</Link>
              <Link href="/router" className="btn">Create Payment Link</Link>
            </div>

            {/* Providers */}
            <div className="providers">
              <p className="label">Powered by</p>
              <div className="providerGrid">
                {["Wise", "Flutterwave", "PayGate", "Stripe"].map((p) => (
                  <div key={p} className="chip">{p}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="wrap section">
          <h2>How it works</h2>
          <div className="cards3">
            <div className="card">
              <div className="cardTitle">1) Connect</div>
              <p className="muted">Link your preferred providers. No custody — Genio only routes.</p>
            </div>
            <div className="card">
              <div className="cardTitle">2) Smart routing</div>
              <p className="muted">We pick the best route for price, speed, and success rate.</p>
            </div>
            <div className="card">
              <div className="cardTitle">3) Track & reconcile</div>
              <p className="muted">Live status, webhooks, and simple exports for your finance team.</p>
            </div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="wrap section">
          <h2>Security & Compliance</h2>
          <ul>
            <li>KYC tiers and AML screening via connected providers.</li>
            <li>Genio OS is a routing layer — we do not hold customer funds.</li>
            <li>Audit logs, role-based access, and provider webhooks.</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="wrap footerRow">
          <p>© 2025 Genio OS</p>
          <div className="links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
          </div>
        </div>
      </footer>
    </>
  );
}
