# Coffee Luxe — Coffeshop E-Commerce Website
<img width="1280" height="715" alt="image" src="https://github.com/user-attachments/assets/efd12b30-3a5a-491e-9373-583e831cf49f" />


A scroll-driven, cinematic coffee shop concept site built to practice RAG pipelines, vector databases, and agentic AI. Not a real store — a real engineering project.

Live site: https://coffeshop-e-commerce-website.vercel.app
GitHub Pages mirror: https://bikash-20.github.io/Coffeshop-E-Commerce-Website/

---

## What this is

Coffee Luxe (display name: Luxing Conlecting) is a front-end concept for a coffee shop serving drinks, pizza, pasta, momo, noodles, panipuri, and fuchka. The visual language is warm amber, caramel, champagne gold, and dark coffee brown, with Playfair Display headlines and scroll-linked parallax.

The more interesting part is the backend: a Cloudflare Worker that exposes a RAG-powered AI assistant grounded in the shop's actual menu, policies, and FAQ. The assistant uses BGE-small embeddings stored in Vectorize to retrieve relevant context, then runs inference with Llama 3.2 via Workers AI, and persists chat sessions in D1 (SQLite on the edge).

This was built as a deliberate practice project to understand how vector databases, embedding pipelines, and LLM-grounded assistants work end to end — not just in theory.

---

## Stack

**Frontend**

- React 19 + Vite 8
- Tailwind CSS v4 (design tokens in `@theme` block, not config)
- Framer Motion (scroll-linked parallax, reveal animations)
- Lenis (smooth scroll)

**Backend / AI**

- Cloudflare Workers (TypeScript)
- Workers AI — Llama 3.2 3B for chat inference
- Vectorize — 384-dim BGE-small embeddings, cosine similarity
- D1 — SQLite on the edge for chat history, saved orders, and RAG doc catalog

**Hosting**

- Vercel (frontend, auto-deploys from `main`)
- Cloudflare Workers (backend API, deployed via `wrangler deploy`)
- GitHub Pages (static mirror, deployed via GitHub Actions)

---

## Quick start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build locally
```

---

## Project structure

```
coffee-luxe/
├── public/
│   └── favicon.svg
├── scripts/
│   └── build_images.py        # one-time image processing pipeline
├── src/
│   ├── assets/
│   │   └── images.js          # auto-generated base64 exports — do not edit by hand
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── sections/          # Hero, Story, Menu, Gallery, CallToAction
│   │   ├── ui/                # Button, SectionHeading, MenuCard, Reveal
│   │   └── ErrorBoundary.jsx
│   ├── data/
│   │   └── menuItems.js       # menu catalog — single source of truth
│   ├── hooks/
│   │   └── useInView.js       # IntersectionObserver scroll-reveal hook
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css              # Tailwind v4 import + design tokens
├── worker/                    # Cloudflare Worker (AI backend)
│   ├── migrations/
│   │   └── 0001_initial.sql   # D1 schema
│   ├── src/
│   │   ├── content.ts         # RAG corpus — single source of truth for what the AI knows
│   │   ├── index.ts           # Worker router (POST /api/chat, POST /api/orders, GET /api/health)
│   │   ├── rag.ts             # Vectorize embed + retrieve helpers
│   │   ├── orders.ts          # order persistence logic
│   │   ├── seed.ts            # embeds RAG_DOCS and upserts to Vectorize + D1
│   │   └── env.d.ts           # Env bindings type
│   └── wrangler.toml
├── .env.example
├── vite.config.js
└── vercel.json
```

**Why this layout:**

`components/layout` vs `components/sections` vs `components/ui` represents three different reasons a component exists: page chrome, a one-off content section, or a small reusable primitive. This distinction means you never have to guess where something lives or whether it is shared.

`data/` is kept separate from `components/` so editing a price or adding a menu item never requires opening a component file.

`hooks/useInView` and `ui/Reveal.jsx` are split by purpose. `useInView` is the raw IntersectionObserver primitive with no animation coupling. `Reveal` is the opinionated wrapper that pairs it with Framer Motion. Swapping animation libraries only touches `Reveal.jsx`.

---

## Image pipeline

All menu photos are processed once by `scripts/build_images.py` (Python + Pillow) into center-cropped, web-sized JPEGs, then written into `src/assets/images.js` as base64 data URIs. The production build makes zero external image requests.

This trade-off is appropriate for a fixed set of roughly 14 images. If the catalog grows past 20-30 images, switch to static files in `public/` with `loading="lazy"` and an image CDN.

One specific problem the script handles: two source PNGs have genuine alpha transparency. A naive `.convert("RGB")` leaves garbage-colored pixels where alpha was zero. The script composites onto the site's cream background first, so transparent source images blend cleanly.

To regenerate after swapping source photos:

```bash
python3 scripts/build_images.py
```

---

## Design tokens

Defined once in `src/index.css` under the Tailwind v4 `@theme` block.

| Token | Hex | Use |
|---|---|---|
| `coffee-950` to `coffee-600` | `#1f140d` to `#6b452a` | Backgrounds, structure |
| `caramel-500` / `400` / `300` | `#c8956b` / `#d6a87e` / `#e3c2a0` | Mid-tone accents |
| `gold-600` / `500` / `400` | `#b8924f` / `#d4af7a` / `#e2c697` | CTAs, dividers, signature accent |
| `cream-100` / `200` / `300` | `#faf6f0` / `#f5ede0` / `#ecdfc9` | Light surfaces, body copy on dark |

Fonts: Playfair Display for headlines, Inter for body text, loaded via Google Fonts in `index.html`.

---

## Deployment

### Frontend — Vercel

Vercel auto-deploys from `main` on every push. It reads `vercel.json`, detects Vite, and runs `npm run build` into `dist/`.

One-time setup:

1. Push the repo to GitHub.
2. On vercel.com: Add New Project, import the repo. Do not change the build command.
3. Under Settings — Environment Variables, add:
   - `VITE_WORKER_URL` = your deployed Worker URL (e.g. `https://coffee-luxe-api.<sub>.workers.dev`)

The `vite.config.js` uses `process.env.GITHUB_ACTIONS` to set the base path dynamically. On Vercel it resolves to `/`. On GitHub Actions it resolves to `/Coffeshop-E-Commerce-Website/`. You do not need to set this manually on Vercel.

### Backend — Cloudflare Worker

Prerequisites: Node 22+, a Cloudflare account, `wrangler login`.

```bash
cd worker
npm install

# 1. Create the D1 database — prints a database_id, paste it into wrangler.toml
npm run db:create

# 2. Create the Vectorize index
npm run vector:create

# 3. Apply the schema migrations
npm run db:migrate

# 4. Embed and upload the RAG corpus to Vectorize + D1
#    Idempotent — safe to re-run after editing content.ts
npm run seed

# 5. Deploy
npm run deploy -- --env=""
```

After the first deploy, copy the printed Worker URL into Vercel's `VITE_WORKER_URL` and redeploy the frontend.

### Updating the RAG corpus

Edit `worker/src/content.ts` — add or update entries in the `RAG_DOCS` array — then run:

```bash
cd worker && npm run seed
```

The seed script re-embeds and upserts everything. You do not need to redeploy the Worker for content-only changes. You do need to redeploy if you change `index.ts`.

### Smoke testing the live API

```bash
# Health check
curl -s https://coffee-luxe-api.<sub>.workers.dev/api/health

# Chat
curl -s -X POST https://coffee-luxe-api.<sub>.workers.dev/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"test-1","message":"What is on the menu?"}'
```

---

## How the AI assistant works

The assistant is grounded in roughly 57 documents covering the full menu, pricing, delivery policy, ordering flow, and FAQs. When a user sends a message:

1. The Worker embeds the message using BGE-small via Workers AI.
2. Vectorize retrieves the top 5 most semantically similar document chunks.
3. Those chunks are injected into the system prompt as context.
4. Llama 3.2 3B generates a response constrained to that context.
5. The reply and the source IDs used are saved to D1 for the session.

If the question is outside the shop's domain (weather, politics, unrelated topics), the assistant redirects to the menu or contact section instead of guessing.

The assistant also matches the user's language. If you write in Bengali, it responds in Bengali.

---

## Accessibility and defensive choices

`ErrorBoundary.jsx` wraps the whole app so a crash in any one section renders a scoped fallback rather than a blank screen.

`prefers-reduced-motion` is respected in two places: globally in `index.css` (collapses all CSS transition and animation durations), and explicitly in `Hero.jsx` (parallax and the ambient float animation are skipped entirely, not just sped up).

`useInView` uses `IntersectionObserver` rather than a scroll event listener. It disconnects after firing once per element rather than running on every scroll frame.

All images use `loading="lazy"` and have descriptive, non-empty `alt` text.

---

## What is out of scope in this version

This is a concept and practice project. The following are not implemented and are noted here for clarity if this codebase is ever extended:

- No real checkout or payment flow. The cart generates a WhatsApp message; the shop confirms by hand.
- No CMS. Menu items are a static JS file, not fetched from an API.
- No analytics or Core Web Vitals reporting.
- No automated tests (unit, component, or end-to-end).

---

## Author

Built by Bikash Talukder as a practice project for RAG pipelines, vector databases, and edge AI deployment.

Contact: bikashtalukder040@gmail.com
Instagram: @talukder_20
