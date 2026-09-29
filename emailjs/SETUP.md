# EmailJS + Mailjet setup (Contact and Invite Greg forms)

The code is done. Both forms send through **one EmailJS template**, and
EmailJS sends the email through **Mailjet**. Until the three IDs below are
filled in, the forms fall back to opening the visitor's email app, so no
message is lost in the meantime.

## 1. Mailjet (the sending account)
1. Use a Mailjet account or sub-account for Love & Lordship (keep it separate from other clients).
2. **Senders & Domains → Add domain:** `loveandlordship.com`. Add the SPF and DKIM
   TXT records Mailjet shows at GoDaddy (DNS for loveandlordship.com is at GoDaddy).
   *Do this with the domain cutover.* Sending "from" the gmail address through
   Mailjet will land in spam, because Gmail's DMARC doesn't authorize Mailjet.
3. Add the sender `noreply@loveandlordship.com` (no mailbox is needed for a sending-only address).
4. **Account → API keys:** copy the API key and secret key.

## 2. EmailJS
1. Sign in at https://dashboard.emailjs.com (free tier: 200 emails/month).
2. **Email Services → Add New Service → Mailjet.** Paste the Mailjet API key and
   secret. Copy the **Service ID**.
3. **Email Templates → Create New Template**, name it `L&L website form`.
   - **Content** tab → Code editor → paste all of `template-notification.html`.
   - Settings: **To Email** `loveandlordship@gmail.com` · **From Name** `Love & Lordship Website` ·
     **From Email** `noreply@loveandlordship.com` (uncheck "use default") ·
     **Reply To** `{{reply_to}}` · **Subject** `{{subject}}`.
   - **Auto-Reply** tab → turn on → paste `template-auto-reply.html`.
     **To** `{{reply_to}}` · **Reply To** `loveandlordship@gmail.com` ·
     **Subject** `We received your message, {{from_name}}`.
   - Save and copy the **Template ID**.
4. **Account → General:** copy the **Public Key**.
5. **Account → Security:** add `loveandlordship.com` (and the vercel.app URL while
   testing) to the allowed origins so the key can't be used from other sites.
   Optionally turn on reCAPTCHA later if spam shows up; the forms already have a
   hidden bot trap.

## 3. Paste the IDs
Edit `components/emailjs-config.js`, replacing the three `YOUR_…` values, then
commit and push. Vercel redeploys in about a minute.

## 4. Test
Send one message from each form on the live site. Check that the notification
reaches loveandlordship@gmail.com (with Reply going to the visitor) and that the
auto-reply reaches the visitor. EmailJS → **History** shows every send and any error.

## Variables the site sends
`form_type` ("Contact message" / "Speaking request") · `subject` · `from_name` ·
`reply_to` · `phone` · `message` · `details_text` · `details_html` (triple braces) ·
`page_url`. New fields added to either form show up automatically in
`details_*`; no template change is needed.
