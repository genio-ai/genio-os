import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIMEOUT_MS = 3000;

async function fetchWithTimeout(url, init = {}, timeoutMs = TIMEOUT_MS) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

/**
 * GET /api/travel/health
 * Returns { ok: true, gateway: true, latency_ms, endpoint }
 */
export async function GET() {
  try {
    const GATEWAY_URL = process.env.GATEWAY_URL;
    const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY;

    if (!GATEWAY_URL || !GATEWAY_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "Missing GATEWAY_URL or GATEWAY_API_KEY" },
        { status: 400 }
      );
    }

    const endpoints = ["/health", "/v1/health", "/"];
    let lastErr = null;

    for (const ep of endpoints) {
      const url = `${GATEWAY_URL.replace(/\/+$/, "")}${ep}`;
      const started = Date.now();
      try {
        const r = await fetchWithTimeout(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${GATEWAY_API_KEY}`,
            Accept: "application/json",
          },
        });

        const latency = Date.now() - started;

        if (r.ok) {
          // Try to parse JSON; ignore errors
          let body = null;
          try {
            body = await r.json();
          } catch {
            body = null;
          }
          return NextResponse.json(
            {
              ok: true,
              gateway: true,
              latency_ms: latency,
              endpoint: ep,
              info: body && typeof body === "object" ? body : undefined,
            },
            { status: 200 }
          );
        } else {
          lastErr = new Error(`Gateway responded ${r.status}`);
        }
      } catch (e) {
        lastErr = e;
      }
    }

    return NextResponse.json(
      { ok: false, error: lastErr?.message || "Gateway unreachable" },
      { status: 502 }
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Unexpected failure" },
      { status: 500 }
    );
  }
}
