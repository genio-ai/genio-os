// File: app/api/chat/route.js
export const runtime = "edge";

export async function POST(req) {
  try {
    const { message = "" } = await req.json();

    // رد بسيط مؤقت ليتأكد البناء
    const reply = message
      ? `Nio: I received "${message}"`
      : "Nio: Hello there!";

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Something went wrong" }),
      { headers: { "Content-Type": "application/json" }, status: 400 }
    );
  }
}
