# Site tools

## Daily content refresh (automatic)

n8n (Hostinger, workflow "Love & Lordship - Daily Content Refresh") triggers
the GitHub Action `.github/workflows/refresh-content.yml` every morning. The
Action runs:

```
python tools/refresh.py
```

which pulls YouTube, Podbean and the old WordPress site, rebuilds the library,
articles, homepage media and sitemap, and commits only if there is new content.
The push to `main` redeploys Vercel. Run the same command locally to refresh by hand.

`tools/podbean_all.json`, `youtube.json`, `wp_posts.json` and `wp_archive.json`
are the committed **snapshots**. A pull only replaces its snapshot if it
succeeds and returns at least 90% as many items, so when loveandlordship.com
(WordPress) is retired its pulls just fail and the 332 articles stay.

The individual steps, if you need them (`build_library.py` runs from `tools/`):

```
cd tools && python build_library.py && cd ..   # classify into the 7 priorities -> data/library.js
python tools/build_articles.py   # rehosted blog/*.html, data/articles.js, repoints Read links
python tools/build_featured.py   # newest 5 Watch/Listen/Read -> data/featured.js (homepage Media section)
python tools/build_sitemap.py    # sitemap.xml + robots.txt
```

Only the Python standard library is needed. `build_library.py` uses today's
date (override with `LL_TODAY=YYYY-MM-DD`) so "future" radio air-dates sort right.

## Other tools

- `build_redirects.py` writes the 301s in `vercel.json` for every URL the old
  WordPress site exposed, including its 327 `/video_post/` and `/listen/` pages
  (list in `old_site_media_pages.json`).
- `build-site.mjs` is the Vercel build (`npm run build`): copies the site to
  `dist/` and precompiles the in-browser JSX so visitors don't download Babel.
  Local preview still uses the source files and compiles in the browser.
- EmailJS + Mailjet form setup: `emailjs/SETUP.md`.

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
