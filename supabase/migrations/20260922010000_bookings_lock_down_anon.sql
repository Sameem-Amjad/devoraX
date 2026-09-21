-- Close anon write access to bookings.
--
-- The previous migration enabled RLS and dropped the permissive policies it
-- knew the names of. Reads did lock down, but an anonymous INSERT still
-- returned 201 — so a policy existed under a name that migration did not
-- guess. Guessing names is the bug; this drops whatever is actually there by
-- iterating pg_policies, then recreates only the one policy that should exist.
--
-- Two independent layers are set, because either alone is enough to have
-- allowed this and both are cheap:
--
--   1. RLS policies — row-level rules, evaluated per statement.
--   2. Table grants — Supabase's defaults give `anon` and `authenticated`
--      full DML on every table in `public`. RLS is what normally holds that
--      back, so a single missing or permissive policy exposes everything.
--      The browser has no reason to touch this table at all now that writes
--      go through /api/bookings with the service role, so the grant itself
--      is revoked rather than merely fenced by a policy.

begin;

-- Report what was there, so the push output records it.
do $$
declare p record;
begin
  raise notice '--- policies on public.bookings before lockdown ---';
  for p in
    select policyname, cmd, roles::text, coalesce(qual, '-') as using_expr,
           coalesce(with_check, '-') as check_expr
      from pg_policies
     where schemaname = 'public' and tablename = 'bookings'
  loop
    raise notice 'policy % | cmd=% | roles=% | using=% | check=%',
      p.policyname, p.cmd, p.roles, p.using_expr, p.check_expr;
  end loop;

  raise notice '--- relrowsecurity = % ---',
    (select relrowsecurity from pg_class where oid = 'public.bookings'::regclass);
end $$;

-- Drop every policy on the table, whatever it is called.
do $$
declare p record;
begin
  for p in
    select policyname from pg_policies
     where schemaname = 'public' and tablename = 'bookings'
  loop
    execute format('drop policy %I on public.bookings', p.policyname);
    raise notice 'dropped policy %', p.policyname;
  end loop;
end $$;

alter table public.bookings enable row level security;
-- Applies RLS to the table owner too, so a future owner-context query cannot
-- quietly bypass these rules.
alter table public.bookings force row level security;

-- The browser gets nothing. /api/bookings/availability returns free times,
-- which is all a visitor needs, and it reads with the service role.
revoke all on public.bookings from anon;

-- Signed-in admins keep dashboard access; the grant is narrowed to what the
-- dashboard actually does (list bookings, change status).
revoke all on public.bookings from authenticated;
grant select, update on public.bookings to authenticated;

create policy "admins read bookings"
  on public.bookings for select
  to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

create policy "admins update bookings"
  on public.bookings for update
  to authenticated
  using      ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

commit;
