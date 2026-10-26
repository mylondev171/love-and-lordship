// Posts written in /admin (Supabase table public.posts) -> pages in dist/.
//
// Runs inside the Vercel build (tools/build-site.mjs), after the site has been
// copied to dist/ and before the JSX is precompiled. For every published post:
//   Read          -> dist/blog/<slug>.html   (same template as the rehosted articles)
//   Watch/Listen  -> dist/media/<slug>.html  (player + Greg's write-up)
// and the post is merged into dist/data/library.js, articles.js (Read only),
// featured.js and sitemap.xml, so it shows up everywhere the old content does.
//
// Publishing in /admin triggers a Vercel deploy hook (database trigger
// private.request_site_rebuild), so a new post is live about a minute later.
//
// Only dist/ is touched: the committed data files stay exactly as the Python
// tools wrote them, and the daily content refresh never sees these posts.
import fs from "node:fs";
import path from "node:path";

const SITE = "https://loveandlordship.com";
const PILLAR_LABEL = {
  lordship: "Love & Lordship", discipleship: "Discipleship", relationship: "Relationship",
  marriage: "Marriage", family: "Family", church: "Church", culture: "Culture",
};

function supabaseConfig(root) {
  const src = fs.readFileSync(path.join(root, "components", "supabase-config.js"), "utf8");
  const url = /url:\s*"([^"]+)"/.exec(src)?.[1];
  const key = /key:\s*"([^"]+)"/.exec(src)?.[1];
  return { url: process.env.LL_SUPABASE_URL || url, key: process.env.LL_SUPABASE_KEY || key };
}

async function fetchPosts(root) {
  const { url, key } = supabaseConfig(root);
  const q = "/rest/v1/posts?status=eq.published&select=*&order=published_on.desc,created_at.desc";
  const res = await fetch(url + q, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.json();
}

// ------------------------------------------------------------ sanitizing ---
// Bodies come from the admin editor (signed-in admins only), but they are still
// cut down to the handful of tags the article styles cover, so a paste from
// Word or a stray script can never reach the page.
const ALLOWED = new Set(["p", "br", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li", "blockquote", "h2", "h3"]);

const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function cleanHref(h) {
  const v = h.replace(/&amp;/g, "&").trim();
  if (/^(https?:|mailto:)/i.test(v) || v.startsWith("/")) return v;
  return null;
}

export function sanitize(html) {
  let s = String(html || "");
  s = s.replace(/<(script|style|iframe|object|embed|template|noscript)[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g, (tag, name, attrs) => {
    const n = name.toLowerCase();
    const closing = tag.startsWith("</");
    if (!ALLOWED.has(n)) return n === "div" ? (closing ? "</p>" : "<p>") : "";
    if (closing) return `</${n}>`;
    if (n === "a") {
      const m = /href\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs);
      const href = m && cleanHref(m[2] ?? m[3] ?? "");
      if (!href) return "<a>";
      const ext = /^https?:/i.test(href) && !href.startsWith(SITE);
      return `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
    }
    return n === "br" ? "<br>" : `<${n}>`;
  });
  // Text typed before the first paragraph (an older admin quirk) gets its own <p>.
  s = s.replace(/^((?:[^<]|<(?!\/?(?:p|ul|ol|li|blockquote|h2|h3)\b)[^>]*>)+)/, (m) => (m.trim() ? `<p>${m.trim()}</p>` : ""));
  s = s.replace(/<p>(\s|&nbsp;|<br>)*<\/p>/g, "");
  return s.trim();
}

const plain = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ")
  .replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

function excerpt(p, n) {
  const t = (p.summary && p.summary.trim()) || plain(p.body_html);
  return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t;
}

// ----------------------------------------------------------------- media ---
function youtubeId(u) {
  const m = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/.exec(u || "");
  return m ? m[1] : null;
}

async function podbeanEmbed(u) {
  try {
    const r = await fetch("https://api.podbean.com/v1/oembed?format=json&url=" + encodeURIComponent(u));
    if (!r.ok) return null;
    const j = await r.json();
    const src = /src="([^"]+)"/.exec(j.html || "")?.[1];
    return src && /^https:\/\/www\.podbean\.com\//.test(src) ? src : null;
  } catch { return null; }
}

async function mediaBlock(p) {
  if (p.format === "Watch") {
    const id = youtubeId(p.media_url);
    if (id) return `<div class="post-media video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${esc(p.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
  } else {
    const src = await podbeanEmbed(p.media_url);
    if (src) return `<div class="post-media audio"><iframe src="${esc(src)}" title="${esc(p.title)}" loading="lazy" height="150" scrolling="no"></iframe></div>`;
  }
  const label = p.format === "Watch" ? "Watch the video" : "Listen to the episode";
  return `<p class="post-media-link"><a class="btn btn-primary" href="${esc(p.media_url)}" target="_blank" rel="noopener noreferrer">${label}</a></p>`;
}

// -------------------------------------------------------------- template ---
const longDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
const shortDate = (d) => new Date(d + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const readMins = (h) => Math.max(1, Math.round(plain(h).split(" ").filter(Boolean).length / 220));

function page(p, { dir, body, media, mins, prev }) {
  const desc = excerpt(p, 180);
  const url = `${SITE}/${dir}/${p.slug}`;
  const kind = { Read: "Read", Watch: "Watch", Listen: "Listen" }[p.format];
  const pills = (p.pillars || []).filter((k) => PILLAR_LABEL[k])
    .map((k) => `<a class="article-pill" href="../pages/library.html?fmt=${kind}&amp;pillar=${k}">${esc(PILLAR_LABEL[k])}</a>`).join("");
  const meta = p.format === "Read" ? `<span>${mins} min read</span>` : `<span>${p.format === "Watch" ? "Video" : "Podcast"}</span>`;
  const image = p.image_url ? `<figure class="post-image"><img src="${esc(p.image_url)}" alt="" loading="lazy"></figure>` : "";
  const nav = prev
    ? `<nav class="article-nav"><a class="prev" href="./${prev.slug}.html"><span class="k">&larr; Previous</span><span class="t">${esc(prev.t)}</span></a><span class="spacer"></span></nav>`
    : "";
  const ld = JSON.stringify({
    "@context": "https://schema.org", "@type": p.format === "Read" ? "Article" : "CreativeWork",
    headline: p.title, datePublished: p.published_on, dateModified: (p.updated_at || "").slice(0, 10) || p.published_on,
    author: { "@type": "Person", name: "Greg Williams" },
    publisher: { "@type": "Organization", name: "Love & Lordship" },
    description: desc, mainEntityOfPage: url,
  }).replace(/</g, "\\u003c");
  const ogImage = p.image_url || (youtubeId(p.media_url) ? `https://i.ytimg.com/vi/${youtubeId(p.media_url)}/hqdefault.jpg` : `${SITE}/assets/images/og-image.jpg`);

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(p.title)} &mdash; Love &amp; Lordship</title>
  <meta name="description" content="${esc(desc)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(p.title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:site_name" content="Love &amp; Lordship" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32.png" />
  <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png" />
  <meta name="theme-color" content="#234090" />
  <meta property="article:published_time" content="${p.published_on}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..600;1,6..72,300..600&family=Manrope:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <link rel="stylesheet" href="../styles.css" />
  <link rel="stylesheet" href="../components/nav.css" />
  <link rel="stylesheet" href="../components/hero.css" />
  <link rel="stylesheet" href="../components/pillars.css" />
  <link rel="stylesheet" href="../components/book-media.css" />
  <link rel="stylesheet" href="../components/sections.css" />
  <link rel="stylesheet" href="../components/pages.css" />
  <link rel="stylesheet" href="../components/article.css" />

  <script type="application/ld+json">${ld}</script>
</head>
<body>
  <div id="nav-root"></div>

  <main class="page">
    <header class="page-header">
      <div class="wrap">
        <a class="back-link" href="../pages/library.html">Back to the library</a>
        <div class="eyebrow">${kind} &middot; ${esc(p.series || (p.format === "Read" ? "Articles" : p.format === "Watch" ? "Video" : "Podcast"))}</div>
        <h1>${esc(p.title)}</h1>
        <div class="article-meta">
          <time datetime="${p.published_on}">${longDate(p.published_on)}</time>
          <span class="dot"></span>
          ${meta}
          ${pills}
        </div>
      </div>
    </header>

    <div class="wrap"><div class="article-wrap">
      ${media}
      ${image}
      <article class="article-body">
${body}
      </article>
      ${nav}
    </div></div>
  </main>

  <div id="footer-root"></div>

  <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" integrity="sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" integrity="sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <script type="text/babel" src="../components/nav.jsx"></script>
  <script type="text/babel" src="../components/footer-events-app.jsx"></script>
  <script type="text/babel" src="../components/page-shell.jsx"></script>
  <script type="text/babel" src="../components/article-chrome.jsx"></script>
</body>
</html>
`;
}

// ---------------------------------------------------------- data merging ---
function readGlobal(file, name) {
  const src = fs.readFileSync(file, "utf8");
  const start = src.indexOf(`window.${name}=`);
  const from = start + `window.${name}=`.length;
  const end = src.indexOf(";\n", from);
  return { src, start, from, end, value: JSON.parse(src.slice(from, end)) };
}

function writeGlobal(file, g, value, pretty) {
  const json = pretty ? JSON.stringify(value, null, 1) : JSON.stringify(value);
  fs.writeFileSync(file, g.src.slice(0, g.from) + json + g.src.slice(g.end));
}

// Newest 5 per tab for the homepage, the same rules as tools/build_featured.py.
function featured(lib) {
  const thumbs = new Map(lib.filter((x) => x.f === "Watch" && x.th).map((x) => [x.t + "|" + x.d, x.th]));
  const out = {};
  for (const fmt of ["Watch", "Listen", "Read"]) {
    out[fmt.toLowerCase()] = lib.filter((x) => x.f === fmt).sort((a, b) => b.d.localeCompare(a.d)).slice(0, 5).map((x) => ({
      t: x.t === x.s ? `${x.t} — ${shortDate(x.d)}` : x.t,
      u: x.u, s: x.s || fmt, d: shortDate(x.d), th: x.th || thumbs.get(x.t + "|" + x.d) || "",
    }));
  }
  return out;
}

// ------------------------------------------------------------------ main ---
export async function buildPosts(root, dist) {
  let posts;
  try {
    posts = await fetchPosts(root);
  } catch (err) {
    // On Vercel a failed fetch fails the build, so the live site (with its
    // posts) stays up instead of being replaced by one missing them.
    if (process.env.VERCEL) throw err;
    console.warn("posts: skipped (" + err.message + ")");
    return;
  }
  if (!posts.length) { console.log("posts: none published"); return; }

  const libFile = path.join(dist, "data", "library.js");
  const artFile = path.join(dist, "data", "articles.js");
  const featFile = path.join(dist, "data", "featured.js");
  const lib = readGlobal(libFile, "LL_LIBRARY");
  const art = readGlobal(artFile, "LL_ARTICLES");
  const taken = new Set(art.value.map((a) => a.slug));

  const items = [], articles = [];
  for (const p of posts) {
    const dir = p.format === "Read" ? "blog" : "media";
    // A post can't replace one of the rehosted articles.
    if (dir === "blog" && taken.has(p.slug)) p.slug = p.slug + "-" + p.id.slice(0, 4);
    const body = sanitize(p.body_html);
    p.body_html = body; // excerpts below must come from the cleaned text
    const mins = readMins(body);
    const yt = p.format === "Watch" ? youtubeId(p.media_url) : null;
    items.push({
      i: "s" + p.id.replace(/-/g, "").slice(0, 12), f: p.format, t: p.title, d: p.published_on,
      u: `/${dir}/${p.slug}.html`, s: p.series || (p.format === "Read" ? "Article" : p.format === "Watch" ? "Video" : "Podcast"),
      x: excerpt(p, 220), ...(p.format === "Read" ? { m: `${mins} min read` } : {}),
      ...(p.image_url || yt ? { th: p.image_url || `https://i.ytimg.com/vi/${yt}/mqdefault.jpg` } : {}),
      p: (p.pillars || []).length ? p.pillars : ["lordship"],
    });
    if (p.format === "Read") articles.push({ slug: p.slug, t: p.title, d: p.published_on, m: mins, p: p.pillars || [], x: excerpt(p, 220) });
    p._dir = dir; p._body = body; p._mins = mins;
  }

  const allArticles = [...articles, ...art.value].sort((a, b) => b.d.localeCompare(a.d));
  fs.mkdirSync(path.join(dist, "media"), { recursive: true });
  for (const p of posts) {
    let prev = null;
    if (p._dir === "blog") {
      const at = allArticles.findIndex((a) => a.slug === p.slug);
      prev = allArticles[at + 1] || null;
    }
    const media = p._dir === "media" ? await mediaBlock(p) : "";
    fs.writeFileSync(path.join(dist, p._dir, p.slug + ".html"), page(p, { dir: p._dir, body: p._body, media, mins: p._mins, prev }));
  }

  const mergedLib = [...items, ...lib.value].sort((a, b) => b.d.localeCompare(a.d));
  writeGlobal(libFile, lib, mergedLib);
  writeGlobal(artFile, art, allArticles);
  const feat = readGlobal(featFile, "LL_FEATURED");
  writeGlobal(featFile, feat, featured(mergedLib), true);

  const smFile = path.join(dist, "sitemap.xml");
  const urls = posts.map((p) => `  <url><loc>${SITE}/${p._dir}/${p.slug}</loc><lastmod>${p.published_on}</lastmod><priority>0.6</priority></url>\n`).join("");
  fs.writeFileSync(smFile, fs.readFileSync(smFile, "utf8").replace("</urlset>", urls + "</urlset>"));

  console.log(`posts: ${posts.length} published (${articles.length} Read, ${posts.length - articles.length} Watch/Listen)`);
}
