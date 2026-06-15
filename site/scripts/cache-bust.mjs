// Post-build cache-busting. Stamps ?v=<token> on first-party asset references
// (/assets, /interactive, /design_system) in the built HTML, so that updated
// figures, interactive scripts, and design-system CSS/JS are fetched fresh after
// each deploy instead of being served stale from a browser or CDN cache.
//
// GitHub Pages already purges its own CDN on every deploy and serves HTML with a
// ~10 minute max-age, so PAGES self-heal. Static ASSET filenames do not change
// when their contents do, so without this step a browser that cached an old SVG
// or JS keeps it until its TTL expires. The per-deploy token closes that gap.
//
// Token: the commit SHA in CI (GITHUB_SHA), or a timestamp locally. One token per
// deploy is deliberate: simple, and a portfolio does not need per-file hashing.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const token = (process.env.GITHUB_SHA || String(Date.now())).slice(0, 8);

// Capture: (src|href=")  (/assets|/interactive|/design_system/...path)  (optional ?query)  (")
const RE = /((?:src|href)=")(\/(?:assets|interactive|design_system)\/[^"?]+)(\?[^"]*)?(")/g;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(p);
    else if (entry.name.endsWith('.html')) yield p;
  }
}

let pages = 0;
let refs = 0;
for await (const file of htmlFiles(dist)) {
  const html = await readFile(file, 'utf8');
  let n = 0;
  const out = html.replace(RE, (_m, pre, url, _query, post) => {
    n++;
    return `${pre}${url}?v=${token}${post}`;
  });
  if (n > 0) {
    await writeFile(file, out, 'utf8');
    pages++;
    refs += n;
  }
}
console.log(`Cache-bust: tagged ${refs} asset refs across ${pages} page(s) with v=${token}.`);
