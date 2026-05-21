/* Shared shell for all subpages. Provides Nav + page content + Footer + DonateModal,
   and a consistent <PageHeader /> for the top of every page. */
const HOME_BASE = "../Love%20and%20Lordship.html";

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
