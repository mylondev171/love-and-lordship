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
