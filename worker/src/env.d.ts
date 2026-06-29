// Type-only declarations for the Cloudflare bindings declared in
// wrangler.toml. Imported wherever we need `Env` so handlers get
// full IntelliSense on `env.AI`, `env.VECTORIZE`, `env.DB`.

export interface Env {
  // Workers AI binding — see https://developers.cloudflare.com/workers-ai/
  AI: Ai;

  // Vectorize binding — the RAG index
  VECTORIZE: VectorizeIndex;

  // D1 binding — SQLite at the edge
  DB: D1Database;

  // Plain env vars from wrangler.toml
  ALLOWED_ORIGIN: string;
}

/** A single chunk of retrieved context fed to the LLM. */
export interface RagChunk {
  id: string;
  source: string;
  title: string;
  content: string;
  url?: string;
  score: number;        // cosine similarity in [0, 1]; higher is better
}

/** Request body for /api/chat. */
export interface ChatRequest {
  sessionId: string;            // client UUID
  message: string;              // latest user message
  history?: ChatHistoryItem[];  // optional short-term context window
  userLabel?: string;           // optional display name
}

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

/** Response body for /api/chat. */
export interface ChatResponse {
  reply: string;
  sources: { id: string; title: string; url?: string }[];
  sessionId: string;
}

/** Request body for /api/orders. */
export interface OrderRequest {
  customer?: { name?: string; phone?: string; note?: string };
  items: { id: string; name: string; price: number; qty: number }[];
  source?: "cart" | "assistant";
}

export interface OrderResponse {
  orderId: string;
  total: number;
  whatsappUrl: string;
}
