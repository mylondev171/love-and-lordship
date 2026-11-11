-- Love & Lordship: "Ministries We Support" at the top of the Events page.
-- Greg adds, edits, removes and reorders them in /admin (Ministries tab).
-- Apply BEFORE deploying the matching code: the build reads public.ministries.

create table public.ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  description text not null default '',
  location text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ministries enable row level security;
create policy "anyone can read ministries" on public.ministries for select using (true);
create policy "admins can add ministries" on public.ministries for insert to authenticated with check (public.is_admin());
create policy "admins can edit ministries" on public.ministries for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins can delete ministries" on public.ministries for delete to authenticated using (public.is_admin());

create trigger ministries_touch before update on public.ministries
  for each row execute function public.touch_updated_at();

-- Saving a ministry redeploys the site, like events and posts.
create trigger ministries_rebuild_site
  after insert or delete or update on public.ministries
  for each statement execute function private.request_site_rebuild();
