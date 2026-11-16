-- Bookings: X, Instagram and Facebook as places a booking can come from.
--
-- The studio now has profiles on X, Instagram and Facebook. Their links go to
-- /book?from=x, /book?from=instagram and /book?from=facebook, which set
-- lead_channel, and the booking form's "How did you hear about us?" gains one
-- answer for all three, 'social'. src/lib/booking/attribution.ts lists the
-- same keys (LEAD_CHANNELS, LINK_CHANNELS, HEARD_ABOUT).
--
-- Both changes only widen a check constraint, so no existing row can fail
-- them and nothing needs a backfill. Apply this before deploying the code that
-- sends the new values. If the code goes first, a booking from one of these
-- links fails the old check (23514) and /api/bookings saves it in its second
-- tier, without the lead tracking fields.

begin;

-- 20261107120000's list plus 'social'.
alter table public.bookings
  drop constraint if exists bookings_heard_about_check;
alter table public.bookings
  add constraint bookings_heard_about_check
  check (
    heard_about is null
    or heard_about in (
      'search', 'ai_assistant', 'fiverr', 'upwork', 'contra', 'linkedin',
      'social', 'community', 'directory', 'referral', 'other'
    )
  );

-- 20261107120000's list plus 'x', 'instagram' and 'facebook'.
alter table public.bookings
  drop constraint if exists bookings_lead_channel_check;
alter table public.bookings
  add constraint bookings_lead_channel_check
  check (
    lead_channel is null
    or lead_channel in (
      'sharetribe-experts', 'contra', 'clutch', 'linkedin', 'x', 'instagram',
      'facebook', 'upwork', 'fiverr', 'community', 'directory'
    )
  );

notify pgrst, 'reload schema';

commit;
