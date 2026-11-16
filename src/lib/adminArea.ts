/* Whether the page on screen is the admin, for the client code that has to
 * stay out of it (analytics, the site cursor).
 *
 * The admin is served at a secret address (lib/adminPath.ts), so the
 * browser's path no longer says "/admin" and must not be compared against
 * the secret either: that would put it in a public bundle. Instead
 * app/admin/layout.tsx renders an element carrying this attribute, which is
 * in the server's HTML from the first byte. */

export const ADMIN_AREA_ATTRIBUTE = "data-admin-area";

export const isAdminArea = () =>
  typeof document !== "undefined" && document.querySelector(`[${ADMIN_AREA_ATTRIBUTE}]`) !== null;
