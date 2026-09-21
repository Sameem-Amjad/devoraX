/* Service-role Supabase client, server-only.
 *
 * This key bypasses Row Level Security, so it must never reach the browser.
 * It is read from a non-NEXT_PUBLIC_ env var, which Next will not inline into
 * client bundles, and the import throws if it is ever evaluated in one.
 */

import { createClient } from "@supabase/supabase-js";

if (typeof window !== "undefined") {
  throw new Error("lib/booking/db is server-only — do not import it from a client component");
}

export const serviceClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase is not configured: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
    );
  }
  // No session persistence: this client is per-request and has no user.
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};
