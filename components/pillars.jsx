/* global React */
// Watch / Listen / Read for each priority open the on-site library, filtered
// to that priority and format (data/library.js). The "Explore on the app"
// button goes to the app section, which carries the store links + access code
// (connectapp. has no public deep links into a channel).
const LIB_BASE = "pages/library.html";
const libChannel = (key, fmt) => `${LIB_BASE}?pillar=${key}${fmt ? `&fmt=${fmt}` : ""}`;

const PILLAR_DATA = [
  {
    key: "lordship",
    name: "Love & Lordship",
    short: "Lordship",
    n: "01",
    verse: "Colossians 1:18",
    title: "Christ first — in <em>every</em> part of life.",
    body: "The foundation under everything we teach. Before marriage advice, before parenting strategy, before relational tools, before church servant-leadership, before engaging culture — there is one priority: the Love & Lordship of Jesus Christ. Get this right and the rest follows.",
    visual: "Christ's Love & Lordship is the priority for all of life",
    visualImg: "assets/images/daddy-studying-bible.jpg",
    stat: "Foundational",
    h: "Christ's Love & Lordship is the priority for all of life.",
  },
  {
    key: "discipleship",
    name: "Discipleship",
    short: "Discipleship",
    n: "02",
    verse: "Matthew 28:19; Luke 14:25–35",
    title: "Disciples who <em>make</em> disciples.",
    body: "We don't measure success by audiences reached. We measure it by lives changed who, in turn, change other lives. Practical, biblical discipleship that multiplies — exactly what the church needs in this generation.",
    visual: "Equipping disciples to disciple others",
    visualImg: "assets/images/mentor-mentee-coffee.png",
    stat: "Multiplying",
    h: "Equipping disciples to disciple others.",
  },
  {
    key: "relationship",
    name: "Relationship",
    short: "Relationship",
    n: "03",
    verse: "1 John 4:19; Mark 12:31",
    title: "Loved <em>first</em>. Loving <em>back</em>.",
    body: "Every relationship in our lives — with God, with family, with neighbors, with the broken — flows from being loved first by Him. We help you live that order rightly, day after ordinary day.",
    visual: "Love that flows from God, into us, into others",
    visualImg: "assets/images/friends-praying-outdoors.png",
    stat: "Vertical & horizontal",
    h: "Love that flows from God, into us, into others.",
  },
  {
    key: "marriage",
    name: "Marriage",
    short: "Marriage",
    n: "04",
    verse: "Ephesians 5:21–33; Hebrews 13:4",
    title: "A lifetime worthy <em>covenant</em>.",
    body: "Marriage isn't a contract you can break when it gets hard — it's a covenant that becomes a portrait of Christ and the church. Greg and Ami have walked this road in the Love & Lordship of Christ for 35 years by God's grace, and this ministry can help you do the same.",
    visual: "35 years, still going strong",
    visualImg: "assets/images/hands-wedding-bands.png",
    stat: "35 years, still going strong",
    h: "Marriage as covenant, not contract.",
    extra: { label: "Premarital & marriage mentoring", note: "Greg is a certified Prepare/Enrich facilitator.", href: "https://www.prepare-enrich.com/" },
  },
  {
    key: "family",
    name: "Family",
    short: "Family",
    n: "05",
    verse: "Deuteronomy 6:4–9; Proverbs 22:6; Ephesians 6:4",
    title: "Home — the place where <em>disciples</em> are raised.",
    body: "From toddlers to teenagers to adult children — your home is the first and most important mission field you'll ever steward. We resource parents, grandparents, and single-parent families with practical, biblical discipleship.",
    visual: "The home is the first and priority place disciples are made",
    visualImg: "assets/images/multigen-dinner-table.png",
    stat: "Three generations",
    h: "The home is the first and priority place disciples are made.",
  },
  {
    key: "church",
    name: "Church",
    short: "Church",
    n: "06",
    verse: "Ephesians 4:11–16; 1 Peter 5:1–4",
    title: "The bride — <em>led</em> by servant-shepherds.",
    body: "The local church is Christ's chosen vehicle for discipleship — and her leaders are called to serve, shepherd, and equip the saints for works of ministry. We come alongside pastors, elders, and lay leaders to strengthen the church in love and Lordship.",
    visual: "Servant-leadership in the local church",
    visualImg: "assets/images/pulpit.png",
    stat: "For pastors, elders & lay leaders",
    h: "Servant-leadership in the local church.",
  },
  {
    key: "culture",
    name: "Culture",
    short: "Culture",
    n: "07",
    verse: "Matthew 5:13–16; Romans 12:1–2",
    title: "Salt &amp; light <em>where</em> we live.",
    body: "Christians aren't called to retreat from culture or be conformed to it — we're called to engage it as ambassadors of the Kingdom. The Love & Lordship of Christ shapes how we live, work, vote, raise families, and love our neighbors in a watching world.",
    visual: "Engaging culture as Kingdom ambassadors",
    visualImg: "assets/images/keynote-stage.png",
    stat: "Ambassadors of the Kingdom",
    h: "Engaging culture as Kingdom ambassadors.",
  },
];

function PillarIcon({ which }) {
  const common = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (which) {
    case "lordship":     return <svg {...common}><path d="M8 1v14M3 6h10"/></svg>;
    case "discipleship": return <svg {...common}><circle cx="5" cy="5" r="2"/><circle cx="11" cy="11" r="2"/><path d="M6.5 6.5L9.5 9.5"/></svg>;
    case "relationship": return <svg {...common}><circle cx="5" cy="8" r="3"/><circle cx="11" cy="8" r="3"/></svg>;
    case "marriage":     return <svg {...common}><path d="M8 13s-5-3-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 4-5 7-5 7z"/></svg>;
    case "family":       return <svg {...common}><path d="M2 14V8l6-5 6 5v6"/><path d="M6 14v-4h4v4"/></svg>;
    case "church":       return <svg {...common}><path d="M8 1v3M6 4h4M3 7v7h10V7L8 4 3 7z"/><path d="M7 14v-3h2v3"/></svg>;
    case "culture":      return <svg {...common}><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2 2 3 4 3 6s-1 4-3 6c-2-2-3-4-3-6s1-4 3-6z"/></svg>;
    default: return null;
  }
}

function Pillars({ layout = "tabs" }) {
  const [idx, setIdx] = React.useState(0);
  const data = PILLAR_DATA[idx];

  return (
    <section id="pillars" className="pillars" data-layout={layout}>
      <div className="wrap">
        <div className="pillars-head reveal">
          <div>
            <div className="eyebrow">Our foundation &amp; priorities</div>
            <h2>One foundation. <em>Six</em> places where it shows up.</h2>
          </div>
          <div className="right">
            <div className="pillar-arrows only-desktop">
              <button className="pillar-arrow" aria-label="Previous priority" onClick={() => setIdx((idx - 1 + PILLAR_DATA.length) % PILLAR_DATA.length)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="pillar-arrow" aria-label="Next priority" onClick={() => setIdx((idx + 1) % PILLAR_DATA.length)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div className="pillar-tabs" role="tablist">
          {PILLAR_DATA.map((p, i) => (
            <button
              key={p.key}
              role="tab"
              aria-selected={i === idx}
              className={"pillar-tab" + (i === idx ? " active" : "")}
              onClick={() => setIdx(i)}
            >
              <PillarIcon which={p.key} />
              <span>{p.n} · {p.short}</span>
            </button>
          ))}
        </div>

        <div className="pillar-panel" key={idx}>
          <div className="pillar-detail reveal-stagger in">
            <div>
              <div className="verse">{data.verse}</div>
              <h3 dangerouslySetInnerHTML={{ __html: data.title }} />
              <p className="body">{data.body}</p>
              <div className="pillar-channels">
                <a className="pillar-channel" href={libChannel(data.key, "Watch")}>
                  <span className="ch-icn" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 3l8 5-8 5z" fill="currentColor"/></svg>
                  </span>
                  <span className="ch-body">
                    <span className="ch-type">Watch</span>
                    <span className="ch-title">{data.name} — videos</span>
                  </span>
                </a>
                <a className="pillar-channel" href={libChannel(data.key, "Listen")}>
                  <span className="ch-icn" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 2v8M8 13v1M5 8a3 3 0 0 0 6 0V5a3 3 0 0 0-6 0z"/></svg>
                  </span>
                  <span className="ch-body">
                    <span className="ch-type">Listen</span>
                    <span className="ch-title">Podcast &amp; radio episodes</span>
                  </span>
                </a>
                <a className="pillar-channel" href={libChannel(data.key, "Read")}>
                  <span className="ch-icn" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h5l1 1v9H3zM13 3H8l-1 1v9h6z"/></svg>
                  </span>
                  <span className="ch-body">
                    <span className="ch-type">Read</span>
                    <span className="ch-title">Articles &amp; devotionals</span>
                  </span>
                </a>
              </div>
              {data.extra && (
                <a className="pillar-extra" href={data.extra.href} target="_blank" rel="noopener noreferrer">
                  <span className="lbl">{data.extra.label}</span>
                  <span className="note">{data.extra.note} <span className="arr">→</span></span>
                </a>
              )}
            </div>
            <div className="actions">
              <a className="btn btn-primary" href="#app">Explore on the L&amp;L App</a>
              <a className="btn-link" href="#app">Learn about the app <span className="arr">→</span></a>
            </div>
          </div>

          <div className="pillar-visual">
            <span className="number">{data.n}</span>
            <div className="imgph dark" style={{ width: "100%", height: "100%" }}>
              {data.visualImg && <img src={data.visualImg} alt="" />}
              <span className="lbl">{data.visual}</span>
            </div>
            <div className="meta">
              <div className="h">{data.h}</div>
              <div className="stat">{data.stat}</div>
            </div>
          </div>
        </div>

        {/* Alternative card grid (used when layout="grid") */}
        <div className="pillar-cards">
          {PILLAR_DATA.map((p) => (
            <div className="pillar-card" key={p.key} onClick={() => setIdx(PILLAR_DATA.findIndex(x => x.key === p.key))}>
              <div className="imgph dark">
                {p.visualImg && <img src={p.visualImg} alt="" />}
                <span className="lbl">{p.visual}</span>
              </div>
              <div className="pillar-card-meta">
                <div className="n">Priority {p.n}</div>
                <h4>{p.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

window.Pillars = Pillars;
