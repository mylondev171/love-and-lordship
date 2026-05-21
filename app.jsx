/* global React, ReactDOM, Nav, Hero, Pillars, Book, Media, Story, Impact, Events, AppPromo, Newsletter, Footer, DonateModal, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakToggle, TweakColor, TweakSelect */
const { useEffect, useRef, useState } = React;

function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const PALETTE_SWATCHES = [
  ["#9b2c2c", "#f7f1e8", "#c89e4f"],
  ["#2a4d8f", "#eef1f6", "#7ba4d6"],
  ["#2f5b3f", "#eef2eb", "#b59a4a"],
  ["#2c2c2c", "#f0efed", "#8a8a8a"],
];
const PALETTE_KEYS = ["warm", "cool", "forest", "mono"];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#9b2c2c", "#f7f1e8", "#c89e4f"],
  "density": "comfortable",
  "pillarLayout": "tabs",
  "typeMix": "serif-sans",
  "showAppPromo": true
}/*EDITMODE-END*/;

function applyPalette(p) {
  const root = document.documentElement;
  const palettes = {
    warm: { bg: "0.975 0.012 78", bgElev: "0.985 0.008 78", paper: "0.96 0.018 75", ink: "0.18 0.015 60", inkSoft: "0.38 0.018 60", inkMute: "0.55 0.018 65", line: "0.88 0.015 70", lineSoft: "0.92 0.012 72", wine: "0.42 0.12 25", wineDeep: "0.34 0.12 25", gold: "0.72 0.085 80" },
    cool: { bg: "0.975 0.008 230", bgElev: "0.985 0.006 230", paper: "0.95 0.012 230", ink: "0.18 0.018 250", inkSoft: "0.38 0.022 250", inkMute: "0.55 0.018 245", line: "0.88 0.012 235", lineSoft: "0.92 0.01 235", wine: "0.42 0.13 250", wineDeep: "0.32 0.13 252", gold: "0.7 0.08 200" },
    forest: { bg: "0.97 0.01 100", bgElev: "0.985 0.008 100", paper: "0.94 0.014 110", ink: "0.18 0.018 140", inkSoft: "0.36 0.02 140", inkMute: "0.55 0.018 130", line: "0.88 0.012 120", lineSoft: "0.92 0.01 120", wine: "0.4 0.11 140", wineDeep: "0.3 0.11 142", gold: "0.72 0.085 90" },
    mono: { bg: "0.97 0.003 60", bgElev: "0.985 0.002 60", paper: "0.95 0.004 60", ink: "0.18 0.005 60", inkSoft: "0.38 0.005 60", inkMute: "0.55 0.005 60", line: "0.88 0.003 60", lineSoft: "0.92 0.002 60", wine: "0.25 0.01 60", wineDeep: "0.18 0.01 60", gold: "0.6 0.01 80" },
  };
  const v = palettes[p] || palettes.warm;
  root.style.setProperty("--bg", `oklch(${v.bg})`);
  root.style.setProperty("--bg-elev", `oklch(${v.bgElev})`);
  root.style.setProperty("--paper", `oklch(${v.paper})`);
  root.style.setProperty("--ink", `oklch(${v.ink})`);
  root.style.setProperty("--ink-soft", `oklch(${v.inkSoft})`);
  root.style.setProperty("--ink-mute", `oklch(${v.inkMute})`);
  root.style.setProperty("--line", `oklch(${v.line})`);
  root.style.setProperty("--line-soft", `oklch(${v.lineSoft})`);
  root.style.setProperty("--wine", `oklch(${v.wine})`);
  root.style.setProperty("--wine-deep", `oklch(${v.wineDeep})`);
  root.style.setProperty("--gold", `oklch(${v.gold})`);
}

function applyTypeMix(t) {
  const root = document.documentElement;
  const stacks = {
    "serif-sans": { display: '"Newsreader", "Source Serif 4", Georgia, serif', sans: '"Manrope", -apple-system, sans-serif' },
    "all-sans":   { display: '"Manrope", -apple-system, sans-serif', sans: '"Manrope", -apple-system, sans-serif' },
    "editorial":  { display: '"Cormorant Garamond", "EB Garamond", Georgia, serif', sans: '"Manrope", -apple-system, sans-serif' },
  };
  const v = stacks[t] || stacks["serif-sans"];
  root.style.setProperty("--font-display", v.display);
  root.style.setProperty("--font-sans", v.sans);
}

function App() {
  const [donateOpen, setDonateOpen] = useState(false);
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useReveal();

  useEffect(() => {
    const idx = PALETTE_SWATCHES.findIndex(s => Array.isArray(t.palette) && s.join("") === t.palette.join(""));
    applyPalette(PALETTE_KEYS[idx === -1 ? 0 : idx]);
  }, [t.palette]);
  useEffect(() => { applyTypeMix(t.typeMix); }, [t.typeMix]);
  useEffect(() => {
    document.body.classList.toggle("dense", t.density === "compact");
  }, [t.density]);

  return (
    <>
      <Nav onDonate={() => setDonateOpen(true)} />
      <Hero onDonate={() => setDonateOpen(true)} />
      <Pillars layout={t.pillarLayout} />
      <Book onDonate={() => setDonateOpen(true)} />
      <Media />
      <Story />
      <Impact />
      <Events />
      {t.showAppPromo && <AppPromo />}
      <Newsletter />
      <Footer onDonate={() => setDonateOpen(true)} />

      <button className="btn btn-give donate-floater" onClick={() => setDonateOpen(true)}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M8 14s-5-3.5-5-7.5A3 3 0 0 1 8 4a3 3 0 0 1 5 2.5C13 10.5 8 14 8 14z" fill="currentColor"/>
        </svg>
        Give
      </button>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Visual">
          <TweakColor
            label="Palette"
            value={t.palette}
            options={PALETTE_SWATCHES}
            onChange={(v) => setTweak("palette", v)}
          />
          <TweakRadio
            label="Type"
            value={t.typeMix}
            options={[
              { value: "serif-sans", label: "Editorial" },
              { value: "editorial", label: "Garamond" },
              { value: "all-sans", label: "All sans" },
            ]}
            onChange={(v) => setTweak("typeMix", v)}
          />
          <TweakRadio
            label="Density"
            value={t.density}
            options={[
              { value: "comfortable", label: "Roomy" },
              { value: "compact", label: "Compact" },
            ]}
            onChange={(v) => setTweak("density", v)}
          />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio
            label="Mission pillars"
            value={t.pillarLayout}
            options={[
              { value: "tabs", label: "Detail + tabs" },
              { value: "grid", label: "Card grid" },
            ]}
            onChange={(v) => setTweak("pillarLayout", v)}
          />
          <TweakToggle
            label="Show L&L App section"
            value={t.showAppPromo}
            onChange={(v) => setTweak("showAppPromo", v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
