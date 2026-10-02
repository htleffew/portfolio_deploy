// Build-time loader for the complaint-text-monitor figure data. The JSON is
// written by projects/research/complaint-text-monitor/generate.py into
// public/data/complaint-text-monitor/ and read here when the page renders, so
// the published page carries the numbers without a runtime fetch.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOTS = [process.cwd(), path.join(process.cwd(), 'site')];

export function loadCtm(name) {
  for (const root of ROOTS) {
    const p = path.join(root, 'public', 'data', 'complaint-text-monitor', name);
    if (existsSync(p)) return JSON.parse(readFileSync(p, 'utf8'));
  }
  throw new Error(`complaint-text-monitor data file not found: ${name}`);
}
