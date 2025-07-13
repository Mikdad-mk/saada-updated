import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Admin-only routes
    const adminRoutes = ["/admin"];
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

    // Moderator routes (moderators can access some admin features)
    const moderatorRoutes = ["/admin/dashboard", "/admin/users", "/admin/quizzes"];
    const isModeratorRoute = moderatorRoutes.some(route => pathname.startsWith(route));

    // Protected routes that require authentication
    const protectedRoutes = ["/profile", "/settings", "/quiz/live"];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Check if user is authenticated
    if (!token) {
      if (isAdminRoute || isModeratorRoute || isProtectedRoute) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    // Check role-based access
    if (isAdminRoute) {
      if (token.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (isModeratorRoute) {
      if (token.role !== "admin" && token.role !== "moderator") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/quiz/live/:path*",
  ],
}; 