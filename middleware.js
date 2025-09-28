import { NextResponse } from "next/server";

export function middleware(req) {
  // temporary bypass: allow everything (disable admin guard)
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"],
};
