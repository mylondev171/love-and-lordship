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
  publicKey: "-qHcXWPinx0CyehXo",   // Account → General → Public Key
  serviceId: "service_2wzse7s",      // Email Services → Mailjet service → Service ID
  templateId: "template_j8tpnfq",    // Email Templates → "Website form" → Template ID
};
