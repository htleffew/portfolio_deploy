// Post-build verification (run after `npm run build`). Exits non-zero if:
//   1. any built article page is missing the frame contract (1 stylesheet + the 3
//      design-system scripts + the key DOM hooks the runtime needs), or
//   2. any /assets/<slug>/... or /interactive/<slug>/... reference in a built page
//      points to a file that isn't in dist/.
// Usage: node scripts/verify-build.mjs
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');

const problems = [];

const distEntries = await readdir(dist, { withFileTypes: true });
const articleDirs = distEntries.filter(
  (d) => d.isDirectory() && existsSync(path.join(dist, d.name, 'index.html'))
);

let checked = 0;
for (const d of articleDirs) {
  const html = await readFile(path.join(dist, d.name, 'index.html'), 'utf8');
  // Skip non-article pages that legitimately lack the case-study frame.
  if (!html.includes('institutional.css')) continue;
  const needs = [
    'institutional.css', 'cinematic_engine_v3.js', 'global_chrome.js', 'institutional.js',
    'recommendation-grid', 'next-chap-link',
  ];
  for (const n of needs) if (!html.includes(n)) problems.push(`[frame] ${d.name}: missing ${n}`);
  checked++;
  const refs = [...html.matchAll(/(?:src|href)="(\/(?:assets|interactive)\/[^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (!existsSync(path.join(dist, ref.replace(/^\//, '')))) problems.push(`[asset] ${d.name}: missing ${ref}`);
  }
}

console.log(`Checked frame + asset refs on ${checked} article pages.`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} PROBLEM(S):`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('✓ Frame contract intact and no broken asset refs.');
