/**
 * Renders the content files' text format (lib/richText.ts): paragraphs split on
 * a blank line, and links written [anchor](/path) or [anchor](https://…).
 *
 * Server components, so every link is in the HTML crawlers receive. A link to a
 * page on this site goes through next/link; a file (a PDF in public/) or an
 * anchor on the page is a plain <a>; an external link opens in a new tab with
 * rel="noopener" and no "noreferrer", so sameemamjad.com and the platforms we
 * cite can still see where a visitor came from. A target that is none of these
 * renders as its anchor text alone, never as a link.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { LINK_PATTERN, hrefKind, paragraphs } from '@/lib/richText';

export const linkClass = 'text-teal-400 underline underline-offset-4 hover:text-teal-300';

export function SmartLink({
  href,
  className = linkClass,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const kind = hrefKind(href);
  if (kind === 'page') {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  if (kind === 'file' || kind === 'fragment') {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  if (kind === 'external') {
    return (
      <a href={href} target="_blank" rel="noopener" className={className}>
        {children}
      </a>
    );
  }
  return <>{children}</>;
}

/** One run of text with its links, and no paragraph breaks: for list items and table cells. */
export function InlineText({ text, linkClassName }: { text: string; linkClassName?: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_PATTERN)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    parts.push(
      <SmartLink key={at} href={m[2]} className={linkClassName}>
        {m[1]}
      </SmartLink>
    );
    last = at + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Paragraphs, each a <p> with the given classes. */
export function RichText({
  text,
  className = 'mt-4 leading-relaxed text-gray-400',
  linkClassName,
}: {
  text: string;
  className?: string;
  linkClassName?: string;
}) {
  return (
    <>
      {paragraphs(text).map((p, i) => (
        <p key={i} className={className}>
          <InlineText text={p} linkClassName={linkClassName} />
        </p>
      ))}
    </>
  );
}
