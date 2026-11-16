import type { Metadata } from 'next';
import { ADMIN_AREA_ATTRIBUTE } from '@/lib/adminArea';

/* The admin is served at a secret address (lib/adminPath.ts); nothing links
 * to it and /admin itself is a 404. Nothing here belongs in a search index
 * either, and since robots.txt can't list a secret address, this noindex is
 * what keeps a page out if a crawler reaches one anyway. It lives here so it
 * covers the whole area. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Tells analytics and the site cursor to stay out (lib/adminArea.ts). */}
      <span hidden {...{ [ADMIN_AREA_ATTRIBUTE]: '' }} />
    </>
  );
}
