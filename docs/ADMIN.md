# The admin's address

The admin (sign-in and dashboard) is not linked from the site and is not at `/admin`. It is served at a secret first path segment, set in the `ADMIN_PATH` environment variable:

| Page | Address |
| --- | --- |
| Sign-in | `https://thedevorax.tech/<ADMIN_PATH>/login` |
| Dashboard | `https://thedevorax.tech/<ADMIN_PATH>/dashboard` |

`/admin`, `/admin/login` and `/admin/dashboard` answer with the site's ordinary 404 page.

## Setting it

- **Production and previews:** Vercel → project `devora-x` → Settings → Environment Variables → `ADMIN_PATH`. A change takes effect on the next deployment.
- **Local:** add `ADMIN_PATH=...` to `.env.local` (or `.env`). Both are gitignored.

The value is one path segment: at least 12 letters, digits, `-` or `_`, with no slashes, and not `admin`, `api` or `_next`. Anything else, or no value at all, leaves the admin with no address: every admin URL is a 404 until it is fixed. Never write the value into this repository; it is public.

To change the address, change the variable and redeploy. The old address stops working at once.

## How it works

- `src/lib/adminPath.ts` reads and checks `ADMIN_PATH` (server code only, nothing `NEXT_PUBLIC_`).
- `src/middleware.ts` rewrites `<ADMIN_PATH>/login` and `<ADMIN_PATH>/dashboard` to `src/app/admin/...`, sends anyone without the admin role to the sign-in page, sends a signed-in admin from the sign-in page to the dashboard, and answers `/admin/*` with a 404. Its matcher can't name the secret, so it matches any `/<segment>/login` and `/<segment>/dashboard`; every other address passes straight through.
- The admin's server pages pass the sign-in and dashboard addresses to the client components as props, so the secret never ends up in a JavaScript bundle.
- `src/app/admin/layout.tsx` sets `noindex` on every admin page (robots.txt can't list a secret address) and renders a hidden `data-admin-area` marker. Analytics and the site cursor stay out of any page with that marker (`src/lib/adminArea.ts`), since the path no longer says `/admin`.
- `/api/admin/*` is unchanged. Each route checks the admin role itself and answers 401 without it.
