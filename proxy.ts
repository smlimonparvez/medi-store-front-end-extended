import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/cart", "/checkout", "/orders", "/profile", "/seller", "/admin"];
const GUEST_ONLY = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasToken  = !!req.cookies.get("medistore_token")?.value;
  const userJson  = req.cookies.get("medistore_user")?.value;

  let role: string | null = null;
  if (userJson) {
    try { role = JSON.parse(userJson).role; } catch { /* ignore */ }
  }

  const isLoggedIn = hasToken && !!role;

  // Guest-only: redirect logged-in users to their dashboard
  if (GUEST_ONLY.some((p) => pathname.startsWith(p))) {
    if (isLoggedIn) {
      const dest =
        role === "admin"  ? "/admin" :
        role === "seller" ? "/seller/dashboard" : "/shop";
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  // Protected: redirect guests to login
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based: wrong role → 403
  if (isLoggedIn && role) {
    if ((pathname.startsWith("/seller") && role !== "seller") ||
        (pathname.startsWith("/admin")  && role !== "admin")) {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
