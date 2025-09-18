// components/TwinModal.js
export default function TwinModal({ onClose }) {
  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target.classList.contains("overlay")) onClose();
      }}
    >
      <div className="modal">
        <header className="modal-header">
          <h2>What is a Twin?</h2>
          <button onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <section className="modal-body">
          <p>
            Your Twin is a secure, always-on assistant trained on your voice,
            tone, habits, and preferences. It responds like you — but faster.
          </p>
          <ul>
            <li>Mirrors your style and tone</li>
            <li>Handles replies, drafts, and tasks</li>
            <li>Optional voice and short video</li>
            <li>Privacy-first: raw media stays internal</li>
          </ul>
        </section>

        <footer className="modal-footer">
          <button onClick={onClose}>Close</button>
        </footer>
      </div>

      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: #0d1424;
          color: #e9eefc;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          padding: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 8px;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 18px;
        }
        .modal-body {
          margin-top: 12px;
          font-size: 14px;
          line-height: 1.5;
        }
        .modal-body ul {
          margin-top: 10px;
          padding-left: 20px;
        }
        .modal-footer {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
        }
        button {
          background: #ffd54d;
          border: none;
          padding: 8px 14px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }
        button:hover {
          background: #ffcd38;
        }
      `}</style>
    </div>
  );
}
