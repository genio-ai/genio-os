// Simple in-memory rate limiter (per IP + optional per userId)
// For production on serverless, consider moving to Redis or Upstash.

const store = new Map();

/**
 * checkRateLimit
 * @param {Request} req - Next.js Request
 * @param {object} opts
 *   - limit: number of allowed requests per window (default 8)
 *   - windowMs: size of the window in ms (default 10_000)
 *   - keyExtra: optional string to scope rate limiting (e.g., route name)
 *   - userId: optional user id to rate limit per user
 * @returns {{ok: boolean, remaining: number, resetAt: number}}
 */
export function checkRateLimit(req, opts = {}) {
  const {
    limit = 8,
    windowMs = 10_000,
    keyExtra = "",
    userId = "",
  } = opts;

  // Best-effort IP from headers
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";

  // Construct a key (route + ip + user)
  const key = `${keyExtra || "global"}::${userId || "anon"}::${ip}`;

  const now = Date.now();
  const entry = store.get(key) || { count: 0, resetAt: now + windowMs };

  // Reset the window if expired
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }

  entry.count += 1;
  store.set(key, entry);

  const remaining = Math.max(0, limit - entry.count);
  const ok = entry.count <= limit;

  return { ok, remaining, resetAt: entry.resetAt };
}

/**
 * helper to build standard 429 response
 */
export function tooManyResponse(remaining, resetAt) {
  const resetIn = Math.max(0, resetAt - Date.now());
  return new Response(
    JSON.stringify({ ok: false, error: "Too many requests", retry_in_ms: resetIn }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(resetAt),
      },
    }
  );
}
