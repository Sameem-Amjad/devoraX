-- Bookings: store a real instant, and make double-booking impossible.
--
-- Before this, booking_date was TEXT holding Date.getTime() — a millisecond
-- timestamp captured at page load, so it carried the current hour, minute and
-- millisecond. Two visitors picking "23 Sep" wrote two different values, which
-- is why the duplicate check never matched and the same slot could be booked
-- repeatedly. booking_time was a display string ("3:00 PM") with no timezone,
-- so a visitor in London and the host in Karachi meant different moments.
--
-- Both are replaced by starts_at timestamptz: one instant, unambiguous
-- everywhere, comparable in SQL.
--
-- The old columns are kept (nullable) rather than dropped. The running site
-- still writes them until it is deployed, and keeping them makes this
-- reversible. Drop them once the new flow has been live for a while.

begin;

alter table public.bookings
  add column if not exists starts_at        timestamptz,
  add column if not exists duration_minutes integer not null default 30,
  add column if not exists visitor_timezone text,
  add column if not exists notes            text,
  add column if not exists google_event_id  text,
  add column if not exists updated_at       timestamptz not null default now();

-- Existing rows are NOT backfilled on purpose. Their booking_date is a
-- page-load timestamp and booking_time a zoneless string, so any instant we
-- derived would be a guess. They are left with starts_at IS NULL, visible in
-- the dashboard as "needs attention" rather than silently wrong.

-- Statuses the app actually uses. Existing rows are normalised first so the
-- constraint cannot fail on legacy values.
update public.bookings
   set status = 'pending'
 where status is null or status not in ('pending', 'confirmed', 'cancelled', 'completed');

alter table public.bookings
  alter column status set default 'pending';

alter table public.bookings
  drop constraint if exists bookings_status_check;
alter table public.bookings
  add constraint bookings_status_check
  check (status in ('pending', 'confirmed', 'cancelled', 'completed'));

-- The actual fix for double-booking. Partial, so cancelling frees the slot
-- again; NULLs are exempt, which is what leaves the two legacy rows alone.
-- An insert racing another now fails with 23505 instead of both succeeding —
-- the API turns that into a 409 and asks for another slot.
create unique index if not exists bookings_one_per_slot
  on public.bookings (starts_at)
  where status <> 'cancelled' and starts_at is not null;

-- Availability lookups scan a date window on every modal open.
create index if not exists bookings_starts_at_idx
  on public.bookings (starts_at)
  where status <> 'cancelled';

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists bookings_set_updated_at on public.bookings;
create trigger bookings_set_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ── Row Level Security ───────────────────────────────────────────────
-- Writes move to the server, which uses the service role key and bypasses
-- RLS. So the browser needs no write access at all, and the anon key must
-- not grant any: with an anon INSERT policy, anyone could POST arbitrary
-- rows straight to PostgREST and skip every validation in the API.
--
-- Reads are denied too. The modal asks /api/bookings/availability for free
-- slots, which returns times only — it never needs to see who booked them.

alter table public.bookings enable row level security;

drop policy if exists "anon can insert bookings"  on public.bookings;
drop policy if exists "public insert"             on public.bookings;
drop policy if exists "Enable insert for all"     on public.bookings;
drop policy if exists "anon can read bookings"    on public.bookings;
drop policy if exists "public read"               on public.bookings;
drop policy if exists "Enable read access for all users" on public.bookings;

-- Signed-in admins keep dashboard access; everyone else goes through the API.
drop policy if exists "admins manage bookings" on public.bookings;
create policy "admins manage bookings"
  on public.bookings for all
  to authenticated
  using  ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

commit;
