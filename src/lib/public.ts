import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Read-only Supabase client for public, cacheable pages.
 *
 * `@/lib/server`'s `createClient()` calls `cookies()` from `next/headers` so it
 * can carry an auth session. That is correct for /admin and the API routes, but
 * touching `cookies()` opts the whole route into dynamic rendering: Next marks
 * the request `no-store`, and any `export const revalidate` on that page becomes
 * inert. Every marketing page — home, /services, /projects, /case-study and both
 * detail routes — was therefore re-rendered from scratch on every single request,
 * hitting Supabase each time, despite declaring an hour-long revalidate window.
 *
 * None of those pages read a session. They query public tables with the anon key
 * under RLS, so they do not need cookies and must not force dynamic rendering.
 * This client is cookie-free, which lets those routes prerender at build time and
 * refresh on the ISR schedule instead.
 *
 * Do NOT use this where an authenticated user matters — use `@/lib/server` there.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}
