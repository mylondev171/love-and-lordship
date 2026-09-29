/* Shared shell for all subpages. Provides Nav + page content + Footer + DonateModal,
   and a consistent <PageHeader /> for the top of every page. */
const HOME_BASE = "../Love%20and%20Lordship.html";

/* ---- Contact / Invite Greg form delivery ---------------------------------
   Forms send through EmailJS (Mailjet behind it) using the keys in
   components/emailjs-config.js. Every field is read as "Label: value" from
   the .field wrappers, so a new field needs no code change here. Until the
   keys are filled in, the form hands off to the visitor's email app instead.
   A hidden "company_website" field catches bots: if it's filled we show
   success and send nothing. */
const LL_EMAIL = "loveandlordship@gmail.com";

function emailjsReady() {
  const c = window.LL_EMAILJS || {};
  return typeof window.emailjs !== "undefined" &&
    [c.publicKey, c.serviceId, c.templateId].every((v) => v && !v.startsWith("YOUR_"));
}

function readFields(form) {
  const fields = [];
  form.querySelectorAll(".field").forEach((f) => {
    const label = f.querySelector("label");
    const el = f.querySelector("input, select, textarea");
    if (label && el && el.value.trim()) fields.push({ label: label.textContent.trim(), value: el.value.trim(), el });
  });
  return fields;
}

const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Resolves to "sent" or "mailto"; rejects if EmailJS fails. (Promises rather
// than async/await: the in-browser Babel preset targets ES5.)
function sendForm(form, formType, subject) {
  const trap = form.querySelector('[name="company_website"]');
  if (trap && trap.value) return Promise.resolve("sent");
  const fields = readFields(form);
  const pick = (test) => fields.filter(test).map((f) => f.value);

  if (!emailjsReady()) {
    const body = fields.map((f) => `${f.label}: ${f.value}`).join("\n\n");
    window.location.href = `mailto:${LL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return Promise.resolve("mailto");
  }

  const c = window.LL_EMAILJS;
  return window.emailjs.send(c.serviceId, c.templateId, {
    form_type: formType,
    subject,
    from_name: pick((f) => /name$/i.test(f.label)).join(" "),
    reply_to: pick((f) => f.el.type === "email")[0] || "",
    phone: pick((f) => f.el.type === "tel")[0] || "",
    message: pick((f) => f.el.tagName === "TEXTAREA")[0] || "",
    details_text: fields.map((f) => `${f.label}: ${f.value}`).join("\n"),
    details_html: fields.map((f) =>
      `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${escapeHtml(f.label)}</td>` +
      `<td style="padding:6px 0;color:#111827">${escapeHtml(f.value).replace(/\n/g, "<br>")}</td></tr>`).join(""),
    page_url: window.location.href,
  }, { publicKey: c.publicKey }).then(() => "sent");
}

/* status: "idle" | "sending" | "sent" | "mailto" | "error" */
function useFormSender(formType, subjectOf) {
  const [status, setStatus] = React.useState("idle");
  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    sendForm(form, formType, subjectOf(form)).then(setStatus, (err) => {
      console.error("[form] EmailJS error:", err);
      setStatus("error");
    });
  };
  return { status, onSubmit, reset: () => setStatus("idle") };
}

function Honeypot() {
  return <input type="text" name="company_website" className="hp-field" tabIndex="-1" autoComplete="off" aria-hidden="true" />;
}

function FormError() {
  return (
    <p className="form-error" role="alert">
      Something went wrong sending your message. Please email <a href={`mailto:${LL_EMAIL}`}>{LL_EMAIL}</a> or
      call <a href="tel:+18592296504">(859) 229-6504</a>.
    </p>
  );
}

function FormResult({ status, title, onBack }) {
  const viaEmailApp = status === "mailto";
  return (
    <div style={{ textAlign: "center", padding: "32px 0" }} role="status">
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--wine)", color: "var(--bg)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
        {viaEmailApp
          ? <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16v10H3z M3 6l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
          : <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M5 11.5l4 4L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <h3 style={{ margin: 0 }}>{viaEmailApp ? "Almost there." : title}</h3>
      <p style={{ margin: "8px auto 0", maxWidth: 380 }}>
        {viaEmailApp ? (
          <>Your email app should have opened with your message filled in — just press send.
          If nothing opened, email us directly at <a href={`mailto:${LL_EMAIL}`} style={{ textDecoration: "underline" }}>{LL_EMAIL}</a> or
          call <a href="tel:+18592296504" style={{ textDecoration: "underline" }}>(859) 229-6504</a>.</>
        ) : (
          <>Your message is on its way to Greg and the Love &amp; Lordship team, and a copy has been sent to your inbox.</>
        )}
      </p>
      <button className="btn btn-ghost" type="button" onClick={onBack} style={{ marginTop: 18 }}>
        {viaEmailApp ? "Back to the form" : "Send another message"}
      </button>
    </div>
  );
}

function PageHeader({ eyebrow, title, sub, deco }) {
  return (
    <header className="page-header">
      {deco && <span className="deco" aria-hidden="true">{deco}</span>}
      <div className="wrap">
        <a className="back-link" href={HOME_BASE}>Back to home</a>
        <div className="eyebrow">{eyebrow}</div>
        <h1 dangerouslySetInnerHTML={{ __html: title }} />
        {sub && <p className="page-sub">{sub}</p>}
      </div>
    </header>
  );
}

function PageShell({ children, header }) {
  const [donateOpen, setDonateOpen] = React.useState(false);
  return (
    <>
      <Nav onDonate={() => setDonateOpen(true)} homeBase={HOME_BASE} />
      <main className="page">
        {header}
        {children}
      </main>
      <button className="btn btn-give donate-floater" onClick={() => setDonateOpen(true)}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M8 14s-5-3.5-5-7.5A3 3 0 0 1 8 4a3 3 0 0 1 5 2.5C13 10.5 8 14 8 14z" fill="currentColor"/>
        </svg>
        Give
      </button>
      <Footer onDonate={() => setDonateOpen(true)} homeBase={HOME_BASE} />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
    </>
  );
}

function CTAStrip({ eyebrow = "Partner with us", title, body, primary, secondary, onDonate }) {
  return (
    <section className="cta-strip">
      <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
        <div className="eyebrow" style={{ color: "var(--gold)" }}>{eyebrow}</div>
        <h2 dangerouslySetInnerHTML={{ __html: title }} />
        {body && <p>{body}</p>}
        <div className="row">
          {primary}
          {secondary}
        </div>
      </div>
    </section>
  );
}

window.PageHeader = PageHeader;
window.PageShell = PageShell;
window.CTAStrip = CTAStrip;
window.HOME_BASE = HOME_BASE;
window.LL_EMAIL = LL_EMAIL;
window.useFormSender = useFormSender;
window.Honeypot = Honeypot;
window.FormError = FormError;
window.FormResult = FormResult;
