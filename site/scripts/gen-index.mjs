// Build-time generator: reads frontmatter from every article MDX in
// src/pages/*.mdx and emits public/projects_index.json in the exact schema
// the runtime (global_chrome.js) consumes: {id,title,desc,cat,subtype,tags,url,time,visual}.
// This replaces the missing sync_index.js / manual JSON upkeep — adding or
// editing an article and rebuilding auto-updates the library index, the
// Related Works grid, and the next-article link.
//
// Rich card metadata (tags, subtype, and the inline-SVG `visual` thumbnail) is
// merged from the previous live index (src/data/live-index.json), matched by
// slug, so the library filters and card thumbnails survive the migration.
// Article frontmatter always wins when it specifies a value.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pagesDir = path.join(root, 'src', 'pages');
const outDir = path.join(root, 'public');
const outFile = path.join(outDir, 'projects_index.json');
const liveIndexFile = path.join(root, 'src', 'data', 'live-index.json');

const EXCLUDE = new Set(['index.mdx', 'index.astro', '404.astro']);

// Build a slug -> live-entry map from the previous deploy index (url = Folder/slug.html).
const liveBySlug = {};
if (existsSync(liveIndexFile)) {
  const live = JSON.parse(await readFile(liveIndexFile, 'utf8'));
  const arr = Array.isArray(live) ? live : (live.projects || Object.values(live)[0] || []);
  for (const e of arr) {
    if (!e || !e.url) continue;
    const slug = e.url.split('/').pop().replace(/\.html$/, '');
    liveBySlug[slug] = e;
  }
}

const entries = [];
const files = (await readdir(pagesDir)).filter(
  (f) => f.endsWith('.mdx') && !EXCLUDE.has(f)
);

for (const file of files.sort()) {
  const slug = file.replace(/\.mdx$/, '');
  const raw = await readFile(path.join(pagesDir, file), 'utf8');
  const { data } = matter(raw);
  const live = liveBySlug[slug] || {};

  const fmTags = Array.isArray(data.tags) ? data.tags : [];
  entries.push({
    id: data.id || slug,
    title: data.title || slug,
    desc: data.description || data.abstract || live.desc || '',
    cat: data.category || live.cat || 'Research',
    subtype: data.subcategory || data.subtype || live.subtype || data.format || 'Analysis',
    tags: fmTags.length ? fmTags : (Array.isArray(live.tags) ? live.tags : []),
    url: `${slug}/`,
    time: data.time || live.time || '',
    visual: data.visual || live.visual || '',
  });
}

// Stable ordering by title (matches prior behavior).
entries.sort((a, b) => a.title.localeCompare(b.title));

await mkdir(outDir, { recursive: true });
await writeFile(outFile, JSON.stringify(entries, null, 2) + '\n', 'utf8');
const withTags = entries.filter((e) => e.tags.length).length;
const withVisual = entries.filter((e) => e.visual).length;
console.log(`[gen-index] wrote ${entries.length} entries -> ${path.relative(root, outFile)} (tags:${withTags}, visual:${withVisual})`);
