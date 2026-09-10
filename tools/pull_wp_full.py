"""Archive every post from the old WordPress site with its full rendered HTML.

pull_wp.py only kept a 3000-char plain-text snippet, which was fine for the
library index but not enough to rehost the articles. The old site is being
taken down, so this grabs the complete content, the media it references and
the category/tag names, and writes tools/wp_archive.json.
"""
import json, urllib.request, ssl, re, html, sys, time

BASE = "https://loveandlordship.com/wp-json/wp/v2"
UA = {"User-Agent": "Mozilla/5.0"}
ctx = ssl.create_default_context()


def get(url, tries=3):
    for n in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, context=ctx, timeout=90) as r:
                return json.loads(r.read().decode("utf-8", "replace"))
        except Exception as e:
            if n == tries - 1:
                print("  FAILED", url[:90], e)
                return None
            time.sleep(2 * (n + 1))


def taxonomy(kind):
    """id -> name for categories or tags."""
    out, page = {}, 1
    while True:
        d = get(f"{BASE}/{kind}?per_page=100&page={page}&_fields=id,name,slug")
        if not d:
            break
        for t in d:
            out[t["id"]] = t["name"]
        if len(d) < 100:
            break
        page += 1
    return out


cats = taxonomy("categories")
tags = taxonomy("tags")
print(f"taxonomies: {len(cats)} categories, {len(tags)} tags")

posts, page = [], 1
while True:
    d = get(f"{BASE}/posts?per_page=100&page={page}&_fields="
            "id,slug,date,modified,link,title,excerpt,content,categories,tags,featured_media,author")
    if not d:
        break
    posts.extend(d)
    print(f"  page {page}: {len(d)} posts (running total {len(posts)})")
    if len(d) < 100:
        break
    page += 1

media_ids = sorted({p["featured_media"] for p in posts if p.get("featured_media")})
media = {}
for mid in media_ids:
    m = get(f"{BASE}/media/{mid}?_fields=id,source_url,alt_text,media_details")
    if m:
        media[mid] = {"url": m.get("source_url"), "alt": m.get("alt_text", "")}
print(f"featured media resolved: {len(media)}/{len(media_ids)}")

recs = []
for p in posts:
    c = p["content"]["rendered"]
    recs.append({
        "id": p["id"],
        "slug": p["slug"],
        "date": p["date"][:10],
        "modified": p.get("modified", "")[:10],
        "url": p["link"],
        "title": html.unescape(p["title"]["rendered"]),
        "excerpt": html.unescape(re.sub(r"<[^>]+>", "", p["excerpt"]["rendered"])).strip(),
        "html": c,
        "images": sorted(set(re.findall(r'<img[^>]+src="([^"]+)"', c))),
        "links": sorted(set(re.findall(r'<a[^>]+href="([^"]+)"', c))),
        "youtube": sorted(set(re.findall(r"(?:youtube\.com/(?:embed/|watch\?v=)|youtu\.be/)([\w-]{11})", c))),
        "podbean": sorted(set(re.findall(r'(https?://[^"\'\s]*podbean\.com[^"\'\s]*)', c))),
        "mp3": sorted(set(re.findall(r'(https?://[^"\'\s]+\.mp3)', c))),
        "cats": [cats.get(i, str(i)) for i in p.get("categories", [])],
        "tags": [tags.get(i, str(i)) for i in p.get("tags", [])],
        "featured": media.get(p.get("featured_media"), None),
    })

json.dump(recs, open("tools/wp_archive.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)

print(f"\nTOTAL {len(recs)} posts -> tools/wp_archive.json")
print("  dates          ", min(r["date"] for r in recs), "->", max(r["date"] for r in recs))
print("  html bytes     ", sum(len(r['html']) for r in recs))
print("  with images    ", sum(1 for r in recs if r["images"]))
print("  with featured  ", sum(1 for r in recs if r["featured"]))
print("  with youtube   ", sum(1 for r in recs if r["youtube"]))
print("  with podbean   ", sum(1 for r in recs if r["podbean"]))
print("  with mp3       ", sum(1 for r in recs if r["mp3"]))
