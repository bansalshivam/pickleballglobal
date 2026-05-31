# PickleClub — Milestone 1

A landing page, working signup/login, and a logged-in dashboard.
Built with Next.js (App Router) + Supabase. This is the foundation —
every later feature hangs off this exact skeleton.

## What's here

- `app/page.js` — landing page
- `app/login/page.js` — login + signup (one screen, toggles between them)
- `app/dashboard/page.js` — the protected logged-in screen
- `lib/` — Supabase client setup (browser + server)
- `middleware.js` — keeps the login session alive across requests

That's the whole of milestone 1. No rankings, no videos, no tournaments.
Just: a site exists, people can make accounts, and they can log in and out.

---

## Get it running — about 15 minutes

### 1. Install dependencies
```bash
npm install
```

### 2. Create a free Supabase project
1. Go to https://supabase.com and sign up (free).
2. Click "New project". Give it a name, set a database password, pick a region.
3. Wait ~2 minutes for it to provision.

### 3. Get your two keys
In your Supabase project: **Project Settings → API**. Copy:
- the **Project URL**
- the **anon / public** key

### 4. Wire them in locally
```bash
cp .env.local.example .env.local
```
Open `.env.local` and paste your two values in.

### 5. Run it
```bash
npm run dev
```
Open http://localhost:3000 — you should see the landing page.
Sign up with an email, confirm via the email Supabase sends, then log in.

> Tip: while testing, you can turn off email confirmation in
> Supabase → Authentication → Providers → Email ("Confirm email" off),
> so signups log in instantly without the email step.

---

## Deploy it live (so she can actually see it)

### 1. Push to GitHub
Create a new empty repo on GitHub, then:
```bash
git init
git add .
git commit -m "Milestone 1: landing, auth, dashboard"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub.
2. "Add New… → Project", pick your repo.
3. Before deploying, add the two environment variables (same names,
   same values as your `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy. ~1 minute later you have a live URL.

### 3. Tell Supabase about the live URL
In Supabase → **Authentication → URL Configuration**, add your Vercel
URL as a Site URL / redirect URL, so login works in production too.

That's it. The loop is closed — there's a real, live, authenticated site.

---

## What comes next (milestone 2 — NOT now)

Content & events pages: a table in Supabase, a form to add them, a page
to list them. Mostly CRUD. Park everything else (rankings, tournaments,
ratings, club finder) until this is live and she's using it.

---

# Milestone 2 — Events & news

The dashboard is now real. Members see upcoming events and club news,
and can add both. New skill in here: **Row Level Security (RLS)** —
the rules that decide who can read/write each row.

## What's new
- `supabase/schema.sql` — creates the `events` and `news` tables + RLS policies
- `app/dashboard/page.js` — now fetches and shows events + news
- `app/dashboard/events/new/` — form to add an event
- `app/dashboard/news/new/` — form to post news

## One required step before it works: run the SQL
The new pages read/write two database tables that don't exist yet.
1. Open your Supabase project → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/schema.sql`.
3. Click **Run**. You should see "Success. No rows returned."

That creates the tables and turns on the security rules. Without this
step, the dashboard will show errors about missing tables.

## Then
- `npm run dev`, log in, and you'll see "Add event" / "Add news" buttons.
- Add one of each — they appear on the dashboard immediately.
- Commit and push; Vercel redeploys automatically. Live in ~1 minute.

## Parked on purpose (don't build yet)
- **Video upload** — its own milestone (storage + streaming is the heavy part)
- **Admin-only posting** — right now any member can post; tighten later
  with an is_admin flag (see note at the bottom of schema.sql)
- Rankings, tournaments, ratings, club finder — later milestones
