import type { Metadata } from 'next';

/* Nothing under /admin belongs in a search index. robots.txt already blocks
 * crawling it, and this keeps it out even if a crawler reaches a page anyway
 * (the footer links /admin/login). The login page is a client component and
 * can't export metadata itself, so the rule lives here for the whole area. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
