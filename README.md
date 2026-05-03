# Deployment Environment: Institutional Portfolio

This repository (`portfolio_deploy`) acts as the strict production environment and GitHub Pages host for the `htleffew.github.io/portfolio_deploy/` domain.

## Live Domain
**[https://htleffew.github.io/portfolio_deploy/](https://htleffew.github.io/portfolio_deploy/)**

## Architectural Rules
1. **Never edit code here:** All drafting, research, and source compilation happens in the upstream `Pm_html` workspace. This repository is strictly a landing zone for finished HTML artifacts.
2. **Automated Synchronization:** Do not manually edit `projects_index.json`. The GitHub Action `sync-index.yml` automatically reads from `master_index.json` and generates the live index based *only* on the case studies that physically exist in this repository.
3. **Global Chrome:** Navigation, footers, and search overlays are dynamically injected by `design_system/js/global_chrome.js`.
