-- Coffee Luxe — initial D1 schema
-- Applied via:  wrangler d1 migrations apply coffee-luxe-db --remote
-- Idempotent: safe to re-apply.

-- ── RAG catalog ──────────────────────────────────────────────────
-- The vector payloads live in Vectorize; this table stores the
-- human-readable doc text + metadata so we can re-embed, audit,
-- and de-dupe. The `id` is the Vectorize vector id.
CREATE TABLE IF NOT EXISTS rag_docs (
  id          TEXT PRIMARY KEY,         -- matches Vectorize vector id
  source      TEXT NOT NULL,            -- "menu" | "story" | "faq" | "policy" | "site"
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  url         TEXT,                     -- optional in-site anchor link
  tags        TEXT,                     -- comma-separated, for client-side filtering
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at  INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_rag_source ON rag_docs(source);

-- ── Chat sessions + messages ────────────────────────────────────
-- One row per chat session, many messages per session. The session
-- id is a client-generated UUID stored in localStorage.
CREATE TABLE IF NOT EXISTS chat_sessions (
  id          TEXT PRIMARY KEY,         -- client UUID
  user_label  TEXT,                     -- optional nickname the user provided
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  last_seen   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL,
  role        TEXT NOT NULL,            -- "user" | "assistant" | "system"
  content     TEXT NOT NULL,
  sources     TEXT,                     -- JSON array of rag_doc ids used
  created_at  INTEGER NOT NULL DEFAULT (unixepoch()),
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_msg_session ON chat_messages(session_id, created_at);

-- ── Saved orders ─────────────────────────────────────────────────
-- Mirrors the cart payload sent from CartDrawer.jsx when the user
-- taps "Save my order" (optional) or when they ask the assistant
-- to "place my order". The WhatsApp link is the primary order path;
-- this table is for analytics, retention, and re-order history.
CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,      -- e.g. "CL-2024-000123"
  customer_name   TEXT,
  customer_phone  TEXT,
  customer_note   TEXT,
  subtotal        INTEGER NOT NULL,      -- BDT
  tax             INTEGER NOT NULL,
  delivery        INTEGER NOT NULL,
  total           INTEGER NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending',  -- pending | confirmed | delivered | cancelled
  source          TEXT NOT NULL DEFAULT 'cart',     -- cart | assistant
  created_at      INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS order_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id    TEXT NOT NULL,
  item_id     TEXT NOT NULL,
  name        TEXT NOT NULL,
  price       INTEGER NOT NULL,         -- unit price in BDT
  qty         INTEGER NOT NULL,
  line_total  INTEGER NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_items_order ON order_items(order_id);
