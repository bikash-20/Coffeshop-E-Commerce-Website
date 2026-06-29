/**
 * RAG helpers — embed a query, search the Vectorize index, and
 * rehydrate the matched vectors with the human-readable doc text
 * stored in D1.
 *
 * Why hydrate from D1? Vectorize stores only the embedding + the
 * vector id. The actual text and metadata live in `rag_docs`. We
 * use the ids returned by `VECTORIZE.query` to fetch the matching
 * rows in a single `IN (...)` batch.
 */

import type { Env, RagChunk } from "./env.js";

/* The BGE-small embedding model exposed by Workers AI.
   Dimensions MUST match the Vectorize index. We declare 384 in
   wrangler.toml — keep these in sync. */
export const EMBED_MODEL = "@cf/baai/bge-small-en-v1.5" as const;
export const EMBED_DIM = 384;

/* Number of chunks we retrieve per query. 5 is the sweet spot for
   8B-class models: enough to be specific, few enough to stay within
   the prompt's context window. */
export const TOP_K = 5;

/* Minimum cosine similarity we'll surface. Below this we treat the
   retrieval as a miss and the LLM is told "no relevant context
   found" so it can fall back to a general-knowledge answer (or a
   polite redirect to the menu/contact section). */
export const MIN_SCORE = 0.55;

export interface EmbeddingResponse {
  shape: number[];
  data: number[][];
}

/** Embed a single string. Returns a length-EMBED_DIM array. */
export async function embed(env: Env, text: string): Promise<number[]> {
  const res = (await env.AI.run(EMBED_MODEL, { text: [text] })) as EmbeddingResponse;
  if (!res?.data?.[0] || res.data[0].length !== EMBED_DIM) {
    throw new Error(`Embedding model returned unexpected shape: ${JSON.stringify(res)}`);
  }
  return res.data[0];
}

/** Top-K nearest neighbours from Vectorize. */
export async function search(env: Env, queryVec: number[], topK = TOP_K) {
  return env.VECTORIZE.query(queryVec, {
    topK,
    returnMetadata: false,
  });
}

/** Pull the matching RAG docs from D1 by id, in one batch. */
async function loadDocsByIds(env: Env, ids: string[]): Promise<Map<string, { source: string; title: string; content: string; url: string | null }>> {
  if (ids.length === 0) return new Map();
  // Build "?, ?, ?" placeholders for the IN clause.
  const placeholders = ids.map(() => "?").join(",");
  const rows = await env.DB.prepare(
    `SELECT id, source, title, content, url FROM rag_docs WHERE id IN (${placeholders})`
  )
    .bind(...ids)
    .all<{ id: string; source: string; title: string; content: string; url: string | null }>();
  return new Map((rows.results ?? []).map((r) => [r.id, r]));
}

/** End-to-end: embed query, search, hydrate, return ranked chunks. */
export async function retrieveContext(env: Env, query: string): Promise<RagChunk[]> {
  const queryVec = await embed(env, query);
  const matches = await search(env, queryVec);
  if (!matches?.matches?.length) return [];

  const ids = matches.matches.map((m) => m.id);
  const docs = await loadDocsByIds(env, ids);

  const chunks: RagChunk[] = [];
  for (const m of matches.matches) {
    const doc = docs.get(m.id);
    if (!doc) continue;
    // Vectorize returns cosine similarity in [0, 1] (we set metric=cosine).
    // m.score is already normalized.
    if (m.score < MIN_SCORE) continue;
    chunks.push({
      id: m.id,
      source: doc.source,
      title: doc.title,
      content: doc.content,
      url: doc.url ?? undefined,
      score: m.score,
    });
  }
  return chunks;
}

/** Render the retrieved chunks as a system-prompt block. */
export function chunksToPrompt(chunks: RagChunk[]): string {
  if (chunks.length === 0) return "(no relevant site content found)";
  return chunks
    .map(
      (c, i) =>
        `[#${i + 1} | source=${c.source} | score=${c.score.toFixed(2)}] ${c.title}\n${c.content}` +
        (c.url ? `\n(URL: ${c.url})` : "")
    )
    .join("\n\n");
}
