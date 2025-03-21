import { clerkMiddleware } from "@clerk/nextjs/server";

// This approach protects all routes by default
export default clerkMiddleware();

// Define the matcher to control which routes the middleware applies to
export const config = {
  matcher: [
    // Skip static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // Protect API routes
    "/api/(.*)",
  ],
}; 