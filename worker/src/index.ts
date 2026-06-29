/**
 * Coffee Luxe — Cloudflare Worker
 * Routes:
 *   POST /api/chat     RAG chat with Workers AI (Llama 3.1 8B)
 *   POST /api/orders   Persist a cart payload to D1
 *   GET  /api/health   Liveness probe (returns 200 + build info)
 *   OPTIONS *          CORS preflight
 *
 * Bindings (from wrangler.toml):
 *   env.AI          Workers AI
 *   env.VECTORIZE   RAG index
 *   env.DB          D1 database
 *
 * CORS: the React app on Vercel calls this Worker cross-origin. The
 * allowed origin is configurable via the ALLOWED_ORIGIN env var.
 */

import type {
  Env,
  ChatRequest,
  ChatResponse,
  OrderRequest,
  OrderResponse,
} from "./env.js";
import { retrieveContext, chunksToPrompt } from "./rag.js";
import { saveOrder, computeOrderTotals } from "./orders.js";
import { CONTACT } from "./contact.js";

/* The chat model. 8B is fast and good enough for a domain-
   constrained assistant. Swap to a larger one if quality suffers. */
const CHAT_MODEL = "@cf/meta/llama-3.2-3b-instruct" as const;

/* System prompt — sets the assistant's persona, ground rules, and
   what to do when it doesn't know. The site context is appended at
   the end so it's the freshest thing in the model's attention. */
const SYSTEM_PROMPT = `You are the AI concierge for Coffee Luxe — a warm, knowledgeable barista assistant on the Coffee Luxe website. Your job is to help customers explore the menu, understand the brand, place orders, and answer questions about the shop.

GROUND RULES (do not violate):
1. ALWAYS use the SITE CONTEXT block below as your source of truth. If the context doesn't contain the answer, say "I don't have that in the site info — your best bet is the Contact section or the floating WhatsApp button." Do NOT invent prices, items, or policies.
2. Be concise: 1–4 sentences per answer unless the user asks for more detail.
3. If the user asks something unrelated to Coffee Luxe (weather, politics, general coding, other shops), politely redirect: "I'm the Coffee Luxe assistant — I can only help with questions about the shop, menu, and orders. Anything else I can help with?"
4. When a user says "I want to order" or "place an order", do NOT process the order yourself. Tell them to use the on-site cart (open the cart icon top-right, add items, tap Checkout, then Send via WhatsApp). The site is the canonical order flow.
5. Money is in BDT — suffix every amount with "tk" (e.g. "290 tk").
6. Cite source titles when you lean on context: e.g. "(see: Menu overview)". This builds trust.
7. Match the user's language. Most users write in English; if they write in Bangla/Bengali script, respond in Bangla. If mixed, match the mix.

VOICE: warm, editorial, a little playful — like a friendly barista who's read a lot of design magazines. No corporate jargon.

SITE CONTEXT:
{{CONTEXT}}`;

/* Build the prompt Messages array Workers AI expects. */
function buildMessages(system: string, history: ChatRequest["history"], userMessage: string) {
  const safeHistory = Array.isArray(history) ? history.slice(-6) : []; // last 6 turns
  return [
    { role: "system", content: system },
    ...safeHistory.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: userMessage },
  ];
}

/* ─── CORS helper ──────────────────────────────────────────────── */
function corsHeaders(env: Env, origin: string | null): HeadersInit {
  // Echo the allowed origin when we have a browser match; otherwise
  // return a permissive wildcard so curl/server-side calls still get
  // a usable response even without an Origin header.
  const allow = origin && origin === env.ALLOWED_ORIGIN ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function jsonResponse(env: Env, body: unknown, status = 200, origin: string | null = null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(env, origin),
    },
  });
}

/* ─── Route handlers ───────────────────────────────────────────── */
async function handleChat(env: Env, req: Request): Promise<Response> {
  const origin = req.headers.get("Origin");
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return jsonResponse(env, { error: "Invalid JSON body" }, 400, origin);
  }
  if (!body?.message?.trim() || !body?.sessionId) {
    return jsonResponse(env, { error: "message and sessionId are required" }, 400, origin);
  }

  // Upsert the session row so the FK on chat_messages holds.
  await env.DB.prepare(
    `INSERT INTO chat_sessions (id, user_label, last_seen)
     VALUES (?, ?, unixepoch())
     ON CONFLICT(id) DO UPDATE SET last_seen = unixepoch(), user_label = COALESCE(excluded.user_label, user_label)`
  )
    .bind(body.sessionId, body.userLabel ?? null)
    .run();

  // Persist the user turn first (sources column is empty for user msgs).
  await env.DB.prepare(
    `INSERT INTO chat_messages (session_id, role, content) VALUES (?, 'user', ?)`
  )
    .bind(body.sessionId, body.message)
    .run();

  // RAG retrieve → build prompt → call the LLM.
  let contextText = "(no relevant site content found)";
  let chunks: Awaited<ReturnType<typeof retrieveContext>> = [];
  try {
    chunks = await retrieveContext(env, body.message);
    contextText = chunksToPrompt(chunks);
  } catch (err) {
    // Don't fail the chat if RAG errors — just answer without context.
    console.error("RAG retrieval failed:", err);
  }
  const systemPrompt = SYSTEM_PROMPT.replace("{{CONTEXT}}", contextText);

  let reply = "Sorry, I'm having trouble thinking right now — please try again in a moment.";
  try {
    const aiRes = (await env.AI.run(CHAT_MODEL, {
      messages: buildMessages(systemPrompt, body.history, body.message),
      max_tokens: 400,
      temperature: 0.6,
      top_p: 0.9,
    })) as { response?: string };
    if (aiRes?.response?.trim()) reply = aiRes.response.trim();
  } catch (err) {
    const message = err instanceof Error ? err.stack || err.message : String(err);
    console.error("Workers AI run failed:", message);
  }

  // Persist the assistant turn with the sources that were used.
  await env.DB.prepare(
    `INSERT INTO chat_messages (session_id, role, content, sources) VALUES (?, 'assistant', ?, ?)`
  )
    .bind(body.sessionId, reply, JSON.stringify(chunks.map((c) => c.id)))
    .run();

  const response: ChatResponse = {
    reply,
    sources: chunks.map((c) => ({ id: c.id, title: c.title, url: c.url })),
    sessionId: body.sessionId,
  };
  return jsonResponse(env, response, 200, origin);
}

async function handleOrder(env: Env, req: Request): Promise<Response> {
  const origin = req.headers.get("Origin");
  let body: OrderRequest;
  try {
    body = (await req.json()) as OrderRequest;
  } catch {
    return jsonResponse(env, { error: "Invalid JSON body" }, 400, origin);
  }
  if (!body?.items?.length) {
    return jsonResponse(env, { error: "items[] is required and must be non-empty" }, 400, origin);
  }
  for (const it of body.items) {
    if (typeof it.price !== "number" || typeof it.qty !== "number" || it.qty <= 0) {
      return jsonResponse(env, { error: "Each item needs a numeric price and positive qty" }, 400, origin);
    }
  }

  const saved = await saveOrder(env, body);

  // Build a pre-filled WhatsApp link mirroring the CartDrawer's message.
  const totals = computeOrderTotals(body.items);
  const lines = body.items.map((it) => `${it.qty}× ${it.name} — ${it.price * it.qty}tk`).join("\n");
  const message = `Hi Coffee Luxe! I'd like to place an order:\n\n${lines}\n\nSubtotal: ${totals.subtotal}tk\nVAT (4%): ${totals.tax}tk\nDelivery: ${totals.delivery}tk\nTotal: ${totals.total}tk\n\nPlease confirm availability and delivery time. Thanks!`;
  const national = `${CONTACT.mobileCountryCode.replace("+", "")}${CONTACT.mobile.replace(/^0/, "")}`;
  const whatsappUrl = `https://wa.me/${national}?text=${encodeURIComponent(message)}`;

  const response: OrderResponse = { ...saved, whatsappUrl };
  return jsonResponse(env, response, 200, origin);
}

function handleHealth(env: Env, req: Request): Response {
  const origin = req.headers.get("Origin");
  return jsonResponse(env, {
    status: "ok",
    service: "coffee-luxe-api",
    time: new Date().toISOString(),
  }, 200, origin);
}

/* ─── Router ───────────────────────────────────────────────────── */
export default {
  async fetch(req: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    const method = req.method.toUpperCase();
    const origin = req.headers.get("Origin");

    // CORS preflight — answer any OPTIONS request cheaply.
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env, origin) });
    }

    try {
      if (url.pathname === "/api/chat" && method === "POST") return await handleChat(env, req);
      if (url.pathname === "/api/orders" && method === "POST") return await handleOrder(env, req);
      if (url.pathname === "/api/health" && method === "GET") return handleHealth(env, req);

      return jsonResponse(env, { error: "Not Found", path: url.pathname }, 404, origin);
    } catch (err) {
      console.error("Unhandled error:", err);
      return jsonResponse(env, { error: "Internal Server Error" }, 500, origin);
    }
  },
};
