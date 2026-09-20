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
  next_step text,
  ngo_org text,
  ngo_location text,
  ngo_audience text,
  ngo_settings text[],
  ngo_explore text[]
);

alter table public.submissions enable row level security;

-- Public-facing forms, no login: allow anyone to insert, no one to read.
create policy "Allow public inserts"
  on public.submissions
  for insert
  to anon
  with check (true);
