-- Experimento India: a SEPARATE Supabase project from the Step by Step English
-- site. Create a new project, then run this once in ITS SQL Editor.
-- Do not run this in the English site's project.
--
-- Then set these in .env.local (dev) and in the Vercel project (production):
--   NEXT_PUBLIC_EXPERIMENTO_SUPABASE_URL=
--   NEXT_PUBLIC_EXPERIMENTO_SUPABASE_PUBLISHABLE_KEY=
-- (Project Settings > API: Project URL and the publishable key.)
-- NEXT_PUBLIC_ vars are baked in at build time, so set them BEFORE deploying.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  -- Which entry path the visitor took: fellow / ngo / curious.
  path text not null check (path in ('fellow', 'ngo', 'curious')),
  next_step text not null,
  name text not null check (char_length(name) <= 200),
  email text not null check (char_length(email) <= 320),
  phone text check (phone is null or char_length(phone) <= 40)
);

alter table public.leads enable row level security;

-- Public-facing form, no login: anyone can insert, nobody can read.
-- No SELECT policy on purpose, so the publishable key can write but never
-- read. Use "to public", not "to anon": the sb_publishable_... key doesn't
-- map to the legacy `anon` role, so "to anon" silently rejects every insert.
create policy "Allow public inserts"
  on public.leads
  for insert
  to public
  with check (true);

-- Read the collected leads afterwards from the Supabase dashboard (Table
-- Editor) or export as CSV. The dashboard uses the service role, which
-- bypasses RLS.
