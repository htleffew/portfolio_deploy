// Shared article-data helper. Reads every article MDX in src/pages/*.mdx and
// returns, for each, its slug, route url, parsed frontmatter, and a `summary`:
// the first N words of the actual article body prose. The summary is derived
// from the body on every build, so when an article's opening paragraph changes
// the library/carousel summaries change with it (no hand-maintained desc text).
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const pagesDir = path.join(root, 'src', 'pages');
const categoriesFile = path.join(root, 'src', 'data', 'categories.json');

// Curated slug -> category map (the Library taxonomy). Overrides the
// inconsistent per-article frontmatter `category`; unlisted slugs fall back to
// their frontmatter category.
let CATEGORY_MAP = null;
async function loadCategories() {
  if (CATEGORY_MAP) return CATEGORY_MAP;
  CATEGORY_MAP = {};
  if (existsSync(categoriesFile)) {
    const raw = JSON.parse(await readFile(categoriesFile, 'utf8'));
    for (const [k, v] of Object.entries(raw)) {
      if (!k.startsWith('_')) CATEGORY_MAP[k] = v;
    }
  }
  return CATEGORY_MAP;
}

// Resolve an article's display category: curated map first, then frontmatter.
export async function resolveCategory(slug, frontmatter = {}) {
  const map = await loadCategories();
  return map[slug] || frontmatter.category || 'Research';
}

// about.mdx is a content page authored with the article toolchain, not an
// article; keep it out of the library index, carousel, and related-works.
const EXCLUDE = new Set(['index.mdx', 'index.astro', '404.astro', 'about.mdx']);
const DEFAULT_WORDS = 20;

// Walk the MDX body line by line and return the first block of real prose: skip
// import lines, markdown headings, code fences, and any line that is markup
// (a <Band>, <div>, <figure>, <a>... tag). Markup-wrapped blocks like a demo
// button or a figure are passed over so the summary lands on the first sentence
// a reader would actually read.
function firstProse(mdxBody) {
  const lines = mdxBody.split('\n');
  const collected = [];
  let inFence = false;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    if (!line) { if (collected.length) break; else continue; } // blank ends the paragraph
    if (/^import\s/.test(line)) continue;          // import statement
    if (/^#{1,6}\s/.test(line)) continue;          // markdown heading
    if (/^[-*]\s/.test(line)) continue;            // list bullet
    if (/^</.test(line)) continue;                 // a markup line (JSX/HTML tag)
    collected.push(line);
  }
  return collected.join(' ');
}

// Decode the handful of HTML entities that show up in raw-HTML article blocks,
// and drop the rest.
function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&(?:rsquo|lsquo|apos|#39);/g, "'")
    .replace(/&(?:ldquo|rdquo|quot);/g, '"')
    .replace(/&(?:nbsp|ensp|emsp);/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/&#\d+;/g, ' ');
}

// Reduce an MDX body to its first `wordCount` words of human prose: find the
// first prose paragraph, strip inline markup and markdown markers, then take the
// opening words of what is left.
export function summarize(mdxBody, wordCount = DEFAULT_WORDS) {
  const text = decodeEntities(
    firstProse(mdxBody)
      .replace(/<[^>]+>/g, ' ')                   // inline JSX / HTML tags
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')      // images
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')    // links -> link text
      .replace(/[*_`>]/g, ' ')                    // emphasis / blockquote markers
  )
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')              // close space before punctuation
    .trim();

  const words = text.split(' ').filter(Boolean);
  const clipped = words.slice(0, wordCount).join(' ');
  if (words.length <= wordCount) return clipped;
  return clipped.replace(/[\s.,;:!?]+$/, '') + '...';
}

// Returns the full article list, sorted by title to match the prior index order.
export async function getArticles(wordCount = DEFAULT_WORDS) {
  const files = (await readdir(pagesDir)).filter(
    (f) => f.endsWith('.mdx') && !EXCLUDE.has(f)
  );

  const articles = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '');
    const raw = await readFile(path.join(pagesDir, file), 'utf8');
    const { data, content } = matter(raw);
    articles.push({
      slug,
      url: `/${slug}/`,
      frontmatter: data,
      cat: await resolveCategory(slug, data),
      summary: summarize(content, wordCount),
    });
  }

  articles.sort((a, b) =>
    (a.frontmatter.title || a.slug).localeCompare(b.frontmatter.title || b.slug)
  );
  return articles;
}
