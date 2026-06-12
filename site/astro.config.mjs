// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Custom domain (CNAME) serves at root, so base = '/'.
// Static output; trailing slash so each article lives at /<slug>/ and the
// runtime path-prefix logic in global_chrome.js resolves projects_index.json
// at the site root exactly as it does on the current deploy.
//
// NOTE for local builds inside the Cowork mount: the mounted filesystem
// disallows unlink in some temp dirs, which breaks Vite's cache. To build
// locally, copy this project off-mount (e.g. /tmp) and run `npm run build`
// there. GitHub Actions runners have no such restriction, so CI builds use
// this config unchanged.
export default defineConfig({
  site: 'https://drheatherleffew.com',
  base: '/',
  trailingSlash: 'always',
  output: 'static',
  integrations: [mdx()],
});
