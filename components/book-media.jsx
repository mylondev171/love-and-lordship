/* global React */
function Book({ onDonate }) {
  return (
    <section id="book" className="book-section">
      <div className="wrap">
        <div className="book-grid">
          <div className="book-cover-wrap reveal">
            <div className="book-cover">
              <span className="spine-edge" aria-hidden="true"></span>
              <span className="pages-edge" aria-hidden="true"></span>
              <div className="em-line">2nd Edition · Greg Williams</div>
              <h2>The<br/>Authority<br/>of Love</h2>
              <div className="seal" aria-hidden="true"><span className="seal-letter">L</span></div>
              <div className="by-line">A discipleship foundation</div>
              <div className="ed">L &amp; L · MMXXVI</div>
            </div>
          </div>

          <div className="book-copy reveal-stagger">
            <div className="eyebrow">The Book</div>
            <h2>A roadmap for every <em>life and relationship</em>.</h2>
            <p className="lead">
              Drawn from twenty years of teaching couples, families, and churches across the world,
              <em> The Authority of Love</em> lays the biblical foundation under everything we do —
              and gives you a practical, week-by-week path to live it.
            </p>
            <ul className="book-bullets">
              {[
                "Chosen by Sisters for Life as core discipleship curriculum",
                "Used in 8 countries and 50+ partner ministries",
                "Designed for personal study, marriages, and small groups",
                "Companion study guide and small-group facilitator track",
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
                Order the book
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a className="btn btn-ghost" href="pages/the-authority-of-love.html#sample" style={{ borderColor: "oklch(0.4 0.02 60)", color: "oklch(0.92 0.02 70)" }}>
                Sample chapter (free)
              </a>
            </div>
            <p className="book-pull">
              "Greg's foundational message centers on the Lordship of Christ, encouraging discipleship
              beyond marriage, family, and purity into all areas of Christian life."
              <cite>— International Marriage &amp; Family Conference</cite>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= Media ================= */
const MEDIA = {
  watch: [
    { dur: "Featured", title: "What the Authority of Love really means", img: "video · keynote stage, wide", imgPath: "assets/images/keynote-stage.png", big: true, badge: "Latest sermon" },
    { dur: "12 min",   title: "Marriage isn't a contract — it's a covenant", img: "video · marriage talk", imgPath: "assets/images/marriage-talk.png", badge: "Marriage Unleashed" },
    { dur: "8 min",    title: "Character starts in the home", img: "video · classroom", imgPath: "assets/images/classroom.png", badge: "Character Matters" },
    { dur: "23 min",   title: "Greg in Cameroon — the African church rising", img: "video · conference, africa", imgPath: "assets/images/conference-africa.png", badge: "Conference" },
    { dur: "6 min",    title: "A father's blessing changes a son", img: "video · father & son", imgPath: "assets/images/father-blessing.png", badge: "Devotional" },
  ],
  read: [
    { dur: "Cover story", title: "The week we re-learned forgiveness", img: "photo · open book and journal", imgPath: "assets/images/open-journal.png", big: true, badge: "Featured essay" },
    { dur: "5 min read", title: "Why we don't teach 'find your purpose'", img: "photo · notebook", imgPath: "assets/images/notebook.png", badge: "Article" },
    { dur: "8 min read", title: "The first conversation every couple needs", img: "photo · two coffee cups", imgPath: "assets/images/two-coffee-cups.png", badge: "Marriage" },
    { dur: "Study", title: "Authority of Love — 30-day reading plan", img: "photo · bible & pen", imgPath: "assets/images/bible-and-pen.png", badge: "Plan" },
    { dur: "3 min read", title: "Grandparenting on purpose", img: "photo · grandparent & child", imgPath: "assets/images/grandparent-and-child.png", badge: "Family" },
  ],
  listen: [
    { dur: "Daily · 15 min", title: "The Authority of Love — weekdays, 11 AM ET", img: "audio · microphone, studio", imgPath: "assets/images/microphone-studio.png", big: true, badge: "WJMM 99.1 FM" },
    { dur: "Ep. 142 · 38 min", title: "Discipleship in a distracted age", img: "audio · podcast cover", imgPath: "assets/images/podcast-cover.png", badge: "Podcast" },
    { dur: "Monthly", title: "KY's Voice — on Word Media", img: "audio · radio dial", imgPath: "assets/images/radio-dial.png", badge: "WGTK 970 AM" },
    { dur: "Ep. 141 · 41 min", title: "When marriages survive the hard years", img: "audio · couple interview", imgPath: "assets/images/marriage-resilient.png", badge: "Podcast" },
    { dur: "Apple · Spotify · YouTube", title: "Subscribe wherever you listen", img: "audio · platforms", imgPath: "assets/images/platforms.png", badge: "Subscribe" },
  ],
};

function Play() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 3l7 4-7 4z" fill="currentColor"/></svg>;
}

function Media() {
  const [tab, setTab] = React.useState("watch");
  const items = MEDIA[tab];
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
            <a className={"media-card" + (m.big ? " big" : "")} href="pages/library.html" key={tab + i}>
              <div className="imgph dark">
                {m.imgPath && <img src={m.imgPath} alt="" />}
                <span className="lbl">{m.img}</span>
              </div>
              <span className="badge">{m.badge}</span>
              <span className="play" aria-hidden="true"><Play /></span>
              <div className="media-card-meta">
                <div className="duration">{m.dur}</div>
                <h3>{m.title}</h3>
              </div>
            </a>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          <a className="btn btn-ghost" href="pages/library.html">View full library →</a>
        </div>
      </div>
    </section>
  );
}

window.Book = Book;
window.Media = Media;
