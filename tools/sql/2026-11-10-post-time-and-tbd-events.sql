-- Love & Lordship: go-live time for scheduled posts + events with no date yet (TBD).
-- From Greg's 11-09 emails. Apply BEFORE deploying the matching code.

-- --------------------------------------------------------- post go-live time ---
-- Greg releases videos/podcasts after the 11:00-11:15 AM radio broadcast, so a post
-- can now hold until a chosen hour (Eastern) on its date. NULL = start of the day,
-- which is exactly how every post worked before this change.
alter table public.posts add column publish_hour smallint
  check (publish_hour is null or publish_hour between 0 and 23);

-- When a post may go live, as a real instant (DST-safe).
create or replace function private.post_go_live(d date, h smallint)
returns timestamptz
language sql
immutable
set search_path to ''
as $$
  select ((d::timestamp + make_interval(hours => coalesce(h, 0))) at time zone 'America/New_York');
$$;

create or replace function private.posts_apply_schedule()
returns trigger
language plpgsql
security definer
set search_path to ''
as $$
declare
  go_live timestamptz := private.post_go_live(new.published_on, new.publish_hour);
begin
  if new.status = 'published' and go_live > now() then
    new.status := 'scheduled';
  elsif new.status = 'scheduled' and go_live <= now() then
    new.status := 'published';
  end if;
  return new;
end;
$$;

-- Same hourly pg_cron job (:05), now honouring the hour.
create or replace function private.publish_due_posts()
returns void
language plpgsql
security definer
set search_path to ''
as $$
begin
  if exists (select 1 from public.posts
             where status = 'scheduled' and private.post_go_live(published_on, publish_hour) <= now()) then
    update public.posts set status = 'published'
      where status = 'scheduled' and private.post_go_live(published_on, publish_hour) <= now();
  end if;
end;
$$;

revoke all on function private.publish_due_posts() from public;

-- --------------------------------------------------------------- TBD events ---
-- A blank date means "TBD". The site lists these at the end of the upcoming events.
alter table public.events alter column starts_on drop not null;
alter table public.events add constraint events_end_needs_start
  check (starts_on is not null or ends_on is null);
