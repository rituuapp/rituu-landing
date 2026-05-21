# rituu Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-page static landing site for rituu — animated, mobile-first, deployable to GitHub Pages with zero build step.

**Architecture:** Three flat files (`index.html`, `styles.css`, `main.js`) at the repo root, plus existing `assets/`. CSS custom properties drive the design tokens (colors, fonts, spacing). Animations are pure CSS transitions toggled by an `is-visible` class that JavaScript sets via an `IntersectionObserver`. Parallax is a single `scroll` handler throttled with `requestAnimationFrame` that writes a `--parallax-y` CSS variable on each blob. `prefers-reduced-motion` short-circuits both.

**Tech Stack:** HTML5, CSS3 (custom properties, grid, flexbox, `@font-face`), vanilla JavaScript (IntersectionObserver, requestAnimationFrame, matchMedia). No build tools, no frameworks, no package manager.

**Source of truth:** [`docs/superpowers/specs/2026-05-21-rituu-landing-page-design.md`](../specs/2026-05-21-rituu-landing-page-design.md)

---

## File Map

| File | Status | Responsibility |
|------|--------|----------------|
| `index.html` | CREATE | Document structure, all section markup, all copy, metadata in `<head>` |
| `styles.css` | CREATE | Design tokens, base styles, layout, animations, reduced-motion overrides |
| `main.js` | CREATE | Load fade-in trigger, IntersectionObserver, parallax handler, motion preference gate |
| `favicon.svg` | CREATE | Tiny inline SVG favicon — black "r" on transparent |
| `README.md` | CREATE | One-paragraph deploy instructions for GitHub Pages |
| `assets/fonts/.gitkeep` | CREATE | Empty file so the empty fonts dir gets tracked |
| `assets/` (everything else) | UNTOUCHED | Existing logo + blob SVGs |

Verification at the end is manual — open the page locally, scroll, resize, test reduced motion. The `verify` and `run` skills automate the browser-driven checks.

---

## Task 1: Scaffold project files

Set up the empty file skeleton so subsequent tasks have something to fill in.

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `main.js`
- Create: `favicon.svg`
- Create: `README.md`
- Create: `assets/fonts/.gitkeep`

- [ ] **Step 1: Write `index.html` with head metadata and empty body**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>rituu — your digital sanctuary</title>
  <meta name="description" content="rituu is a community-based platform for embodied moments of attention. Be present in your own life and master its transitions through shared ritual practices.">

  <meta property="og:type" content="website">
  <meta property="og:title" content="rituu — your digital sanctuary">
  <meta property="og:description" content="A community-based platform for embodied moments of attention.">
  <meta property="og:image" content="assets/rituu_Logo_black.png">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="apple-touch-icon" href="assets/rituu_Logo_black.png">

  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- sections added in later tasks -->
  <script src="main.js" defer></script>
</body>
</html>
```

- [ ] **Step 2: Write `styles.css` with just a body reset**

```css
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { background: #FFFFFF; color: #000000; font-family: system-ui, sans-serif; }
img { max-width: 100%; display: block; }
```

- [ ] **Step 3: Write `main.js` as an empty IIFE**

```js
(() => {
  // populated in later tasks
})();
```

- [ ] **Step 4: Write `favicon.svg`** — minimal "r" mark

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text x="16" y="24" text-anchor="middle" font-family="system-ui, sans-serif" font-size="22" font-weight="700" fill="#000">r</text></svg>
```

- [ ] **Step 5: Write `README.md`**

```markdown
# rituu-web

Landing page for **rituu** — be present in your own life.

## Local preview

Open `index.html` directly in a browser, or run a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push this repo to GitHub (public).
2. Repo → Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `/ (root)`.
3. Page resolves at `https://<username>.github.io/rituu-web/` within a minute.

## Fonts

Drop `SnagaUniDisplay.woff2` and `Akkurat.woff2` into `assets/fonts/`. Until then, the page renders with the fallback stack.

## Tally subscribe form

Replace every `href="#TALLY"` in `index.html` with the live Tally URL.
```

- [ ] **Step 6: Create empty `assets/fonts/.gitkeep`**

```bash
mkdir -p assets/fonts && touch assets/fonts/.gitkeep
```

- [ ] **Step 7: Verify the page loads without errors**

```bash
python3 -m http.server 8000 &
sleep 1
curl -sI http://localhost:8000/ | head -1
# Expected: HTTP/1.0 200 OK
kill %1
```

- [ ] **Step 8: Commit**

```bash
git add index.html styles.css main.js favicon.svg README.md assets/fonts/.gitkeep
git commit -m "feat: scaffold landing page files and metadata"
```

---

## Task 2: Design tokens, typography, and base styles

Lock in colors, fonts, type scale, and spacing as CSS custom properties so every later task references the same source.

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Replace `styles.css` with full token + base layer**

```css
/* ----- @font-face: user-supplied .woff2 files in assets/fonts/ ----- */
@font-face {
  font-family: 'Snaga Uni Display';
  src: url('assets/fonts/SnagaUniDisplay.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: 'Akkurat';
  src: url('assets/fonts/Akkurat.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}

/* ----- Design tokens ----- */
:root {
  /* brand */
  --color-white:       #FFFFFF;
  --color-black:       #000000;
  --color-orange:      #C6783E;
  --color-mustard:     #E6BE66;
  --color-green-dark:  #4C532C;
  --color-green-light: #B7D58B;
  --color-blue-deep:   #000180;

  /* type */
  --font-display: 'Snaga Uni Display', 'Outfit', 'Manrope', system-ui, sans-serif;
  --font-body:    'Akkurat', 'Inter', system-ui, -apple-system, sans-serif;

  /* fluid type scale */
  --fs-h1:    clamp(2.25rem, 6vw, 3.5rem);
  --fs-h2:    clamp(1.75rem, 4vw, 2.5rem);
  --fs-body:  clamp(1rem, 1.5vw, 1.125rem);
  --fs-small: 0.875rem;

  /* spacing */
  --space-section: 4rem;          /* mobile */
  --space-section-lg: 6rem;       /* desktop */
  --content-max: 720px;
}

/* ----- Reset ----- */
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--color-white);
  color: var(--color-black);
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; }

/* ----- Typography ----- */
h1, h2, h3 {
  font-family: var(--font-display);
  font-weight: 400;
  line-height: 1.15;
  margin: 0 0 1rem;
}
h1 { font-size: var(--fs-h1); }
h2 { font-size: var(--fs-h2); }
p  { margin: 0 0 1rem; }

/* ----- Layout helpers ----- */
.container {
  max-width: var(--content-max);
  margin-inline: auto;
  padding-inline: 1.5rem;
}
section {
  padding-block: var(--space-section);
  position: relative;
  overflow: hidden; /* clip blobs that bleed beyond section */
}
@media (min-width: 768px) {
  section { padding-block: var(--space-section-lg); }
}
```

- [ ] **Step 2: Open the page and confirm body renders with fallback fonts**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/  # macOS
# Inspect in DevTools: body should use system-ui (fallback for Akkurat)
kill %1
```

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add design tokens, type scale, and base styles"
```

---

## Task 3: Hero section — markup, content, and styles

The hero is the heaviest visual section. Build it whole: markup, mobile layout, desktop split, blobs, button.

**Files:**
- Modify: `index.html` (replace body's empty comment with hero markup)
- Modify: `styles.css` (append hero block)

- [ ] **Step 1: Add hero markup to `index.html`** (replace `<!-- sections added... -->`)

```html
<header class="hero" id="hero">
  <div class="hero__inner container">
    <div class="hero__content">
      <img class="hero__logo" src="assets/rituu_Logo_black.png" alt="rituu" width="320" height="320">
      <h1 class="hero__tagline">your digital sanctuary</h1>
      <a class="btn btn--primary" href="#TALLY" aria-label="Subscribe">Subscribe</a>
      <!-- TODO: replace #TALLY with live Tally URL -->
    </div>
    <div class="hero__blobs" aria-hidden="true">
      <img class="blob blob--hero-1" src="assets/rituu_logoideation_Form 2.svg" alt="" data-parallax="0.30">
      <img class="blob blob--hero-2" src="assets/rituu_logoideation_Form 1.svg" alt="" data-parallax="0.45">
      <img class="blob blob--hero-3" src="assets/rituu_logoideation_Form 4.svg" alt="" data-parallax="0.55">
    </div>
  </div>
</header>

<main>
  <!-- content sections added in later tasks -->
</main>
```

- [ ] **Step 2: Append hero CSS to `styles.css`**

```css
/* ===== Hero ===== */
.hero {
  min-height: 100svh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.hero__inner {
  width: 100%;
  display: grid;
  gap: 2rem;
}
.hero__content {
  text-align: center;
  position: relative;
  z-index: 2;
}
.hero__logo {
  width: clamp(180px, 32vw, 320px);
  height: auto;
  margin: 0 auto 1.5rem;
}
.hero__tagline {
  margin-bottom: 2rem;
}
.hero__blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

/* Mobile blob placement — corners, partially clipped */
.blob--hero-1 { /* orange */
  position: absolute;
  width: 60vw; max-width: 320px;
  top: -10vw; right: -15vw;
  opacity: 0.85;
}
.blob--hero-2 { /* light green */
  position: absolute;
  width: 70vw; max-width: 380px;
  top: -20vw; left: -25vw;
  opacity: 0.85;
}
.blob--hero-3 { /* deep blue */
  position: absolute;
  width: 75vw; max-width: 400px;
  bottom: -20vw; right: -25vw;
  opacity: 0.95;
}

/* Button */
.btn {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 500;
  padding: 0.875rem 2rem;
  border-radius: 999px;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  border: none;
}
.btn--primary {
  background: var(--color-black);
  color: var(--color-white);
}
.btn--primary:hover { background: var(--color-green-dark); }
.btn:focus-visible {
  outline: 2px solid var(--color-blue-deep);
  outline-offset: 3px;
}

/* Desktop split layout */
@media (min-width: 768px) {
  .hero { min-height: 90vh; }
  .hero__inner {
    grid-template-columns: 45% 55%;
    align-items: center;
    gap: 0;
  }
  .hero__content {
    text-align: left;
    padding-right: 2rem;
  }
  .hero__logo { margin-inline: 0; }
  .hero__blobs {
    position: relative;
    inset: auto;
    height: 70vh;
  }
  /* Reposition the 3 blobs as a collage on the right half */
  .blob--hero-1 { /* orange — top right */
    width: 45%; max-width: none;
    top: 0; right: 5%; left: auto; bottom: auto;
  }
  .blob--hero-2 { /* light green — middle left of collage */
    width: 55%; max-width: none;
    top: 20%; left: -5%; right: auto; bottom: auto;
  }
  .blob--hero-3 { /* deep blue — bottom right */
    width: 50%; max-width: none;
    bottom: 0; right: 0; top: auto; left: auto;
  }
}
```

- [ ] **Step 3: Reload the page and verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Expected (manual eyeball):
- Mobile width (resize browser to ~400px): logo + tagline + button centered, blobs in corners
- Desktop (>768px): content on left, three overlapping blobs on the right
- Button is a black pill; hover turns dark green

- [ ] **Step 4: Commit**

```bash
git add index.html styles.css
git commit -m "feat: build hero section with logo, tagline, button, and blob collage"
```

---

## Task 4: All content sections — markup + copy

Add every remaining section's markup in one pass so we can then style them. Each section follows the same `section > .container` structure.

**Files:**
- Modify: `index.html` (inside `<main>`)

- [ ] **Step 1: Insert all content sections inside `<main>`**

```html
<section class="section section--mission" id="mission" aria-labelledby="mission-h">
  <img class="blob blob--side blob--mission" src="assets/rituu_logoideation_Form 3.svg" alt="" aria-hidden="true" data-parallax="0.35">
  <div class="container">
    <h2 id="mission-h">be present in your own life</h2>
    <p>We are building a community based platform for embodied moments of attentions, in short: rituals. This is your space to grow roots while you fly high. Master all transitions in your life with ease and feel connected to people all over the world.</p>
    <p>Become part of sharing practices that makes us all feel human again.</p>
  </div>
</section>

<section class="section section--subscribe" id="subscribe" aria-labelledby="subscribe-h">
  <div class="container subscribe">
    <h2 id="subscribe-h" class="subscribe__title">Subscribe now</h2>
    <a class="btn btn--primary" href="#TALLY">Join rituu</a>
    <!-- TODO: replace #TALLY with live Tally URL -->
  </div>
</section>

<section class="section section--guidelines" id="guidelines" aria-labelledby="guidelines-h">
  <img class="blob blob--side blob--guidelines" src="assets/rituu_logoideation_Form 2.svg" alt="" aria-hidden="true" data-parallax="0.50">
  <div class="container guidelines">
    <h2 id="guidelines-h">Community Guidelines</h2>
    <p class="guidelines__rules">No Hate. No Fake. No Brain Rott.</p>
    <p class="guidelines__sign">See you inside.</p>
  </div>
</section>

<section class="section section--playground" id="playground" aria-labelledby="playground-h">
  <img class="blob blob--side blob--playground" src="assets/rituu_logoideation_Form 1.svg" alt="" aria-hidden="true" data-parallax="0.40">
  <div class="container">
    <h2 id="playground-h" class="visually-hidden">A ritual in four steps</h2>
    <p>rituu is your playground to discover and create rituals that help you master life through all seasons. We consciously ebb and flow together by sharing meaningful ritual practices. We grow together. And we hope that you feel safe with us.</p>
    <p class="steps__intro">Within rituu every ritual has four easy steps:</p>
    <ol class="steps">
      <li class="step step--arrive"><span class="step__num">01</span><span class="step__name">Arrive</span></li>
      <li class="step step--engage"><span class="step__num">02</span><span class="step__name">Engage</span></li>
      <li class="step step--express"><span class="step__num">03</span><span class="step__name">Express</span></li>
      <li class="step step--integrate"><span class="step__num">04</span><span class="step__name">Integrate</span></li>
    </ol>
  </div>
</section>

<section class="section section--body" id="body-wisdom" aria-labelledby="body-h">
  <img class="blob blob--side blob--body" src="assets/rituu_logoideation_Form 4.svg" alt="" aria-hidden="true" data-parallax="0.55">
  <div class="container">
    <h2 id="body-h" class="visually-hidden">Body wisdom</h2>
    <p>We focus on Breath, Touch, Gestures, Movements, Postures, Voice and Intention. It's not meditation. It's the wisdom your body holds.</p>
    <p>You're in full control. Define your intention and available time and dive in.</p>
  </div>
</section>
```

- [ ] **Step 2: Add the footer after `</main>`**

```html
<footer class="footer">
  <div class="container footer__inner">
    <p class="footer__mark">rituu</p>
    <p class="footer__meta">© 2026 rituu</p>
    <!-- TODO: socials -->
  </div>
</footer>
```

- [ ] **Step 3: Reload and verify all copy is visible (unstyled)**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Expected: every paragraph and heading appears in DOM. Styling comes next.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add markup and copy for all content sections + footer"
```

---

## Task 5: Content section styles + 4-step cards + footer

Style everything below the hero. Cards get their tinted backgrounds.

**Files:**
- Modify: `styles.css` (append)

- [ ] **Step 1: Append content section styles**

```css
/* ===== Visually hidden (a11y) ===== */
.visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

/* ===== Sections — base ===== */
.section { position: relative; }

/* Side blob accents (one per section, alternating sides) */
.blob--side {
  position: absolute;
  width: 50vw; max-width: 360px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.75;
}
.blob--mission     { top: 10%;  left: -15vw; }
.blob--guidelines  { top: 5%;   right: -15vw; }
.blob--playground  { top: 5%;   left: -15vw; }
.blob--body        { top: 10%;  right: -15vw; }

.section .container { position: relative; z-index: 1; }

/* Mission */
.section--mission p {
  font-size: 1.0625rem;
}

/* Subscribe block */
.section--subscribe { text-align: center; }
.subscribe__title { margin-bottom: 1.5rem; }

/* Community Guidelines */
.guidelines { text-align: center; }
.guidelines__rules {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  color: var(--color-orange);
  margin-block: 1rem 1.5rem;
}
.guidelines__sign {
  font-style: italic;
  color: var(--color-green-dark);
}

/* Steps */
.steps__intro {
  margin-top: 2rem;
  font-weight: 500;
}
.steps {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}
.step {
  padding: 1.5rem 1.25rem;
  border-radius: 16px;
  font-family: var(--font-display);
  display: flex;
  align-items: baseline;
  gap: 1rem;
}
.step__num {
  font-size: 1rem;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}
.step__name {
  font-size: 1.75rem;
  letter-spacing: -0.01em;
}
.step--arrive    { background: var(--color-green-light); color: var(--color-black); }
.step--engage    { background: var(--color-mustard);     color: var(--color-black); }
.step--express   { background: var(--color-orange);      color: var(--color-white); }
.step--integrate { background: var(--color-green-dark);  color: var(--color-white); }

@media (min-width: 768px) {
  .steps {
    grid-template-columns: repeat(4, 1fr);
  }
  .step {
    flex-direction: column;
    align-items: flex-start;
    min-height: 160px;
  }
  .step__name { font-size: 1.5rem; }
}

/* Footer */
.footer {
  padding-block: 3rem 2rem;
  border-top: 1px solid rgba(0,0,0,0.08);
  text-align: center;
}
.footer__mark {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
}
.footer__meta {
  font-size: var(--fs-small);
  color: var(--color-green-dark);
  margin: 0;
}
```

- [ ] **Step 2: Reload and verify**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Expected:
- Mission section reads clean and centered
- Subscribe section: heading + button centered
- Guidelines: "No Hate. No Fake. No Brain Rott." in orange display font
- Playground section: paragraph then 4 cards. On mobile they stack; on desktop they sit in a 4-column row.
- Card colors: light green, mustard, orange (white text), dark green (white text)
- Footer: small wordmark + © line at the bottom
- Side blobs visible bleeding from the edges of each section

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: style content sections, 4-step cards, and footer"
```

---

## Task 6: Fade-in animations (load + scroll via IntersectionObserver)

Animate elements in: hero on load, sections as they scroll into view. CSS provides the transition; JS toggles a class.

**Files:**
- Modify: `styles.css` (append animation rules)
- Modify: `main.js` (replace empty IIFE)

- [ ] **Step 1: Append animation CSS to `styles.css`**

```css
/* ===== Reveal animations ===== */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: var(--reveal-delay, 0s);
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* Reduced motion — show everything immediately, no transitions */
@media (prefers-reduced-motion: reduce) {
  .reveal,
  .reveal.is-visible {
    opacity: 1;
    transform: none;
    transition: none;
  }
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 2: Add the `reveal` class + per-child stagger to markup**

In `index.html`, add `class="reveal"` to:
- `.hero__logo`, `.hero__tagline`, `.hero .btn`, each `.blob--hero-*`
- Each section's `<h2>`, each `<p>` inside its container, each `.step`, each `.blob--side`, the footer's wordmark/meta

Set staggered delays via inline `style="--reveal-delay: 0.2s"` on hero children (0.2s, 0.4s, 0.6s, 0.8s on the 4 hero items).

Example for the hero section:
```html
<img class="hero__logo reveal" style="--reveal-delay:0.2s" src="..." alt="rituu" width="320" height="320">
<h1 class="hero__tagline reveal" style="--reveal-delay:0.4s">your digital sanctuary</h1>
<a class="btn btn--primary reveal" style="--reveal-delay:0.6s" href="#TALLY">Subscribe</a>
<!-- and on the blobs: -->
<img class="blob blob--hero-1 reveal" style="--reveal-delay:0.4s" ... >
<img class="blob blob--hero-2 reveal" style="--reveal-delay:0.6s" ... >
<img class="blob blob--hero-3 reveal" style="--reveal-delay:0.8s" ... >
```

For content sections, just add `class="reveal"` to each `<h2>`, `<p>`, and `.step` — the IntersectionObserver auto-staggers them by index (next step).

- [ ] **Step 3: Replace `main.js` body**

```js
(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Hero: reveal immediately on load ---
  const heroReveals = document.querySelectorAll('.hero .reveal');
  // Defer one frame so the initial CSS state paints before the class flip
  requestAnimationFrame(() => {
    heroReveals.forEach(el => el.classList.add('is-visible'));
  });

  if (prefersReducedMotion) {
    // Show everything immediately; skip observer + parallax
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  // --- Sections: reveal on scroll, with per-child stagger ---
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const reveals = entry.target.querySelectorAll('.reveal');
      reveals.forEach((el, i) => {
        // Don't overwrite an existing inline delay
        if (!el.style.getPropertyValue('--reveal-delay')) {
          el.style.setProperty('--reveal-delay', `${i * 0.1}s`);
        }
        el.classList.add('is-visible');
      });
      sectionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('main .section, .footer').forEach(s => sectionObserver.observe(s));
})();
```

- [ ] **Step 4: Reload and verify load + scroll behavior**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Expected:
- On load: hero logo fades up, then tagline, then button (and blobs)
- Scroll down slowly: each section's heading and paragraphs fade up as they enter the viewport
- Steps in the playground section fade up one after the other

- [ ] **Step 5: Verify reduced motion**

In Chrome DevTools → Rendering tab → "Emulate CSS media feature prefers-reduced-motion" → "reduce". Reload. Expected: everything is visible immediately, nothing animates.

- [ ] **Step 6: Commit**

```bash
git add index.html styles.css main.js
git commit -m "feat: add fade-in animations on load and scroll with reduced-motion fallback"
```

---

## Task 7: Parallax for blobs

A single throttled scroll handler that updates a per-blob CSS variable. Skipped under reduced motion.

**Files:**
- Modify: `styles.css` (append parallax transform rule)
- Modify: `main.js` (append parallax block before the closing `})();`)

- [ ] **Step 1: Append CSS** — blobs use the parallax variable

```css
.blob {
  --parallax-y: 0px;
  transform: translate3d(0, var(--parallax-y), 0);
  will-change: transform;
}
/* But still respect the existing positioning — translate is additive,
   so absolute top/left/right/bottom are unchanged. */

@media (prefers-reduced-motion: reduce) {
  .blob {
    --parallax-y: 0px !important;
    transform: none;
    will-change: auto;
  }
}
```

- [ ] **Step 2: Append parallax JS to `main.js`** (inside the IIFE, after the IntersectionObserver block, only reached if reduced motion is OFF)

Restructure `main.js` so the parallax code lives below the early `return`. The full file should now be:

```js
(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Hero: reveal immediately ---
  const heroReveals = document.querySelectorAll('.hero .reveal');
  requestAnimationFrame(() => {
    heroReveals.forEach(el => el.classList.add('is-visible'));
  });

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    return;
  }

  // --- Sections: reveal on scroll ---
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const reveals = entry.target.querySelectorAll('.reveal');
      reveals.forEach((el, i) => {
        if (!el.style.getPropertyValue('--reveal-delay')) {
          el.style.setProperty('--reveal-delay', `${i * 0.1}s`);
        }
        el.classList.add('is-visible');
      });
      sectionObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('main .section, .footer').forEach(s => sectionObserver.observe(s));

  // --- Parallax for blobs ---
  const blobs = Array.from(document.querySelectorAll('.blob[data-parallax]'))
    .map(el => ({ el, factor: parseFloat(el.dataset.parallax) || 0 }));

  let ticking = false;
  const updateParallax = () => {
    const y = window.scrollY;
    blobs.forEach(({ el, factor }) => {
      el.style.setProperty('--parallax-y', `${y * factor * -1}px`);
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
})();
```

- [ ] **Step 3: Reload and verify parallax**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

Expected:
- Scroll slowly — blobs move at a different (slower) speed than the foreground content
- Different blobs move at slightly different rates (factor 0.30 vs 0.55 → noticeable)
- No janky scroll — page stays at 60fps

- [ ] **Step 4: Verify reduced motion still kills parallax**

In DevTools Rendering panel: enable `prefers-reduced-motion: reduce`. Reload. Scroll. Expected: blobs stay put.

- [ ] **Step 5: Commit**

```bash
git add styles.css main.js
git commit -m "feat: add parallax scroll handler for blobs with reduced-motion gating"
```

---

## Task 8: Cross-browser & responsive verification

Final manual pass before declaring done. Use the `verify` skill if available — it scripts the browser-driven check.

**Files:** none (verification only)

- [ ] **Step 1: Start a local server and open in the default browser**

```bash
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/
```

- [ ] **Step 2: Resize from 360px → 1440px and check breakpoints**

Walk widths: 360, 414, 768, 1024, 1280, 1440.

At each: no horizontal scrollbar, no overflowing text, blobs stay in their intended positions, hero stays vertically balanced.

- [ ] **Step 3: Mobile viewport DevTools test**

Toggle device toolbar (iPhone 12 Pro preset). Verify hero matches the WhatsApp mockup feel: logo + tagline centered, blobs at corners.

- [ ] **Step 4: Tab through interactive elements**

Press Tab from the URL bar. Expected: the two subscribe buttons receive focus with the blue outline ring. No focus traps.

- [ ] **Step 5: Run Lighthouse → Accessibility + Performance**

In DevTools → Lighthouse → run on Mobile. Expected: Accessibility ≥ 95, Performance ≥ 90. Fix any issues found.

- [ ] **Step 6: Verify all copy matches the spec**

Quick diff against §5 of the spec. Confirm exact strings, especially: "No Hate. No Fake. No Brain Rott.", "Arrive · Engage · Express · Integrate", "Breath, Touch, Gestures, Movements, Postures, Voice and Intention".

- [ ] **Step 7: Confirm Tally placeholders are obvious**

```bash
grep -n '#TALLY' index.html
```

Expected output: at least 2 matches (hero + subscribe block), each on a line near a `<!-- TODO -->` comment.

- [ ] **Step 8: Commit anything caught (or skip if clean)**

If any fixes were needed during this pass, group them in a single commit:

```bash
git add -A
git commit -m "fix: address verification findings (responsive/a11y polish)"
```

If nothing was caught, no commit. Skill complete.

---

## Out of scope (explicitly NOT in this plan)

Per spec §12: no Tally form embedding, no build tools, no analytics, no socials, no dark mode, no cookie banner, no custom domain configuration, no white-logo variant, no additional pages. These remain user-facing follow-ups.

## Known follow-ups after merge

1. User drops `SnagaUniDisplay.woff2` and `Akkurat.woff2` into `assets/fonts/`.
2. User replaces every `href="#TALLY"` with the live Tally URL.
3. User pushes to GitHub and enables Pages.
