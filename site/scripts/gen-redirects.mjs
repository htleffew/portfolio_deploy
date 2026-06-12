// Generates redirect stubs so old article URLs (/<Folder>/<slug>.html, the paths
// the previous static site served) don't 404 after the move to /<slug>/ routes.
// Each stub is a tiny HTML page with a meta-refresh + canonical link + JS
// fallback. Emitted into public/<Folder>/<slug>.html so Astro copies them to dist.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, 'public');
const liveIndexFile = path.join(root, 'src', 'data', 'live-index.json');

const live = JSON.parse(await readFile(liveIndexFile, 'utf8'));
const arr = Array.isArray(live) ? live : (live.projects || Object.values(live)[0] || []);

let n = 0;
for (const e of arr) {
  if (!e || !e.url) continue;
  const oldUrl = e.url;                                   // Folder/slug.html
  const slug = oldUrl.split('/').pop().replace(/\.html$/, '');
  const dest = `/${slug}/`;
  const outPath = path.join(publicDir, oldUrl);
  await mkdir(path.dirname(outPath), { recursive: true });
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved → ${slug}</title>
<link rel="canonical" href="${dest}">
<meta http-equiv="refresh" content="0; url=${dest}">
<script>location.replace(${JSON.stringify(dest)});</script>
</head>
<body>This page has moved to <a href="${dest}">${dest}</a>.</body>
</html>
`;
  await writeFile(outPath, html, 'utf8');
  n++;
}
console.log(`[redirects] wrote ${n} redirect stubs into public/`);
