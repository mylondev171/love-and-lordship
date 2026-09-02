/* global React */
const { useState, useEffect, useRef } = React;

function NavLogo({ homeBase = "#top", imgBase = "" }) {
  return (
    <a href={homeBase} className="nav-logo" aria-label="Love and Lordship — Home">
      <img className="nav-logo-img" src={`${imgBase}assets/images/logo-white-on-blue.jpg`} alt="Love & Lordship" />
    </a>
  );
}

function Chev() {
  return (
    <svg className="chev" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const NAV_ITEMS = [
  {
    key: "mission",
    label: "Mission",
    cols: [
      {
        title: "Foundation / Pillars",
        items: [
          { name: "Love & Lordship", href: "#pillars" },
          { name: "Discipleship", href: "#pillars" },
          { name: "Relationship", href: "#pillars" },
          { name: "Marriage", href: "#pillars" },
          { name: "Family", href: "#pillars" },
          { name: "Church", href: "#pillars" },
          { name: "Culture", href: "#pillars" },
        ],
      },
      {
        title: "Who We Are",
        items: [
          { name: "Our Vision", href: "pages/about.html" },
          { name: "Greg Williams", href: "pages/about.html" },
          { name: "Global Reach", href: "#impact" },
          { name: "Statement of Faith", href: "pages/statement-of-faith.html" },
        ],
      },
      {
        title: "Get Involved",
        items: [
          { name: "Attend an Event", href: "pages/events.html" },
          { name: "Host a Conference", href: "pages/invite-greg.html" },
          { name: "Become a Partner", href: "https://give.cornerstone.cc/loveandlordship" },
          { name: "Volunteer", href: "pages/contact.html" },
        ],
      },
    ],
    feature: { eyebrow: "Now Available", title: "The Authority of Love, Second Edition", body: "Greg & Ami Williams' book — chosen as curriculum by Sisters for Life.", cta: "Order the book", href: "pages/the-authority-of-love.html" },
  },
  {
    key: "media",
    label: "Media",
    cols: [
      {
        title: "Watch",
        items: [
          { name: "Family Foundation Friday", href: "pages/library.html?fmt=Watch&series=Family%20Foundation%20Friday" },
          { name: "Wednesdays 4 Women", href: "pages/library.html?fmt=Watch&series=Wednesdays%204%20Women" },
          { name: "All videos", href: "pages/library.html?fmt=Watch" },
        ],
      },
      {
        title: "Listen",
        items: [
          { name: "The Authority of Love — daily radio", href: "pages/library.html?fmt=Listen&series=The%20Authority%20of%20Love%20%C2%B7%20Daily%20radio" },
          { name: "God Comes First", href: "pages/library.html?fmt=Listen&series=God%20Comes%20First" },
          { name: "Apple Podcasts · Podbean · RSS", href: "pages/library.html#subscribe" },
        ],
      },
      {
        title: "Read",
        items: [
          { name: "The Authority of Love, Second Edition", href: "pages/the-authority-of-love.html" },
          { name: "Articles & devotionals", href: "pages/library.html?fmt=Read" },
          { name: "The “One Another” series", href: "pages/library.html?fmt=Read&series=One%20Another" },
        ],
      },
    ],
    feature: { eyebrow: "Now live", title: "The Love & Lordship App", body: "Messages, podcasts, articles and events — inside connectapp. Download it and enter the access code to join.", cta: "Get the app", href: "#app" },
  },
  {
    key: "events",
    label: "Events",
    href: "pages/events.html",
  },
  {
    key: "app",
    label: "App",
    href: "#app",
  },
];

function Nav({ onDonate, homeBase = "" }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef(null);

  // When on a subpage (homeBase set), prefix anchor hrefs with the home URL
  // and strip the "pages/" prefix from page links so they resolve as siblings.
  const link = (href) => {
    if (!href) return href;
    if (homeBase) {
      if (href.startsWith("#")) return `${homeBase}${href}`;
      if (href.startsWith("pages/")) return href.slice(6);
    }
    return href;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobile) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobile]);

  const handleEnter = (key) => {
    clearTimeout(closeTimer.current);
    setOpen(key);
  };
  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(null), 120);
  };

  return (
    <header className={"nav-shell" + (scrolled ? " scrolled" : "")}>
      <div className="nav-inner">
        <NavLogo homeBase={homeBase || "#top"} imgBase={homeBase ? "../" : ""} />
        <nav className="nav-links" onMouseLeave={handleLeave}>
          {NAV_ITEMS.map((item) => {
            if (!item.cols) {
              return (
                <a key={item.key} href={link(item.href)} className="nav-link" onMouseEnter={() => handleEnter(null)}>
                  {item.label}
                </a>
              );
            }
            const isOpen = open === item.key;
            return (
              <button
                key={item.key}
                className={"nav-link" + (isOpen ? " active" : "")}
                aria-expanded={isOpen}
                onMouseEnter={() => handleEnter(item.key)}
                onFocus={() => handleEnter(item.key)}
                onClick={() => setOpen(isOpen ? null : item.key)}
              >
                {item.label}
                <Chev />
              </button>
            );
          })}
        </nav>
        <div className="nav-right">
          <a className="nav-search only-desktop" aria-label="Search the library" href={link("pages/library.html") + "?focus=1"}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14 14l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </a>
          <button className="btn btn-give nav-give" onClick={onDonate}>
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M8 14s-5-3.5-5-7.5A3 3 0 0 1 8 4a3 3 0 0 1 5 2.5C13 10.5 8 14 8 14z" fill="currentColor"/>
            </svg>
            Give
          </button>
          <button className="nav-burger only-mobile" aria-label="Menu" onClick={() => setMobile(!mobile)}>
            <span></span>
          </button>
        </div>
      </div>

      {NAV_ITEMS.filter(i => i.cols).map((item) => (
        <div
          key={item.key}
          className={"mega" + (open === item.key ? " open" : "")}
          onMouseEnter={() => handleEnter(item.key)}
          onMouseLeave={handleLeave}
        >
          <div className="mega-grid">
            {item.cols.map((col) => (
              <div className="mega-col" key={col.title}>
                <h6>{col.title}</h6>
                <ul>
                  {col.items.map((it) => (
                    <li key={it.name}><a href={link(it.href)} onClick={() => setOpen(null)}>{it.name}</a></li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="mega-feature">
              <div>
                <div className="eyebrow">{item.feature.eyebrow}</div>
                <h3>{item.feature.title}</h3>
                <p style={{ margin: 0, color: "oklch(0.7 0.015 70)", fontSize: 14, lineHeight: 1.5 }}>{item.feature.body}</p>
              </div>
              <a className="btn-link" href={link(item.feature.href || "#")} onClick={() => setOpen(null)} style={{ color: "var(--gold)", marginTop: 16 }}>
                {item.feature.cta} <span className="arr">→</span>
              </a>
            </div>
          </div>
        </div>
      ))}

      <div className={"mobile-drawer" + (mobile ? " open" : "")}>
        <h6>Mission</h6>
        {["Love & Lordship","Discipleship","Relationship","Marriage","Family","Church","Culture"].map(n => <a key={n} href={link("#pillars")} onClick={() => setMobile(false)}>{n}</a>)}
        <h6>Media</h6>
        <a href={link("#media")} onClick={() => setMobile(false)}>Watch</a>
        <a href={link("#media")} onClick={() => setMobile(false)}>Read</a>
        <a href={link("#media")} onClick={() => setMobile(false)}>Listen</a>
        <h6>Engage</h6>
        <a href={link("#events")} onClick={() => setMobile(false)}>Events</a>
        <a href={link("#app")} onClick={() => setMobile(false)}>The L&amp;L App</a>
        <a href={link("#story")} onClick={() => setMobile(false)}>About</a>
        <a href={link("#newsletter")} onClick={() => setMobile(false)}>Newsletter</a>
        <div style={{ marginTop: 24 }}>
          <button className="btn btn-give" style={{ width: "100%", justifyContent: "center" }} onClick={() => { setMobile(false); onDonate(); }}>Give</button>
        </div>
      </div>
    </header>
  );
}

window.Nav = Nav;
