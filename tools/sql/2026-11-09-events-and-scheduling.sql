-- Love & Lordship: scheduled posts + admin-managed events.
-- Apply BEFORE deploying the matching code: the build reads public.events.

-- ---------------------------------------------------------- scheduled posts ---
-- A post published with a future date is held as 'scheduled' and goes live on
-- that date (Eastern time, Greg is in Kentucky). Enforced here, not in the admin
-- page, so no client can publish early. The site build and the public read policy
-- both only see status = 'published', so scheduled posts stay off the site.
alter table public.posts drop constraint posts_status_check;
alter table public.posts add constraint posts_status_check
  check (status = any (array['published'::text, 'draft'::text, 'scheduled'::text]));

create or replace function private.posts_apply_schedule()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
declare
  today date := (now() at time zone 'America/New_York')::date;
begin
  if new.status = 'published' and new.published_on > today then
    new.status := 'scheduled';
  elsif new.status = 'scheduled' and new.published_on <= today then
    new.status := 'published';
  end if;
  return new;
end;
$$;

create trigger posts_apply_schedule
  before insert or update on public.posts
  for each row execute function private.posts_apply_schedule();

-- posts_rebuild_site is a statement trigger: it fires even when an UPDATE touches
-- no rows. The exists() guard stops the hourly job from deploying the site hourly.
create or replace function private.publish_due_posts()
returns void
language plpgsql
security definer
set search_path to ''
as $$
declare
  today date := (now() at time zone 'America/New_York')::date;
begin
  if exists (select 1 from public.posts where status = 'scheduled' and published_on <= today) then
    update public.posts set status = 'published' where status = 'scheduled' and published_on <= today;
  end if;
end;
$$;

revoke all on function private.publish_due_posts() from public;

create extension if not exists pg_cron;
select cron.schedule('publish-scheduled-posts', '5 * * * *', 'select private.publish_due_posts()');

-- ------------------------------------------------------------------- events ---
create table public.events (
  id uuid primary key default gen_random_uuid(),
  starts_on date not null,
  ends_on date,
  name text not null check (length(trim(name)) > 0),
  location text not null default '',
  type text not null check (type = any (array['Men''s event'::text, 'Retreat'::text, 'Church service'::text, 'Partner event'::text, 'Broadcast'::text])),
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_on is null or ends_on >= starts_on)
);

alter table public.events enable row level security;
create policy "anyone can read events" on public.events for select using (true);
create policy "admins can add events" on public.events for insert to authenticated with check (public.is_admin());
create policy "admins can edit events" on public.events for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins can delete events" on public.events for delete to authenticated using (public.is_admin());

create trigger events_touch before update on public.events
  for each row execute function public.touch_updated_at();

-- The current 2026 schedule, copied from components/footer-events-app.jsx.
insert into public.events (starts_on, ends_on, name, location, type, featured) values
  ('2026-01-24', null, 'Super Saturday for Men', 'The Mission Church · Lexington, KY', 'Men''s event', false),
  ('2026-01-31', null, 'Saturday Morning Men''s Group', 'NECC · Lexington, KY', 'Men''s event', false),
  ('2026-02-07', null, 'IronMan', 'Russ Young''s · Lexington, KY', 'Men''s event', false),
  ('2026-02-17', null, 'Celebrate Recovery', 'Jessamine Christian Church · Nicholasville, KY', 'Partner event', false),
  ('2026-02-27', null, 'KY''s Voice — live 11 AM on WGTK 970 AM; replays 4 & 8 PM on WBNA 21', 'Louisville, KY', 'Broadcast', false),
  ('2026-04-18', null, 'Saturday Morning Men''s Group', 'NECC · Lexington, KY', 'Men''s event', false),
  ('2026-04-25', null, 'America Reads the Bible — Scripture reading', 'Museum of the Bible · Washington, DC', 'Partner event', false),
  ('2026-05-02', null, 'IronMan', 'Russ Young''s · Lexington, KY', 'Men''s event', false),
  ('2026-05-12', null, 'Celebrate Recovery', 'Jessamine Christian Church · Nicholasville, KY', 'Partner event', false),
  ('2026-05-29', '2026-05-31', 'Colson Fellows Conference & Commissioning', 'Knoxville, TN', 'Partner event', false),
  ('2026-07-25', null, 'Saturday Morning Men''s Group', 'NECC · Lexington, KY', 'Men''s event', false),
  ('2026-07-26', null, 'Greg preaching', 'Peyton''s Lick Christian Church · Mt Sterling, KY', 'Church service', false),
  ('2026-08-01', null, 'IronMan', 'Russ Young''s · Lexington, KY', 'Men''s event', false),
  ('2026-08-18', null, 'Celebrate Recovery', 'Jessamine Christian Church · Nicholasville, KY', 'Partner event', false),
  ('2026-09-18', '2026-09-20', 'Men''s Retreat', 'Camp Loucon · Leitchfield, KY', 'Retreat', true),
  ('2026-09-25', '2026-09-26', 'Communion 250 service', 'Renfro Valley · Mt Vernon, KY', 'Church service', false),
  ('2026-10-02', null, 'Upper Room Men — speaking', 'Southeast Christian Church · Louisville, KY', 'Men''s event', false),
  ('2026-10-05', null, 'KY Right to Life Golf Scramble', 'Shelbyville Country Club · Shelbyville, KY', 'Partner event', false),
  ('2026-10-17', null, 'Saturday Morning Men''s Group', 'NECC · Lexington, KY', 'Men''s event', false),
  ('2026-10-24', null, '4th Annual KY Family Forum — leadership role', 'Embassy Suites · Lexington, KY', 'Partner event', false),
  ('2026-11-07', null, 'IronMan', 'Russ Young''s · Lexington, KY', 'Men''s event', false),
  ('2026-11-10', null, 'Celebrate Recovery', 'Jessamine Christian Church · Nicholasville, KY', 'Partner event', false),
  ('2026-11-15', null, 'Ministry sharing event', 'The Mission Church · Lexington, KY', 'Church service', false);

-- Added last so seeding the table doesn't start a deploy.
create trigger events_rebuild_site
  after insert or delete or update on public.events
  for each statement execute function private.request_site_rebuild();
