// File: app/api/neo-chat/route.js
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { messages = [] } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ ok:false, error:"Missing OPENAI_API_KEY" }, { status: 500 });

    // Call OpenAI (Responses API or Chat Completions-style)
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.6,
        max_tokens: 500,
      }),
    }).then(res => res.json());

    const answer = r?.choices?.[0]?.message?.content ?? "…";
    return NextResponse.json({ ok: true, answer });
  } catch (e) {
    return NextResponse.json({ ok:false, error: e?.message || "neo error" }, { status: 500 });
  }
}
