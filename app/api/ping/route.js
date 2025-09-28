export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      app: "Genio Twin API",
      version: "0.1.0",
      time: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
