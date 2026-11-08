-- Bookings: lead tracking, so bookings can be counted by channel and outcome.
--
-- The table could say how a visitor heard about us and the page they booked
-- on, but not which profile's link they followed, where their visit began,
-- what they told us about their app, whether the call was qualified, or
-- whether they went on to pay. Two kinds of column fix that.
--
-- Written by /api/bookings from the booking form:
--
--   landing_path       the first page of the visit, path only. The browser
--                      keeps it in sessionStorage, which needs consent, so it
--                      arrives only from visitors who accepted analytics; null
--                      otherwise
--   lead_channel       the profile a tagged booking link came from, such as
--                      /book?from=linkedin; one of the values in the check
--                      below. The owner can also set it by hand at first
--                      contact, which is why the list is longer than the
--                      links that exist
--   app_link           the optional brief, as typed: a link to the app,
--   built_with         what it was built with (a key from src/lib/booking/brief.ts)
--   deadline           and the deadline
--
-- Set by the owner in the Supabase table editor (the dashboard does not edit
-- them yet). The API never writes them, so each is null until the owner sets
-- it:
--
--   new_channel        at first contact: whether the lead came through a new
--                      channel (which channels count as new is kept outside
--                      this repo)
--   qualified          after the call: the owner's assessment (the criteria
--                      are kept outside this repo)
--   qualified_note     why, in a line
--   first_step_paid    the first paid step bought: an OfferStepId from
--                      src/data/offer.ts ('audit', 'sprint', 'payments',
--                      'launch' or 'care')
--   developer_account  the kind of App Store and Google Play developer account
--                      the founder has: 'none', 'personal' or 'organisation'
--                      (an organisation account needs a D-U-N-S Number)
--   sharetribe_plan    for a Sharetribe marketplace, the plan it is on
--   sharetribe_need    and what it needs built
--
-- heard_about also gains four answers: upwork, contra, community and directory.
-- src/lib/booking/attribution.ts lists the same keys, so a new answer still
-- needs a migration as well as a line there.
--
-- Every new column is nullable with no default, so existing rows need no
-- backfill. Apply this before deploying the code that sends the new fields. If
-- the code goes first, /api/bookings falls back rather than failing: without
-- these columns it saves the booking with heard_about, booked_from and
-- referrer_host (an answer the old check refuses is saved as null), failing
-- that the booking alone, and it logs which tier fired.
--
-- No RLS or grant change is needed, for the reasons in 20261014120000: only
-- /api/bookings inserts, with the service role, and the dashboard's table-wide
-- select and update grant to authenticated admins covers the new columns.

begin;

alter table public.bookings
  add column if not exists landing_path      text,
  add column if not exists lead_channel      text,
  add column if not exists app_link          text,
  add column if not exists built_with        text,
  add column if not exists deadline          text,
  add column if not exists new_channel       boolean,
  add column if not exists qualified         boolean,
  add column if not exists qualified_note    text,
  add column if not exists first_step_paid   text,
  add column if not exists developer_account text,
  add column if not exists sharetribe_plan   text,
  add column if not exists sharetribe_need   text;

-- The 20261014120000 list plus upwork, contra, community and directory.
alter table public.bookings
  drop constraint if exists bookings_heard_about_check;
alter table public.bookings
  add constraint bookings_heard_about_check
  check (
    heard_about is null
    or heard_about in (
      'search', 'ai_assistant', 'fiverr', 'upwork', 'contra', 'linkedin',
      'community', 'directory', 'referral', 'other'
    )
  );

-- LEAD_CHANNELS in src/lib/booking/attribution.ts.
alter table public.bookings
  drop constraint if exists bookings_lead_channel_check;
alter table public.bookings
  add constraint bookings_lead_channel_check
  check (
    lead_channel is null
    or lead_channel in (
      'sharetribe-experts', 'contra', 'clutch', 'linkedin', 'upwork',
      'fiverr', 'community', 'directory'
    )
  );

-- The API trims and limits these before writing; the checks hold the same
-- limits for anything that writes to the table another way. The API checks
-- built_with against its list of keys; the database only bounds its length,
-- so a new option needs no migration.
alter table public.bookings
  drop constraint if exists bookings_landing_path_check;
alter table public.bookings
  add constraint bookings_landing_path_check
  check (landing_path is null or char_length(landing_path) <= 200);

alter table public.bookings
  drop constraint if exists bookings_app_link_check;
alter table public.bookings
  add constraint bookings_app_link_check
  check (app_link is null or char_length(app_link) <= 500);

alter table public.bookings
  drop constraint if exists bookings_built_with_check;
alter table public.bookings
  add constraint bookings_built_with_check
  check (built_with is null or char_length(built_with) <= 40);

alter table public.bookings
  drop constraint if exists bookings_deadline_check;
alter table public.bookings
  add constraint bookings_deadline_check
  check (deadline is null or char_length(deadline) <= 100);

-- The owner types these by hand, so the checks catch a slip: developer_account
-- takes one of its three values, and the two Sharetribe fields are bounded
-- like the brief.
alter table public.bookings
  drop constraint if exists bookings_developer_account_check;
alter table public.bookings
  add constraint bookings_developer_account_check
  check (
    developer_account is null
    or developer_account in ('none', 'personal', 'organisation')
  );

alter table public.bookings
  drop constraint if exists bookings_sharetribe_plan_check;
alter table public.bookings
  add constraint bookings_sharetribe_plan_check
  check (sharetribe_plan is null or char_length(sharetribe_plan) <= 40);

alter table public.bookings
  drop constraint if exists bookings_sharetribe_need_check;
alter table public.bookings
  add constraint bookings_sharetribe_need_check
  check (sharetribe_need is null or char_length(sharetribe_need) <= 500);

-- Shown as column descriptions in the Supabase table editor, where the owner
-- fills in the owner-set columns by hand.
comment on column public.bookings.landing_path is
  'First page of the visit, path only. Sent only with analytics consent.';
comment on column public.bookings.lead_channel is
  'Profile a tagged /book?from= link came from, or set by hand at first contact.';
comment on column public.bookings.app_link is
  'Optional brief: link to the app, as typed.';
comment on column public.bookings.built_with is
  'Optional brief: a BUILT_WITH key from src/lib/booking/brief.ts.';
comment on column public.bookings.deadline is
  'Optional brief: the deadline, as typed.';
comment on column public.bookings.new_channel is
  'Owner, at first contact: whether the lead came through a new channel. Null until set.';
comment on column public.bookings.qualified is
  'Owner, after the call: whether the conversation was qualified. Null until assessed.';
comment on column public.bookings.qualified_note is
  'Owner, after the call: why it was or was not qualified.';
comment on column public.bookings.first_step_paid is
  'Owner: first paid step bought (audit, sprint, payments, launch or care). Null until one is.';
comment on column public.bookings.developer_account is
  'Owner: the kind of App Store and Google Play developer account the founder has (none, personal or organisation; an organisation needs a D-U-N-S Number). Null until known.';
comment on column public.bookings.sharetribe_plan is
  'Owner, for a Sharetribe marketplace: the Sharetribe plan it is on.';
comment on column public.bookings.sharetribe_need is
  'Owner, for a Sharetribe marketplace: what it needs built.';

-- As in 20261014120000: make sure PostgREST's schema cache has the new
-- columns. Until it does it rejects them, and the API saves bookings without
-- them. Sent on commit.
notify pgrst, 'reload schema';

commit;
