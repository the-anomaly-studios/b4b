alter table public.schools
  add column if not exists scorecard_id integer;

create unique index if not exists schools_scorecard_id_unique
  on public.schools (scorecard_id)
  where scorecard_id is not null;

alter table public.schools
  drop constraint if exists schools_name_key;

create index if not exists schools_name_idx
  on public.schools (name);
