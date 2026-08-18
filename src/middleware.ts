import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;
    if (req.nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    pages: { signIn: "/login" },
  }
);

// حماية لوحة الإدارة بالكامل + واجهات API الخاصة بها
export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
