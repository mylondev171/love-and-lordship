"""Write the redirects in vercel.json: every URL the old WordPress site exposed
(its wp-sitemap.xml) gets a 301 to the closest page on the new site.

- Old pages (/about/, /watch/, ...)            -> the matching new page
- /blog/<slug>/                                 -> served by the rewrite below (same path)
- /video_post/<slug>/ and /listen/<slug>/       -> the rehosted article with the same
  title if there is one, otherwise the library searched for that title
  (list saved in tools/old_site_media_pages.json from the old REST API)
- /category/..., /author/..., old PDFs, /feed   -> nearest equivalent

Re-run after changing the rules:  python tools/build_redirects.py
"""
import json, os, re
from urllib.parse import quote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STATIC = [
    ("/about", "/pages/about.html"),
    ("/contact", "/pages/contact.html"),
    ("/newsletter", "/#newsletter"),
    ("/read", "/pages/blog.html"),
    ("/watch", "/pages/library.html?fmt=Watch"),
    ("/listen-podcasts", "/pages/library.html?fmt=Listen"),
    ("/ministry-updates-events", "/pages/events.html"),
    ("/events", "/pages/events.html"),
    ("/the-authority-of-love", "/pages/the-authority-of-love.html"),
    ("/mentoring-minutes-4-16-21", "/pages/library.html?series=Mentoring%20Minutes"),
    ("/home", "/"),
    ("/author/:name", "/pages/about.html"),
    ("/category/video-on-top", "/pages/library.html?fmt=Watch"),
    ("/category/:path*", "/pages/blog.html"),
    ("/feed", "/pages/blog.html"),
    ("/comments/feed", "/pages/blog.html"),
    ("/wp-content/uploads/2019/09/LL-Privacy-Statement-092019.pdf", "/pages/privacy.html"),
    ("/wp-content/uploads/2019/09/LL-Terms-Of-Use-092019.pdf", "/pages/terms.html"),
]
# Catch-alls go last so the specific media pages below win.
TAIL = [
    ("/video_post/:slug", "/pages/library.html?fmt=Watch"),
    ("/listen/:slug", "/pages/library.html?fmt=Listen"),
]

STOP = {"the", "and", "for", "with", "pt", "part", "of", "to", "a", "an", "in", "on", "is"}


def norm(s):
    return re.sub(r"[^a-z0-9]+", " ", s.lower().replace("’", "'")).strip()


def search_terms(title):
    words = [w for w in norm(title).split() if len(w) > 2 and w not in STOP and not w.isdigit()]
    return " ".join(words[:5])


def load_js_array(path, var):
    src = open(path, encoding="utf8").read()
    start = src.index(f"window.{var}=")
    return json.loads(src[src.index("[", start):src.index(";\n", start)])


articles = {norm(a["t"]): a["slug"] for a in load_js_array(os.path.join(ROOT, "data", "articles.js"), "LL_ARTICLES")}
old_media = json.load(open(os.path.join(ROOT, "tools", "old_site_media_pages.json"), encoding="utf8"))

rules, seen = [], set()


def add(src, dst):
    if src not in seen:
        seen.add(src)
        rules.append({"source": src, "destination": dst, "statusCode": 301})


for s, d in STATIC:
    add(s, d)

stats = {"article": 0, "search": 0}
for o in old_media:
    slug = articles.get(norm(o["title"]))
    if slug:
        add(o["path"], f"/blog/{slug}")
        stats["article"] += 1
    else:
        fmt = "Watch" if o["type"] == "video_post" else "Listen"
        add(o["path"], f"/pages/library.html?fmt={fmt}&q={quote(search_terms(o['title']))}")
        stats["search"] += 1

for s, d in TAIL:
    add(s, d)

path = os.path.join(ROOT, "vercel.json")
cfg = json.load(open(path, encoding="utf8"))
cfg["redirects"] = rules
with open(path, "w", encoding="utf8", newline="\n") as f:
    json.dump(cfg, f, indent=2, ensure_ascii=False)
    f.write("\n")
print(f"{len(rules)} redirects ({stats['article']} media pages -> articles, {stats['search']} -> library search)")
