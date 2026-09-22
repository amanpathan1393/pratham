-- Run this once in the Supabase SQL Editor for this project
-- (https://pzuhxlkuumqmcqercsfg.supabase.co) to create the submissions table.

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  name text,
  email text,
  phone text,
  role text,
  challenges text[],
  student_count text,
  grades_taught text,
  next_step text,
  ngo_org text,
  ngo_location text,
  ngo_audience text,
  ngo_settings text[],
  ngo_explore text[]
);

alter table public.submissions enable row level security;

-- Public-facing forms, no login: allow anyone to insert, no one to read.
-- Note: use "to public", not "to anon" — the new sb_publishable_... key
-- doesn't map to the legacy `anon` Postgres role, so "to anon" silently
-- rejects every insert (42501) even though the policy looks correct.
create policy "Allow public inserts"
  on public.submissions
  for insert
  to public
  with check (true);

-- If the table already exists in your project (it does in production),
-- `create table if not exists` above is a no-op and won't add new columns.
-- Run this once instead to bring an existing table up to date:
alter table public.submissions
  add column if not exists student_count text,
  add column if not exists grades_taught text;

-- One row per Fastest Finger First play, for the Control Room infographic.
create table if not exists public.game_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  result text not null
);

alter table public.game_results enable row level security;

create policy "Allow public inserts"
  on public.game_results
  for insert
  to public
  with check (true);

-- The Control Room page reads both tables with the service_role key from
-- the server (bypasses RLS entirely), so no SELECT policy is added here —
-- anon/public keys still can't read submissions or game_results.
