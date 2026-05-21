/* global React */
const PILLAR_DATA = [
  {
    key: "lordship",
    name: "Lordship",
    n: "01",
    verse: "Colossians 1:18",
    title: "Christ first — in <em>every</em> corner of life.",
    body: "The foundation under everything we teach. Before marriage advice, before parenting strategy, before relational tools, there is one priority relationship: the Lordship of Jesus. Get this right and the rest follows.",
    visual: "photo · open Bible, morning light",
    visualImg: "assets/images/open-bible-morning.png",
    stat: "Foundational",
    h: "Christ as the priority relationship of life.",
    resources: [
      { type: "Sermon series", title: "The Authority of Love — Part I" },
      { type: "Workbook", title: "Surrender & Sanctification" },
      { type: "Podcast", title: "Lordship begins in the small things" },
      { type: "Reading plan", title: "21 days of Lordship" },
    ],
  },
  {
    key: "discipleship",
    name: "Discipleship",
    n: "02",
    verse: "Matthew 28:19",
    title: "Disciples who <em>make</em> disciples.",
    body: "We don't measure success by audiences reached. We measure it by lives changed who, in turn, change other lives. Practical, biblical discipleship that multiplies — exactly what the church needs in this generation.",
    visual: "photo · mentor + mentee, coffee, talking",
    visualImg: "assets/images/mentor-mentee-coffee.png",
    stat: "Multiplying",
    h: "Equipping disciples to disciple others.",
    resources: [
      { type: "Curriculum", title: "Authority of Love for small groups" },
      { type: "Conference", title: "Train the trainer · Spring '26" },
      { type: "Article", title: "Why programs aren't discipleship" },
      { type: "Mentor guide", title: "Walking with the next one" },
    ],
  },
  {
    key: "relationship",
    name: "Relationship",
    n: "03",
    verse: "1 John 4:19",
    title: "Loved <em>first</em>. Loving <em>back</em>.",
    body: "Every relationship in our lives — with God, with family, with neighbors, with the broken — flows from being loved first by Him. We help you live that order rightly, day after ordinary day.",
    visual: "photo · two friends praying outdoors",
    visualImg: "assets/images/friends-praying-outdoors.png",
    stat: "Vertical & Horizontal",
    h: "Love that flows from God, into us, into others.",
    resources: [
      { type: "Devotional", title: "Loved · A 30-day journey" },
      { type: "Talk", title: "Purity & the heart's true longing" },
      { type: "Article", title: "Forgiveness isn't a feeling" },
      { type: "Workshop", title: "Restoring broken friendships" },
    ],
  },
  {
    key: "marriage",
    name: "Marriage",
    n: "04",
    verse: "Ephesians 5:25",
    title: "A covenant <em>worth</em> a lifetime.",
    body: "Marriage isn't a contract you can break when it gets hard — it's a covenant that becomes a portrait of Christ and the church. Greg & Ami have walked this road for 34 years and counting, and the path is open to you.",
    visual: "photo · hands clasped, wedding bands",
    visualImg: "assets/images/hands-wedding-bands.png",
    stat: "34 years, still going",
    h: "Marriage as covenant, not contract.",
    resources: [
      { type: "Marriage event", title: "Authority of Love · Lexington" },
      { type: "Series", title: "Marriage Unleashed (WTVQ archives)" },
      { type: "Premarital", title: "Six conversations before 'I do'" },
      { type: "Counseling guide", title: "When the seasons shift" },
    ],
  },
  {
    key: "family",
    name: "Family",
    n: "05",
    verse: "Deuteronomy 6:7",
    title: "A home that <em>raises</em> disciples.",
    body: "From toddlers to teenagers to adult children — your home is the first and most important mission field you'll ever steward. We resource parents, grandparents, and single-parent families with practical, biblical roadmaps.",
    visual: "photo · multigenerational dinner table",
    visualImg: "assets/images/multigen-dinner-table.png",
    stat: "Three generations",
    h: "The home as the first place disciples are made.",
    resources: [
      { type: "Course", title: "Disciple-making parents" },
      { type: "Family worship", title: "30 evenings around the table" },
      { type: "Article", title: "Grandparenting on purpose" },
      { type: "Podcast", title: "Conversations every teenager needs" },
    ],
  },
];

function PillarIcon({ which }) {
  // Tiny abstract glyphs, NOT detailed illustration
  const common = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (which) {
    case "lordship":     return <svg {...common}><path d="M8 1v14M3 6h10"/></svg>;
    case "discipleship": return <svg {...common}><circle cx="5" cy="5" r="2"/><circle cx="11" cy="11" r="2"/><path d="M6.5 6.5L9.5 9.5"/></svg>;
    case "relationship": return <svg {...common}><circle cx="5" cy="8" r="3"/><circle cx="11" cy="8" r="3"/></svg>;
    case "marriage":     return <svg {...common}><path d="M8 13s-5-3-5-7a3 3 0 0 1 5-2 3 3 0 0 1 5 2c0 4-5 7-5 7z"/></svg>;
    case "family":       return <svg {...common}><path d="M2 14V8l6-5 6 5v6"/><path d="M6 14v-4h4v4"/></svg>;
    default: return null;
  }
}

function ResourceIcon({ type }) {
  const t = type.toLowerCase();
  const s = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" };
  if (t.includes("pod") || t.includes("talk")) return <svg {...s}><path d="M8 2v8M8 13v1M5 8a3 3 0 0 0 6 0V5a3 3 0 0 0-6 0z"/></svg>;
  if (t.includes("read") || t.includes("article") || t.includes("devot")) return <svg {...s}><path d="M3 3h5l1 1v9H3zM13 3H8l-1 1v9h6z"/></svg>;
  if (t.includes("event") || t.includes("conf") || t.includes("workshop")) return <svg {...s}><rect x="2.5" y="3.5" width="11" height="10" rx="1"/><path d="M2.5 6h11M6 2v3M10 2v3"/></svg>;
  if (t.includes("curr") || t.includes("course") || t.includes("guide") || t.includes("workbook")) return <svg {...s}><path d="M3 2h10v12H3z M3 2v12 M7 2v12"/></svg>;
  return <svg {...s}><circle cx="8" cy="8" r="5"/></svg>;
}

function Pillars({ layout = "tabs" }) {
  const [idx, setIdx] = React.useState(0);
  const data = PILLAR_DATA[idx];

  return (
    <section id="pillars" className="pillars" data-layout={layout}>
      <div className="wrap">
        <div className="pillars-head reveal">
          <div>
            <div className="eyebrow">Our five priorities</div>
            <h2>One foundation. <em>Five</em> places where it shows up.</h2>
          </div>
          <div className="right">
            <div className="pillar-arrows only-desktop">
              <button className="pillar-arrow" aria-label="Previous pillar" onClick={() => setIdx((idx - 1 + PILLAR_DATA.length) % PILLAR_DATA.length)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="pillar-arrow" aria-label="Next pillar" onClick={() => setIdx((idx + 1) % PILLAR_DATA.length)}>
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
              <span>{p.n} · {p.name}</span>
            </button>
          ))}
        </div>

        <div className="pillar-panel" key={idx}>
          <div className="pillar-detail reveal-stagger in">
            <div>
              <div className="verse">{data.verse}</div>
              <h3 dangerouslySetInnerHTML={{ __html: data.title }} />
              <p className="body">{data.body}</p>
              <div className="pillar-resources">
                {data.resources.map((r) => (
                  <a className="pillar-resource" key={r.title} href="pages/library.html">
                    <span className="res-icn"><ResourceIcon type={r.type} /></span>
                    <span className="res-body">
                      <span className="res-type">{r.type}</span>
                      <span className="res-title">{r.title}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
            <div className="actions">
              <a className="btn btn-primary" href="pages/library.html">Explore {data.name.toLowerCase()}</a>
              <a className="btn-link" href="#newsletter">Get the {data.name.toLowerCase()} reading plan <span className="arr">→</span></a>
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
                <div className="n">Pillar {p.n}</div>
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
