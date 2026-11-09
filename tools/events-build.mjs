// Events managed in /admin (Supabase table public.events) -> the LL_EVENTS list
// that the homepage and pages/events.html read.
//
// The list in components/footer-events-app.jsx is only the local-preview
// fallback: the production build swaps it for the rows in Supabase while
// compiling that file. Saving an event triggers a Vercel rebuild.
import { supabaseConfig } from "./posts-build.mjs";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const LIST = /const LL_EVENTS = \[[\s\S]*?\n\]\.map\(/;

// "Nov 7", "May 29–31", or "Sep 30 – Oct 2".
export function dateLabel(start, end) {
  const [, sm, sd] = start.split("-").map(Number);
  const from = `${MONTHS[sm - 1]} ${sd}`;
  if (!end || end === start) return from;
  const [, em, ed] = end.split("-").map(Number);
  return sm === em ? `${from}–${ed}` : `${from} – ${MONTHS[em - 1]} ${ed}`;
}

// `name` is rendered as HTML by the site; `loc` is rendered as text.
const escName = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function toSiteEvent(row) {
  return {
    on: row.starts_on,
    date: dateLabel(row.starts_on, row.ends_on),
    name: escName(row.name),
    loc: row.location,
    type: row.type,
    ...(row.featured ? { featured: true } : {}),
  };
}

export function injectEvents(source, events) {
  if (!LIST.test(source)) throw new Error("events: LL_EVENTS list not found in footer-events-app.jsx");
  return source.replace(LIST, () => `const LL_EVENTS = ${JSON.stringify(events)}.map(`);
}

// Returns the site's events, or null to keep the fallback list (local builds only).
export async function fetchEvents(root) {
  try {
    const { url, key } = supabaseConfig(root);
    const res = await fetch(url + "/rest/v1/events?select=*&order=starts_on.asc,created_at.asc", {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
    const rows = await res.json();
    console.log(`events: ${rows.length} from Supabase`);
    return rows.map(toSiteEvent);
  } catch (err) {
    // On Vercel a failed fetch fails the build, so the live site keeps its events.
    if (process.env.VERCEL) throw err;
    console.warn("events: using the fallback list (" + err.message + ")");
    return null;
  }
}
