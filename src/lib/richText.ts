/**
 * The text format of the content files: paragraphs separated by a blank line,
 * and links written [anchor text](/path) or [anchor text](https://…). Nothing
 * else, on purpose: no bold, no lists, no HTML. Writers can't break a page with
 * it, and an audit can read every link target with one regex.
 *
 * Pure functions, so data files, route handlers and components can share them.
 * The React side is components/seo/rich-text.tsx.
 */

/** [anchor](target). The anchor can't span lines; the target has no spaces. */
export const LINK_PATTERN = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;

/** Paragraphs, split on blank lines and trimmed. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** The text a reader sees, link syntax removed: for JSON-LD, meta tags and llms.txt. */
export function plainText(text: string): string {
  return text.replace(LINK_PATTERN, '$1');
}

/** Words in the visible text of these strings. */
export function countWords(...texts: string[]): number {
  return texts.reduce(
    (n, t) => n + plainText(t).split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length,
    0
  );
}

/**
 * What a link target is. 'page': a path on this site; 'file': a path with a
 * file extension (a PDF in public/), which must not go through the client
 * router; 'fragment': an anchor on the same page; 'external': an https URL.
 * Anything else (http:, mailto:, javascript:, "//host") is null, and renders
 * as plain text rather than as a link.
 */
export type HrefKind = 'page' | 'file' | 'fragment' | 'external';

export function hrefKind(href: string): HrefKind | null {
  if (/^#[\w-]+$/.test(href)) return 'fragment';
  if (/^https:\/\/[^\s/]+\.[^\s/]+/.test(href)) return 'external';
  if (/^\/(?!\/)/.test(href)) {
    const path = href.split(/[?#]/)[0];
    return /\.[a-z0-9]{2,5}$/i.test(path) ? 'file' : 'page';
  }
  return null;
}
