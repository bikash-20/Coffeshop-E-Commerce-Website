# Luxing Conlecting ☕
live link: https://bikash-20.github.io/Coffeshop-E-Commerce-Website/


A cinematic, scroll-driven coffee shop concept site — built as a
**Concept 1** recreation (warm amber/caramel + champagne gold + dark
coffee brown, serif display type, scroll-linked parallax hero).

**Stack:** React 19 + Vite + Tailwind CSS v4 + Framer Motion

---

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

## Project structure

```
coffee-luxe/
├── public/
│   └── favicon.svg
├── scripts/
│   └── build_images.py        # one-time image processing pipeline (see below)
├── src/
│   ├── assets/
│   │   └── images.js          # AUTO-GENERATED base64 image exports — do not hand-edit
│   ├── components/
│   │   ├── layout/            # Navbar, Footer — structural, page-wide
│   │   ├── sections/          # Hero, Story, Menu, Gallery, CallToAction — one per page section
│   │   ├── ui/                # Button, SectionHeading, MenuCard, Reveal — small reusable primitives
│   │   └── ErrorBoundary.jsx  # top-level crash guard (see "Defensive choices" below)
│   ├── data/
│   │   └── menuItems.js       # menu catalog — single source of truth, no data hardcoded in JSX
│   ├── hooks/
│   │   └── useInView.js       # IntersectionObserver-based scroll-reveal hook
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css              # Tailwind v4 import + design tokens (@theme block)
├── .editorconfig
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

Why this layout, specifically:

- **`components/layout` vs `components/sections` vs `components/ui`** —
  three different reasons a component exists: page chrome (layout),
  a content section unique to this page (sections), or a small reusable
  piece used by other components (ui). Splitting this way means you
  never have to wonder "is this a one-off or shared?" when you go
  looking for something to edit.
- **`data/` is separate from `components/`** — menu items, prices, and
  copy live in plain data files, not inline in JSX. Editing a price or
  adding a drink never requires touching a component file.
- **`hooks/` and `ui/Reveal.jsx` are split** — `useInView` is the raw,
  reusable primitive (no React-specific animation library coupling);
  `Reveal` is the opinionated wrapper that pairs it with Framer Motion.
  If you ever swap animation libraries, only `Reveal.jsx` changes.

## Image pipeline — base64 embedding

All 14 source coffee/menu photos are processed once via
`scripts/build_images.py` (Python + Pillow) into:

- center-cropped, web-sized JPEGs (no oversized uploads shipped raw)
- base64 data URIs, written into `src/assets/images.js`

This means **the production build has zero external image requests** —
everything ships inline in the JS bundle. That's the right trade-off
for a small, fixed image set like this concept site (~900KB total
image payload). It is **not** the right trade-off if this catalog
grows past maybe 20–30 images — at that point, switch to static files
in `public/` with `loading="lazy"` (already used throughout) and
consider a real image CDN.

To regenerate the asset module after swapping source photos:

```bash
# Drop new source images into the path scripts/build_images.py reads from,
# update the JOBS list at the top of the file, then:
python3 scripts/build_images.py
```

One real bug this script had to handle: two of the source PNGs
(the coffee-splash cutouts) have genuine alpha transparency. A naive
`.convert("RGB")` left garbage-colored pixels where alpha was 0 — the
script now composites onto the site's cream background color first,
so transparent source images blend cleanly instead of showing artifacts.

## Design tokens

Defined once in `src/index.css` under the Tailwind v4 `@theme` block —
not duplicated across components:

| Token | Hex | Use |
|---|---|---|
| `coffee-950` → `coffee-600` | `#1f140d` → `#6b452a` | Backgrounds, structure |
| `caramel-500` / `400` / `300` | `#c8956b` / `#d6a87e` / `#e3c2a0` | Mid-tone accents |
| `gold-600` / `500` / `400` | `#b8924f` / `#d4af7a` / `#e2c697` | CTAs, dividers, the signature accent |
| `cream-100` / `200` / `300` | `#faf6f0` / `#f5ede0` / `#ecdfc9` | Light surfaces, body copy on dark |

Fonts: **Playfair Display** (display/headlines) + **Inter** (body),
loaded via Google Fonts `<link>` tags in `index.html`.

## Defensive/accessibility choices worth knowing about

- **`ErrorBoundary.jsx`** wraps the whole app — a crash in any one
  section renders a scoped fallback instead of a blank white screen.
- **`prefers-reduced-motion` is respected in two places**: globally in
  `index.css` (collapses all CSS transition/animation durations), and
  explicitly inside `Hero.jsx`'s Framer Motion transforms (parallax and
  the floating-bean ambient animation are skipped entirely, not just
  sped up).
- **`useInView` uses `IntersectionObserver`**, not a scroll event
  listener — far lower overhead, and it disconnects after firing once
  per element instead of running on every scroll frame.
- All images use `loading="lazy"` and have written (non-empty)
  `alt` text describing the actual photo content.

## What's deliberately deferred (not implemented in this v1)

This is a front-end concept/demo site with no real backend, so the
following are out of scope for now but worth knowing they're missing
if this becomes a real production project:

- No real ordering/checkout flow — "Order Online" links to the menu
  section, not a cart or payment provider.
- No CMS — menu items are a static JS file, not fetched from an API.
- No analytics/Core Web Vitals reporting wired up yet.
- No automated tests (unit/component/E2E) yet — see the frontend
  production-grade checklist this project was designed against for
  what a full testing pyramid would look like here.
