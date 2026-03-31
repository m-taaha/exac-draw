import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Just pass through!
  // Client-side checkAuth will handle protection.
  return NextResponse.next();
}

export const config = {
  matcher: ["/room/:path*"],
};
