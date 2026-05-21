/* global React */
function HeroWatermark() {
  const full = "Love & Lordship";
  const [n, setN] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    // Respect reduced motion: render the whole phrase immediately.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(full.length); setDone(true); return;
    }
    let i = 0;
    let t;
    const tick = () => {
      i++;
      setN(i);
      if (i < full.length) {
        const next = full[i];
        // Per-char timing for organic feel: pauses on space + ampersand, jitter elsewhere.
        const ms = next === " " ? 130 : next === "&" ? 220 : (70 + Math.random() * 60);
        t = setTimeout(tick, ms);
      } else {
        setDone(true);
      }
    };
    // Small lead-in so the caret appears alone for a beat before typing.
    t = setTimeout(tick, 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="hero-watermark" aria-hidden="true">
      <span>{full.slice(0, n)}</span>
      <span className={"hero-wm-caret" + (done ? " done" : "")}></span>
    </div>
  );
}

function Hero({ onDonate }) {
  const stageRef = React.useRef(null);
  React.useEffect(() => {
    let raf;
    const onMove = (e) => {
      if (!stageRef.current) return;
      const r = stageRef.current.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cards = stageRef.current.querySelectorAll(".hero-card");
        cards.forEach((c, i) => {
          const depth = [10, 18, 6, 14][i] || 8;
          c.style.transform = `translate3d(${x * depth}px, ${y * depth}px, 0)`;
        });
      });
    };
    const node = stageRef.current;
    node && node.addEventListener("mousemove", onMove);
    return () => { node && node.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  // Subtle scroll parallax on book cover
  React.useEffect(() => {
    const onScroll = () => {
      if (!stageRef.current) return;
      const y = window.scrollY;
      const book = stageRef.current.querySelector(".hero-card.book");
      const tl = stageRef.current.querySelector(".hero-card.float-tl");
      if (book) book.style.translate = `0 ${Math.min(y * 0.08, 60)}px`;
      if (tl) tl.style.translate = `0 ${Math.min(y * -0.05, 40)}px`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="hero" id="top">
      <HeroWatermark />
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-copy reveal-stagger">
            <div className="hero-eyebrow">
              <span className="dot" aria-hidden="true"></span>
              <span>A Ministry for Every Life &amp; Every Relationship</span>
            </div>
            <h1>
              Every life,<br/>
              every relationship<br/>
              <em>built on Love</em> <span className="amp">&amp;</span> <em>Lordship.</em>
            </h1>
            <p className="hero-sub">
              For more than twenty years, Greg &amp; Ami Williams have been making disciples
              who make disciples — sharing a biblical foundation for marriage, family, and
              relationship with churches in eight countries and counting.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => document.getElementById("pillars").scrollIntoView({ behavior: "smooth" })}>
                Explore the Mission
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="btn btn-give" onClick={onDonate}>
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                  <path d="M8 14s-5-3.5-5-7.5A3 3 0 0 1 8 4a3 3 0 0 1 5 2.5C13 10.5 8 14 8 14z" fill="currentColor"/>
                </svg>
                Partner with us
              </button>
              <a className="btn btn-ghost" href="pages/library.html">
                Watch latest
              </a>
            </div>

            <div className="hero-meta">
              <span className="quote-mark" aria-hidden="true">“</span>
              <div>
                <blockquote>
                  The greatest thing my parents taught me was that Love is a commitment. They were married for nearly 62 years before my Mother passed.
                </blockquote>
                <cite>— Greg Williams, President &amp; Founder</cite>
              </div>
            </div>
          </div>

          <div className="hero-stage" ref={stageRef} aria-hidden="true">
            <div className="hero-card float-tl">
              <div className="imgph" style={{ width: "100%", height: "100%" }}>
                <img src="assets/images/couple-candid.png" alt="" />
                <span className="lbl">photo · couple, candid</span>
              </div>
            </div>
            <div className="hero-card main">
              <div className="imgph" style={{ width: "100%", height: "100%" }}>
                <img src="assets/images/teaching.png" alt="" />
                <span className="lbl">photo · greg teaching</span>
              </div>
            </div>
            <div className="hero-card float-br">
              <div className="imgph" style={{ width: "100%", height: "100%" }}>
                <img src="assets/images/family-gathered.png" alt="" />
                <span className="lbl">photo · family gathered</span>
              </div>
            </div>
            <div className="hero-card book">
              <span className="spine"></span>
              <div className="em">A New Book by Greg Williams</div>
              <h3>The Authority<br/>of Love</h3>
              <div className="crest">L</div>
              <div className="by">Greg Williams</div>
            </div>
          </div>
        </div>

        <div className="hero-strip" aria-hidden="true">
          <div className="hero-strip-track">
            {[..."Lordship · Discipleship · Relationship · Marriage · Family · Love & Lordship · Lordship · Discipleship · Relationship · Marriage · Family · Love & Lordship".split(" · ")].map((w, i) => (
              <span className="hero-strip-item" key={i}>
                {w}
                <span className="sep" aria-hidden="true"></span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="scroll-hint only-desktop"><span className="bar"></span>Scroll to explore</div>
    </section>
  );
}

window.Hero = Hero;
