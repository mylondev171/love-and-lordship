/* Shared shell for all subpages. Provides Nav + page content + Footer + DonateModal,
   and a consistent <PageHeader /> for the top of every page. */
const HOME_BASE = "../Love%20and%20Lordship.html";

/* The site has no form backend yet, so the contact and speaking-request forms
   hand off to the visitor's email app with everything they typed filled in.
   Each field is read as "Label: value" from the .field wrappers. */
const LL_EMAIL = "loveandlordship@gmail.com";

function emailForm(form, subject) {
  const lines = [];
  form.querySelectorAll(".field").forEach((f) => {
    const label = f.querySelector("label");
    const el = f.querySelector("input, select, textarea");
    if (label && el && el.value.trim()) lines.push(`${label.textContent.trim()}: ${el.value.trim()}`);
  });
  const body = lines.join("\n\n");
  window.location.href = `mailto:${LL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function EmailSent({ title, onBack }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--wine)", color: "var(--bg)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 6h16v10H3z M3 6l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
      </div>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ margin: "8px auto 0", maxWidth: 380 }}>
        Your email app should have opened with your message filled in — just press send.
        If nothing opened, email us directly at <a href={`mailto:${LL_EMAIL}`} style={{ textDecoration: "underline" }}>{LL_EMAIL}</a> or
        call <a href="tel:+18592296504" style={{ textDecoration: "underline" }}>(859) 229-6504</a>.
      </p>
      <button className="btn btn-ghost" type="button" onClick={onBack} style={{ marginTop: 18 }}>Back to the form</button>
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
window.emailForm = emailForm;
window.EmailSent = EmailSent;
