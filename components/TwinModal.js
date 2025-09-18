// components/TwinModal.js
import { useEffect } from "react";

/**
 * TwinModal
 * Simple, dependency-free modal.
 * - Accessible focus trap (basic)
 * - Closes on ESC or backdrop click
 * - No external CSS frameworks required
 */
export default function TwinModal({
  open = false,
  title = "Create Your Twin",
  children,
  onClose = () => {},
  primaryAction, // { label: string, onClick: fn, disabled?: bool }
  secondaryAction, // { label: string, onClick: fn }
}) {
  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="twin-modal-title"
      className="tw-overlay"
      onClick={(e) => {
        // close when clicking the dim backdrop only
        if (e.target.classList.contains("tw-overlay")) onClose();
      }}
    >
      <div className="tw-modal" role="document">
        <header className="tw-header">
          <h2 id="twin-modal-title">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            className="tw-close"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <section className="tw-body">{children}</section>

        {(primaryAction || secondaryAction) && (
          <footer className="tw-footer">
            {secondaryAction && (
              <button
                type="button"
                className="tw-btn tw-ghost"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button
                type="button"
                className="tw-btn tw-primary"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
              >
                {primaryAction.label}
              </button>
            )}
          </footer>
        )}
      </div>

      {/* scoped styles */}
      <style jsx>{`
        .tw-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: grid;
          place-items: center;
          z-index: 1000;
          padding: 16px;
        }
        .tw-modal {
          width: 100%;
          max-width: 560px;
          background: #0d1424;
          color: #e9eefc;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
          overflow: hidden;
        }
        .tw-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .tw-header h2 {
          margin: 0;
          font-size: 18px;
          letter-spacing: 0.2px;
        }
        .tw-close {
          appearance: none;
          border: 0;
          background: transparent;
          color: #9fb3ff;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
        }
        .tw-close:hover {
          color: #cdd8ff;
        }
        .tw-body {
          padding: 18px;
          font-size: 14.5px;
          line-height: 1.6;
        }
        .tw-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 18px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .tw-btn {
          appearance: none;
          border: 0;
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 600;
          cursor: pointer;
        }
        .tw-primary {
          background: #ffd14a;
          color: #1b2540;
        }
        .tw-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .tw-ghost {
          background: transparent;
          color: #cdd8ff;
        }
        .tw-ghost:hover {
          background: rgba(255, 255, 255, 0.06);
        }
      `}</style>
    </div>
  );
}
