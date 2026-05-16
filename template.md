---
title: "Master Template Guideline"
description: "This document serves as the authoritative standard for all components, typography, colors, and layout structures used ac..."
category: "·"
subcategory: "Obsidian & Chrome"
format: "CASE STUDY"
time: "5 min read"
scripts: ["interactive_5.js"]
---
# Master Template Guideline

Dr. Heather Leffew
Obelus Institute
May 2026
---

## Abstract
This document serves as the authoritative standard for all components, typography, colors, and layout structures used across the portfolio. It encompasses both the "Dark Mode" (Obsidian) and "Light Mode" (Paper) structural bands, and includes all page controls and types.

[Dr. Heather Leffew](index.html)

Search
[About](about.html)
[Research Library](projects-repository.html)
[Resume ->](resume.pdf)

Dark Mode (Obsidian)

## Landing Page Elements

Color Palette

Obsidian  
#030303

Charcoal  
#1A1A1A

Brushed  
#333333

Tungsten  
#A1A1A6

Platinum  
#F5F5F7

Flare  
#FFFFFF

Phthalo Blue  
#0F3A6B

Phthalo Lift  
#3866A0

Typography

# Heading Level 1

## Heading Level 2

### Heading Level 3

#### Heading Level 4

Lede Paragraph: Measuring what machines and humans reveal through language, behavior, and implicit signals to build the science of how they think.

Body Paragraph: Her doctoral research used computational psycholinguistics to measure implicit power drives in the manifestos of mass murderers.

Eyebrow Mono Label

Caption Mono Label

Inline code example: `npm run dev` or `const x = 10;`

Tags

Technical Leadership
AI Strategy
Machine Learning
NLP

Project Card

[Case Study

### Multimodal Autism AI

Using advanced language and audio models to detect implicit markers in diagnostic interviews.

View Research ->](#)

Resume Card

### Director of Data Science

Spokeo

Sep 2025 - Present

Founding technical leader who built and scaled Spokeo's Data Science and AI function.

Light Mode (Paper)

## About Page Elements

Color Palette

Paper  
#F5F5F7

Paper 2  
#E9E9E9

Paper 3  
#DDDDDD

Ink  
#030303

Ink 2  
#222222

Ink 3  
#5E5E5A

Ink Blue  
#1A3A6B

Phthalo Lift  
#3866A0

Typography

# Heading Level 1

## Heading Level 2

### Heading Level 3

#### Heading Level 4

Lede Paragraph: Measuring what machines and humans reveal through language, behavior, and implicit signals to build the science of how they think.

Body Paragraph: Her doctoral research used computational psycholinguistics to measure implicit power drives in the manifestos of mass murderers.

Eyebrow Mono Label

Caption Mono Label

Inline code example: `npm run dev` or `const x = 10;`

About Page specific blocks

About Component

# I, Robopsychologist

I love machines and I love humans. I have spent my entire career trying to understand how they think, how they interact, and what happens when they shape each other.

![Dr. Heather Leffew](design_system/assets/Heather_headshot_2.jpg)

This is a paragraph inside the about body. It uses ink-2 color and specific leading.

And here is the section break line.

[Executive Profile](#)
[Research Library](#)
[Resume PDF](#)

Biography Card

**Dr. Heather Leffew** is a PhD psychologist and data science executive who has spent twenty years building measurement systems that cut through ambiguity in human and machine behavior.

Read Full Biography +

Spotify Embed

Dashboard Layout

## Project Repository Dashboard

TAXONOMY (Sidebar)

Domain Area

Sort by Relevance
Sort Alphabetically

Machine Learning
NLP

[2026

Multimodal Autism AI

Clinical ML

→](#)
[2025

Autoresearch Master

Agentic Systems

→](#)

Project Pages

## Individual Case Study (Dark Mode)

This section demonstrates the native layout of the case study components in a dark environment.

01 / Case Study Component

## The Philosophy of Ultra-Realistic Data Simulation

A common pitfall in clinical machine learning is training models on idealized, perfectly separated datasets. This text uses the Gloss Tooltip**Gloss Tooltip**, used to define specialized terminology inline without disrupting prose. component.

![Figure 2](fig_2.svg)

FIG. 01 Receiver Operating Characteristic curve. The highly steep arch indicates potential overfitting.

Enforcing Realism (Method Box)

We enforce realism through constraints:

* **Clinical Overlap:** Statistical overlap in behavioral features between groups.
* **Measurement Noise:** Injecting 25% to 35% error.

| Simulation Parameter | Target Value |
| --- | --- |
| Total Profiles | 1,200 |

```
# Python implementation of the Ultra-Realistic Data Simulation
import numpy as np

def generate_clinical_data():
    return True
```

Interactive Profile Explorer

[Interactive Explorer Block - See live site]

Project Pages

## Individual Case Study (Light Mode)

This section demonstrates the native layout of the exact same components adapting seamlessly to a light environment.

01 / Case Study Component

## The Philosophy of Ultra-Realistic Data Simulation

A common pitfall in clinical machine learning is training models on idealized, perfectly separated datasets. This text uses the Gloss Tooltip**Gloss Tooltip**, used to define specialized terminology inline without disrupting prose. component.

![Figure 3](fig_3.svg)

FIG. 01 Receiver Operating Characteristic curve. The highly steep arch indicates potential overfitting.

Enforcing Realism (Method Box)

We enforce realism through constraints:

* **Clinical Overlap:** Statistical overlap in behavioral features between groups.
* **Measurement Noise:** Injecting 25% to 35% error.

| Simulation Parameter | Target Value |
| --- | --- |
| Total Profiles | 1,200 |

```
# Python implementation of the Ultra-Realistic Data Simulation
import numpy as np

def generate_clinical_data():
    return True
```

Interactive Profile Explorer

[Interactive Explorer Block - See live site]

Case Study Assets

## Diagram Colors (Oil Paint Quartet)

Phthalo Blue  
#0F3A6B

Phthalo Lift  
#3866A0

Alizarin  
#7A1626

Hooker's Green  
#1A4A38

Hansa Yellow  
#DBA844

Dioxazine  
#3D1F4A

Implementation

## Boilerplate & Required Dependencies

To render the Obsidian & Chrome design system correctly, your HTML file must include the exact sequence of stylesheets, external CDNs, and JavaScript components shown below.

```
<!-- 1. Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:wght@300;400;500;700&display=swap" rel="stylesheet">

<!-- 2. Global Stylesheet -->
<link rel="stylesheet" href="design_system/css/global.css">

<!-- 3. Animation & Cinematic CDNs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>
<script src="https://unpkg.com/split-type" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js" defer></script>

<!-- 4. Global Core Script (Place at bottom of body) -->
<script src="design_system/js/global.js" defer></script>
```

Standalone Files

## JavaScript Component Architecture

The Obsidian & Chrome design system relies on a set of standalone JavaScript files that orchestrate the interactive, cinematic, and functional layers of the site. They are included as external scripts rather than inline blocks to ensure consistent caching and maintainability.

Core Engines

### 1. global.js

Dependency: GSAP, Lenis, SplitType, Three.js

This file is the consolidated powerhouse of the site's visual experience and institutional functionality. It handles:

* **Lenis Smooth Scrolling:** Hijacks native scroll to provide fluid, momentum-based scrolling.
* **GSAP ScrollTriggers:** Orchestrates elements fading in, sliding up, and blurring/unblurring as they enter the viewport.
* **Theatrical Opening Sequences:** Controls the initial preloader curtain split, the text splitting effects (`SplitType`), and the fade-in sequence for hero elements.
* **Navigation Mode Observer:** Uses `IntersectionObserver` to detect when a `.band--paper` enters the viewport, toggling the `is-paper` class on the top navigation to invert text colors for contrast.
* **Progress Bar:** Calculates scroll depth and updates the `--p` CSS variable driving the top progress indicator.
* **Dynamic Navigation:** Handles the global topnav, search overlay logic, footer rendering, and "Next Publication" back matter.

### 2. library\_dashboard.js

Dependency: master\_index.json

Used specifically on the `projects-repository.html` page to render the interactive project directory:

* **Data Fetching:** Asynchronously loads the master JSON database of publications.
* **DOM Injection:** Dynamically builds the `.db-row` table elements, the `.db-chips` tag filters, and the sidebar accordion.
* **Search & Filter Logic:** Executes real-time string matching and tag intersection to filter the visible table rows.

© 2026 Dr. Heather Leffew. All Rights Reserved.

[Research Library](projects-repository.html)
[About](about.html)
