-- Projects: a recorded walkthrough, a screenshot gallery and a live-demo link.
--
-- Several portfolio projects now have a walkthrough video, three gallery images
-- and a page on the demo hub (demoprojectsforclients.sameemamjad.com) where a
-- visitor can try the demo build. The project page renders each one only when
-- it is present, so every existing row renders exactly as before.
--
--   video     {"src", "poster", "caption", "duration", "uploadDate"}: a
--             same-origin file under /videos (src/poster are site paths),
--             duration as ISO 8601 (PT2M6S), uploadDate as YYYY-MM-DD. Also
--             feeds the VideoObject and the video sitemap.
--   gallery   [{"src", "alt"}, ...]: absolute image URLs (the DevoraX storage
--             bucket) with their alt text, in display order.
--   demo_url  the project's page on the demo hub. Not the product itself: that
--             stays in `web`. The hub page is noindexed and holds the demo
--             logins, so this column holds only the hub URL.
--
-- All three are nullable with no default, so existing rows need no backfill.
-- No RLS or grant change is needed: the grants on this table are table-wide,
-- so the public read policy covers the new columns, and the admin dashboard's
-- update payload names its columns explicitly and never touches these.

begin;

alter table public.projects
  add column if not exists video    jsonb,
  add column if not exists gallery  jsonb,
  add column if not exists demo_url text;

comment on column public.projects.video is
  'Walkthrough video: {"src","poster","caption","duration" (ISO 8601),"uploadDate" (YYYY-MM-DD)}. src/poster are same-origin paths under /videos.';
comment on column public.projects.gallery is
  'Gallery images in display order: [{"src","alt"}], absolute URLs.';
comment on column public.projects.demo_url is
  'The project''s page on the demo hub (noindexed, holds the demo logins). The real product stays in web.';

notify pgrst, 'reload schema';

commit;
