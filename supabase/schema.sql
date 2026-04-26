-- ============================================================
-- InTIMIdated by Math — Database Schema
-- Safe to run multiple times (idempotent)
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────

create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text,
  target_score  smallint,
  exam_date     date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

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
  category        text not null,
  subcategory     text,
  difficulty      smallint not null check (difficulty between 1 and 5),
  question_text   text not null,
  answer_options  jsonb,
  correct_answer  text not null,
  explanation     text,
  source          text,
  created_at      timestamptz not null default now()
);

alter table public.problems enable row level security;

drop policy if exists "Problems are readable by authenticated users" on public.problems;
create policy "Problems are readable by authenticated users"
  on public.problems for select
  to authenticated
  using (true);


-- ── 3. SESSIONS ─────────────────────────────────────────────

do $$ begin
  create type public.session_mode as enum ('practice', 'deep_dive', 'simulation');
exception when duplicate_object then null;
end $$;

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

drop policy if exists "Users can manage their own sessions" on public.sessions;
create policy "Users can manage their own sessions"
  on public.sessions for all
  using (auth.uid() = user_id);


-- ── 4. ATTEMPTS ─────────────────────────────────────────────

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

drop policy if exists "Users can manage their own attempts" on public.attempts;
create policy "Users can manage their own attempts"
  on public.attempts for all
  using (auth.uid() = user_id);


-- ── 5. CATEGORY PROGRESS ────────────────────────────────────

create table if not exists public.category_progress (
  user_id          uuid not null references public.profiles (id) on delete cascade,
  category         text not null,
  total_attempted  integer not null default 0,
  total_correct    integer not null default 0,
  updated_at       timestamptz not null default now(),
  primary key (user_id, category)
);

alter table public.category_progress enable row level security;

drop policy if exists "Users can manage their own progress" on public.category_progress;
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

drop policy if exists "Memes are readable by authenticated users" on public.memes;
create policy "Memes are readable by authenticated users"
  on public.memes for select
  to authenticated
  using (true);
