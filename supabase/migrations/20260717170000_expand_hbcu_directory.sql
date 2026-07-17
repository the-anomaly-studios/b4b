alter table public.schools
  alter column abbreviation drop not null,
  alter column band_name drop not null,
  alter column primary_color drop not null;

alter table public.schools
  add column if not exists website_url text,
  add column if not exists scorecard_id integer,
  add column if not exists institution_type varchar(80),
  add column if not exists address text,
  add column if not exists city varchar(120),
  add column if not exists state varchar(2),
  add column if not exists has_marching_band boolean not null default false,
  add column if not exists band_source_url text,
  add column if not exists directory_source_url text,
  add column if not exists data_verified_at timestamptz;

create index if not exists schools_state_idx
  on public.schools (state);
create index if not exists schools_has_marching_band_idx
  on public.schools (has_marching_band);
create unique index if not exists schools_scorecard_id_unique
  on public.schools (scorecard_id)
  where scorecard_id is not null;

alter table public.schools
  drop constraint if exists schools_name_key;

create index if not exists schools_name_idx
  on public.schools (name);
