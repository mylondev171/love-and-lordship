# 🔴 10-23 PM: forms + newsletter (de975b5 + 16b603e PUSHED; CC form PUBLISHED by Mylon's OK)
- Read AI 10-23 call: greg@loveandlordship.com now exists (GoDaddy email, bought on the call).
  Greg wants a once-a-day subscribe pop-up AND a persistent Subscribe button near Give.
- Constant Contact: inline form "Website Newsletter Sign-up (loveandlordship.com)"
  id d3a7509f-c5e1-400b-b44b-5d1925cd100c, list General Interest (724), fields email/first/last,
  button "Subscribe". ACTIVE (published 10-23 on Mylon's OK; renders in the site modal, verified locally).
  must publish it (Sign-up forms > Edit > Publish). Account key e420cd6603496bbfb3bd2b695fc03d41.
  No welcome email exists (Aug "Welcome: Basic" was deleted); copy needs Greg/Mylon.
- Site (de975b5): SubscribeModal mounted in Footer (every page) with the CC form; nav Subscribe
  button (hidden <480px, in drawer); newsletter section opens the modal with the email prefilled;
  daily pop-up after 12s, only if the CC form rendered, never after a submit. Google Form removed.
  PUSH ONLY AFTER the CC form is published (else empty modal).
- Contact/Invite forms now route to greg@loveandlordship.com (LL_EMAIL + emailjs/SETUP.md).
  EmailJS (Greg's account) has no service yet; Mailjet was signed out (needs Mylon to log in).
  Mailjet domain SPF/DKIM at GoDaddy must MERGE with the new GoDaddy email SPF (one SPF record).

# 🔴🔴🔴 RESUME HERE (saved 2026-10-23) — read this block first
State: site main unchanged since `d3f8184` (live on the preview); only docs commits since.
connectapp. app is FULLY LOADED (details in the blocks below). Nothing in flight.

DONE 10-22/23:
- connectapp. library: 2,395 posts added (0 fails), group total 2,613, all visible in the home
  Newsfeed (Mylon's choice after the hidden-posts bug). notify_users ON 24/24 (verified).
- Greg's logins collected into C:\Users\mylon\OneDrive\Desktop\Greg Williams - Love & Lordship Logins.txt
  (app, Constant Contact = gdubya31@yahoo.com, M365, GoDaddy, EmailJS, Mailjet). Never put the
  passwords in the repo or memory.
- greg@loveandlordship.com research: Greg's Microsoft account (loveandlordship@gmail.com) has NO
  paid M365 subscription (free tier only); GoDaddy has domain + Web Hosting Deluxe (cPanel, 0 email
  accounts included). Options given to Mylon: M365 Business Basic NONPROFIT grant $0 (recommended,
  L&L is a 501(c)(3)), Google Workspace for Nonprofits $0, free forwarding (Cloudflare/ImprovMX),
  M365 Business Basic $7/mo, GoDaddy Email Essentials $1.99/mo yr1 then $8.99/mo.
  Web Hosting Deluxe becomes redundant after the Vercel cutover (cancel = savings; not touched).
  NO DECISION YET from Mylon.

NEXT (pick up here):
1. Mylon's pick for the greg@ inbox, then set it up (needs MX/DNS at GoDaddy; best with cutover).
2. Constant Contact: newsletter list + sign-up form + welcome email (replace the Google Form).
3. App QR code: not in the connectapp. admin; ask Greg's app contact. Then add it beside the 3
   app steps (AppPromo in components/footer-events-app.jsx).
4. DONE 10-23: join steps now "download, enter email + code LOVE, Love & Lordship displays, tap Continue" (Mylon's wording).
5. DONE 10-23 (`9a525b9`): 4th Annual KY Family Forum; Prepare/Enrich link + greg@ contact (mailto bounces until the inbox exists). Greg OKd GoDaddy Email Essentials + MS nonprofit grant (10-22 "Email Decision" email).
6. Answer Greg: "Coming Up" is a hand-edited list (offer a Google Calendar feed); app populated.
   Reply not drafted or sent.
7. Older items still waiting: photo-greg-teaching face check, GitHub Action push, n8n PAT,
   EmailJS/Mailjet IDs, domain cutover.

# ✅ 2026-10-22 ~4:45pm: IMPORT DONE. 2,395 posted (0 failures), group total 2,613, newest on
# top of each feed. notify_users turned back ON on all 24 feeds (verified 24/24). The block
# below is the record of how it was done; the "MUST be turned back ON" item is resolved.
# Article cards show a plain "loveandlordship.com" preview until the domain points at the new site.
# 10-23: display_newsfeed:false BROKE the home Newsfeed (server filters AFTER paginating, so pages
# 1-239 came back empty: "No posts found"). Mylon chose to flip all 2,395 imported posts to
# display_newsfeed:true (done, 0 failures, notify paused + restored 24/24). Home feed works; its top
# is the newest library items, Greg's May posts are further down. 🔴 PATCH /social/posts/<id> with a
# PARTIAL body wipes the attachment and resets post_type to TEXT: always send the full post body.
# 🔴🔴 RESUME HERE (saved 2026-10-22 afternoon) — connectapp. library import
- Mylon OK'd: whole library, deduped, PRIMARY priority only, notifications paused during import,
  back-catalog NOT in the main newsfeed (display_newsfeed:false).
- App structure (group 115 "Love and Lordship", code LOVE): 11 channels; each of the 7 site
  priorities + Kingdom has Watch/Read/Listen sub-feeds. Feed ids [Watch, Read, Listen]:
  lordship 47787/47786/47788, discipleship 47797/47796/47798, relationship 47818/47817/47819,
  marriage 47813/47814/47816, family 47801/47800/47802, church 47809/47808/47810,
  culture 47812/47811/47815, kingdom 47793/47792/47794 (Kingdom left as Greg had it).
- API: https://wl-v2.api.connectapp.live/public/v1 , Bearer = localStorage.accessToken on
  connectapp.live. POST /social/posts (VIDEO+youtu.be for Watch, LINK+podbean for Listen,
  LINK+loveandlordship.com/blog/<slug>/ for Read). PATCH /group/115/channels/<id> needs the FULL
  field set (title, description, channel_img, channel_cover_img, allowed_post_types...).
- 🔴 notify_users is OFF on all 24 Watch/Read/Listen feeds (all were ON before). MUST be turned
  back ON when the import ends (side effect seen: the server also flips filters_enabled
  false->true on save; invisible, no filters are selected).
- Import: 2,395 posts (4 test + 2,391), oldest first, progress in localStorage `ll_import_prog`
  on connectapp.live. Greg's 218 original posts untouched. Test post 66275 was deleted.
- Still open: QR code (not in admin; ask Greg's app contact), confirm real join steps (code is
  "LOVE"; site says "love"), reply to Greg.

# RESUME HERE (saved 2026-10-19 night)
State: main `d3f8184` LIVE on https://love-and-lordship.vercel.app/ , working tree clean.
Done today (on top of the 10-19 block below):
- `photo-greg-teaching.webp` replaced with an AI-restored 736x1412 version (Gemini
  gemini-3-pro-image-preview). Original backed up at
  C:\Users\mylon\Downloads\greg-photos\photo-greg-teaching-ORIGINAL.webp. Mylon/Greg to
  confirm the face still looks like Greg; revert = copy the backup back.
- Greg's 10-19 evening emails (Website thread): new Constant Contact password sent (in the
  thread, not stored here); free THURSDAY 10-22, 11am-4pm, for the CC + greg@ email setup;
  asked (a) is the app populated yet, (b) put the app QR code on the site, (c) does
  "Coming Up" update automatically.

NEXT STEPS:
1. connectapp. app load (PROMISED, Greg asking): Mylon signs in at connectapp.live in Chrome
   with Greg's 10-15 login (loveandlordship@gmail.com; Claude can't type passwords). Then
   Claude loads the library into the 11 channels. Unknown yet: bulk import vs one-by-one.
   While logged in, look for the group's QR code + the real join flow.
2. Join steps on the site are probably WRONG: the web join page (connectapp.live/join-with-code)
   asks for EMAIL + group code, not "search for Love & Lordship". Fix once confirmed.
3. QR code: add next to the 3 app steps (AppPromo in components/footer-events-app.jsx) once we
   have it (admin area, or from Greg's app folks).
4. "Coming Up": past events drop off automatically; NEW events are a hand-edited list
   (LL_EVENTS in components/footer-events-app.jsx). Answer Greg; offer (Mylon decides) to
   feed it from a Google Calendar Greg edits.
5. Thursday session: Constant Contact list + sign-up form + welcome automation (replace the
   Google Form), then greg@loveandlordship.com forwarding to Yahoo only (M365/GoDaddy).
6. Reply to Greg covering 1-4 (not yet drafted or sent).

Gotchas: the google-image-gen MCP tool kept returning 402 after credits were added; calling
the API directly with the same key via `uv run --project C:\Users\mylon\tools\google-image-gen-api-starter`
worked (script pattern: read key from ~/.claude.json mcpServers.google-image-gen.env).
`C:\Users\mylon\types.py` + `functools.py` shadow the stdlib: run Python with `-I` or from
another folder.

# UPDATE 2026-10-19 (read first)
- LIVE (`3805639`), verified on the deployed site. Greg's 10-17 evening emails:
  - Countries are SEVEN, not 12 (Greg: the 12 were places he's been). Map is USA, Cameroon,
    Liberia, Uganda, Kenya, Pakistan, India; Ireland/Russia/Ukraine/Bosnia/Jamaica removed.
    Changed in hero, Story, Reach, meta, and the about page (timeline h2 + fact).
  - "50+ partner ministries" -> "20+ Churches & ministries involved, engaged and impacted at
    any one time" (Reach stat + about fact). Eyebrow "Impacted Countries".
  - Book bullets: Sisters for Life bullet removed; first is now "Shared in several countries
    and with numerous ministries" (verbatim). Story: "Ami has been his greatest support every
    step of the way" (verbatim).
  - Homepage logo at >=1200px is 110px tall (570 wide); header grows to 126px with
    margin-bottom -54px so the hero doesn't move. Shrinks to 44px on scroll.
- WAITING ON GREG: exact app join steps (his test "didn't work as I thought") + the app's QR
  code (put BOTH on the site); new Constant Contact password (he changed it after seeing
  Mylon's Kissimmee login). Best days for codes: Mon/Wed/Thu afternoons.
- Sisters for Life is still named in the nav mega-menu, about, contact FAQ, invite page
  (Greg only asked to drop the book bullet). Ask before changing.

# UPDATE 2026-10-17 (read first)
- LIVE on the preview (`c878dcf`, `8b1339d`, `df53ccb`), verified on the deployed site:
  - Homepage Watch cards use Greg's 6 photos (his 10-16 email) instead of YouTube thumbnails,
    rotating each quarter (`watchPhotos()` in components/book-media.jsx; only the 3 hi-res
    photos take the big card). Files: assets/images/photo-greg-*.webp.
  - The Reach: Greg's 10-17 paragraph verbatim; map dots added for Liberia, Uganda, Kenya,
    Pakistan, India. Count is now 12 countries site-wide (Mylon: "obvious, just do it").
  - App section: 3-step "how to join" list; lead copy now says "eleven channels".
  - Mobile menu bug FIXED: drawer moved outside <header> (+ visibility:hidden when closed).
- Nav logo is now the HORIZONTAL assets/images/logo-horizontal.png (`7d68f61`), built from the
  original letterforms; 44px (64px homepage top, 36px phone).
- Mylon HAS the Constant Contact + Greg M365 logins (from the 10-16 call); never ask Greg for them.
  He signs in to Chrome, Claude drives. Reply to Greg drafted 10-17: photos answer, 10 vs 12 countries,
  confirm app join steps.
- Next for Claude on Mylon's go: load the library into the connectapp. channels
  (creds are in Greg's 10-15 email; not stored here).

# UPDATE 2026-10-16 evening, after the call with Greg (read first)
- `3fafd1a` LIVE on the preview: book page endorsements (Greg's top 3 + Bob Russell, then
  6 behind "Read more", verbatim from his doc) and the full TOC (8 sections, 32 chapters);
  "All donations are fully tax deductible." in the footer, donate modal and giving FAQ;
  homepage logo is 112px at the top of the page and shrinks on scroll (desktop only);
  501(c)(3) ligature fix (Manrope turns "(c)" into ©, so the text uses a ZWNJ: "(‌c)").
- Source docs: Downloads\TAOL Book Endorsement - Website (1).docx, TAOL TOC - Website (1).docx.
- 🔴 KNOWN BUG, not fixed (awaiting Mylon's OK): `.nav-shell.scrolled` uses backdrop-filter,
  which becomes the containing block for the fixed `.mobile-drawer`. Result: the phone menu
  opened after scrolling is a ~100px strip, and the closed drawer adds horizontal scroll
  on desktop once scrolled. Fix: move the drawer out of `<header>` (or drop backdrop-filter).
- Decided on the call: newsletter -> Greg's CONSTANT CONTACT (welcome email + auto-add);
  photos rotate QUARTERLY, Greg sends them; greg@ email: cheapest of GoDaddy M365 ($23.88/yr)
  vs his own M365 (likely Family/Personal, which can't add custom domains since 2023-11-30).
  Restream is Greg's to set up (YouTube, Podbean, LinkedIn). Prepare/Enrich link: Greg.
- Credentials were spoken on the call; they are NOT stored in the repo or in memory.

# UPDATE 2026-10-16 (read first)
- `d8b492f` (pushed, verified live on the preview): Greg's 10-16 answers applied. The
  501(c)(3) legal name "Building Healthy Relationships (dba Love & Lordship)" is now in
  the footer, terms, giving FAQ, donate modal and schema. Office hours are removed.
- Greg APPROVED: privacy + terms, the access code "love", "eleven channels" (the app has
  11 channels; the site library's 7 priorities are separate), Restream Standard,
  launching without a full library review. Call with Greg 10-16 at 3:30 ET.
- STILL NEEDED: the endorsements doc + TOC photo (Greg's email attachments; not on disk yet),
  4-6 homepage photos (Greg sends, or pull from his Facebook "Gregory Scott Williams"),
  a newsletter platform decision (signups go to a Google Form today, no thank-you email),
  greg@loveandlordship.com forwarding to YAHOO ONLY (GoDaddy, do on the call),
  the Prepare/Enrich link (Greg), loading the library into the connectapp. channels.
- The working folder had 7 tracked files deleted (moved to the sibling
  "Love and Lordship" folder, identical copies). Restored from HEAD on 10-16; the
  sibling copies were left in place.

# RESUME HERE (saved 2026-09-29)

Live preview: https://love-and-lordship.vercel.app (Vercel project `love-and-lordship`,
team `team_fKDIaYwVy8wAOa99EOOBc8po`). `main` HEAD is deployed and verified.

## Done this session
- `d965ce0` launch-readiness pass: real forms fallback, dead emails fixed, real
  social links, fabricated copy removed, real media grid, favicon/OG/sitemap/404.
- `6d28870` EmailJS/Mailjet form code, Vercel build step (JSX precompiled into
  `dist/`), photos to WebP, 347 old-site 301s, structured data, guarded content
  refresh (`tools/refresh.py`).
- Email to Greg drafted: `docs/email-to-greg-2026-09-29.md` (Mylon sends it).

## Waiting on Mylon
1. **Push the GitHub Action.** `.github/workflows/refresh-content.yml` is committed on
   the local branch `content-refresh-action` only; the gh token lacks `workflow`
   scope. Run `gh auth refresh -h github.com -s workflow`, then merge the branch
   into `main` and push.
2. **n8n.** Workflow `Q8b6GXGTmIwczXHq` "Love & Lordship - Daily Content Refresh"
   on the Hostinger n8n is INACTIVE. Paste a fine-grained GitHub PAT (this repo only;
   Actions read/write, Contents read) into credential `lIQmJ2fJYUubVgJS`, replacing
   the placeholder, run it once by hand, then activate.
3. **EmailJS + Mailjet.** Follow `emailjs/SETUP.md`, then fill the three IDs in
   `components/emailjs-config.js`. Until then the forms open the visitor's email app.
   The sender should be `noreply@loveandlordship.com` (needs Mailjet SPF/DKIM at GoDaddy).
4. **Domain cutover** (Mylon handling): add loveandlordship.com to the Vercel project,
   then point the GoDaddy DNS (ns47/48.domaincontrol.com, currently the old WP host
   132.148.178.108) at Vercel. Do the Mailjet DNS records at the same time.

## Waiting on Greg (see the email)
Endorsements, table of contents photo, Prepare/Enrich link, 501(c)(3) status and
legal name, office hours / "eleven channels" / public access code, privacy + terms
review, library category skim, streaming tool pick, connectapp. admin access,
homepage featured video choice.

## Working notes
- Local preview: `python -m http.server 8765 --bind 127.0.0.1` from the repo root
  (compiles JSX in the browser). Production build: `npm install && npm run build` → `dist/`.
  Stop any server running from `dist/` before rebuilding (Windows file lock).
- Chrome caches `.jsx` locally; `fetch(url, {cache: "reload"})` before re-testing.
- Don't use async/await in JSX (Babel env preset targets ES5).
- Edit JS/Python with the editor, not bash heredocs (they mangle backslashes).
- Tool docs: `tools/README.md`.
