create extension if not exists "pgcrypto";

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name varchar(180) not null unique,
  abbreviation varchar(16) not null,
  slug varchar(180) not null unique,
  band_name varchar(180) not null,
  description text,
  location varchar(180),
  conference varchar(32),
  logo_url text,
  primary_color varchar(32) not null,
  secondary_color varchar(32),
  total_score integer not null default 0 check (total_score >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists schools_total_score_idx
  on public.schools (total_score desc);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username varchar(40) not null unique
    check (username ~ '^[a-zA-Z0-9_]{3,40}$'),
  avatar_url text,
  school_id uuid references public.schools (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_school_id_idx
  on public.profiles (school_id);

alter table public.schools enable row level security;
alter table public.profiles enable row level security;

create policy "Schools are publicly readable"
  on public.schools
  for select
  to anon, authenticated
  using (true);

create policy "Profiles are publicly readable"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

create policy "Members can insert their own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Members can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  requested_username text;
  profile_username text;
begin
  requested_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    split_part(new.email, '@', 1),
    'member'
  );

  requested_username := regexp_replace(
    requested_username,
    '[^a-zA-Z0-9_]',
    '_',
    'g'
  );

  requested_username := left(requested_username, 40);
  if length(requested_username) < 3 then
    requested_username := 'member';
  end if;

  profile_username := requested_username;
  if exists (
    select 1
    from public.profiles
    where username = profile_username
  ) then
    profile_username :=
      left(requested_username, 31) || '_' ||
      left(replace(new.id::text, '-', ''), 8);
  end if;

  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    profile_username,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

insert into public.schools (
  id,
  name,
  abbreviation,
  slug,
  band_name,
  description,
  location,
  conference,
  primary_color,
  secondary_color,
  total_score
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Florida A&M University',
    'FAMU',
    'florida-a-and-m',
    'The Marching 100',
    'Known for precision, power, and a standard of musicianship that has influenced generations of marching bands.',
    'Tallahassee, Florida',
    'SWAC',
    '#F47721',
    '#007A33',
    28470
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Jackson State University',
    'JSU',
    'jackson-state',
    'Sonic Boom of the South',
    'A high-impact sound and unmistakable visual style make the Sonic Boom one of the most recognized bands in the nation.',
    'Jackson, Mississippi',
    'SWAC',
    '#002147',
    '#FFFFFF',
    27310
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'North Carolina A&T State University',
    'NCAT',
    'north-carolina-a-and-t',
    'Blue and Gold Marching Machine',
    'The Blue and Gold Marching Machine pairs musical range with crowd-moving arrangements and polished field design.',
    'Greensboro, North Carolina',
    'CAA',
    '#004684',
    '#FDB927',
    25880
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    'Southern University',
    'SU',
    'southern-university',
    'Human Jukebox',
    'The Human Jukebox is celebrated for a massive symphonic sound, sharp drill, and arrangements built for the stadium.',
    'Baton Rouge, Louisiana',
    'SWAC',
    '#5B2C83',
    '#F9C80E',
    24920
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    'Bethune-Cookman University',
    'BCU',
    'bethune-cookman',
    'Marching Wildcats',
    'A theatrical, high-energy program whose performances connect precision marching with contemporary showmanship.',
    'Daytona Beach, Florida',
    'SWAC',
    '#6A1B2D',
    '#F4C430',
    21840
  ),
  (
    '10000000-0000-4000-8000-000000000006',
    'Tennessee State University',
    'TSU',
    'tennessee-state',
    'Aristocrat of Bands',
    'The Grammy-winning Aristocrat of Bands carries a legacy of innovation from the field to the recording studio.',
    'Nashville, Tennessee',
    'OVC',
    '#00539F',
    '#FFFFFF',
    20560
  )
on conflict (id) do update set
  name = excluded.name,
  abbreviation = excluded.abbreviation,
  slug = excluded.slug,
  band_name = excluded.band_name,
  description = excluded.description,
  location = excluded.location,
  conference = excluded.conference,
  primary_color = excluded.primary_color,
  secondary_color = excluded.secondary_color,
  total_score = excluded.total_score,
  updated_at = now();
