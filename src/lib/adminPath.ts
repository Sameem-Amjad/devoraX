/* The admin's address.
 *
 * The admin's pages live in app/admin, but nobody reaches them by that name.
 * They are served at a secret first path segment, ADMIN_PATH, which is set in
 * the Vercel project's environment variables and in .env.local, and never in
 * this repository (it is public). src/middleware.ts rewrites
 * <ADMIN_PATH>/login and <ADMIN_PATH>/dashboard to app/admin and answers
 * /admin itself with the site's 404. See docs/ADMIN.md.
 *
 * Server code only: the value is read at request time and must never reach a
 * client bundle, so nothing here is NEXT_PUBLIC_. Client components get the
 * addresses they need as props from the admin's server pages. */

export type AdminPage = "/login" | "/dashboard";

const ADMIN_PAGES: readonly AdminPage[] = ["/login", "/dashboard"];

/* One path segment, long enough not to be guessed, and not a name the site
   already uses for something else. */
const SEGMENT = /^[A-Za-z0-9_-]{12,}$/;
const TAKEN = new Set(["admin", "api", "_next"]);

/** "/<ADMIN_PATH>", or null when it is unset or unusable: then there is no way in. */
export function adminBase(): string | null {
  const segment = process.env.ADMIN_PATH?.trim().replace(/^\/+|\/+$/g, "") ?? "";
  if (!SEGMENT.test(segment) || TAKEN.has(segment.toLowerCase())) return null;
  return `/${segment}`;
}

/** The public address of one admin page. */
export function adminHref(page: AdminPage): string {
  return `${adminBase() ?? ""}${page}`;
}

/** Which admin page a request path asks for, or null when it is not one. */
export function adminPageFor(pathname: string): AdminPage | null {
  const base = adminBase();
  if (!base || !pathname.startsWith(`${base}/`)) return null;
  const page = pathname.slice(base.length).replace(/\/+$/, "");
  return ADMIN_PAGES.find((p) => p === page) ?? null;
}
