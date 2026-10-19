/**
 * The optional media on a project: a walkthrough video, a screenshot gallery
 * and a link to the project's page on the demo hub.
 *
 * Stored in three nullable columns on `projects` (migration
 * 20261019182204_project_media). The page, the JSON-LD and the video sitemap
 * all read them through these parsers, so the three can never disagree about
 * whether a project has a video. Anything malformed parses as "no media", and
 * the page then renders exactly as it did before the columns existed.
 *
 * Pure functions with no server-only imports: the project page's client
 * component uses them too.
 */
import { SITE_URL } from '@/data/brand';

export type ProjectVideo = {
  /** Same-origin path under /videos, e.g. /videos/constraction-v1.mp4. */
  src: string;
  poster: string;
  caption: string;
  /** ISO 8601 duration, e.g. PT2M6S. */
  duration: string;
  /** YYYY-MM-DD. */
  uploadDate: string;
};

export type GalleryImage = { src: string; alt: string };

/** The demo hub: a noindexed page per project that holds its demo logins. */
const DEMO_HUB = /^https:\/\/demoprojectsforclients\.sameemamjad\.com\/projects\/[a-z0-9-]+$/;

const SITE_VIDEO_PATH = /^\/videos\/[a-z0-9-]+\.(?:mp4|jpg)$/;
const ISO_DURATION = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** jsonb arrives as an object; a hand-edited row could hold a JSON string. */
function parse(raw: unknown): unknown {
  if (typeof raw !== 'string') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

export function projectVideo(raw: unknown): ProjectVideo | null {
  const v = parse(raw);
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  const video = {
    src: str(o.src),
    poster: str(o.poster),
    caption: str(o.caption),
    duration: str(o.duration),
    uploadDate: str(o.uploadDate),
  };
  // Only same-origin files: the CSP has no media-src, so it falls back to
  // default-src 'self' and a remote video would be blocked anyway.
  if (!SITE_VIDEO_PATH.test(video.src) || !SITE_VIDEO_PATH.test(video.poster)) return null;
  if (!ISO_DURATION.test(video.duration) || video.duration === 'PT') return null;
  if (!DATE.test(video.uploadDate)) return null;
  return video;
}

export function projectGallery(raw: unknown): GalleryImage[] {
  const v = parse(raw);
  if (!Array.isArray(v)) return [];
  return v
    .map((item) => ({ src: str(item?.src), alt: str(item?.alt) }))
    .filter((img) => /^https:\/\//.test(img.src) && img.alt.length > 0);
}

export function projectDemoUrl(raw: unknown): string | null {
  const url = str(raw);
  return DEMO_HUB.test(url) ? url : null;
}

/** PT3M11S → 191. */
export function durationSeconds(iso: string): number {
  const m = ISO_DURATION.exec(iso);
  if (!m) return 0;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
}

/** PT3M11S → "3:11", for the caption. */
export function durationLabel(iso: string): string {
  const total = durationSeconds(iso);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/**
 * The upload date as a full ISO 8601 datetime with a time zone, which Google
 * asks for on VideoObject and in video sitemaps (a bare date is read in
 * Googlebot's own zone). The walkthroughs were recorded in Pakistan, so the
 * date is anchored to the start of that day there.
 */
export function uploadDateTime(date: string): string {
  return `${date}T00:00:00+05:00`;
}

export const absoluteMediaUrl = (path: string): string =>
  /^https?:\/\//.test(path) ? path : `${SITE_URL}${path}`;

/** "<title> walkthrough": the video's name in JSON-LD and the sitemap. */
export const videoTitle = (projectTitle: string): string => `${projectTitle} walkthrough`;
