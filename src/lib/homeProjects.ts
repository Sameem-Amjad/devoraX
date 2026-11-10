/**
 * The homepage's view of a project: the dozen fields its cards print.
 *
 * The homepage used to hand every column of every row of the projects table to
 * a client component, long-form `content` included, for a grid that shows six
 * cards. The server page now maps the rows it shows through here, so the
 * browser gets what it renders and nothing else.
 *
 * Pure functions, no server-only imports.
 */
import { durationLabel, projectVideo } from '@/lib/projectMedia';

export type HomeProject = {
  id: number;
  title: string;
  /** The stack line, e.g. "Flutter & NestJS". */
  category: string;
  description: string;
  /** What a reader can check today, e.g. "Live on the App Store since June 2026." */
  result: string | null;
  tags: string[];
  /** Cover image on Supabase storage, or null when the row has none. */
  image: string | null;
  /** Tailwind gradient stops from the row, e.g. "from-purple-400 to-indigo-500". */
  accent: string | null;
  video: { src: string; poster: string; length: string } | null;
  ios: string | null;
  android: string | null;
  web: string | null;
};

/**
 * One walkthrough in the hero's showcase: the recording, its poster, and the
 * three lines printed under it. Every string is the row's own.
 */
export type HomeReel = {
  id: number;
  title: string;
  /** The stack line, e.g. "Next.js & Supabase". */
  category: string;
  /** What a reader can check today; the caption's second line. */
  result: string | null;
  src: string;
  poster: string;
  /** "2:06" */
  length: string;
};

type Row = Record<string, unknown>;

const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/** A stored link, or null: the table holds "", "null" and real URLs. */
function link(v: unknown): string | null {
  const s = text(v);
  return /^https?:\/\//.test(s) ? s : null;
}

/** `tags` is a JSON array, or a JSON string of one on hand-edited rows. */
function tags(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((t): t is string => typeof t === 'string');
  if (typeof v !== 'string') return [];
  try {
    const parsed: unknown = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string') : [];
  } catch {
    return [];
  }
}

export function toHomeProject(row: Row): HomeProject {
  const video = projectVideo(row.video);
  return {
    id: Number(row.id),
    title: text(row.title),
    category: text(row.category),
    description: text(row.description),
    result: text(row.result) || null,
    tags: tags(row.tags),
    image: link(row.image),
    accent: text(row.accent) || null,
    video: video ? { src: video.src, poster: video.poster, length: durationLabel(video.duration) } : null,
    ios: link(row.ios),
    android: link(row.android),
    web: link(row.web),
  };
}

/** The first `limit` projects that have a walkthrough, in the order given. */
export function homeReels(rows: Row[], limit: number): HomeReel[] {
  const reels: HomeReel[] = [];
  for (const row of rows) {
    const video = projectVideo(row.video);
    if (!video) continue;
    reels.push({
      id: Number(row.id),
      title: text(row.title),
      category: text(row.category),
      result: text(row.result) || null,
      src: video.src,
      poster: video.poster,
      length: durationLabel(video.duration),
    });
    if (reels.length === limit) break;
  }
  return reels;
}
