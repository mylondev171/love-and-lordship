/* =========================================================================
   Love & Lordship — EmailJS settings for the Contact and Invite Greg forms
   -------------------------------------------------------------------------
   Both forms send through ONE EmailJS template (Mailjet is the email service
   behind it). Setup steps and the template HTML are in /emailjs/SETUP.md.

   *** FILL IN THESE THREE VALUES *** (from https://dashboard.emailjs.com/)
   Until they are filled in, the forms fall back to opening the visitor's
   email app with the message pre-filled, so nothing is ever lost.
   ========================================================================= */
window.LL_EMAILJS = {
  publicKey: "YOUR_PUBLIC_KEY",     // Account → General → Public Key
  serviceId: "YOUR_SERVICE_ID",     // Email Services → Mailjet service → Service ID
  templateId: "YOUR_TEMPLATE_ID",   // Email Templates → "Website form" → Template ID
};
