# Library build tools

`data/library.js` (the catalog behind `pages/library.html` and the pillar
Watch / Listen / Read links) is generated, not hand-edited. To refresh it:

```
cd tools
python pull_wp.py      # articles  -> wp_posts.json      (loveandlordship.com WordPress REST API)
python pull_pb.py      # podcasts  -> podbean_all.json   (loveandlordship.podbean.com, all pages)
python pull_yt.py      # videos    -> youtube.json       (YouTube channel UCY9DJ9AIFc3eXXvmmWn-6AQ, no API key)
python build_library.py   # merges, classifies into the 7 priorities, writes ../data/library.js
```

Only the Python standard library is needed. `build_library.py` sets `TODAY`
near the top; bump it when re-running so "future" radio air-dates sort right.

Classification is keyword-based (see `LEX` and `SERIES_PRIOR`). Every item
gets one to three priorities; anything with no signal falls back to
Love & Lordship. Tune the lexicons there if a category looks off.

Events live in `components/footer-events-app.jsx` (`LL_EVENTS`).

## Rehosted blog articles

loveandlordship.com is being retired, so the 332 Read items can no longer link
out to it. They are now served from this repo under `blog/<slug>.html`.

```
python tools/pull_wp_full.py    # full post HTML + taxonomies -> tools/wp_archive.json
python tools/build_articles.py  # -> blog/*.html, data/articles.js, repoints data/library.js
```

`pull_wp_full.py` only works while the old site is still up — `wp_archive.json`
is the permanent copy, so keep it in the repo. `build_articles.py` is safe to
re-run and is idempotent.

Notes:
- Pages keep the ORIGINAL `/blog/<slug>/` path and canonical URL, so existing
  inbound links and the Google index survive the DNS move. `vercel.json`
  rewrites `/blog/:slug` to the generated file.
- Article bodies are written as real HTML, not rendered by React, so crawlers
  and no-JS readers get the content. Only nav/footer mount client-side, via
  `components/article-chrome.jsx`.
- Priorities and series come from `data/library.js`, so the article pages and
  the library always agree. Rebuild the library first if you re-classify.
- One image (`Race-Baiters-Booker-T.-Washington`) was already 404 on the old
  site before takedown and is dropped. `Truth-Chart.png` was saved to
  `assets/images/blog/`.
- The listing page is `pages/blog.html`, styled by `components/article.css`.
