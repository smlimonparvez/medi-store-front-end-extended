import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require login
const PROTECTED = [
  "/cart",
  "/checkout",
  "/orders",
  "/profile",
  "/seller",
  "/admin",
];

// Routes only for guests (logged-in users get redirected away)
const GUEST_ONLY = ["/login", "/register"];

// Role-based route prefixes
const ROLE_ROUTES: Record<string, string[]> = {
  seller: ["/seller"],
  admin:  ["/admin"],
  // customer has no exclusive prefix — they use /cart, /orders, etc.
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token    = req.cookies.get("medistore_token")?.value;
  const userJson = req.cookies.get("medistore_user")?.value;

  let role: string | null = null;
  if (userJson) {
    try { role = JSON.parse(userJson).role; } catch { /* ignore */ }
  }

  const isLoggedIn = !!token && !!role;

  // 1. Guest-only pages — redirect logged-in users to their dashboard
  if (GUEST_ONLY.some((p) => pathname.startsWith(p))) {
    if (isLoggedIn) {
      const dest =
        role === "admin"  ? "/admin" :
        role === "seller" ? "/seller/dashboard" :
        "/shop";
      return NextResponse.redirect(new URL(dest, req.url));
    }
    return NextResponse.next();
  }

  // 2. Protected pages — redirect guests to login
  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Role-based protection — wrong role gets a 403 page
  if (isLoggedIn && role) {
    for (const [requiredRole, prefixes] of Object.entries(ROLE_ROUTES)) {
      if (prefixes.some((p) => pathname.startsWith(p)) && role !== requiredRole) {
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }
    // Customers cannot access /seller or /admin
    if (role === "customer") {
      if (pathname.startsWith("/seller") || pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
