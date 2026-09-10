"""Rehost the 332 old-site blog posts on the new site.

loveandlordship.com is being retired, so the Read half of the library can no
longer link out to it. This turns tools/wp_archive.json into static pages under
blog/<slug>.html, keeping the ORIGINAL URL path so existing inbound links and
Google's index still resolve once DNS moves.

Content is written straight into the HTML rather than rendered by React, so
crawlers and no-JS readers get the article. Only the nav and footer chrome
mounts client-side, the same components every other page uses.

  python tools/build_articles.py
"""
import json, io, os, re, html, datetime, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARCHIVE = os.path.join(ROOT, "tools", "wp_archive.json")
OUTDIR = os.path.join(ROOT, "blog")

# Images that no longer resolve on the old site (already 404 before takedown).
DEAD_IMAGES = {"Race-Baiters-Booker-T.-Washington-1024x512.jpg",
               "fundraising-thermometer"}  # 2020 campaign widget, long finished
# Images pulled down into assets/images/blog/.
LOCAL_IMAGES = {"Truth-Chart.png"}

posts = json.load(io.open(ARCHIVE, encoding="utf-8"))
SLUGS = {p["slug"] for p in posts}

# ---------------------------------------------------------------- pillars ---
# data/library.js already classified every Read item into the seven priorities.
# Reuse that rather than re-running the classifier, so the article pages and
# the library agree.
lib_src = io.open(os.path.join(ROOT, "data", "library.js"), encoding="utf-8").read()
lib = json.loads(lib_src[lib_src.index("["):lib_src.rindex("]") + 1])
def slug_of(url):
    """Slug from either the old absolute URL or the rewritten /blog/x.html one."""
    m = re.search(r"/blog/([^/?#]+?)(?:\.html)?/?$", url or "")
    return m.group(1) if m else None


PILLAR_BY_SLUG, LIB_BY_SLUG = {}, {}
for it in lib:
    if it.get("f") != "Read":
        continue
    sl = slug_of(it.get("u", ""))
    if sl:
        PILLAR_BY_SLUG[sl] = it.get("p", [])
        LIB_BY_SLUG[sl] = it

PILLAR_LABEL = {
    "lordship": "Love & Lordship", "discipleship": "Discipleship",
    "relationship": "Relationship", "marriage": "Marriage",
    "family": "Family", "church": "Church", "culture": "Culture",
}

# ------------------------------------------------------------ link fixing ---
OLD_HOSTS = r"(?:www\.)?loveandlord?ship\.com"   # covers the loveandlorship typo


def clean_html(raw, slug):
    s = raw

    # A stray "mailto:http://..." in one post — make it a real link.
    s = re.sub(r'href="mailto:(https?://[^"]+)"', r'href="\1"', s)

    # Internal blog links -> keep the same path on the new site.
    def internal(m):
        target = m.group(1)
        return f'href="/blog/{target}/"' if target in SLUGS else f'href="/pages/library.html"'
    s = re.sub(rf'href="https?://{OLD_HOSTS}/blog/([^/"?#]+)/?"', internal, s)

    # Bare old-domain links -> new site home.
    s = re.sub(rf'href="https?://{OLD_HOSTS}/?"', 'href="/"', s)

    # Scripture links are the bulk of the outbound links; force https.
    s = s.replace('http://www.biblegateway.com', 'https://www.biblegateway.com')
    s = s.replace('http://classic.biblegateway.com', 'https://classic.biblegateway.com')

    # Images: relocate the one we saved, drop the ones that are already dead.
    for name in DEAD_IMAGES:
        s = re.sub(rf'<img[^>]*{re.escape(name)}[^>]*>', '', s)
    for name in LOCAL_IMAGES:
        s = re.sub(rf'src="[^"]*{re.escape(name)}"', f'src="/assets/images/blog/{name}"', s)
    # srcset/sizes still list the old domain, which would 404 on wide screens
    # once it is taken down. The local copy is the full-size original, so the
    # responsive variants add nothing.
    s = re.sub(r'\s+(?:srcset|sizes)="[^"]*"', '', s)
    # Normalise lazy-loading rather than stacking a second attribute on the
    # posts that already carry one.
    s = re.sub(r'\s+loading="[^"]*"', '', s)
    s = s.replace('<img ', '<img loading="lazy" ')

    # External links open in a new tab; internal ones stay put.
    def anchor(m):
        tag, href = m.group(0), m.group(1)
        if href.startswith(("/", "#", "mailto:")) or "target=" in tag:
            return tag
        return tag[:-1] + ' target="_blank" rel="noopener noreferrer">'
    s = re.sub(r'<a [^>]*href="([^"]+)"[^>]*>', anchor, s)

    # WordPress leaves runs of blank lines between blocks.
    s = re.sub(r"\n{3,}", "\n\n", s).strip()
    return s


def read_time(h_):
    words = len(re.sub(r"<[^>]+>", " ", h_).split())
    return max(1, round(words / 220))


def esc(t):
    return html.escape(t, quote=True)


posts.sort(key=lambda p: p["date"], reverse=True)
for i, p in enumerate(posts):
    p["_html"] = clean_html(p["html"], p["slug"])
    p["_mins"] = read_time(p["_html"])
    p["_pillars"] = PILLAR_BY_SLUG.get(p["slug"], [])
    p["_prev"] = posts[i + 1] if i + 1 < len(posts) else None   # older
    p["_next"] = posts[i - 1] if i > 0 else None                # newer

print(f"prepared {len(posts)} posts")

# ------------------------------------------------------------- templating ---
HEAD = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title} &mdash; Love &amp; Lordship</title>
  <meta name="description" content="{desc}" />
  <link rel="canonical" href="https://loveandlordship.com/blog/{slug}/" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="article:published_time" content="{date}" />

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

  <script type="application/ld+json">{ld}</script>
</head>
<body>
  <div id="nav-root"></div>

  <main class="page">
    <header class="page-header">
      <div class="wrap">
        <a class="back-link" href="../pages/library.html">Back to the library</a>
        <div class="eyebrow">Read &middot; {series}</div>
        <h1>{title}</h1>
        <div class="article-meta">
          <time datetime="{date}">{datelong}</time>
          <span class="dot"></span>
          <span>{mins} min read</span>
          {pills}
        </div>
      </div>
    </header>

    <div class="wrap"><div class="article-wrap">
      <article class="article-body">
{body}
      </article>
      {nav}
    </div></div>
  </main>

  <div id="footer-root"></div>

  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <script type="text/babel" src="../components/nav.jsx"></script>
  <script type="text/babel" src="../components/footer-events-app.jsx"></script>
  <script type="text/babel" src="../components/page-shell.jsx"></script>
  <script type="text/babel" src="../components/article-chrome.jsx"></script>
</body>
</html>
"""


def build_page(p):
    desc = (p["excerpt"] or re.sub(r"<[^>]+>", " ", p["_html"]))[:180]
    desc = re.sub(r"\s+", " ", html.unescape(desc)).strip()
    d = datetime.date.fromisoformat(p["date"])
    pills = "".join(
        f'<a class="article-pill" href="../pages/library.html#{k}">{esc(PILLAR_LABEL[k])}</a>'
        for k in p["_pillars"] if k in PILLAR_LABEL)
    series = (LIB_BY_SLUG.get(p["slug"], {}) or {}).get("s") or "Articles"

    parts = []
    if p["_prev"]:
        parts.append(f'<a class="prev" href="./{p["_prev"]["slug"]}.html">'
                     f'<span class="k">&larr; Previous</span>'
                     f'<span class="t">{esc(p["_prev"]["title"])}</span></a>')
    else:
        parts.append('<span class="spacer"></span>')
    if p["_next"]:
        parts.append(f'<a class="next" href="./{p["_next"]["slug"]}.html">'
                     f'<span class="k">Next &rarr;</span>'
                     f'<span class="t">{esc(p["_next"]["title"])}</span></a>')
    else:
        parts.append('<span class="spacer"></span>')
    nav = '<nav class="article-nav">' + "".join(parts) + "</nav>"

    ld = json.dumps({
        "@context": "https://schema.org", "@type": "Article",
        "headline": p["title"], "datePublished": p["date"],
        "dateModified": p["modified"] or p["date"],
        "author": {"@type": "Person", "name": "Greg Williams"},
        "publisher": {"@type": "Organization", "name": "Love & Lordship"},
        "description": desc,
        "mainEntityOfPage": f"https://loveandlordship.com/blog/{p['slug']}/",
    }, ensure_ascii=False)

    return HEAD.format(
        title=esc(p["title"]), desc=esc(desc), slug=p["slug"], date=p["date"],
        datelong=d.strftime("%B %-d, %Y") if os.name != "nt" else d.strftime("%B %d, %Y").replace(" 0", " "),
        mins=p["_mins"], pills=pills, series=esc(series),
        body=p["_html"], nav=nav, ld=ld)


if os.path.isdir(OUTDIR):
    shutil.rmtree(OUTDIR)
os.makedirs(OUTDIR)
for p in posts:
    io.open(os.path.join(OUTDIR, p["slug"] + ".html"), "w", encoding="utf-8", newline="\n").write(build_page(p))
print(f"wrote {len(posts)} pages -> blog/")

# ------------------------------------------------- index for the list page ---
index = [{
    "slug": p["slug"], "t": p["title"], "d": p["date"], "m": p["_mins"],
    "p": p["_pillars"],
    "x": re.sub(r"\s+", " ", html.unescape(
        p["excerpt"] or re.sub(r"<[^>]+>", " ", p["_html"])))[:220].strip(),
} for p in posts]
io.open(os.path.join(ROOT, "data", "articles.js"), "w", encoding="utf-8", newline="\n").write(
    "// Generated by tools/build_articles.py from the retired loveandlordship.com WordPress site.\n"
    "// Fields: slug t=title d=date m=read-minutes p=pillars x=excerpt\n"
    "window.LL_ARTICLES=" + json.dumps(index, ensure_ascii=False, separators=(",", ":")) + ";\n")
print(f"wrote data/articles.js ({len(index)} entries)")

# ------------------------------------ repoint the library's Read links home ---
lib_out = lib_src
n = 0
for it in lib:
    if it.get("f") != "Read":
        continue
    sl = slug_of(it.get("u", ""))
    if sl and sl in SLUGS and not it["u"].startswith("/blog/"):
        lib_out = lib_out.replace('"u":"%s"' % it["u"], '"u":"/blog/%s.html"' % sl)
        n += 1
io.open(os.path.join(ROOT, "data", "library.js"), "w", encoding="utf-8", newline="\n").write(lib_out)
print(f"repointed {n} library Read links to /blog/")
