---
component: SVG Temporal Sequence
id: DIA-02
status: stable
category: diagrams
interactivity: none
source: multimodal-autism-ai.html — FIG.05
---

## What It Does
A static timeline diagram showing two parallel event tracks (cause/effect, clinician/patient, stimulus/response) with timestamped markers and a curved connector showing latency between paired events.

## When to Use
- Clinical behavioral sequences (bid → response latency)
- Cause-and-effect timing analysis
- Protocol sequences (request → acknowledgment)
- Any "Event A triggers Event B after X seconds/ms" narrative
- System response time diagrams

## When NOT to Use
- More than 3 concurrent tracks (becomes unreadable)
- When exact timing data isn't central (use hierarchy tree for structural relationships)
- When events are simultaneous (no latency to show)

## Anatomy
```
CLINICIAN ACTIONS ──●────────────────────── timeline →
                    │ Joint Attention Bid
                    │
                    ╰── 1.2 sec ──╮
                                  ↓
PATIENT RESPONSES  ─────────────●────────── timeline →
                                 │ Social Smile (gold)
```

## The Two-Accent System

This is the **only diagram in the system that uses `--hansa` (gold)**:

| Color | Token | Hex | Role |
|-------|-------|-----|------|
| Blue | `--phthalo` / `--phthalo-lift` | #0F3A6B / #3866A0 | Initiator / Cause / Clinician action |
| Gold | `--hansa` | #DBA844 | Responder / Effect / Patient response |

Blue = the thing that happens first. Gold = the reaction that follows. This two-color logic is universal to any cause-effect temporal diagram — not just clinical settings.

## SVG Implementation

Complete markup from `multimodal-autism-ai.html` FIG.05:

```html
<svg viewBox="0 0 800 180" style="width:100%; height:auto;">
  <g font-family="JetBrains Mono" font-size="11" fill="#A1A1A6">

    <!-- Horizontal time axis -->
    <line x1="50" y1="140" x2="750" y2="140" stroke="#333" stroke-width="2"/>
    <text x="400" y="165" text-anchor="middle">Time (Seconds)</text>

    <!-- Track 1: Clinician Actions -->
    <text x="50" y="45" font-weight="bold" fill="#F5F5F7">Clinician Actions</text>
    <line x1="200" y1="40" x2="750" y2="40"
          stroke="#222" stroke-width="20" stroke-linecap="round"/>

    <!-- Track 2: Patient Responses -->
    <text x="50" y="105" font-weight="bold" fill="#F5F5F7">Patient Responses</text>
    <line x1="200" y1="100" x2="750" y2="100"
          stroke="#222" stroke-width="20" stroke-linecap="round"/>

    <!-- Event marker: Clinician bid (blue) -->
    <circle cx="300" cy="40" r="6" fill="#0F3A6B"/>
    <text x="300" y="20" text-anchor="middle" fill="#3866A0">Joint Attention Bid</text>

    <!-- Event marker: Patient response (gold) -->
    <circle cx="450" cy="100" r="6" fill="#DBA844"/>
    <text x="450" y="125" text-anchor="middle" fill="#DBA844">Social Smile</text>

    <!-- Latency connector (cubic bezier from blue event to gold event) -->
    <path d="M 300 46 C 300 80, 450 60, 450 94"
          fill="none" stroke="#DBA844" stroke-width="2" stroke-dasharray="4 4"/>

    <!-- Latency label -->
    <rect x="345" y="60" width="60" height="20" rx="2"
          fill="#161616" stroke="#333"/>
    <text x="375" y="74" text-anchor="middle" font-size="10" fill="#F5F5F7">1.2 sec</text>

  </g>
</svg>
```

## Key SVG Patterns

### The Cubic Bezier Connector
```html
<path d="M [x1] [y1+offset] C [x1] [ctrlY], [x2] [ctrlY], [x2] [y2-offset]"
      fill="none" stroke="#DBA844" stroke-width="2" stroke-dasharray="4 4"/>
```
Control point logic: `C [startX] [midY], [endX] [midY], [endX] [endY]`
- The first and second control points share the same Y value (`midY = (y1 + y2) / 2`)
- This creates a smooth S-curve connecting the two tracks
- `stroke-dasharray="4 4"` signals "implied/invisible relationship" — the latency is inferred, not observed directly

### The Track Band
```html
<line x1="200" y1="40" x2="750" y2="40" stroke="#222" stroke-width="20" stroke-linecap="round"/>
```
Uses a thick stroked line (not a rect) for the timeline track. `stroke-width: 20` with `stroke-linecap: round` creates a pill-shaped band. Easier to position than rects; more scalable.

### The Latency Label Box
```html
<rect x="345" y="60" width="60" height="20" rx="2" fill="#161616" stroke="#333"/>
<text x="375" y="74" text-anchor="middle" font-size="10" fill="#F5F5F7">1.2 sec</text>
```
Dark box with subtle border, centered over the bezier midpoint. Always positions the rect center at the midpoint between the two events: `x = (x1 + x2)/2 - width/2`.

## Design Token Mapping
| SVG Value | CSS Token |
|-----------|-----------|
| `fill="#0F3A6B"` (blue dot) | `--phthalo` |
| `fill="#3866A0"` (blue label) | `--phthalo-lift` |
| `fill="#DBA844"` (gold dot + label) | `--hansa` |
| `fill="#F5F5F7"` (track labels) | `--platinum` |
| `fill="#A1A1A6"` (axis text) | `--tungsten` |
| `stroke="#222"` (tracks) | `--graphite` |
| `fill="#161616"` (label box) | `--charcoal` |

## How to Adapt

**What changes:** Event labels, circle positions (cx), bezier control points, latency label text and position, track labels.

**What stays constant:** The two-color system (blue = initiator, gold = responder). The dashed connector indicating latency. The `stroke-width: 20` track bands. The JetBrains Mono font.

**For more events:** Add more circle markers along the tracks. Keep gold for responder events, blue for initiator events. Don't add a third color — use opacity variation instead.

**For multiple latencies:** Each latency gets its own bezier path. Stack multiple connectors between the two tracks, varying `cx` positions.

## Source Reference
`multimodal-autism-ai.html` → Section 06 "Future Directions" → FIG.05 "Temporal sequencing graph. Simple aggregate counts fail to capture the critical clinical latency between a clinician's bid and a child's response."
