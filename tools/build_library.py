import json, re, html, collections, datetime, os

PROJ = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
TODAY = datetime.date(2026, 9, 2)
pb = json.load(open("podbean_all.json", encoding="utf8"))
yt = json.load(open("youtube.json", encoding="utf8"))
wp = json.load(open("wp_posts.json", encoding="utf8"))

# ---------- helpers ----------
DATE_RE = re.compile(r'(\d{2})(\d{2})(\d{4})\s*$')


def title_date(t):
    m = DATE_RE.search(t)
    if not m:
        return None
    mm, dd, yy = int(m.group(1)), int(m.group(2)), int(m.group(3))
    try:
        return datetime.date(yy, mm, dd).isoformat()
    except ValueError:
        return None


def fix(s):
    return html.unescape(s or "").replace("\u2019", "'").replace("\ufffd", "'").replace("\u2013", "-")


def clean_title(t):
    t = fix(t)
    t = DATE_RE.sub("", t).strip(" -:")
    return re.sub(r'\s+', ' ', t).strip()


SIGNOFF = re.compile(r'\s*(Share\.?\s*)?(Make it a great day|God bless)[^!]*!?\s*$', re.I)


def clean_desc(d, n=170):
    d = re.sub(r'\s+', ' ', fix(d)).strip()
    d = SIGNOFF.sub("", d).strip()
    d = re.sub(r'^Share\.\s*', '', d)
    if len(d) > n:
        d = d[:n].rsplit(" ", 1)[0].rstrip(",.;:") + "\u2026"
    return d


def series_of(title):
    t = title.lower()
    if re.match(r'(family foundation friday|ff friday|fff\b)', t):
        return "Family Foundation Friday"
    if re.match(r'(wednesdays? (4|for) women|w4w)', t):
        return "Wednesdays 4 Women"
    if t.startswith("god comes first"):
        return "God Comes First"
    if "mentoring minute" in t:
        return "Mentoring Minutes"
    if t.startswith("taol") or t.startswith("the authority of love"):
        return "The Authority of Love"
    if t.startswith("names of god"):
        return "Names of God"
    if "one another" in t:
        return "One Another"
    if "interview" in t:
        return "Interviews"
    return None


def strip_series_prefix(title, series):
    if series in ("Family Foundation Friday", "Wednesdays 4 Women"):
        return series
    t = re.sub(r'^(god comes first|taol|the authority of love|ff friday|w4w)\s*[-:]\s*', '', title, flags=re.I).strip()
    return t or title


# ---------- classifier ----------
LEX = {
    "lordship": [("lordship", 3), ("lord ", 2), ("christ first", 3), ("god comes first", 3), ("kingdom", 2), ("surrender", 2), ("obedien", 2), ("holiness", 2), ("sanctif", 2), ("identity in christ", 2), ("names of god", 3), ("worship", 2), ("prayer", 1), ("gospel", 2), ("salvation", 2), ("born again", 2), ("mind of christ", 2), ("humility", 1), ("servant", 1), ("faith", 1), ("trust", 1), ("suffering", 1), ("grace", 1), ("hope", 1), ("thanksgiving", 1), ("christmas", 2), ("easter", 2), ("resurrection", 2), ("cross", 1), ("holy spirit", 2), ("fruit of the spirit", 2), ("god's word", 1), ("scripture", 1), ("idol", 2), ("throne", 2), ("authority of love", 1), ("jesus", 1), ("wisdom", 1), ("attitude of christ", 2), ("like him", 1), ("die to self", 2), ("dying to self", 2), ("repent", 2), ("sin", 1), ("truth", 1), ("eternal", 1), ("heaven", 1)],
    "discipleship": [("disciple", 3), ("discipleship", 3), ("mentor", 2), ("mentoring minutes", 3), ("follow", 1), ("grow", 1), ("teach", 1), ("training", 1), ("radical", 1), ("missional", 2), ("witness", 2), ("evangel", 2), ("great commission", 3), ("make disciples", 3), ("spiritual growth", 2), ("stand firm", 1), ("persecution", 2), ("apologetic", 2), ("mission", 1), ("bible study", 2), ("study", 1), ("kingdom life", 2)],
    "relationship": [("relationship", 3), ("one another", 3), ("love one another", 3), ("forgiv", 3), ("friend", 2), ("neighbor", 2), ("community", 1), ("hospitab", 3), ("encourag", 2), ("honor", 1), ("harmony", 2), ("conflict", 2), ("reconcil", 2), ("serve one another", 3), ("loving others", 3), ("real love", 2), ("agape", 2), ("kindness", 2), ("compassion", 2), ("patience", 1), ("gossip", 2), ("anger", 2), ("bitterness", 2), ("unity", 1), ("humility toward", 2)],
    "marriage": [("marriage", 4), ("marri", 3), ("husband", 3), ("wife", 3), ("wives", 3), ("spouse", 3), ("couple", 3), ("wedding", 3), ("covenant", 2), ("premarital", 4), ("navigating marriage", 4), ("anniversary", 2), ("intimacy", 2), ("divorce", 3), ("in-law", 2), ("marshall", 1)],
    "family": [("family", 3), ("families", 3), ("parent", 3), ("father", 2), ("mother", 2), ("dad", 2), ("mom", 2), ("children", 3), ("child", 2), ("kids", 2), ("son ", 1), ("daughter", 2), ("home", 1), ("grandparent", 3), ("raising", 2), ("teen", 2), ("youth", 2), ("nurture", 1), ("admonition", 1), ("legacy", 1), ("generation", 1), ("sexual", 1), ("purity", 2)],
    "church": [("church", 4), ("congregation", 3), ("pastor", 3), ("elder", 2), ("leader", 2), ("leadership", 2), ("body of christ", 3), ("bride", 2), ("shepherd", 3), ("ministry", 1), ("servant-lead", 3), ("deacon", 2), ("preach", 2), ("sermon", 2), ("fellowship", 1), ("communion", 1)],
    "culture": [("culture", 4), ("cultural", 3), ("nation", 2), ("america", 2), ("political", 3), ("politic", 2), ("government", 3), ("right to life", 4), ("abortion", 4), ("pro-life", 4), ("pro-death", 4), ("baby box", 3), ("ky's voice", 3), ("kentucky", 1), ("law", 2), ("legislat", 3), ("election", 3), ("vote", 3), ("sports", 2), ("gender", 3), ("transgender", 4), ("school", 2), ("education", 2), ("public", 1), ("supreme court", 3), ("meta", 2), ("wnba", 3), ("dsa", 2), ("socialis", 3), ("marxis", 3), ("woke", 3), ("family foundation", 3), ("wuchner", 3), ("bill ", 2), ("policy", 3), ("freedom", 2), ("religious liberty", 3), ("israel", 2), ("world", 1)],
}
PILLARS = ["lordship", "discipleship", "relationship", "marriage", "family", "church", "culture"]
SERIES_PRIOR = {
    "Family Foundation Friday": {"culture": 6, "family": 2},
    "Wednesdays 4 Women": {"culture": 5, "family": 2},
    "God Comes First": {"lordship": 5, "discipleship": 2},
    "Mentoring Minutes": {"discipleship": 5},
    "Names of God": {"lordship": 6},
    "One Another": {"relationship": 6},
}


def classify(title, desc, series):
    text = (title + " . " + title + " . " + desc).lower()
    sc = {p: 0 for p in PILLARS}
    for p, lex in LEX.items():
        for kw, w in lex:
            n = text.count(kw)
            if n:
                sc[p] += w * min(n, 3)
    for p, w in SERIES_PRIOR.get(series, {}).items():
        sc[p] += w
    ranked = sorted(sc.items(), key=lambda x: -x[1])
    top = ranked[0][1]
    if top == 0:
        return ["lordship"]
    out = [p for p, s in ranked if s >= max(3, top * 0.5)][:3]
    return out or ["lordship"]


def rel_to_date(rel):
    m = re.match(r'(\d+)\s+(day|week|month|year)s?\s+ago', rel or "")
    if not m:
        return None
    n, u = int(m.group(1)), m.group(2)
    days = {"day": 1, "week": 7, "month": 30, "year": 365}[u] * n
    return (TODAY - datetime.timedelta(days=days)).isoformat()


def air_or_pub(raw, pub):
    """Radio episodes carry their AIR date in the title and are uploaded early.
    Use the air date unless it is still in the future, then fall back to publish date."""
    ad = title_date(raw)
    if ad and ad <= TODAY.isoformat():
        return ad
    return pub or ad or "2020-01-01"


items = []
pb_index = {}
for e in pb:
    raw = fix(e["title"]); s = series_of(raw); t = clean_title(raw)
    slug = re.sub(r'\W', '', e["url"].rsplit("/e/", 1)[-1])[:40]
    pillars = classify(t, e["desc"], s)
    it = {"i": "p" + slug, "f": "Listen", "t": strip_series_prefix(t, s), "d": air_or_pub(raw, e["date"]), "u": e["url"],
          "s": s or "The Authority of Love \u00b7 Daily radio", "x": clean_desc(e["desc"]), "p": pillars}
    items.append(it)
    key = (t.lower(), title_date(raw))
    pb_index.setdefault(key, it)
    pb_index.setdefault((t.lower(), None), it)

matched = 0
for v in yt:
    if v["kind"] == "short":
        continue
    raw = fix(v["title"]); s = series_of(raw); t = clean_title(raw)
    twin = pb_index.get((t.lower(), title_date(raw))) or pb_index.get((t.lower(), None))
    desc = v.get("desc", "")
    if twin:
        matched += 1
        summary = twin["x"]; pillars = twin["p"]
    else:
        summary = clean_desc(desc); pillars = classify(t, desc, s)
    pub = rel_to_date(v["published"])
    items.append({"i": "y" + v["id"], "f": "Watch", "t": strip_series_prefix(t, s), "d": air_or_pub(raw, pub),
                  "u": "https://www.youtube.com/watch?v=" + v["id"], "s": s or "The Authority of Love \u00b7 Daily radio", "x": summary,
                  "m": v.get("dur", ""), "th": "https://i.ytimg.com/vi/" + v["id"] + "/mqdefault.jpg", "p": pillars})
print("youtube videos matched to a podcast episode:", matched)

for p in wp:
    raw = fix(p["title"]); s = series_of(raw); t = clean_title(raw)
    body = p["excerpt"] or p["text"]
    words = len(p["text"].split()); rt = str(max(1, round(words / 200))) + " min read"
    body = re.sub(r'^Love and Lordship in Focus\u2026?\s*', '', fix(body))
    items.append({"i": "a" + str(p["id"]), "f": "Read", "t": t, "d": p["date"], "u": p["url"], "s": s or "Article",
                  "x": clean_desc(body), "m": rt, "p": classify(t, p["text"][:1500], s)})

items.sort(key=lambda x: x["d"], reverse=True)

print("TOTAL", len(items), collections.Counter(i["f"] for i in items))
print("series", collections.Counter(i["s"] for i in items).most_common())
print("pillars", collections.Counter(p for i in items for p in i["p"]))
print("multi-label", collections.Counter(len(i["p"]) for i in items))
print("no summary", sum(1 for i in items if not i["x"]))
print("future-dated", sum(1 for i in items if i["d"] > TODAY.isoformat()))

os.makedirs(os.path.join(PROJ, "data"), exist_ok=True)
out = os.path.join(PROJ, "data", "library.js")
with open(out, "w", encoding="utf8") as f:
    f.write("// Generated by build_library.py from loveandlordship.com (WordPress REST API), Podbean and YouTube on 2026-09-02.\n")
    f.write("// Fields: i=id f=format t=title d=date u=url s=series x=summary p=pillars m=duration/read-time th=thumbnail\n")
    f.write("window.LL_LIBRARY=" + json.dumps(items, ensure_ascii=False, separators=(",", ":")) + ";\n")
    f.write('window.LL_LIBRARY_BUILT="2026-09-02";\n')
print("bytes", os.path.getsize(out))
json.dump(items, open("library_items.json", "w", encoding="utf8"), indent=0, ensure_ascii=False)
