-- ============================================================
-- InTIMIdated by Math — Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
-- Extends auth.users with app-specific data.
-- A row is created automatically on signup via trigger below.

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text,
  target_score  smallint,           -- GRE quant target (130–170)
  exam_date     date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ── 2. PROBLEMS ─────────────────────────────────────────────

create table if not exists public.problems (
  id              bigint generated always as identity primary key,
  category        text not null,       -- e.g. 'arithmetic', 'algebra', 'geometry', 'data_analysis'
  subcategory     text,
  difficulty      smallint not null check (difficulty between 1 and 5),
  question_text   text not null,
  answer_options  jsonb,               -- null for numeric-entry questions
  correct_answer  text not null,
  explanation     text,
  source          text,                -- e.g. 'official_gre', 'custom'
  created_at      timestamptz not null default now()
);

alter table public.problems enable row level security;

create policy "Problems are readable by authenticated users"
  on public.problems for select
  to authenticated
  using (true);


-- ── 3. SESSIONS ─────────────────────────────────────────────

create type public.session_mode as enum ('practice', 'deep_dive', 'simulation');

create table if not exists public.sessions (
  id              bigint generated always as identity primary key,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  mode            public.session_mode not null default 'practice',
  started_at      timestamptz not null default now(),
  ended_at        timestamptz,
  total_problems  smallint,
  correct_count   smallint,
  score_pct       numeric(5,2) generated always as (
                    case when total_problems > 0
                    then round(correct_count::numeric / total_problems * 100, 2)
                    else null end
                  ) stored
);

alter table public.sessions enable row level security;

create policy "Users can manage their own sessions"
  on public.sessions for all
  using (auth.uid() = user_id);


-- ── 4. ATTEMPTS ─────────────────────────────────────────────
-- One row per problem per session.

create table if not exists public.attempts (
  id                bigint generated always as identity primary key,
  session_id        bigint not null references public.sessions (id) on delete cascade,
  user_id           uuid not null references public.profiles (id) on delete cascade,
  problem_id        bigint not null references public.problems (id),
  selected_answer   text,
  is_correct        boolean,
  time_spent_sec    smallint,
  created_at        timestamptz not null default now()
);

alter table public.attempts enable row level security;

create policy "Users can manage their own attempts"
  on public.attempts for all
  using (auth.uid() = user_id);


-- ── 5. CATEGORY PROGRESS ────────────────────────────────────
-- Aggregated per-user per-category stats (updated by the app).

create table if not exists public.category_progress (
  user_id          uuid not null references public.profiles (id) on delete cascade,
  category         text not null,
  total_attempted  integer not null default 0,
  total_correct    integer not null default 0,
  updated_at       timestamptz not null default now(),
  primary key (user_id, category)
);

alter table public.category_progress enable row level security;

create policy "Users can manage their own progress"
  on public.category_progress for all
  using (auth.uid() = user_id);


-- ── 6. MEMES ────────────────────────────────────────────────

create table if not exists public.memes (
  id          bigint generated always as identity primary key,
  image_url   text not null,
  caption     text,
  tags        text[],
  created_at  timestamptz not null default now()
);

alter table public.memes enable row level security;

create policy "Memes are readable by authenticated users"
  on public.memes for select
  to authenticated
  using (true);
