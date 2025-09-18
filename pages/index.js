// pages/index.js
import { useEffect, useRef, useState } from "react";

/** Helper: read/write local auth & profile safely */
const AUTH_FLAG = "genio.auth";          // set to "1" after your real login flow
const PROFILE_KEY = "genio.profile";     // style + filenames
const CONSENTS_KEY = "genio.consents";   // tos + ai_text + marketing

export default function Home() {
  // Core state
  const [styleText, setStyleText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [isAuthed, setIsAuthed] = useState(false);

  // Consents
  const [showConsents, setShowConsents] = useState(false);
  const [consentTOS, setConsentTOS] = useState(false);
  const [consentAIText, setConsentAIText] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);

  // Save UX
  const [isSaving, setIsSaving] = useState(false);
  const [savedTick, setSavedTick] = useState(false);

  // Video recording
  const [recStream, setRecStream] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const recChunksRef = useRef([]);
  const [videoBlob, setVideoBlob] = useState(null);
  const videoPreviewRef = useRef(null);

  // Load local state
  useEffect(() => {
    const auth = localStorage.getItem(AUTH_FLAG);
    setIsAuthed(!!auth);

    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        if (obj.styleText) setStyleText(obj.styleText);
      } catch {}
    }

    const cons = localStorage.getItem(CONSENTS_KEY);
    if (cons) {
      try {
        const c = JSON.parse(cons);
        setConsentTOS(!!c.tos);
        setConsentAIText(!!c.ai_text_opt_in);
        setConsentMarketing(!!c.marketing_opt_in);
      } catch {}
    }
  }, []);

  /** Save profile locally + send best-effort to backend */
  async function handleSave() {
    if (!styleText.trim()) return;
    setIsSaving(true);

    // 1) Local save
    const payload = {
      styleText: styleText.trim(),
      audioName: audioFile?.name || null,
      videoName: videoBlob ? "capture.webm" : null,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));

    // 2) Server save (best-effort, safe to skip if backend not ready yet)
    try {
      const form = new FormData();
      form.append("styleText", payload.styleText);
      if (audioFile) form.append("audio", audioFile);
      if (videoBlob) form.append("video", videoBlob, "capture.webm");

      await fetch("/api/profile", { method: "POST", body: form });
    } catch {
      // ignore for now (local copy is already saved)
    }

    setIsSaving(false);
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 1500);
  }

  /** Consents modal: persist locally + notify backend (optional) */
  async function confirmConsents() {
    if (!consentTOS) return; // must accept TOS
    const cons = {
      tos: true,
      ai_text_opt_in: !!consentAIText,
      marketing_opt_in: !!consentMarketing,
      ts: new Date().toISOString(),
    };
    localStorage.setItem(CONSENTS_KEY, JSON.stringify(cons));
    setShowConsents(false);

    // best-effort server notify
    try {
      await fetch("/api/consents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cons),
      });
    } catch {}
  }

  /** Create Twin: gated by auth + TOS + saved style */
  async function onCreateTwin() {
    if (!isAuthed) {
      alert("Please log in first to bind the Twin to your account.");
      return;
    }
    if (!consentTOS) {
      setShowConsents(true);
      return;
    }
    if (!styleText.trim()) {
      alert("Please write your Style profile and click Save first.");
      return;
    }
    // Redirect or call your Twin creation endpoint
    window.location.href = "/chat";
  }

  /** Video: start recording from camera + mic */
  async function startRecording() {
    if (recorder) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 360 },
        audio: true,
      });
      setRecStream(stream);
      const mr = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
      recChunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(recChunksRef.current, { type: "video/webm" });
        setVideoBlob(blob);
        // attach to preview
        if (videoPreviewRef.current) {
          videoPreviewRef.current.src = URL.createObjectURL(blob);
          videoPreviewRef.current.play().catch(() => {});
        }
        // stop tracks
        if (stream) stream.getTracks().forEach((t) => t.stop());
        setRecStream(null);
        setRecorder(null);
      };
      mr.start();
      setRecorder(mr);
    } catch (err) {
      alert("Camera/Mic permission denied or not available.");
    }
  }

  function stopRecording() {
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
  }

  function resetVideo() {
    setVideoBlob(null);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.pause();
      videoPreviewRef.current.src = "";
    }
  }

  // UI
  return (
    <main style={styles.main}>
      {/* STYLE */}
      <section style={styles.card}>
        <h2 style={styles.h2}>Your Style</h2>
        <p style={styles.p}>
          Write a full page if you want: how you speak, personality, likes/dislikes, habits.
          Your Twin will mirror this voice.
        </p>
        <textarea
          value={styleText}
          onChange={(e) => setStyleText(e.target.value)}
          placeholder="Describe your tone, phrases you use, what you like/dislike, how you reply to people..."
          rows={10}
          style={styles.textarea}
        />
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button
            onClick={handleSave}
            disabled={isSaving || !styleText.trim()}
            style={{
              ...styles.btn,
              background: isSaving ? "#6b7280" : "#ffd166",
              color: "#0d1b2a",
              cursor: isSaving || !styleText.trim() ? "not-allowed" : "pointer",
            }}
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          {savedTick && <span style={{ color: "#9be372" }}>Saved ✓</span>}
        </div>
      </section>

      {/* VOICE */}
      <section style={styles.card}>
        <h2 style={styles.h2}>Voice Sample (optional)</h2>
        <p style={styles.p}>
          Upload a 2–5 minute recording. We store raw media internally only. We do not share raw
          files with third parties. If you opt in, we may send text-only prompts to an AI model.
        </p>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
        />
        {audioFile && (
          <div style={styles.meta}>Selected: {audioFile.name} ({Math.round(audioFile.size / 1024)} KB)</div>
        )}
      </section>

      {/* VIDEO RECORDING */}
      <section style={styles.card}>
        <h2 style={styles.h2}>Video Capture (for 3D avatar, optional)</h2>
        <p style={styles.p}>
          Record a short 10–20s clip: look left, right, and speak naturally. This will help build
          a better 3D presence later. Raw video is stored internally only.
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          {!recorder && !recStream && (
            <button onClick={startRecording} style={styles.btn}>
              Start Recording
            </button>
          )}
          {(recorder || recStream) && (
            <button onClick={stopRecording} style={{ ...styles.btn, background: "#ef4444", color: "white" }}>
              Stop
            </button>
          )}
          {videoBlob && (
            <button onClick={resetVideo} style={{ ...styles.btn, background: "#334155", color: "white" }}>
              Remove Video
            </button>
          )}
        </div>

        <video
          ref={videoPreviewRef}
          controls
          playsInline
          loop
          muted
          style={{ width: "100%", maxHeight: 260, borderRadius: 10, background: "#0b1220" }}
        />
        {videoBlob && (
          <div style={styles.meta}>
            Captured: {(videoBlob.size / (1024 * 1024)).toFixed(2)} MB
          </div>
        )}
      </section>

      {/* ACTIONS */}
      <section style={styles.card}>
        <h2 style={styles.h2}>Create Your Twin</h2>
        {!isAuthed && (
          <p style={{ ...styles.p, color: "#a3b0bf" }}>
            Please <a href="/login" style={{ color: "#ffd166" }}>log in</a> first so we can bind this Twin to your account.
          </p>
        )}
        <p style={styles.pSmall}>
          By creating your Twin, you accept the Terms and the Responsible-Use Policy.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setShowConsents(true)}
            style={{ ...styles.btnGhost }}
          >
            View / Edit Consents
          </button>
          <button
            onClick={onCreateTwin}
            disabled={!isAuthed}
            style={{
              ...styles.btn,
              background: isAuthed ? "#ffd166" : "#334155",
              color: isAuthed ? "#0d1b2a" : "#8aa0b3",
              cursor: isAuthed ? "pointer" : "not-allowed",
            }}
            title={isAuthed ? "" : "Login required"}
          >
            Create Twin
          </button>
        </div>
      </section>

      {/* CONSENTS MODAL */}
      {showConsents && (
        <div style={styles.modalWrap} onClick={() => setShowConsents(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.h3}>Consents</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={consentTOS}
                  onChange={(e) => setConsentTOS(e.target.checked)}
                />
                <span style={{ marginLeft: 8 }}>
                  I accept the Terms of Service & Responsible-Use Policy (required).
                </span>
              </label>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={consentAIText}
                  onChange={(e) => setConsentAIText(e.target.checked)}
                />
                <span style={{ marginLeft: 8 }}>
                  I allow sending <b>text-only</b> prompts to an AI model to assist responses (optional).
                </span>
              </label>
              <label style={styles.label}>
                <input
                  type="checkbox"
                  checked={consentMarketing}
                  onChange={(e) => setConsentMarketing(e.target.checked)}
                />
                <span style={{ marginLeft: 8 }}>
                  I agree to receive product updates and marketing (optional).
                </span>
              </label>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setShowConsents(false)}
                style={{ ...styles.btnGhost }}
              >
                Cancel
              </button>
              <button
                onClick={confirmConsents}
                style={{ ...styles.btn, background: consentTOS ? "#ffd166" : "#334155", color: "#0d1b2a" }}
                disabled={!consentTOS}
              >
                Save Consents
              </button>
            </div>

            <p style={{ ...styles.pSmall, marginTop: 10 }}>
              We store your style, voice, and video <b>internally only</b>. We never share raw media with external providers.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

const styles = {
  main: { maxWidth: 840, margin: "0 auto", padding: 24 },
  card: { marginBottom: 32, padding: 16, borderRadius: 12, background: "#0f2030" },
  h2: { color: "white", marginBottom: 8 },
  h3: { color: "white", margin: 0, marginBottom: 8 },
  p: { color: "#c9d6e2", marginTop: 0 },
  pSmall: { color: "#9fb4c6", fontSize: 12, marginTop: 8 },
  textarea: {
    width: "100%",
    borderRadius: 10,
    border: "1px solid #2b3c4a",
    background: "#13283a",
    color: "white",
    padding: 14,
    outline: "none",
  },
  btn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: 0,
    background: "#1f6feb",
    color: "white",
    fontWeight: 700,
  },
  btnGhost: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#0f2030",
    color: "#c9d6e2",
    fontWeight: 600,
  },
  meta: { color: "#9fb4c6", fontSize: 12, marginTop: 8 },
  label: { display: "flex", alignItems: "center", color: "#c9d6e2", userSelect: "none" },
  modalWrap: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 50,
  },
  modal: {
    width: "100%",
    maxWidth: 560,
    borderRadius: 12,
    background: "#0f2030",
    padding: 16,
    boxShadow: "0 10px 35px rgba(0,0,0,0.4)",
  },
};
