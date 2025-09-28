import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = new URL(req.url);

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
