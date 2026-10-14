-- Bookings: record how the visitor heard about us.
--
-- The booking form now asks "How did you hear about us?" (optional). Analytics
-- undercounts AI assistants badly: someone who read about DevoraX in ChatGPT
-- or Perplexity usually arrives by typing the address or searching the name,
-- so the visit shows up as Direct or Google. Asking is the most reliable single
-- signal of AI-assistant influence there is. Two passive signals are kept with
-- the answer, for the cases where it is skipped or vague:
--
--   heard_about    the answer, one of the keys in src/lib/booking/attribution.ts
--                  (the check below lists the same keys, so a new answer needs
--                  a migration too); null when skipped
--   booked_from    the path the booking was made on, without query or hash
--   referrer_host  the referring site's hostname, never the full URL; null
--                  when there was none or it was this site
--
-- All three are nullable with no default, so existing rows need no backfill.
-- The API may be deployed before this is applied. Until it is, the API saves
-- bookings without these fields rather than failing them, so either order is
-- safe.
--
-- No RLS or grant change is needed. Only /api/bookings inserts, using the
-- service role, which bypasses RLS; anon holds no privileges on the table at
-- all (20260922010000), so it cannot write these columns or any other. The
-- dashboard's select and update grant to authenticated is table-wide, so it
-- covers the new columns, and the admin-only policies apply to them unchanged.

begin;

alter table public.bookings
  add column if not exists heard_about   text,
  add column if not exists booked_from   text,
  add column if not exists referrer_host text;

-- The API validates all three before writing; these hold the same limits for
-- anything that writes to the table another way.
alter table public.bookings
  drop constraint if exists bookings_heard_about_check;
alter table public.bookings
  add constraint bookings_heard_about_check
  check (
    heard_about is null
    or heard_about in ('search', 'ai_assistant', 'fiverr', 'linkedin', 'referral', 'other')
  );

alter table public.bookings
  drop constraint if exists bookings_booked_from_check;
alter table public.bookings
  add constraint bookings_booked_from_check
  check (booked_from is null or char_length(booked_from) <= 200);

alter table public.bookings
  drop constraint if exists bookings_referrer_host_check;
alter table public.bookings
  add constraint bookings_referrer_host_check
  check (referrer_host is null or char_length(referrer_host) <= 255);

-- Supabase normally reloads PostgREST's schema cache after DDL by itself; this
-- makes sure. Until the cache has the new columns PostgREST rejects them, and
-- the API keeps saving bookings without attribution. Sent on commit.
notify pgrst, 'reload schema';

commit;
