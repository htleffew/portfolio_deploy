// Build-time generator for the two article-listing surfaces, regenerated from
// src/pages/*.mdx on every build so they always reflect the real article set and
// the real article text:
//   - public/projects-repository.html : the Library/Articles index. Regenerates
//     the taxonomy sidebar (#sidebar-accordion) and the table of rows (#tableWrap).
//   - public/index.html : the homepage "Featured Work" carousel. Regenerates both
//     loop groups inside #dynamic-carousel-track.
// Each card/row shows the first ~20 words of the article body as its summary (see
// scripts/lib/article-data.mjs), so editing an article's opening paragraph updates
// these summaries automatically; adding an article adds it to both surfaces.
//
// Category note: the article frontmatter `category` is inconsistent, so the
// Library taxonomy is the curated map in src/data/categories.json (resolved by
// getArticles as `cat`); unlisted slugs fall back to their frontmatter category.
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { getArticles } from './lib/article-data.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDir = path.join(root, 'public');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
// Attribute-safe (also escape quotes).
function attr(s) {
  return esc(s).replace(/"/g, '&quot;');
}

const articles = await getArticles();

// Category (`cat`) and tags (normalized) are already resolved by getArticles.
for (const a of articles) {
  a.title = a.frontmatter.title || a.slug;
}

// Stable display order: grouped by category (alphabetical), then title.
const byCatThenTitle = (a, b) =>
  a.cat.localeCompare(b.cat) || a.title.localeCompare(b.title);
const ordered = [...articles].sort(byCatThenTitle);

// ---- projects-repository.html : sidebar taxonomy ----
function renderSidebar() {
  const cats = {};
  for (const a of ordered) (cats[a.cat] = cats[a.cat] || []).push(a);
  const groups = Object.keys(cats).sort().map((cat) => {
    const links = cats[cat].map((a) =>
      `<a href="${a.url}" class="sb-link db-filter-link" data-cat="${attr(a.cat)}" data-title="${attr(a.title)}">${esc(a.title)}</a>`
    ).join('');
    return `      <div class="sb-group">
        <div class="sb-header">
          ${esc(cat)} <span>${cats[cat].length}</span>
        </div>
        <div class="sb-drawer" style="max-height: 1000px;">
          ${links}
        </div>
      </div>`;
  }).join('\n');
  return '\n' + groups + '\n      ';
}

// ---- projects-repository.html : table rows ----
function renderRows() {
  return '\n' + ordered.map((a) => {
    const dataTags = a.tags.map((t) => t.toLowerCase()).join(',');
    const tagChips = a.tags.map((t) =>
      `<span class="db-tag" data-tag="${attr(t)}">${esc(t)}</span>`
    ).join('');
    return `      <a href="${a.url}" class="db-row gs-reveal" data-cat="${attr(a.cat)}" data-title="${attr(a.title.toLowerCase())}" data-tags="${attr(dataTags)}">
        <div class="db-info">
          <div class="db-cat">${esc(a.cat)} </div>
          <div class="db-title">${esc(a.title)}</div>
          <div class="db-desc">${esc(a.summary)}</div>
          <div class="db-tags-wrap">${tagChips}</div>
        </div>
        <div class="db-action">&#8594;</div>
      </a>`;
  }).join('\n') + '\n      ';
}

// ---- index.html : carousel cards ----
function renderCards() {
  return ordered.map((a) =>
    `        <a href="${a.url}" class="p-card">
          <div class="p-content">
            <div class="p-eyebrow">${esc(a.cat)}</div>
            <h3 class="p-title">${esc(a.title)}</h3>
            <p class="p-desc">${esc(a.summary)}</p>
            <span class="p-link">Read Case Study -></span>
          </div>
        </a>`
  ).join('\n');
}

function replaceRegion(html, file, label, re, replacement) {
  if (!re.test(html)) {
    throw new Error(`[listings] ${file}: could not locate ${label} region`);
  }
  return html.replace(re, replacement);
}

async function writeIfPresent(file, transform) {
  const fp = path.join(publicDir, file);
  if (!existsSync(fp)) {
    console.warn(`[listings] ${file} not found, skipping`);
    return;
  }
  const html = await readFile(fp, 'utf8');
  await writeFile(fp, transform(html), 'utf8');
}

// --- projects-repository.html ---
await writeIfPresent('projects-repository.html', (html) => {
  html = replaceRegion(
    html, 'projects-repository.html', 'sidebar',
    /(<div id="sidebar-accordion">)[\s\S]*?(<\/div>\s*<\/aside>)/,
    `$1${renderSidebar()}$2`
  );
  html = replaceRegion(
    html, 'projects-repository.html', 'table',
    /(<div class="db-table" id="tableWrap">)[\s\S]*?(<\/div>\s*<div id="noResults")/,
    `$1${renderRows()}$2`
  );
  console.log(`[listings] projects-repository.html: ${ordered.length} articles`);
  return html;
});

// --- index.html (carousel only; the rest of the homepage is hand-authored) ---
await writeIfPresent('index.html', (html) => {
  const cards = renderCards();
  const block =
`$1
        <!-- Built from src/pages/*.mdx by scripts/gen-listings.mjs -->
        <div class="carousel-group" id="carousel-group-1">
${cards}
        </div>
        <div class="carousel-group" id="carousel-group-2" aria-hidden="true">
${cards}
        </div>
      </div>
    </div>
    $2`;
  html = replaceRegion(
    html, 'index.html', 'carousel',
    /(<div class="carousel-track" id="dynamic-carousel-track">)[\s\S]*?(<a href="\/projects-repository\.html" class="view-all-link">)/,
    block
  );
  console.log(`[listings] index.html: ${ordered.length} carousel cards x2 groups`);
  return html;
});
