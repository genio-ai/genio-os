// File: pages/onboarding.js
import Head from "next/head";

export default function Onboarding() {
  return (
    <>
      <Head>
        <title>Onboarding — Create your twin</title>
      </Head>
      <main className="container onboarding">
        <h1>Set up your digital twin</h1>
        <p>Tell us about yourself, record your voice, and add a video to bring your twin to life.</p>

        <form className="onboarding-form">
          <label>
            Your Name / Twin Name
            <input type="text" placeholder="e.g., Samer Bot" />
          </label>
          <label>
            Personality / About you
            <textarea placeholder="Describe your style, tone, or key traits..."></textarea>
          </label>
          <label>
            Record Voice
            <input type="file" accept="audio/*" />
          </label>
          <label>
            Upload/Record Video
            <input type="file" accept="video/*" />
          </label>
          <button type="submit" className="btn btn-primary">Save & Continue</button>
        </form>
      </main>

      <style jsx>{`
        .onboarding {
          padding: 80px 20px;
        }
        .onboarding-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 30px;
          max-width: 600px;
        }
        label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
          color: #e9eef5;
        }
        input, textarea {
          margin-top: 6px;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #233043;
          background: #111a27;
          color: #fff;
        }
        textarea {
          min-height: 100px;
        }
        .btn {
          padding: 12px 16px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }
        .btn-primary {
          background: linear-gradient(135deg, #5ee1a1, #6fc3ff);
          color: #071018;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}
