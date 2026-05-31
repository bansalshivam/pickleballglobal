-- ============================================================
-- PickleClub — Milestone 3 schema: RSVPs
-- Run this in Supabase: SQL Editor → New query → paste → Run.
-- (Run this AFTER the milestone 2 schema.sql.)
-- ============================================================

-- RSVPS — the JOIN TABLE (the new concept this milestone).
-- Each row links ONE member to ONE event = "this person is going".
-- Many members per event, many events per member: a many-to-many
-- relationship, expressed as rows in this middle table.
create table if not exists public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  event_id    uuid not null references public.events (id) on delete cascade,
  user_id     uuid not null references auth.users (id) default auth.uid(),

  -- A member can only RSVP to a given event ONCE. This constraint
  -- enforces that at the database level — no duplicate "going" rows.
  unique (event_id, user_id)
);

-- Security: every RSVP action is scoped to the logged-in member.
alter table public.rsvps enable row level security;

-- READ: any member can read RSVPs (needed to count attendees).
create policy "members can read rsvps"
  on public.rsvps for select to authenticated using (true);

-- CREATE: a member can only add an RSVP as THEMSELVES.
create policy "members can rsvp as self"
  on public.rsvps for insert to authenticated
  with check (auth.uid() = user_id);

-- DELETE: a member can only remove their OWN RSVP (un-RSVP).
create policy "members can remove own rsvp"
  on public.rsvps for delete to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- NEXT (parked): showing attendee NAMES, not just counts.
-- That needs a profiles table + a read policy that exposes
-- display names. Do it as a focused follow-up once this works.
-- ============================================================
