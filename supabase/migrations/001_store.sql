create table public.apps (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  summary_vi text not null default '',
  summary_en text not null default '',
  description_vi text not null default '',
  description_en text not null default '',
  privacy_policy_vi text not null default '',
  privacy_policy_en text not null default '',
  play_store_url text,
  icon_path text,
  apk_path text,
  apk_version text,
  policy_updated_on date not null default current_date,
  is_published boolean not null default false,
  is_home_policy boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index apps_one_home_policy
  on public.apps (is_home_policy)
  where is_home_policy;

create table public.app_screenshots (
  id uuid primary key default gen_random_uuid(),
  app_id uuid not null references public.apps (id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0
);

alter table public.apps enable row level security;
alter table public.app_screenshots enable row level security;

create policy "Public can read published apps"
  on public.apps
  for select
  to anon, authenticated
  using (is_published);

create policy "Public can read screenshots of published apps"
  on public.app_screenshots
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.apps
      where apps.id = app_screenshots.app_id
        and apps.is_published
    )
  );

grant select on public.apps to anon, authenticated;
grant select on public.app_screenshots to anon, authenticated;

insert into storage.buckets (id, name, public)
values
  ('app-media', 'app-media', true),
  ('app-apks', 'app-apks', true)
on conflict (id) do nothing;

create policy "Public can read app media"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'app-media');

create policy "Public can read app apks"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'app-apks');
