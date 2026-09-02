/* global React */
function Story() {
  return (
    <section id="story" className="story">
      <div className="wrap">
        <div className="story-grid">
          <div className="story-figure reveal">
            <div className="imgph dark">
              <img src="assets/images/greg-williams.jpg" alt="Greg Williams" />
              <span className="lbl">portrait · greg williams</span>
            </div>
            <span className="frame" aria-hidden="true"></span>
            <div className="caption">
              <span>Greg &amp; Ami Williams</span>
              <span>35 yrs · 3 kids · 3 grandkids &amp; counting</span>
            </div>
          </div>

          <div className="story-copy reveal-stagger">
            <div className="eyebrow">The Williams Story</div>
            <h2>30+ years of teaching. <em>One</em> message worth telling.</h2>
            <p>
              Greg started what is now Love &amp; Lordship after years of pastors, couples, and individuals
              asked the same thing: how do I build a deeper relationship with Christ, and how do I let
              that shape every part of my life and relationships?
            </p>
            <p>
              He's spoken to thousands across the United States and as keynote at the
              International Marriage &amp; Family Conference in Cameroon. Ami stands beside him in every
              setting — a partnership that started in 1991 and has only deepened.
            </p>
            <div className="story-credentials">
              <div className="item">
                <div className="n"><em>35</em></div>
                <div className="l">Years married</div>
              </div>
              <div className="item">
                <div className="n">30<sub>+</sub></div>
                <div className="l">Years of ministry</div>
              </div>
              <div className="item">
                <div className="n">10</div>
                <div className="l">Countries reached</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="btn btn-primary" href="pages/about.html">Read Greg's full story</a>
              <a className="btn-link" href="pages/invite-greg.html">Invite Greg to speak <span className="arr">→</span></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Impact() {
  const countries = [
    { name: "USA", x: 22, y: 38 },
    { name: "Cameroon", x: 54, y: 60 },
    { name: "UK", x: 48, y: 30 },
    { name: "Brazil", x: 32, y: 70 },
    { name: "Kenya", x: 58, y: 64 },
    { name: "India", x: 70, y: 50 },
    { name: "Philippines", x: 80, y: 58 },
    { name: "Australia", x: 84, y: 78 },
  ];

  return (
    <section id="impact" className="impact">
      <div className="wrap">
        <div className="impact-band reveal">
          <div className="eyebrow">The Reach</div>
          <h2>A foundation that's <em>quietly</em> become global.</h2>
        </div>

        <div className="impact-stats reveal">
          <div className="impact-stat">
            <div className="n"><em>50</em><sub>+</sub></div>
            <div className="label">Partner ministries &amp; churches actively engaged with the message</div>
          </div>
          <div className="impact-stat">
            <div className="n">10</div>
            <div className="label">Countries receiving Love &amp; Lordship teaching</div>
          </div>
          <div className="impact-stat">
            <div className="n"><em>30</em><sub>+</sub></div>
            <div className="label">Years of teaching, writing, and broadcasting</div>
          </div>
          <div className="impact-stat">
            <div className="n">35</div>
            <div className="label">Years Greg &amp; Ami have been married — and going strong</div>
          </div>
        </div>

        <div className="impact-map reveal">
          <div className="map-vis">
            {countries.map(c => (
              <span key={c.name} className="country-dot" style={{ left: `${c.x}%`, top: `${c.y}%`, animationDelay: `${(c.x + c.y) * 0.01}s` }} data-name={c.name}></span>
            ))}
            <div style={{
              position: "absolute", inset: 0,
              background: "repeating-linear-gradient(0deg, transparent 0, transparent 39px, oklch(0.88 0.015 70) 39px, oklch(0.88 0.015 70) 40px), repeating-linear-gradient(90deg, transparent 0, transparent 39px, oklch(0.88 0.015 70) 39px, oklch(0.88 0.015 70) 40px)",
              opacity: 0.45,
              pointerEvents: "none"
            }}></div>
          </div>
          <div>
            <div className="eyebrow">Partner countries</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 350, fontSize: 32, lineHeight: 1.05, letterSpacing: "-0.02em", margin: "12px 0 18px" }}>
              From Kentucky to Cameroon — and beyond.
            </h3>
            <p style={{ color: "var(--ink-soft)", fontSize: 16, lineHeight: 1.55, margin: "0 0 20px" }}>
              The Authority of Love serves as discipleship curriculum for Sisters for Life and
              Marriage for Life as they rescue moms, babies, and fathers off the streets — from
              Louisville to LA, Dallas, Cincinnati, Indianapolis, and beyond.
            </p>
            <a className="btn-link" href="pages/about.html#reach">See where we're going next <span className="arr">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Story = Story;
window.Impact = Impact;
