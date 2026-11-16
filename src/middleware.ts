// src/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { adminHref, adminPageFor } from "@/lib/adminPath";

/* The admin's pages are app/admin/login and app/admin/dashboard, served only
 * at the secret address in ADMIN_PATH (see lib/adminPath.ts):
 *
 *  - /admin and anything under it get the site's ordinary 404, the same page
 *    as any address that doesn't exist, so the name gives nothing away.
 *  - <ADMIN_PATH>/login and <ADMIN_PATH>/dashboard are rewritten to app/admin,
 *    behind the same guard as before: no admin session, the login page; an
 *    admin session on the login page, the dashboard.
 *  - /api/admin/* only gets its session refreshed. Each route checks the
 *    admin role itself and answers 401 without it.
 *
 * The matcher can't name the secret (it has to be a literal, in a public
 * repository), so it takes any "/<segment>/login" or "/<segment>/dashboard"
 * and everything else passes straight through. No public page has that shape. */

/* An address that matches no route: rewriting to it renders not-found.tsx
   with a 404 status, exactly what an unknown address gets. */
const NOT_FOUND = "/__not-found";

type CookieToSet = { name: string; value: string; options?: Parameters<NextResponse["cookies"]["set"]>[2] };

/* The Supabase session for this request, refreshed if it had expired. The
   refreshed cookies go on the request (so the page renders with them) and are
   collected for whichever response the caller builds. */
async function readSession(request: NextRequest) {
  const refreshed: CookieToSet[] = [];
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          refreshed.push(...cookiesToSet);
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const withCookies = (response: NextResponse) => {
    refreshed.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    return response;
  };
  return { isAdmin: user?.app_metadata?.role === "admin", withCookies };
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return NextResponse.rewrite(new URL(NOT_FOUND, request.url));
  }

  if (pathname.startsWith("/api/admin/")) {
    const { withCookies } = await readSession(request);
    return withCookies(NextResponse.next({ request }));
  }

  const page = adminPageFor(pathname);
  if (!page) return NextResponse.next();

  const { isAdmin, withCookies } = await readSession(request);

  if (!isAdmin && page !== "/login") {
    return withCookies(NextResponse.redirect(new URL(adminHref("/login"), request.url)));
  }
  if (isAdmin && page === "/login") {
    return withCookies(NextResponse.redirect(new URL(adminHref("/dashboard"), request.url)));
  }
  return withCookies(NextResponse.rewrite(new URL(`/admin${page}${search}`, request.url), { request }));
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*", "/:segment/login", "/:segment/dashboard"],
};
