"""Write sitemap.xml and robots.txt at the site root.

Lists the homepage, every page under pages/, and every rehosted article (at its
canonical /blog/<slug> URL, with the article's publish date). Re-run after
adding pages or rebuilding the articles:

    python tools/build_sitemap.py
"""
import glob, json, os, datetime

PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://loveandlordship.com"
TODAY = datetime.date.today().isoformat()

urls = [(f"{SITE}/", TODAY, "1.0")]
for p in sorted(glob.glob(os.path.join(PROJ, "pages", "*.html"))):
    name = os.path.basename(p)
    urls.append((f"{SITE}/pages/{name}", TODAY, "0.8"))

src = open(os.path.join(PROJ, "data", "articles.js"), encoding="utf8").read()
articles = json.loads(src[src.index("["):src.rindex("]") + 1])
for a in articles:
    slug = a.get("slug") or a["u"].rstrip("/").split("/")[-1].removesuffix(".html")
    urls.append((f"{SITE}/blog/{slug}", a.get("d") or TODAY, "0.6"))

with open(os.path.join(PROJ, "sitemap.xml"), "w", encoding="utf8", newline="\n") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for loc, mod, pri in urls:
        f.write(f"  <url><loc>{loc}</loc><lastmod>{mod}</lastmod><priority>{pri}</priority></url>\n")
    f.write("</urlset>\n")

with open(os.path.join(PROJ, "robots.txt"), "w", encoding="utf8", newline="\n") as f:
    f.write(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n")

print(f"sitemap.xml: {len(urls)} URLs ({len(articles)} articles)")
