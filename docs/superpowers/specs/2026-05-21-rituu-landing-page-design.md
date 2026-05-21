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

### Typography

- **Display / headings / wordmark:** Snaga Uni Display
- **Body / regular text:** Akkurat

Both are commercial fonts; the user supplies the `.woff2` files. They live in `assets/fonts/` and are loaded via `@font-face` with `font-display: swap`. Until the files are dropped in, graceful fallback stacks render so the page is never blocked:

```css
--font-display: 'Snaga Uni Display', 'Outfit', 'Manrope', system-ui, sans-serif;
--font-body:    'Akkurat', 'Inter', system-ui, -apple-system, sans-serif;
```

Type scale (mobile → desktop):
- `h1` (hero tagline): 2.25rem → 3.5rem
- `h2` (section): 1.75rem → 2.5rem
- `body`: 1rem → 1.125rem
- small / footer: 0.875rem

## 4. Layout

### Mobile (≤768px)
Single-column, content max-width ~480px, horizontally centered. Blobs anchored to viewport corners, partially clipped off-screen. Mirrors the supplied WhatsApp mockup.

### Vertical rhythm
- Hero: `min-height: 100svh` on mobile, `min-height: 90vh` on desktop. Content vertically centered.
- Inter-section spacing: `4rem` mobile, `6rem` desktop (applied as section `padding-block`).
- Footer padding: `3rem` above, `2rem` below.

### Desktop (>768px)
**Asymmetric split hero** — only the hero section uses the split. Lower sections stay center-aligned in a ~720px column.

- Hero left ~45%: logo, tagline, subscribe CTA, stacked vertically with left-alignment
- Hero right ~55%: blob collage of exactly **3 blobs** — orange (`#C6783E`), light green (`#B7D58B`), deep blue (`#000180`) — arranged with overlap.
- Sections below hero: ~720px max-width column, centered, with single blob accents at the left or right edge of each section (alternating sides). Suggested per-section blob usage: Mission = dark green (`#4C532C`), Community Guidelines = orange, Playground = light green, Body Wisdom = deep blue.

### Single media query breakpoint
`@media (min-width: 768px)` — used for the hero-split and font-size adjustments only.

## 5. Page sections (top to bottom)

1. **Hero**
   - Logo (`rituu_Logo_black.png`) — sized at `width: clamp(180px, 32vw, 320px)`
   - Tagline (`<h1>`): *"your digital sanctuary"*
   - Primary subscribe button → Tally URL placeholder

   **Subscribe button visual:**
   - Background `#000000`, text `#FFFFFF`, font `var(--font-body)`, weight 500, size 1rem
   - Padding `0.875rem 2rem`, `border-radius: 999px` (pill), no border
   - Hover: background `#4C532C` (dark green), `transition: background 0.2s ease`
   - Focus-visible: 2px solid `#000180` outline, `outline-offset: 3px`
2. **Mission**
   - Section heading (`<h2>`): *"be present in your own life"*
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
   - Four cards, side-by-side on desktop, stacked on mobile. Each card has its own background tint; text color is chosen for WCAG AA contrast on that tint:
     - **Arrive** — background `#B7D58B` (light green), text `#000000`
     - **Engage** — background `#E6BE66` (mustard), text `#000000`
     - **Express** — background `#C6783E` (orange), text `#FFFFFF`
     - **Integrate** — background `#4C532C` (dark green), text `#FFFFFF`
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
- A single `scroll` event listener (throttled with `requestAnimationFrame`) reads `window.scrollY` and sets a CSS variable `--parallax-y` on each `.blob` element to `scrollY * factor`.
- Per-blob factors via `data-parallax="<factor>"` attribute, read once on init:
  - Hero blobs: `0.30`, `0.45`, `0.55`
  - Section blobs: `0.35` (Mission), `0.50` (Guidelines), `0.40` (Playground), `0.55` (Body Wisdom)
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
│   └── fonts/                    (user drops .woff2 files here)
│       ├── SnagaUniDisplay.woff2 (TODO — user-supplied)
│       └── Akkurat.woff2         (TODO — user-supplied)
├── favicon.svg                   (1-character "r" mark in #000000)
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-21-rituu-landing-page-design.md
└── README.md                     (short deploy instructions)
```

### Page metadata (in `<head>`)

- `<title>rituu — your digital sanctuary</title>`
- `<meta name="description" content="rituu is a community-based platform for embodied moments of attention. Be present in your own life and master its transitions through shared ritual practices.">`
- Open Graph: `og:title`, `og:description`, `og:image` (= `assets/rituu_Logo_black.png`), `og:type=website`, `og:url` (placeholder)
- Twitter card: `summary_large_image`
- `<link rel="icon" type="image/svg+xml" href="favicon.svg">`
- `<link rel="apple-touch-icon" href="assets/rituu_Logo_black.png">`
- Viewport meta + UTF-8 charset

## 8. Accessibility

- Semantic HTML: `<header>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>`.
- Logo image gets `alt="rituu"`.
- Decorative blobs use `aria-hidden="true"` and empty `alt`.
- Heading hierarchy: `<h1>` once (hero), `<h2>` per section.
- All interactive elements (subscribe button/link) have visible focus states.
- Body text on white background uses `#000000` or `#4C532C` — both pass WCAG AA.
- 4-step card text colors (per §5.5) are chosen per card background for WCAG AA contrast.
- `prefers-reduced-motion` honored as described above.

## 9. Performance

- No external JS or CSS dependencies. No CDN font fetches.
- Images already in repo; logo PNG used as-is. **SVG blobs are rendered as `<img src="...svg" class="blob" data-parallax="…">`** — keeps HTML small and the existing SVGs work as-is. CSS targets `.blob` for sizing, positioning, opacity transitions, and the parallax transform via the `--parallax-y` CSS variable.
- Fonts: `font-display: swap` so text never blocks render; fallback stack matches metrics closely.
- Total JS ≈ 60 lines, CSS ≈ 280 lines.

## 10. Deployment

1. Push to a public GitHub repo (e.g. `rituu-web`).
2. Repo settings → Pages → Source: `main` / `/ (root)`.
3. Page resolves at `https://<username>.github.io/rituu-web/`.

## 11. Open items (intentional placeholders)

- **Tally URL** — user to provide later. Subscribe buttons render with `href="#"` and an inline `<!-- TODO: Tally URL -->` comment. Easy to swap with one find/replace.
- **Footer socials** — placeholder comment in HTML, no icons in v1.
- **Font files** — user supplies `SnagaUniDisplay.woff2` and `Akkurat.woff2` in `assets/fonts/`. Until then, fallback stacks render.
- **OG image** — uses logo PNG for v1; can swap for a dedicated 1200×630 social card later.

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
