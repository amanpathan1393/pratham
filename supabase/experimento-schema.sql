-- Experimento India: a SEPARATE Supabase project from the Step by Step English
-- site. Run this in ITS SQL Editor. Safe to run more than once.

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

-- Fellow-path answers (added after launch). `create table if not exists`
-- above does nothing on an existing table, so these add the columns.
alter table public.leads
  add column if not exists subject text,
  add column if not exists grades text[],
  add column if not exists student_count text,
  add column if not exists challenges text[];

alter table public.leads drop constraint if exists leads_subject_check;
alter table public.leads add constraint leads_subject_check
  check (subject is null or subject in ('science', 'maths', 'both'));

alter table public.leads enable row level security;

-- Anyone can insert, nobody can read. No SELECT policy on purpose.
-- "to public", not "to anon": the sb_publishable_... key doesn't map to the
-- legacy anon role, so "to anon" silently rejects every insert.
drop policy if exists "Allow public inserts" on public.leads;
create policy "Allow public inserts"
  on public.leads
  for insert
  to public
  with check (true);

-- Make the API pick up the new columns immediately.
notify pgrst, 'reload schema';
