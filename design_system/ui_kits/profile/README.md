# UI Kit — Executive Profile

A pixel-faithful recreation of `DrHeatherLeffew.com` (the live site at `htleffew/Pm_html`), broken into small reusable JSX components. Cosmetic recreation only — no real backend, no real data fetches.

## Files
- `index.html` — interactive entry point. Boots the kit and demonstrates a typical view of the executive profile end-to-end.
- `AmbientBackdrop.jsx` — the Three.js icosahedron + cursor halo (optional; degrades gracefully if Three.js isn't loaded).
- `GlobalNav.jsx` — fixed top nav with wordmark + projects link.
- `Hero.jsx` — eyebrow → title → rule → subtitle → contact links + headshot frame.
- `BioCard.jsx` — expandable executive biography card with sapphire glow on the expand button.
- `ProjectCarousel.jsx` — auto-scrolling marquee of `ProjectCard` items.
- `ResumeCard.jsx` — the grid-paper résumé card with ▸ bullets.
- `EducationCard.jsx` — degree card with mono-labelled specialization / dissertation rows.
- `TechStack.jsx` — capability cluster with dashed pill chips.
- `ResearchFeed.jsx` — a slim version of the research index card list (for embedding inside the profile page).

## Components NOT recreated
- The case-study pages themselves (~30 of them). They share the same chrome / typography / card vocabulary as the profile and are out of scope for this kit.
- The full Lenis smooth-scroll runtime — included as an optional CDN script in `index.html` but the design works without it.

## Substitutions
- Fonts via Google Fonts (same as live site).
- Three.js + GSAP via CDN (same versions as live site: `three@r128`, `gsap@3.12.5`, `lenis@1.1.13`).
