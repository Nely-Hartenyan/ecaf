import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";

    if (isAdminRoute && !isLoginPage) {
        // Check for auth session cookie
        const authToken = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token");
        
        if (!authToken) {
            const url = new URL("/admin/login", req.nextUrl.origin);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
