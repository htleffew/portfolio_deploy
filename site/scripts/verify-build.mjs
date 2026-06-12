// Post-build verification. Fails (exit 1) if anything is wrong:
//   1. every /assets/<slug>/<file> and /interactive/<slug>/<file> referenced in a
//      built page exists in dist/
//   2. every built article page has the frame contract (1 stylesheet + 3 scripts + key DOM hooks)
//   3. content parity: each article's MDX body retains >= 85% of the source markdown's words
//      (guards against sections silently dropped in conversion; Related is intentionally dropped)
// Run AFTER `npm run build`.  node scripts/verify-build.mjs
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import matter from 'gray-matter';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const pagesDir = path.join(root, 'src', 'pages');
const deployRoot = path.resolve(root, '..', 'portfolio_deploy');

const problems = [];
const ok = [];

// --- 1 & 2: scan built article pages ---
const distEntries = await readdir(dist, { withFileTypes: true });
const articleDirs = distEntries.filter((d) => d.isDirectory() && existsSync(path.join(dist, d.name, 'index.html')));
let frameChecked = 0;
for (const d of articleDirs) {
  const html = await readFile(path.join(dist, d.name, 'index.html'), 'utf8');
  // frame contract
  const needs = ['institutional.css', 'cinematic_engine_v3.js', 'global_chrome.js', 'institutional.js', 'recommendation-grid', 'next-chap-link'];
  for (const n of needs) if (!html.includes(n)) problems.push(`[frame] ${d.name}: missing ${n}`);
  frameChecked++;
  // asset refs
  const refs = [...html.matchAll(/(?:src|href)="(\/(?:assets|interactive)\/[^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    const fp = path.join(dist, ref.replace(/^\//, ''));
    if (!existsSync(fp)) problems.push(`[asset] ${d.name}: missing ${ref}`);
  }
}

// --- 3: content parity (mdx body words vs source md body words) ---
// Needs the source repo (portfolio_deploy), which isn't present in CI. Skip there.
const liveIndexFile = path.join(root, 'src', 'data', 'live-index.json');
if (!existsSync(deployRoot)) {
  console.log(`Checked frame on ${frameChecked} article pages; parity skipped (portfolio_deploy not present, e.g. CI).`);
  if (problems.length) {
    console.error(`\n✗ ${problems.length} PROBLEM(S):`);
    for (const p of problems) console.error('  ' + p);
    process.exit(1);
  }
  console.log('\n✓ Frame contract intact and no broken asset refs.');
  process.exit(0);
}
const live = JSON.parse(await readFile(liveIndexFile, 'utf8'));
const liveArr = Array.isArray(live) ? live : (live.projects || Object.values(live)[0] || []);
const slugToFolder = {};
for (const e of liveArr) {
  if (!e || !e.url) continue;
  const [folder, file] = e.url.split('/');
  slugToFolder[file.replace(/\.html$/, '')] = folder;
}
const words = (s) => (s.match(/\b[\w'-]+\b/g) || []).length;
const mdxFiles = (await readdir(pagesDir)).filter((f) => f.endsWith('.mdx'));
for (const f of mdxFiles) {
  const slug = f.replace(/\.mdx$/, '');
  const folder = slugToFolder[slug];
  if (!folder) { problems.push(`[parity] ${slug}: no source folder mapping`); continue; }
  const mdPath = path.join(deployRoot, folder, `${slug}.md`);
  if (!existsSync(mdPath)) { problems.push(`[parity] ${slug}: source md not found`); continue; }
  const srcBody = matter(await readFile(mdPath, 'utf8')).content
    .replace(/^##\s+related[\s\S]*?(?=^##\s|\Z)/im, ''); // Related is intentionally dropped
  const mdxBody = matter(await readFile(path.join(pagesDir, f), 'utf8')).content;
  const sw = words(srcBody), mw = words(mdxBody);
  const ratio = sw === 0 ? 1 : mw / sw;
  if (ratio < 0.85) problems.push(`[parity] ${slug}: only ${(ratio * 100).toFixed(0)}% of source words (${mw}/${sw})`);
  else ok.push(`${slug}: ${(ratio * 100).toFixed(0)}% (${mw}/${sw})`);
}

console.log(`Checked frame on ${frameChecked} article pages; parity on ${mdxFiles.length} articles.`);
console.log(`Parity OK: ${ok.length}/${mdxFiles.length}`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} PROBLEM(S):`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('\n✓ All checks passed: frame contract intact, no broken asset refs, content parity >= 85% on every article.');
