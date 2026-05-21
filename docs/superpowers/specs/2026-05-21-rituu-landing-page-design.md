# rituu Landing Page — Design Spec

**Date:** 2026-05-21
**Status:** Approved by user, pending spec review
**Owner:** andor.schvarcz@gmail.com

## 1. Purpose

A single-page static landing site for **rituu** — a community-based platform for embodied rituals. The page captures email signups via a Tally.so form (URL to be provided later) and communicates the brand's voice and mission. Deployed via GitHub Pages from a public repo.

## 2. Constraints

- **Tech:** vanilla HTML + CSS + JavaScript only. No build step, no framework, no package manager.
- **Hosting:** GitHub Pages from `main` branch / repo root.
- **Background:** white (`#FFFFFF`).
- **Mobile-first** and fully responsive.
- **Performance:** lightweight; total page weight ≈ existing assets + ~10 KB code.

## 3. Brand assets (already in `assets/`)

| File | Use |
|------|-----|
| `rituu_Logo_black.png` | Primary logo (hero) |
| `rituu_logoideation_Form 1.svg` | Blob — light green `#B7D58B` |
| `rituu_logoideation_Form 2.svg` | Blob — orange `#C6783E` |
| `rituu_logoideation_Form 3.svg` | Blob — dark green `#4C532C` |
| `rituu_logoideation_Form 4.svg` | Blob — dark blue `#000180` |
| `ColourPalette_rituu.png` | Reference only — not used on page |
| `rituu_logo_white.png` | Reserved (not used in v1) |

### Color palette
`#C6783E` (orange) · `#E6BE66` (mustard) · `#FFFFFF` (white) · `#4C532C` (dark green) · `#000000` (black) · `#000180` (deep blue) · `#B7D58B` (light green)

## 4. Layout

### Mobile (≤768px)
Single-column, content max-width ~480px, horizontally centered. Blobs anchored to viewport corners, partially clipped off-screen. Mirrors the supplied WhatsApp mockup.

### Desktop (>768px)
**Asymmetric split hero** — only the hero section uses the split. Lower sections stay center-aligned in a ~720px column.

- Hero left ~45%: logo, tagline, subscribe CTA, stacked vertically with left-alignment
- Hero right ~55%: blob collage (2–3 blobs arranged organically, overlapping)
- Sections below hero: ~720px max-width column, centered, with single blob accents at the left or right edge of each section (alternating sides).

### Single media query breakpoint
`@media (min-width: 768px)` — used for the hero-split and font-size adjustments only.

## 5. Page sections (top to bottom)

1. **Hero**
   - Logo (`rituu_Logo_black.png`)
   - Tagline: *"be present in your own life"*
   - Primary subscribe button → Tally URL placeholder
2. **Mission**
   - *"We are building a community based platform for embodied moments of attentions, in short: rituals. This is your space to grow roots while you fly high. Master all transitions in your life with ease and feel connected to people all over the world."*
   - *"Become part of sharing practices that makes us all feel human again."*
3. **Subscribe block** — repeated CTA with short prompt *"Subscribe now"*. Same Tally placeholder URL.
4. **Community Guidelines**
   - Heading: **Community Guidelines**
   - Body: *"No Hate. No Fake. No Brain Rott."*
   - Closing: *"See you inside."*
5. **Playground & 4 Steps**
   - Intro paragraph: *"rituu is your playground to discover and create rituals that help you master life through all seasons. We consciously ebb and flow together by sharing meaningful ritual practices. We grow together. And we hope that you feel safe with us."*
   - Sub-heading: *"Within rituu every ritual has four easy steps:"*
   - Four cards, side-by-side on desktop, stacked on mobile:
     - **Arrive** (tinted with `#B7D58B` light green)
     - **Engage** (tinted with `#E6BE66` mustard)
     - **Express** (tinted with `#C6783E` orange)
     - **Integrate** (tinted with `#4C532C` dark green, white text)
6. **Body Wisdom**
   - *"We focus on Breath, Touch, Gestures, Movements, Postures, Voice and Intention. It's not meditation. It's the wisdom your body holds."*
   - *"You're in full control. Define your intention and available time and dive in."*
7. **Footer**
   - Small rituu wordmark (text)
   - © 2026 rituu
   - Socials placeholder (`<!-- TODO: socials -->`)

## 6. Animations

### Page load
- Hero logo, tagline, subscribe CTA, and 2–3 hero blobs fade in staggered at 0.2s / 0.4s / 0.6s / 0.8s.
- CSS `transition: opacity 0.6s ease, transform 0.6s ease`. Initial state `opacity: 0; transform: translateY(20px)`. Animated state via `.is-visible` class.

### On scroll
- Each section's heading + body + section blobs are observed with `IntersectionObserver`. When 15% visible, the `.is-visible` class is added, triggering the same fade-up.
- Stagger inside a section: each child animates 0.1s after the previous.

### Parallax
- A single `scroll` event listener (throttled with `requestAnimationFrame`) reads `window.scrollY` and sets a CSS variable `--parallax-y` on each `.blob` element to `scrollY * factor` where `factor` is 0.3–0.6 depending on the blob (varied for depth feel).
- Blobs use `transform: translate3d(0, var(--parallax-y), 0)` for GPU acceleration.

### Reduced motion
- `@media (prefers-reduced-motion: reduce)` overrides: no transitions, no parallax, all content visible at full opacity from load. JS checks `matchMedia('(prefers-reduced-motion: reduce)').matches` and skips both observer fade-in (sets is-visible immediately) and scroll listener.

## 7. File structure

```
/
├── index.html
├── styles.css
├── main.js
├── assets/                       (existing, unchanged)
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-21-rituu-landing-page-design.md
└── README.md                     (short deploy instructions)
```

## 8. Accessibility

- Semantic HTML: `<header>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>`.
- Logo image gets `alt="rituu"`.
- Decorative blobs use `aria-hidden="true"` and empty `alt`.
- Heading hierarchy: `<h1>` once (hero), `<h2>` per section.
- All interactive elements (subscribe button/link) have visible focus states.
- Text colors: `#000000` and `#4C532C` on white — both pass WCAG AA Large and Normal.
- `prefers-reduced-motion` honored as described above.

## 9. Performance

- No external JS or CSS dependencies.
- Images already in repo; logo PNG used as-is. SVG blobs inlined via `<img src="...svg">` or as inline `<svg>` (decision deferred to implementation — inline lets us style with CSS, `<img>` keeps HTML small; default to `<img>` unless inline styling is needed).
- Total JS ≈ 60 lines, CSS ≈ 250 lines.

## 10. Deployment

1. Push to a public GitHub repo (e.g. `rituu-web`).
2. Repo settings → Pages → Source: `main` / `/ (root)`.
3. Page resolves at `https://<username>.github.io/rituu-web/`.

## 11. Open items (intentional placeholders)

- **Tally URL** — user to provide later. Subscribe buttons render with `href="#"` and an inline `<!-- TODO: Tally URL -->` comment. Easy to swap with one find/replace.
- **Footer socials** — placeholder comment in HTML, no icons in v1.

## 12. Out of scope (YAGNI)

- Build tools (Vite, Astro, Parcel)
- CSS frameworks (Tailwind, Bootstrap)
- JavaScript frameworks (React, Vue, Svelte)
- Analytics or tracking pixels
- Multi-language / i18n
- Dark mode
- Cookie banner (no tracking → not required)
- Custom domain configuration (user can add later via repo settings)
- White-logo variant or any future page (`/about`, `/blog`, etc.)
