-- ============================================================
-- PickleClub — Milestone 2 schema
-- Run this in your Supabase dashboard:  SQL Editor → New query →
-- paste this whole file → Run.
-- ============================================================

-- 1. EVENTS TABLE -------------------------------------------------
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  description text,
  location    text,
  event_date  date,
  created_by  uuid references auth.users (id) default auth.uid()
);

-- 2. NEWS / ANNOUNCEMENTS TABLE ----------------------------------
create table if not exists public.news (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  body        text,
  created_by  uuid references auth.users (id) default auth.uid()
);

-- 3. ROW LEVEL SECURITY ------------------------------------------
-- RLS is the heart of Supabase security. With it ON, NO row is
-- readable or writable unless a policy below explicitly allows it.
alter table public.events enable row level security;
alter table public.news   enable row level security;

-- READ: any logged-in member can see all events and news.
create policy "members can read events"
  on public.events for select to authenticated using (true);

create policy "members can read news"
  on public.news for select to authenticated using (true);

-- CREATE: a logged-in member can add a row, but only as themselves
-- (created_by must equal their own id — the default fills this in).
create policy "members can create events"
  on public.events for insert to authenticated
  with check (auth.uid() = created_by);

create policy "members can create news"
  on public.news for insert to authenticated
  with check (auth.uid() = created_by);

-- UPDATE / DELETE: only the person who created a row can change it.
create policy "authors can update own events"
  on public.events for update to authenticated
  using (auth.uid() = created_by) with check (auth.uid() = created_by);

create policy "authors can delete own events"
  on public.events for delete to authenticated
  using (auth.uid() = created_by);

create policy "authors can update own news"
  on public.news for update to authenticated
  using (auth.uid() = created_by) with check (auth.uid() = created_by);

create policy "authors can delete own news"
  on public.news for delete to authenticated
  using (auth.uid() = created_by);

-- ============================================================
-- NOTE on "who can post": right now ANY logged-in member can add
-- events and news. For a real club you'll likely want only an
-- owner/admin to post. That's a small follow-up (an is_admin flag
-- on a profiles table, then change the WITH CHECK above). Parked
-- on purpose — get this working first.
-- ============================================================
