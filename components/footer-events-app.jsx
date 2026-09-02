/* global React */
// 2026 schedule, taken from loveandlordship.com/ministry-updates-events/ on
// 2026-09-02. `on` is the ISO start date used to split upcoming from past.
// Add new dates here (pages/events.html reads the same list via window.LL_EVENTS).
const LL_EVENTS = [
  { on: "2026-01-24", date: "Jan 24",    name: "Super Saturday for Men",                       loc: "The Mission Church · Lexington, KY",            type: "Men's event" },
  { on: "2026-01-31", date: "Jan 31",    name: "Saturday Morning Men's Group",                 loc: "NECC · Lexington, KY",                          type: "Men's event" },
  { on: "2026-02-07", date: "Feb 7",     name: "IronMan",                                      loc: "Russ Young's · Lexington, KY",                  type: "Men's event" },
  { on: "2026-02-17", date: "Feb 17",    name: "Celebrate Recovery",                           loc: "Jessamine Christian Church · Nicholasville, KY", type: "Partner event" },
  { on: "2026-02-27", date: "Feb 27",    name: "KY's Voice — live 11 AM on WGTK 970 AM; replays 4 &amp; 8 PM on WBNA 21", loc: "Louisville, KY",  type: "Broadcast" },
  { on: "2026-04-18", date: "Apr 18",    name: "Saturday Morning Men's Group",                 loc: "NECC · Lexington, KY",                          type: "Men's event" },
  { on: "2026-04-25", date: "Apr 25",    name: "America Reads the Bible — Scripture reading",  loc: "Museum of the Bible · Washington, DC",          type: "Partner event" },
  { on: "2026-05-02", date: "May 2",     name: "IronMan",                                      loc: "Russ Young's · Lexington, KY",                  type: "Men's event" },
  { on: "2026-05-12", date: "May 12",    name: "Celebrate Recovery",                           loc: "Jessamine Christian Church · Nicholasville, KY", type: "Partner event" },
  { on: "2026-05-29", date: "May 29–31", name: "Colson Fellows Conference &amp; Commissioning", loc: "Knoxville, TN",                                type: "Partner event" },
  { on: "2026-07-25", date: "Jul 25",    name: "Saturday Morning Men's Group",                 loc: "NECC · Lexington, KY",                          type: "Men's event" },
  { on: "2026-07-26", date: "Jul 26",    name: "Greg preaching",                               loc: "Peyton's Lick Christian Church · Mt Sterling, KY", type: "Church service" },
  { on: "2026-08-01", date: "Aug 1",     name: "IronMan",                                      loc: "Russ Young's · Lexington, KY",                  type: "Men's event" },
  { on: "2026-08-18", date: "Aug 18",    name: "Celebrate Recovery",                           loc: "Jessamine Christian Church · Nicholasville, KY", type: "Partner event" },
  { on: "2026-09-18", date: "Sep 18–20", name: "Men's Retreat",                                loc: "Camp Loucon · Leitchfield, KY",                 type: "Retreat", featured: true },
  { on: "2026-09-25", date: "Sep 25–26", name: "Communion 250 service",                        loc: "Renfro Valley · Mt Vernon, KY",                 type: "Church service" },
  { on: "2026-10-02", date: "Oct 2",     name: "Upper Room Men — speaking",                    loc: "Southeast Christian Church · Louisville, KY",   type: "Men's event" },
  { on: "2026-10-05", date: "Oct 5",     name: "KY Right to Life Golf Scramble",               loc: "Shelbyville Country Club · Shelbyville, KY",    type: "Partner event" },
  { on: "2026-10-17", date: "Oct 17",    name: "Saturday Morning Men's Group",                 loc: "NECC · Lexington, KY",                          type: "Men's event" },
  { on: "2026-10-24", date: "Oct 24",    name: "3rd Annual KY Family Forum — leadership role", loc: "Embassy Suites · Lexington, KY",                type: "Partner event" },
  { on: "2026-11-07", date: "Nov 7",     name: "IronMan",                                      loc: "Russ Young's · Lexington, KY",                  type: "Men's event" },
  { on: "2026-11-10", date: "Nov 10",    name: "Celebrate Recovery",                           loc: "Jessamine Christian Church · Nicholasville, KY", type: "Partner event" },
  { on: "2026-11-15", date: "Nov 15",    name: "Ministry sharing event",                       loc: "The Mission Church · Lexington, KY",            type: "Church service" },
].map(e => ({ year: e.on.slice(0, 4), badge: e.type, ...e }));
window.LL_EVENTS = LL_EVENTS;

const todayISO = () => new Date().toISOString().slice(0, 10);
const upcomingEvents = () => LL_EVENTS.filter(e => e.on >= todayISO());
window.LL_upcomingEvents = upcomingEvents;

// Homepage preview: the next four dates on the calendar.
const EVENTS = upcomingEvents().slice(0, 4);

function Pin() { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M6.5 11.5s4-3.2 4-6.5a4 4 0 1 0-8 0c0 3.3 4 6.5 4 6.5z"/><circle cx="6.5" cy="5" r="1.4"/></svg>; }
function CalIcon() { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="1.5" y="2.5" width="10" height="9" rx="1"/><path d="M1.5 5h10M4 1.5v2M9 1.5v2"/></svg>; }

function Events() {
  return (
    <section id="events" className="events">
      <div className="wrap">
        <div className="events-head reveal">
          <div>
            <div className="eyebrow">Coming up</div>
            <h2>Where we'll be <em>next</em>.</h2>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <a className="btn btn-ghost" href="pages/events.html">Filter</a>
            <a className="btn btn-primary" href="pages/events.html">All events</a>
          </div>
        </div>
        <div className="events-list">
          {EVENTS.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ink-mute)", border: "1px dashed var(--line)", borderRadius: "var(--r-md)" }}>
              No dates on the calendar right now. <a className="btn-link" href="pages/events.html">See the full 2026 schedule <span className="arr">→</span></a>
            </div>
          ) : EVENTS.map((e, i) => (
            <a className="event-row" key={i} href="pages/events.html">
              <div className="date">{e.date}<span className="yr">{e.year}</span></div>
              <div className="info">
                <h3 dangerouslySetInnerHTML={{ __html: e.name }} />
                <div className="meta">
                  <span><Pin /> {e.loc}</span>
                  <span><CalIcon /> {e.type}</span>
                </div>
              </div>
              <span className={"badge" + (e.featured ? " featured" : "")}>{e.badge}</span>
              <span className="go" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </a>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, flexWrap: "wrap", gap: 16 }}>
          <p style={{ color: "var(--ink-mute)", fontSize: 14, margin: 0 }}>Looking to host an event in your city? <a className="btn-link" href="pages/invite-greg.html">Invite us to come <span className="arr">→</span></a></p>
        </div>
      </div>
    </section>
  );
}

function PhoneScreen({ kind }) {
  if (kind === "feed") {
    return (
      <div className="phone-screen-content">
        <div className="ph-head"><span>9:41</span><span>L&amp;L</span></div>
        <div className="ph-title">Today's<br/>devotional</div>
        <div className="ph-card">
          <div className="ph-thumb" style={{ background: "linear-gradient(135deg, var(--wine), var(--ink))" }}></div>
          <div>
            <div className="ph-meta-l">Day 12 · Marriage</div>
            <div className="ph-meta-t">Listening before answering</div>
          </div>
        </div>
        <div className="ph-card">
          <div className="ph-thumb" style={{ background: "linear-gradient(135deg, var(--gold), var(--wine))" }}></div>
          <div>
            <div className="ph-meta-l">New episode</div>
            <div className="ph-meta-t">Authority of Love · Ep. 142</div>
          </div>
        </div>
        <div className="ph-card">
          <div className="ph-thumb" style={{ background: "linear-gradient(135deg, oklch(0.4 0.06 130), var(--ink))" }}></div>
          <div>
            <div className="ph-meta-l">Group · 12 messages</div>
            <div className="ph-meta-t">Lexington Q&amp;A · live tonight</div>
          </div>
        </div>
        <div className="phone-tab" aria-hidden="true">
          <span className="dot on"></span><span className="dot"></span><span className="dot"></span><span className="dot"></span>
        </div>
      </div>
    );
  }
  return (
    <div className="phone-screen-content">
      <div className="ph-head"><span>9:41</span><span>Give</span></div>
      <div className="ph-title">Partner with the mission</div>
      <div className="ph-card" style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        <div className="ph-meta-l">Monthly · 24 partners this week</div>
        <div style={{ display: "flex", gap: 6, width: "100%" }}>
          {[25, 50, 100, 250].map(n => (
            <div key={n} style={{ flex: 1, padding: "10px 0", textAlign: "center", border: "1px solid var(--line)", borderRadius: 6, fontFamily: "var(--font-display)", fontSize: 13, background: n === 50 ? "var(--ink)" : "transparent", color: n === 50 ? "var(--bg)" : "var(--ink)" }}>${n}</div>
          ))}
        </div>
      </div>
      <div className="ph-card" style={{ background: "var(--wine)", borderColor: "var(--wine)", color: "var(--bg)", justifyContent: "center" }}>
        <div className="ph-meta-t" style={{ color: "var(--bg)", marginTop: 0 }}>Give $50 / month</div>
      </div>
      <div className="phone-tab" aria-hidden="true">
        <span className="dot"></span><span className="dot"></span><span className="dot"></span><span className="dot on"></span>
      </div>
    </div>
  );
}

function AppPromo() {
  return (
    <section id="app" className="app-promo">
      <div className="wrap">
        <div className="app-grid">
          <div className="app-copy reveal-stagger">
            <div className="eyebrow">The L&amp;L App · Available now</div>
            <h2>The teaching, the community, and the daily rhythm — in your <em>pocket</em>.</h2>
            <p className="lead">
              The Love &amp; Lordship app lives inside <strong>connectapp.</strong> — a private, ad-free community
              platform. Download it, search for <strong>Love &amp; Lordship</strong>, and enter the access code
              to join. Every message, podcast, article and event lands there first, sorted into channels
              that match the seven priorities on this site.
            </p>
            <div className="app-code" aria-label="Access code">
              <span className="lbl">Access code</span>
              <span className="code">love</span>
            </div>
            <div className="app-features">
              <div className="app-feature">
                <div className="ic"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 3v10M12 3v10M4 6h8M4 10h8"/></svg></div>
                <div>
                  <div className="ttl">Eleven channels, one foundation</div>
                  <div className="desc">Daily radio, Family Foundation Friday, Wednesdays 4 Women, articles and more — each in its own channel, sorted by priority.</div>
                </div>
              </div>
              <div className="app-feature">
                <div className="ic"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="8" cy="8" r="6"/><path d="M5 8l2 2 4-4"/></svg></div>
                <div>
                  <div className="ttl">Events &amp; updates, first</div>
                  <div className="desc">New dates, registrations and ministry updates arrive as notifications — no algorithm, no ads, no noise.</div>
                </div>
              </div>
              <div className="app-feature">
                <div className="ic"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M8 14s-5-3.5-5-7.5A3 3 0 0 1 8 4a3 3 0 0 1 5 2.5C13 10.5 8 14 8 14z"/></svg></div>
                <div>
                  <div className="ttl">Partner from anywhere</div>
                  <div className="desc">One tap to give through Cornerstone, plus a direct line to ask Greg a question or invite him to speak.</div>
                </div>
              </div>
            </div>
            <div className="app-stores">
              <a className="app-store" href="https://apps.apple.com/us/app/connectapp/id6447310443" target="_blank" rel="noopener noreferrer">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true"><path d="M15.7 11.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 2.9 2.4 1.2 0 1.6-.8 3.1-.8 1.5 0 1.8.8 3.1.7 1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.6-.1-.1-2.6-1-2.6-4.1zM13.5 5c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z"/></svg>
                <span className="label">
                  <small>Download on the</small>App Store
                </span>
              </a>
              <a className="app-store" href="https://play.google.com/store/apps/details?id=social.inthezone.com" target="_blank" rel="noopener noreferrer">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true"><path d="M3.5 2.7c-.3.3-.5.8-.5 1.4v14c0 .6.2 1.1.5 1.4l9.4-8.4-9.4-8.4zm10.9 9.8 2.7 1.5c1.2.7 1.2 1.7 0 2.4l-2.5 1.4-2.9-2.6 2.7-2.7zm-1.2-1.2 2.7-2.7-2.5-1.4c-1.2-.7-2.3-.3-2.3-.3l2.1 4.4zm-9.4 8.4 8-7.2-2.7-2.7-5.3 9.9z"/></svg>
                <span className="label">
                  <small>Get it on</small>Google Play
                </span>
              </a>
            </div>
          </div>

          <div className="phone-stack reveal">
            <div className="phone phone-2" aria-hidden="true">
              <div className="screen"><PhoneScreen kind="give" /></div>
            </div>
            <div className="phone phone-1" aria-hidden="true">
              <div className="screen"><PhoneScreen kind="feed" /></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const submit = (e) => { e.preventDefault(); if (email.includes("@")) setSent(true); };

  return (
    <section id="newsletter" className="newsletter">
      <div className="wrap">
        <div className="newsletter-inner reveal">
          <div>
            <div className="eyebrow">Newsletter</div>
            <h2>The <em>Love &amp; Lordship</em> letter.</h2>
            <p>Weekly devotionals, event invites, and a short reflection from Greg — written for marriages, families, and the leaders who shepherd them.</p>
          </div>
          <div>
            {sent ? (
              <div className="nl-success">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9.5l3.5 3.5L14 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Welcome — check your inbox for the 30-day reading plan.
              </div>
            ) : (
              <form className="nl-form" onSubmit={submit}>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} aria-label="Email address" required />
                <button className="btn btn-give" type="submit">Subscribe</button>
              </form>
            )}
            <div className="nl-bonus"><span className="pip"></span>New subscribers get the 30-day Authority of Love reading plan, free.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SOCIALS = [
  { name: "Apple Podcasts", path: "M9 1a8 8 0 0 0-3 15.4V12a3 3 0 0 1 6 0v4.4A8 8 0 0 0 9 1zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" },
  { name: "YouTube", path: "M3 5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5zm5 1v4l3-2-3-2z" },
  { name: "Instagram", path: "M5 2.5h8a2.5 2.5 0 0 1 2.5 2.5v8a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 13V5A2.5 2.5 0 0 1 5 2.5zM9 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4-1a.6.6 0 1 1 0 1.2.6.6 0 0 1 0-1.2z" },
  { name: "Facebook", path: "M11 3h2v3h-2c-.6 0-1 .4-1 1v2h3l-.5 3H10v6H7v-6H5V9h2V6.5C7 4.6 8.6 3 10.5 3h.5z" },
  { name: "X / Twitter", path: "M3 3l5.5 7L3.5 15h2l4-4.5L13 15h2l-5.7-7.5L14.5 3h-2l-3.5 4L6 3H3z" },
  { name: "LinkedIn", path: "M3 4a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zM3 7h3v8H3V7zm5 0h3v1.2A3 3 0 0 1 13.5 7c2 0 2.5 1.5 2.5 3.5V15h-3v-4c0-1-.4-1.5-1.2-1.5S10 10 10 11v4H8V7z" },
  { name: "Vimeo", path: "M2 5c1-1 3-2 4-1 .8.7 1 2 1.5 4 .3 1 .5 2 1 2 .4 0 1-.7 1.5-1.5-.5-.1-1-.5-1-1.5 0-.8.7-1.5 1.5-1.5 1 0 1.5.8 1.5 1.8 0 1.5-1 3.5-2 5-1 1.5-2 2.2-3 2-1.5-.3-2-3-2.5-5-.3-1-.5-2-1-2-.2 0-.5.2-.8.5L2 5z" },
];

function Footer({ onDonate, homeBase = "" }) {
  const link = (href) => {
    if (!href) return href;
    if (homeBase) {
      if (href.startsWith("#")) return `${homeBase}${href}`;
      if (href.startsWith("pages/")) return href.slice(6);
    }
    return href;
  };
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href={link("#top")} className="footer-logo" aria-label="Love & Lordship — Home">
              <img src={`${homeBase ? "../" : ""}assets/images/logo-white-on-blue.jpg`} alt="Love &amp; Lordship" />
            </a>
            <p>Building every life and relationship on the Love &amp; Lordship of Jesus Christ.</p>
            <div className="footer-socials">
              {SOCIALS.map(s => (
                <a key={s.name} href="#" aria-label={s.name}>
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h6>Mission</h6>
            <ul>
              <li><a href={link("#pillars")}>Love &amp; Lordship</a></li>
              <li><a href={link("#pillars")}>Discipleship</a></li>
              <li><a href={link("#pillars")}>Relationship</a></li>
              <li><a href={link("#pillars")}>Marriage</a></li>
              <li><a href={link("#pillars")}>Family</a></li>
              <li><a href={link("#pillars")}>Church</a></li>
              <li><a href={link("#pillars")}>Culture</a></li>
            </ul>
          </div>
          <div>
            <h6>Media</h6>
            <ul>
              <li><a href={link("pages/library.html")}>Watch</a></li>
              <li><a href={link("pages/library.html")}>Read</a></li>
              <li><a href={link("pages/library.html")}>Listen</a></li>
              <li><a href={link("pages/the-authority-of-love.html")}>The book</a></li>
            </ul>
          </div>
          <div>
            <h6>Engage</h6>
            <ul>
              <li><a href={link("pages/events.html")}>Events</a></li>
              <li><a href={link("#app")}>The L&amp;L App</a></li>
              <li><a href={link("#newsletter")}>Newsletter</a></li>
              <li><a href={link("pages/about.html")}>About</a></li>
              <li><a href={link("pages/contact.html")}>Contact</a></li>
            </ul>
          </div>
          <div className="footer-give-cta">
            <h4>Partner with us</h4>
            <p>Your monthly partnership funds curriculum, broadcast, and global discipleship.</p>
            <button className="btn btn-give" onClick={onDonate} style={{ width: "100%", justifyContent: "center" }}>Give today</button>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 Love &amp; Lordship · 324 Timothy Drive, Nicholasville, KY 40356 · (859) 229-6504</div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href={link("pages/terms.html")}>Terms of Use</a>
            <a href={link("pages/privacy.html")}>Privacy</a>
            <a href={link("pages/statement-of-faith.html")}>Statement of Faith</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function DonateModal({ open, onClose }) {
  const [freq, setFreq] = React.useState("monthly");
  const [amt, setAmt] = React.useState(50);
  const [custom, setCustom] = React.useState("");
  const amounts = freq === "monthly" ? [25, 50, 100, 250] : [50, 100, 250, 500];
  const impactText = {
    25: "underwrites 25 audio devotionals for the L&L app",
    50: "sends a copy of The Authority of Love to a partner ministry",
    100: "sponsors one marriage conference scholarship",
    250: "trains a small-group leader through the curriculum",
    500: "funds a regional discipleship intensive",
  };
  const eff = custom ? parseInt(custom) || 0 : amt;
  const nearest = Object.keys(impactText).map(Number).sort((a, b) => Math.abs(eff - a) - Math.abs(eff - b))[0];

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={"modal-back" + (open ? " open" : "")} onClick={onClose}>
      <div className="modal donate-modal" onClick={(e) => e.stopPropagation()}>
        <button className="donate-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
        <div className="eyebrow" style={{ marginBottom: 8 }}>Partner with us</div>
        <h3>Build the next <em>thousand</em> disciples.</h3>
        <p className="sub">Every gift trains marriages, equips parents, and sends teaching to the ten countries already using the message.</p>

        <div className="donate-frequency">
          <button className={freq === "monthly" ? "on" : ""} onClick={() => setFreq("monthly")}>Monthly partner</button>
          <button className={freq === "once" ? "on" : ""} onClick={() => setFreq("once")}>One-time gift</button>
        </div>

        <div className="donate-amounts">
          {amounts.map(a => (
            <button key={a} className={!custom && amt === a ? "on" : ""} onClick={() => { setAmt(a); setCustom(""); }}>${a}</button>
          ))}
        </div>
        <div className="donate-custom">
          <span className="dollar">$</span>
          <input type="number" placeholder="Custom amount" value={custom} onChange={e => setCustom(e.target.value)} />
          <span style={{ color: "var(--ink-mute)", fontSize: 13, fontFamily: "var(--font-mono)" }}>{freq === "monthly" ? "/ month" : "once"}</span>
        </div>

        <div className="donate-impact">
          <div className="ic">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 14s-5-3.5-5-7.5A3 3 0 0 1 8 4a3 3 0 0 1 5 2.5C13 10.5 8 14 8 14z" fill="currentColor"/></svg>
          </div>
          <div className="txt">
            <strong>${eff || nearest}{freq === "monthly" ? " / month" : ""}</strong> {impactText[nearest]}.
          </div>
        </div>

        <div className="donate-cta">
          <button className="btn btn-ghost" onClick={onClose}>Not now</button>
          <a className="btn btn-give" href="https://give.cornerstone.cc/loveandlordship" target="_blank" rel="noopener noreferrer">
            Continue to Cornerstone
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8m-3-3 3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </div>

        <div className="donate-footer">
          <span className="secure">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="2" y="5" width="7" height="5" rx="0.5"/><path d="M3.5 5V3a2 2 0 0 1 4 0v2"/></svg>
            Secure · Cornerstone giving
          </span>
          <span>501(c)(3) · Tax-deductible</span>
        </div>
      </div>
    </div>
  );
}

window.Events = Events;
window.AppPromo = AppPromo;
window.Newsletter = Newsletter;
window.Footer = Footer;
window.DonateModal = DonateModal;
