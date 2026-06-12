// Ports the live landing/entry pages (homepage, library, about, gallery) from
// portfolio_deploy into public/, adapted to the Astro build:
//   - rewrites old article links  Folder/slug.html -> /slug/
//   - makes design-system + script asset paths absolute (/design_system/..., /library_dashboard.js)
//   - copies supporting root assets (library_dashboard.js, resume.pdf, headshots already in design_system)
// The library page is data-driven by library_dashboard.js + projects_index.json,
// whose URLs are already the new /slug/ routes (see gen-index.mjs), so its cards
// link correctly without per-card edits.
import { readFile, writeFile, copyFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const deployRoot = path.resolve(root, '..', 'portfolio_deploy');
const publicDir = path.join(root, 'public');
const liveIndexFile = path.join(root, 'src', 'data', 'live-index.json');

// slug map: "Folder/slug.html" -> "/slug/"
const live = JSON.parse(await readFile(liveIndexFile, 'utf8'));
const liveArr = Array.isArray(live) ? live : (live.projects || Object.values(live)[0] || []);
const urlPairs = [];
for (const e of liveArr) {
  if (!e || !e.url) continue;
  const oldUrl = e.url;                          // Folder/slug.html
  const slug = oldUrl.split('/').pop().replace(/\.html$/, '');
  urlPairs.push([oldUrl, `/${slug}/`]);
}

function rewrite(html) {
  let out = html;
  // Article links (handle optional ./ and leading /)
  for (const [oldUrl, newUrl] of urlPairs) {
    const variants = [oldUrl, `./${oldUrl}`, `/${oldUrl}`];
    for (const v of variants) {
      out = out.split(`"${v}"`).join(`"${newUrl}"`);
      out = out.split(`'${v}'`).join(`'${newUrl}'`);
    }
  }
  // Absolute asset paths for design system + dashboard script
  out = out.replace(/(href|src)="(\.\/)?design_system\//g, '$1="/design_system/');
  out = out.replace(/(href|src)="(\.\/)?(library_dashboard|fix_descriptions|interactive_5)\.js"/g, '$1="/$3.js"');
  out = out.replace(/(href|src)="(\.\/)?projects_index\.json"/g, '$1="/projects_index.json"');
  // Other root entry pages referenced relatively -> keep at root (they live in public root)
  out = out.replace(/(href)="(\.\/)?(projects-repository|about|svg-gallery)\.html"/g, '$1="/$3.html"');
  out = out.replace(/(href)="(\.\/)?resume\.pdf"/g, '$1="/resume.pdf"');
  return out;
}

const PAGES = ['index.html', 'projects-repository.html', 'about.html', 'svg-gallery.html'];
const SUPPORT = ['library_dashboard.js', 'resume.pdf'];

await mkdir(publicDir, { recursive: true });
let portedPages = 0;
for (const page of PAGES) {
  const src = path.join(deployRoot, page);
  if (!existsSync(src)) { console.log(`[port] skip ${page} (not found)`); continue; }
  const html = await readFile(src, 'utf8');
  await writeFile(path.join(publicDir, page), rewrite(html), 'utf8');
  portedPages++;
  console.log(`[port] ${page}`);
}
let copied = 0;
for (const f of SUPPORT) {
  const src = path.join(deployRoot, f);
  if (existsSync(src)) { await copyFile(src, path.join(publicDir, f)); copied++; console.log(`[port] copy ${f}`); }
}
console.log(`\n[port] ${portedPages} pages, ${copied} support files -> public/`);
