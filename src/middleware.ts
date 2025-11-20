import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // For this rapid MVP, we'll skip strict server-side auth checks in middleware
    // and rely on client-side auth state or simple existence of cookies if needed.
    // In a real production app, we'd verify the session cookie here.

    // For now, just pass through. We will implement client-side protection in the layout/pages.
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/resumes/:path*"],
};
