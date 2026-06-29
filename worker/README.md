# Coffee Luxe — Cloudflare Worker

The backend powering the AI assistant and the order persistence for [the
Coffee Luxe site](../../). Lives in its own subproject (`worker/`) with
its own `package.json` and `wrangler.toml` so it can be deployed
independently of the Vite frontend.

## Stack

| | |
|---|---|
| **Compute** | Cloudflare Workers (TypeScript, ESM) |
| **LLM** | [Workers AI](https://developers.cloudflare.com/workers-ai/) — `@cf/meta/llama-3.1-8b-instruct` |
| **Embeddings** | Workers AI — `@cf/baai/bge-small-en-v1.5` (384-dim) |
| **Vector DB** | [Vectorize](https://developers.cloudflare.com/vectorize/) — `coffee-luxe-rag` (cosine) |
| **Relational DB** | [D1](https://developers.cloudflare.com/d1/) — `coffee-luxe-db` (SQLite on the edge) |

## Routes

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/chat` | RAG chat — embeds the user message, retrieves the top 5 chunks from Vectorize, calls Llama 3.1, persists both turns to D1. |
| `POST` | `/api/orders` | Writes a cart payload to D1 (`orders` + `order_items`) and returns a `wa.me/...?text=...` link mirroring the on-site checkout. |
| `GET`  | `/api/health` | Liveness probe. |

## One-time setup

From inside this `worker/` directory:

```bash
npm install

# 1. Create the D1 database — Wrangler prints a database_id.
npm run db:create
# → paste the printed id into wrangler.toml under [[d1_databases]] database_id

# 2. Create the Vectorize index.
npm run vector:create

# 3. Apply the schema to remote D1.
npm run db:migrate

# 4. Embed the RAG corpus and push it to Vectorize + D1.
npm run seed
```

Then deploy:

```bash
npm run deploy
# → returns a https://coffee-luxe-api.<your-subdomain>.workers.dev URL
# → set that URL as VITE_WORKER_URL in the Vercel project env vars
```

## Updating the RAG corpus

1. Edit `src/content.ts` — add/edit entries in the `RAG_DOCS` array.
2. From the `worker/` directory: `npm run seed`
3. Done. Vectors and D1 rows are upserted; the assistant picks up
   the changes on its next request.

## Local dev

```bash
npm run dev
# → wrangler dev serves the worker at http://127.0.0.1:8787
# → the Vite site at localhost:5173 can call it directly; no CORS issue
#   because the origin matches dev defaults (or you can override
#   ALLOWED_ORIGIN in wrangler.toml)
```

## Architecture notes

- **No secrets to manage.** Workers AI inference is included in the
  Workers paid plan (or free tier up to the daily limit). The only env
  var is `ALLOWED_ORIGIN` for CORS.
- **Chat history is per-session-id, not per-user.** The client
  generates a UUID and stores it in `localStorage`; we look it up in
  D1 to assemble a short-term context window.
- **The WhatsApp link is the canonical order path.** D1 only stores
  orders for the shop's analytics; the customer never needs a
  Coffee Luxe account.
- **The LLM is told not to invent.** The system prompt is explicit
  about grounding answers in the retrieved `SITE CONTEXT` block and
  redirecting off-topic questions.
