import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  return NextResponse.next(); // ← just check existence, skip JWT verify
}

export const config = {
  matcher: ["/dashboard", "/room/:path*"],
};
