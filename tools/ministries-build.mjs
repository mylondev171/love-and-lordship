// Ministries managed in /admin (Supabase table public.ministries) -> the
// LL_MINISTRIES list shown at the top of pages/events.html.
//
// The list in components/footer-events-app.jsx is only the local-preview
// fallback: the production build swaps it for the rows in Supabase while
// compiling that file. Saving a ministry triggers a Vercel rebuild.
import { supabaseConfig } from "./posts-build.mjs";

const LIST = /const LL_MINISTRIES = \[[\s\S]*?\n\]\.map\(/;

// All three fields are rendered as text by the site.
export function toSiteMinistry(row) {
  return { name: row.name, desc: row.description || "", loc: row.location || "" };
}

export function injectMinistries(source, ministries) {
  if (!LIST.test(source)) throw new Error("ministries: LL_MINISTRIES list not found in footer-events-app.jsx");
  return source.replace(LIST, () => `const LL_MINISTRIES = ${JSON.stringify(ministries)}.map(`);
}

// Returns the site's ministries, or null to keep the fallback list (local builds only).
export async function fetchMinistries(root) {
  try {
    const { url, key } = supabaseConfig(root);
    const res = await fetch(url + "/rest/v1/ministries?select=*&order=sort_order.asc,created_at.asc", {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
    const rows = await res.json();
    console.log(`ministries: ${rows.length} from Supabase`);
    return rows.map(toSiteMinistry);
  } catch (err) {
    // On Vercel a failed fetch fails the build, so the live site keeps its list.
    if (process.env.VERCEL) throw err;
    console.warn("ministries: using the fallback list (" + err.message + ")");
    return null;
  }
}
