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
