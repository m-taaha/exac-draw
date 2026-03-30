import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_KEY) //Required because jose expects Uint8Array, not string


export async function middleware (req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if(!token) {
        return NextResponse.redirect(new URL("/signin", req.url))
    }


    try{
        await jwtVerify(token, JWT_SECRET)
        return NextResponse.next();
        
    } catch {
        return NextResponse.redirect(new URL("/signin", req.url));
    }
}


export const config = {
    matcher: ["/", "/room/:path*"]
}

