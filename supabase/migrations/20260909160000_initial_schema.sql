create extension if not exists "pgcrypto";

create type public.meal_type as enum ('breakfast', 'lunch', 'dinner', 'snack');
create type public.workout_type as enum ('run', 'strength', 'walk', 'rowing', 'cycling');
create type public.grocery_status as enum ('to_buy', 'bought', 'at_home');

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  first_name text not null default '',
  initial_weight_kg numeric(5,2) check (initial_weight_kg between 30 and 300),
  height_cm integer check (height_cm between 100 and 250),
  target_weight_kg numeric(5,2) check (target_weight_kg between 30 and 300),
  daily_step_goal integer not null default 10000 check (daily_step_goal > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, description text not null default '', portions integer not null default 1 check (portions > 0),
  prep_minutes integer not null default 0 check (prep_minutes >= 0), calories_per_portion integer check (calories_per_portion >= 0),
  protein_g numeric(6,1) check (protein_g >= 0), carbs_g numeric(6,1) check (carbs_g >= 0), fat_g numeric(6,1) check (fat_g >= 0),
  instructions text not null default '', created_at timestamptz not null default now()
);

create table public.ingredients (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, category text not null default 'Autres', created_at timestamptz not null default now(), unique(user_id, name)
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade, ingredient_id uuid not null references public.ingredients(id) on delete cascade,
  quantity numeric(8,2) not null check (quantity > 0), unit text not null, unique(recipe_id, ingredient_id)
);

create table public.meal_plan (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete restrict, planned_for date not null, meal_type public.meal_type not null,
  portions numeric(4,1) not null default 1 check (portions > 0), eaten boolean not null default false, created_at timestamptz not null default now(),
  unique(user_id, planned_for, meal_type)
);

create table public.grocery_items (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  ingredient_id uuid references public.ingredients(id) on delete set null, name text not null, category text not null default 'Autres',
  quantity numeric(8,2), unit text, status public.grocery_status not null default 'to_buy', week_start date not null, created_at timestamptz not null default now()
);

create table public.workouts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, workout_type public.workout_type not null, scheduled_for date not null, duration_minutes integer not null default 0 check (duration_minutes >= 0),
  notes text not null default '', created_at timestamptz not null default now()
);

create table public.workout_exercises (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade, exercise_name text not null, sets integer not null check (sets > 0),
  reps integer not null check (reps > 0), weight_kg numeric(6,2) check (weight_kg >= 0), rest_seconds integer check (rest_seconds >= 0), position integer not null default 0
);

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  workout_id uuid not null references public.workouts(id) on delete cascade, performed_on date not null, completed boolean not null default false,
  notes text not null default '', created_at timestamptz not null default now(), unique(user_id, workout_id, performed_on)
);

create table public.exercise_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade, workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number integer not null check (set_number > 0), reps integer check (reps >= 0), weight_kg numeric(6,2) check (weight_kg >= 0), completed boolean not null default false,
  unique(workout_log_id, workout_exercise_id, set_number)
);

create table public.weight_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  logged_on date not null, weight_kg numeric(5,2) not null check (weight_kg between 30 and 300), created_at timestamptz not null default now(),
  unique(user_id, logged_on)
);

create table public.waist_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  logged_on date not null, waist_cm numeric(5,1) not null check (waist_cm between 30 and 250), created_at timestamptz not null default now(),
  unique(user_id, logged_on)
);

create table public.daily_logs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  logged_on date not null, steps integer not null default 0 check (steps between 0 and 200000), step_goal_reached boolean not null default false,
  notes text not null default '', created_at timestamptz not null default now(), unique(user_id, logged_on)
);

create index meal_plan_user_date_idx on public.meal_plan(user_id, planned_for);
create index workouts_user_date_idx on public.workouts(user_id, scheduled_for);
create index weight_logs_user_date_idx on public.weight_logs(user_id, logged_on desc);
create index daily_logs_user_date_idx on public.daily_logs(user_id, logged_on desc);

create function public.set_step_goal_reached() returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.step_goal_reached := new.steps >= coalesce((select daily_step_goal from public.profiles where user_id = new.user_id), 10000);
  return new;
end;
$$;
create trigger daily_logs_step_goal before insert or update of steps on public.daily_logs for each row execute function public.set_step_goal_reached();

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles','recipes','ingredients','recipe_ingredients','meal_plan','grocery_items','workouts','workout_exercises','workout_logs','exercise_logs','weight_logs','waist_logs','daily_logs'] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('create policy "Users manage own %1$s" on public.%1$I for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id)', table_name);
  end loop;
end $$;

create function public.create_profile_for_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, first_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'first_name', ''));
  return new;
end;
$$;
create trigger auth_user_created after insert on auth.users for each row execute function public.create_profile_for_new_user();
