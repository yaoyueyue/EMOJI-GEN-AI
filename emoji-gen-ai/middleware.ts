import { clerkMiddleware } from "@clerk/nextjs/server";

// This example protects all routes including api/trpc routes
export default clerkMiddleware();

// Define public routes using the matcher pattern instead
export const config = {
  matcher: []
}; 