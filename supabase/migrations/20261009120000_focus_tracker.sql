-- Focus tracker: Sameem's private to-do board (the devorax-focus app).
--
-- It lives in the DevoraX project rather than a client's database, and every
-- row belongs to one auth user. RLS means only the signed-in owner can read or
-- change their rows; anon gets nothing at all.
--
-- focus_tasks  one row per task: one-off, or repeating daily/weekly
-- focus_log    one row per task per day it was done, which powers the
--              "yesterday" and history views

create table if not exists public.focus_tasks (
  id           uuid primary key default gen_random_uuid(),
  owner        uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title        text not null,
  details      text,
  category     text not null default 'General',
  priority     smallint not null default 2 check (priority between 1 and 3),
  planned_for  date,
  repeat       text check (repeat in ('daily', 'weekly')),
  done         boolean not null default false,
  completed_at timestamptz,
  notes        text,
  sort         integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.focus_log (
  id         uuid primary key default gen_random_uuid(),
  owner      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  task_id    uuid not null references public.focus_tasks (id) on delete cascade,
  day        date not null,
  created_at timestamptz not null default now(),
  unique (task_id, day)
);

create index if not exists focus_tasks_owner_idx on public.focus_tasks (owner, sort);
create index if not exists focus_log_owner_day_idx on public.focus_log (owner, day);

create or replace function public.focus_touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists focus_tasks_touch on public.focus_tasks;
create trigger focus_tasks_touch
  before update on public.focus_tasks
  for each row execute function public.focus_touch_updated_at();

alter table public.focus_tasks enable row level security;
alter table public.focus_log enable row level security;

revoke all on public.focus_tasks from anon;
revoke all on public.focus_log from anon;
grant select, insert, update, delete on public.focus_tasks to authenticated;
grant select, insert, update, delete on public.focus_log to authenticated;

drop policy if exists "owner manages own tasks" on public.focus_tasks;
create policy "owner manages own tasks" on public.focus_tasks
  for all to authenticated
  using (owner = (select auth.uid()))
  with check (owner = (select auth.uid()));

drop policy if exists "owner manages own log" on public.focus_log;
create policy "owner manages own log" on public.focus_log
  for all to authenticated
  using (owner = (select auth.uid()))
  with check (owner = (select auth.uid()));
