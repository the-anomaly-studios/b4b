create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  title varchar(180) not null,
  slug varchar(220) not null unique,
  description text,
  mux_upload_id varchar(120) unique,
  mux_asset_id varchar(120) unique,
  mux_playback_id varchar(120),
  thumbnail_url text,
  status varchar(32) not null default 'waiting_for_upload'
    check (
      status in (
        'waiting_for_upload',
        'uploading',
        'processing',
        'ready',
        'errored'
      )
    ),
  error_message text,
  uploader_id uuid not null references public.profiles (id) on delete cascade,
  school_id uuid not null references public.schools (id) on delete restrict,
  upvote_count integer not null default 0 check (upvote_count >= 0),
  recorded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists videos_school_id_idx
  on public.videos (school_id);
create index if not exists videos_uploader_id_idx
  on public.videos (uploader_id);
create index if not exists videos_created_at_idx
  on public.videos (created_at desc);
create index if not exists videos_upvote_count_idx
  on public.videos (upvote_count desc);
create index if not exists videos_status_idx
  on public.videos (status);

alter table public.videos enable row level security;

create policy "Ready videos and owned uploads are readable"
  on public.videos
  for select
  to anon, authenticated
  using (
    status = 'ready'
    or (select auth.uid()) = uploader_id
  );

create policy "Members can create their own uploads"
  on public.videos
  for insert
  to authenticated
  with check ((select auth.uid()) = uploader_id);

create policy "Members can delete their own uploads"
  on public.videos
  for delete
  to authenticated
  using ((select auth.uid()) = uploader_id);
