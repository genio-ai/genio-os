// lib/analytics.js
export function track(event, payload = {}) {
  // Minimal stub — replace with your DB/event bus later.
  try {
    console.log("[analytics]", event, payload);
  } catch {}
}
