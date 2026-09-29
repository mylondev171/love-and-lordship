/* global React */
function Book({ onDonate }) {
  return (
    <section id="book" className="book-section">
      <div className="wrap">
        <div className="book-grid">
          <div className="book-cover-wrap reveal">
            <div className="book-cover book-cover-real">
              <img src="assets/images/book-cover-front.jpg" alt="The Authority of Love, Second Edition — front cover" />
            </div>
            <div className="book-cover book-cover-real book-cover-back">
              <img src="assets/images/book-cover-back.jpg" alt="The Authority of Love, Second Edition — back cover with endorsement" />
            </div>
          </div>

          <div className="book-copy reveal-stagger">
            <div className="eyebrow">The Book</div>
            <h2>The roadmap for every <em>life and relationship</em>.</h2>
            <p className="lead">
              Drawn from 30+ years of teaching men, couples, families, and churches in KY, the US and around the globe,
              <em> The Authority of Love</em> lays the biblical foundation under everything we do —
              and gives you a practical path to live it.
            </p>
            <ul className="book-bullets">
              {[
                "Chosen by Sisters for Life as core discipleship curriculum",
                "Shared in at least 10 countries and 50+ partner ministries",
                "Designed for personal study, marriages, and small groups",
                "Companion study guide for family, class and small-groups",
              ].map((b) => (
                <li key={b}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <path d="M4 9.5l3.5 3.5L14 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="book-cta-row">
              <a className="btn btn-give" href="pages/the-authority-of-love.html">
                Order The Authority of Love, Second Edition
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a className="btn btn-ghost" href="pages/the-authority-of-love.html#preview" style={{ borderColor: "oklch(0.4 0.02 60)", color: "oklch(0.92 0.02 70)" }}>
                Watch the book intro
              </a>
            </div>
            <p className="book-pull">
              "This is such an important book for today's church… a wake-up call for the modern-day American church to restore the Biblical standards of marriage, family and the church which are still compelling and transforming."
              <cite>— Bob Russell, CEO, Bob Russell Ministries · Senior Minister (Ret.), Southeast Christian Church</cite>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Media ================= */
// The newest real items from the library, generated into data/featured.js by
// tools/build_featured.py. Watch cards use the YouTube thumbnail; Listen and
// Read have no artwork of their own, so they rotate through the site imagery.
const MEDIA_ART = {
  listen: ["assets/images/microphone-studio.webp", "assets/images/podcast-cover.webp", "assets/images/radio-dial.webp", "assets/images/marriage-resilient.webp", "assets/images/waveform.webp"],
  read: ["assets/images/open-journal.webp", "assets/images/notebook.webp", "assets/images/two-coffee-cups.webp", "assets/images/bible-and-pen.webp", "assets/images/open-bible-morning.webp"],
};
const MEDIA_LIB = { watch: "Watch", listen: "Listen", read: "Read" };

function mediaItems(tab) {
  const list = (window.LL_FEATURED && window.LL_FEATURED[tab]) || [];
  return list.map((m, i) => {
    const art = tab === "watch" && m.th
      ? (i === 0 ? m.th.replace("mqdefault", "maxresdefault") : m.th)
      : MEDIA_ART[tab][i % MEDIA_ART[tab].length];
    return { ...m, art, big: i === 0 };
  });
}

function Play() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3l7 4-7 4z" fill="currentColor"/></svg>;
}

function Media() {
  const [tab, setTab] = React.useState("watch");
  const items = mediaItems(tab);
  return (
    <section id="media" className="media">
      <div className="wrap">
        <div className="media-head reveal">
          <div>
            <div className="eyebrow">Watch · Read · Listen</div>
            <h2>Wherever you meet us, the <em>message</em> meets you.</h2>
          </div>
          <div className="media-tabs">
            {[["watch","Watch"],["read","Read"],["listen","Listen"]].map(([k, label]) => (
              <button key={k} className={"media-tab" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="media-grid">
          {items.map((m, i) => (
            <a className={"media-card" + (m.big ? " big" : "")} href={m.u} target={m.u.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" key={tab + i}>
              <div className="imgph dark">
                <img src={m.art} alt="" loading="lazy" />
              </div>
              <span className="badge">{m.s.replace("The Authority of Love · ", "")}</span>
              {tab !== "read" && <span className="play" aria-hidden="true"><Play /></span>}
              <div className="media-card-meta">
                <div className="duration">{m.d}</div>
                <h3>{m.t}</h3>
              </div>
            </a>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <a className="btn btn-ghost" href={`pages/library.html?fmt=${MEDIA_LIB[tab]}`}>View the full {tab === "read" ? "article" : tab === "watch" ? "video" : "audio"} library →</a>
        </div>
      </div>
    </section>
  );
}

window.Book = Book;
window.Media = Media;
