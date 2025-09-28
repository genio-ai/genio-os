import { NextResponse } from "next/server";

export function middleware(req) {
  const auth = req.headers.get("authorization") || "";

  // Expect: Authorization: Bearer <token>
  if (auth === `Bearer ${process.env.ADMIN_TOKEN}`) {
    return NextResponse.next();
  }

  return new NextResponse("Unauthorized", { status: 401 });
}

export const config = {
  matcher: ["/admin/:path*"],
};
