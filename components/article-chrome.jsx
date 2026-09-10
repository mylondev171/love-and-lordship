/* Chrome for the rehosted blog articles.

   Unlike the other subpages, article bodies are real HTML in the document so
   crawlers and no-JS readers get the content. That means Nav and Footer mount
   into their own roots on either side of <main> instead of PageShell wrapping
   everything. The two roots are separate React trees, so the donate modal is
   coordinated with a DOM event rather than shared state. */

const openDonate = () => window.dispatchEvent(new CustomEvent("ll:donate"));

function NavRoot() {
  return <Nav onDonate={openDonate} homeBase={window.HOME_BASE} />;
}

function FooterRoot() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener("ll:donate", h);
    return () => window.removeEventListener("ll:donate", h);
  }, []);
  return (
    <>
      <button className="btn btn-give donate-floater" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M8 14s-5-3.5-5-7.5A3 3 0 0 1 8 4a3 3 0 0 1 5 2.5C13 10.5 8 14 8 14z" fill="currentColor"/>
        </svg>
        Give
      </button>
      <Footer onDonate={() => setOpen(true)} homeBase={window.HOME_BASE} />
      <DonateModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("nav-root")).render(<NavRoot />);
ReactDOM.createRoot(document.getElementById("footer-root")).render(<FooterRoot />);
