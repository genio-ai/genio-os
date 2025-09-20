// File: pages/onboarding/personality.js
import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

const DRAFT_KEY = "twin_ob_draft";

export default function Personality() {
  const router = useRouter();
  const [about, setAbout] = useState("");
  const [rules, setRules] = useState("");
  const [likes, setLikes] = useState("");
  const [savedAt, setSavedAt] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  // load draft
  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      if (d.about) setAbout(d.about);
      if (d.rules) setRules(d.rules);
      if (d.likes) setLikes(d.likes);
    } catch {}
  }, []);

  // autosave
  useEffect(() => {
    const h = setTimeout(() => {
      try {
        const cur = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ ...cur, about, rules, likes })
        );
        setSavedAt(new Date());
      } catch {}
    }, 500);
    return () => clearTimeout(h);
  }, [about, rules, likes]);

  const canContinue = useMemo(() => about.trim().length >= 30, [about]);

  const saveAndNext = async () => {
    if (!canContinue || busy) return;
    setBusy(true);
    try {
      const cur = JSON.parse(localStorage.getItem(DRAFT_KEY) || "{}");
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          ...cur,
          about: about.trim(),
          rules: rules.trim(),
          likes: likes.trim(),
        })
      );
      router.push("/onboarding/voice");
    } finally {
      setBusy(false);
    }
  };

  const doUpgrade = () => {
    setNote("You can upgrade your Twin anytime — just edit these fields and save.");
    setTimeout(() => setNote(""), 2200);
  };

  const doReset = () => {
    setAbout("");
    setRules("");
    setLikes("");
    setNote("Cleared fields. Draft kept until you save.");
    setTimeout(() => setNote(""), 1800);
  };

  const doDelete = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
    setAbout(""); setRules(""); setLikes("");
    setNote("Twin draft deleted.");
    setTimeout(() => setNote(""), 1800);
  };

  const goBack = () => {
    router.push("/signup"); // 🔹 غيّر الوجهة حسب الصفحه اللي بدك ترجع إلها
  };

  return (
    <>
      <Head>
        <title>AI Lab — Create your Twin (Step 1)</title>
      </Head>

      {/* Header */}
      <header className="hdr">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="genio os">
            <span className="brand-neon">genio os</span>
          </Link>
          <div className="stepper" aria-label="Progress">
            <span className="dot on" />
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="container">
        <section className="card form">
          <h1>Welcome to your AI Lab — Create your Twin</h1>

          <label className="field">
            <div className="label">Describe yourself</div>
            <textarea
              rows={7}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Write as you normally talk..."
            />
          </label>

          <label className="field">
            <div className="label">Rules for your Twin</div>
            <textarea
              rows={5}
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="What must your Twin avoid?"
            />
          </label>

          <label className="field">
            <div className="label">What I like</div>
            <textarea
              rows={4}
              value={likes}
              onChange={(e) => setLikes(e.target.value)}
              placeholder="Preferred tone, topics, style..."
            />
          </label>

          <div className="actions">
            <button className="btn ghost" onClick={goBack}>Go Back</button>
            <button className="btn ghost" onClick={doUpgrade}>Upgrade my Twin</button>
            <button className="btn ghost" onClick={doReset}>Reset</button>
            <button className="btn danger" onClick={doDelete}>Delete my Twin</button>
            <div className="spacer" />
            <button className="btn btn-neon" disabled={!canContinue || busy} onClick={saveAndNext}>
              {busy ? "Saving…" : "Save & Continue — Voice"}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
