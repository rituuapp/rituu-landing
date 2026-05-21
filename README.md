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
