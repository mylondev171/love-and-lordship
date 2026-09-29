// Production build: copy the site into dist/ and precompile every
// <script type="text/babel"> so visitors don't download Babel (~3 MB) and
// compile the JSX on every page load.
//
// The source files are untouched, so local preview (python -m http.server)
// still compiles in the browser exactly as before. Compilation uses the same
// @babel/standalone version and the same presets/plugins the browser used
// (see buildBabelOptions in @babel/standalone), so behavior is identical:
// each script still runs as a classic global script, in the same order.
//
// Vercel runs this via `npm run build` (see vercel.json). Run locally with:
//   npm install && npm run build
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const Babel = require("@babel/standalone");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SKIP = new Set([".git", ".github", ".vercel", "node_modules", "dist", "tools", "emailjs",
  "package.json", "package-lock.json", ".gitignore", ".vercelignore", "vercel.json"]);

const BABEL_TAG = /\s*<script src="https:\/\/unpkg\.com\/@babel\/standalone@[^"]*"[^>]*><\/script>/;
const SRC_TAG = /<script type="text\/babel" src="([^"]+)"><\/script>/g;
const INLINE_TAG = /<script type="text\/babel">([\s\S]*?)<\/script>/g;

function compile(code, filename) {
  const out = Babel.transform(code, {
    filename,
    presets: ["react", "env"],
    plugins: ["transform-class-properties", "transform-object-rest-spread", "transform-flow-strip-types"],
    comments: false,
    compact: true,
  }).code;
  return out.replace(/<\/script/gi, "<\\/script");
}

function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (src === ROOT && SKIP.has(e.name)) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d);
    else if (!e.name.endsWith(".jsx")) fs.copyFileSync(s, d);
  }
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? htmlFiles(p) : e.name.endsWith(".html") ? [p] : [];
  });
}

fs.rmSync(DIST, { recursive: true, force: true });
copyTree(ROOT, DIST);

const compiled = new Map(); // absolute .jsx source path -> "?v=hash" suffix
let pages = 0, inline = 0;

for (const file of htmlFiles(DIST)) {
  let html = fs.readFileSync(file, "utf8");
  if (!html.includes('type="text/babel"')) continue;

  // <base href="/"> (404.html) makes relative URLs resolve from the site root.
  const base = /<base href="\/"/.test(html) ? DIST : path.dirname(file);

  html = html.replace(BABEL_TAG, "");
  html = html.replace(SRC_TAG, (_, src) => {
    const distPath = path.resolve(base, src);
    const srcPath = path.join(ROOT, path.relative(DIST, distPath));
    if (!compiled.has(srcPath)) {
      const js = compile(fs.readFileSync(srcPath, "utf8"), path.basename(srcPath));
      fs.writeFileSync(distPath.replace(/\.jsx$/, ".js"), js);
      compiled.set(srcPath, "?v=" + crypto.createHash("sha1").update(js).digest("hex").slice(0, 10));
    }
    return `<script src="${src.replace(/\.jsx$/, ".js")}${compiled.get(srcPath)}"></script>`;
  });
  html = html.replace(INLINE_TAG, (_, code) => {
    inline++;
    return `<script>${compile(code, path.basename(file))}</script>`;
  });

  fs.writeFileSync(file, html);
  pages++;
}

console.log(`dist/: ${pages} pages, ${compiled.size} JSX files and ${inline} inline scripts precompiled`);
