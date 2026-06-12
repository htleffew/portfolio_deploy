// Rich-content parity audit: compares the OLD deployed article HTML against the
// NEW built page for every article, counting figures/images, SVGs, code blocks,
// tables, canvases, iframes, and interactive scripts. Flags anything where the
// OLD page had MORE of an element than the NEW page (i.e. content left behind).
//
// Run from site/:  node scripts/audit-parity-rich.mjs
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));     // .../site
const deployRoot = path.resolve(root, '..');                                 // portfolio_deploy
const distDir = path.join(root, 'dist');
const liveIndexFile = path.join(root, 'src', 'data', 'live-index.json');

const live = JSON.parse(await readFile(liveIndexFile, 'utf8'));
const arr = Array.isArray(live) ? live : (live.projects || Object.values(live)[0] || []);

// Strip <head> and the runtime-injected chrome that differs between old/new so
// counts reflect article body content, not the shell.
function bodyOf(html) {
  let h = html.replace(/<head[\s\S]*?<\/head>/i, '');
  // Remove the design-system + CDN script tags (shell), keep page/interactive scripts.
  h = h.replace(/<script[^>]*(three\.min\.js|EffectComposer|RenderPass|ShaderPass|CopyShader|LuminosityHighPassShader|UnrealBloomPass|simplex-noise|cinematic_engine_v3|global_chrome|institutional\.js)[^>]*><\/script>/gi, '');
  return h;
}

// Count interactive/page scripts: external interactive_* refs + inline <script>
// blocks that carry real code (not empty, not the shell ones already stripped).
function countInteractive(html) {
  const body = bodyOf(html);
  const ext = (body.match(/(?:src|href)="[^"]*interactive[_/][^"]*\.js"/gi) || []).length
            + (body.match(/\/interactive\/[^"]+\.js/gi) || []).length;
  const inline = (body.match(/<script(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi) || [])
    .filter((s) => s.replace(/<\/?script[^>]*>/gi, '').trim().length > 40).length;
  return { ext, inline };
}

const count = (re, s) => (s.match(re) || []).length;

const rows = [];
const flags = [];
for (const e of arr) {
  if (!e || !e.url) continue;
  const [folder, file] = e.url.split('/');
  const slug = file.replace(/\.html$/, '');
  const oldPath = path.join(deployRoot, folder, file);
  const newPath = path.join(distDir, slug, 'index.html');
  if (!existsSync(oldPath)) { flags.push(`${slug}: OLD html missing (${folder}/${file})`); continue; }
  if (!existsSync(newPath)) { flags.push(`${slug}: NEW page missing (dist/${slug}/)`); continue; }
  const oldH = bodyOf(await readFile(oldPath, 'utf8'));
  const newH = bodyOf(await readFile(newPath, 'utf8'));

  const metrics = {
    img:    [count(/<img\b/gi, oldH),    count(/<img\b/gi, newH)],
    figure: [count(/<figure\b/gi, oldH), count(/<figure\b/gi, newH)],
    svg:    [count(/<svg\b/gi, oldH),     count(/<svg\b/gi, newH)],
    pre:    [count(/<pre\b/gi, oldH),     count(/<pre\b/gi, newH)],
    table:  [count(/<table\b/gi, oldH),   count(/<table\b/gi, newH)],
    canvas: [count(/<canvas\b/gi, oldH),  count(/<canvas\b/gi, newH)],
    iframe: [count(/<iframe\b/gi, oldH),  count(/<iframe\b/gi, newH)],
  };
  const oi = countInteractive(await readFile(oldPath, 'utf8'));
  const ni = countInteractive(await readFile(newPath, 'utf8'));
  metrics.interactExt = [oi.ext, ni.ext];
  metrics.interactInline = [oi.inline, ni.inline];

  const line = [slug.padEnd(38)];
  for (const [k, [o, n]] of Object.entries(metrics)) {
    line.push(`${k}:${o}->${n}${o > n ? ' !!' : ''}`);
    if (o > n) flags.push(`${slug}: ${k} OLD=${o} NEW=${n}  (possible loss)`);
  }
  rows.push(line.join('  '));
}

console.log(rows.join('\n'));
console.log('\n--- FLAGS (OLD had more than NEW) ---');
if (flags.length) { for (const f of flags) console.log('  ' + f); }
else console.log('  none — every article retains >= the old count for every element type.');
