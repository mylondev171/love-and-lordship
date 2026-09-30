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
