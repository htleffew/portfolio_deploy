// One-time enrichment: backfill `tags` and a concise `short_title` into each
// article's MDX frontmatter so they are co-located with the article and easy to
// edit. tags come from the previous live index (src/data/live-index.json),
// matched by slug; short_title is derived from the title (text before the first
// colon, or the first ~6 words), capped for the nav label.
//
// Only the `tags:` and `short_title:` frontmatter lines are rewritten; the rest
// of the file is untouched. Idempotent: only fills empty tags / overlong short_title.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pagesDir = path.join(root, 'src', 'pages');
const liveIndexFile = path.join(root, 'src', 'data', 'live-index.json');

const liveBySlug = {};
if (existsSync(liveIndexFile)) {
  const live = JSON.parse(await readFile(liveIndexFile, 'utf8'));
  const arr = Array.isArray(live) ? live : (live.projects || Object.values(live)[0] || []);
  for (const e of arr) {
    if (!e || !e.url) continue;
    liveBySlug[e.url.split('/').pop().replace(/\.html$/, '')] = e;
  }
}

function conciseTitle(title) {
  let t = String(title).trim();
  if (t.includes(':')) t = t.split(':')[0].trim();
  // Drop a trailing parenthetical.
  t = t.replace(/\s*\([^)]*\)\s*$/, '').trim();
  if (t.length > 52) {
    const words = t.split(/\s+/);
    let out = '';
    for (const w of words) {
      if ((out + ' ' + w).trim().length > 52) break;
      out = (out + ' ' + w).trim();
    }
    t = out || t.slice(0, 52);
  }
  return t;
}

const yamlStr = (v) => JSON.stringify(String(v));
const yamlArr = (a) => '[' + a.map((x) => JSON.stringify(String(x))).join(', ') + ']';

const files = (await readdir(pagesDir)).filter((f) => f.endsWith('.mdx'));
let changed = 0;
for (const file of files) {
  const slug = file.replace(/\.mdx$/, '');
  const p = path.join(pagesDir, file);
  let text = await readFile(p, 'utf8');
  const fmEnd = text.indexOf('\n---', 4);
  if (!text.startsWith('---') || fmEnd === -1) continue;
  let fm = text.slice(0, fmEnd);
  const body = text.slice(fmEnd);
  const live = liveBySlug[slug] || {};
  let dirty = false;

  // tags: fill if empty and live has them
  const tagsMatch = fm.match(/^tags:\s*\[(.*?)\]\s*$/m);
  const tagsEmpty = tagsMatch && tagsMatch[1].trim() === '';
  if (tagsEmpty && Array.isArray(live.tags) && live.tags.length) {
    fm = fm.replace(/^tags:\s*\[.*?\]\s*$/m, `tags: ${yamlArr(live.tags)}`);
    dirty = true;
  }

  // short_title: derive concise if missing or equal to full title
  const titleMatch = fm.match(/^title:\s*(.+?)\s*$/m);
  const fullTitle = titleMatch ? JSON.parse(titleMatch[1]) : slug;
  const concise = conciseTitle(fullTitle);
  const stMatch = fm.match(/^short_title:\s*(.+?)\s*$/m);
  const currentSt = stMatch ? JSON.parse(stMatch[1]) : '';
  if (!stMatch) {
    fm = fm.replace(/^(title:\s*.+?\s*)$/m, `$1\nshort_title: ${yamlStr(concise)}`);
    dirty = true;
  } else if (currentSt === fullTitle && concise !== fullTitle) {
    fm = fm.replace(/^short_title:\s*.+?\s*$/m, `short_title: ${yamlStr(concise)}`);
    dirty = true;
  }

  if (dirty) {
    await writeFile(p, fm + body, 'utf8');
    changed++;
    console.log(`[enrich] ${slug}  tags:${tagsEmpty ? (live.tags?.length || 0) : 'kept'}  short_title:"${concise}"`);
  }
}
console.log(`\n[enrich] updated ${changed} files.`);
