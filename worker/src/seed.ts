/**
 * Seed the RAG corpus into Vectorize + D1.
 *
 * Run from the worker/ directory:
 *   npm run seed
 *
 * The script is idempotent — it INSERT OR REPLACE's each doc row and
 * upserts each vector, so re-running after editing content.ts just
 * updates the index.
 *
 * Requires the bindings in wrangler.toml to point at real resources:
 *   - VECTORIZE index "coffee-luxe-rag" (dimensions 384, metric cosine)
 *   - D1 database "coffee-luxe-db" with the `rag_docs` table migrated
 *
 * To seed the LOCAL wrangler dev resources (no remote), use
 *   wrangler dev --test-scheduled
 * and hit /__seed, OR set up `wrangler d1 execute --local` with the
 * --persist flag. We keep it remote-only for simplicity — the seed
 * takes a few seconds and the free tier handles it.
 */

import { RAG_DOCS, docToEmbedText } from "./content.js";
import { EMBED_MODEL, EMBED_DIM } from "./rag.js";

interface Env {
  AI: Ai;
  VECTORIZE: VectorizeIndex;
  DB: D1Database;
}

export async function seed(env: Env): Promise<void> {
  console.log(`Embedding ${RAG_DOCS.length} docs with ${EMBED_MODEL} (dim=${EMBED_DIM})…`);

  // Batch up to 100 texts per embedding call — Workers AI supports it.
  const BATCH = 100;
  const allVectors: VectorizeVector[] = [];

  for (let i = 0; i < RAG_DOCS.length; i += BATCH) {
    const batch = RAG_DOCS.slice(i, i + BATCH);
    const texts = batch.map(docToEmbedText);
    const res = (await env.AI.run(EMBED_MODEL, { text: texts })) as {
      data: number[][];
    };
    if (!res?.data?.length) {
      throw new Error(`Embedding model returned no data for batch ${i}`);
    }
    for (let j = 0; j < batch.length; j++) {
      const doc = batch[j];
      const vec = res.data[j];
      if (!vec || vec.length !== EMBED_DIM) {
        throw new Error(`Vector ${doc.id} has wrong shape: ${vec?.length ?? "missing"}`);
      }
      // Build the metadata we'll need at retrieval time to do
      // lightweight filtering without re-hitting D1 for known fields.
      // Note: Vectorize metadata has a 10 KiB cap per vector.
      allVectors.push({
        id: doc.id,
        values: vec,
        metadata: {
          source: doc.source,
          title: doc.title,
          url: doc.url ?? "",
        },
      });
    }
  }

  console.log(`Upserting ${allVectors.length} vectors to Vectorize…`);
  // Vectorize.upsert accepts up to 1000 vectors per call.
  for (let i = 0; i < allVectors.length; i += 1000) {
    const slice = allVectors.slice(i, i + 1000);
    const result = await env.VECTORIZE.upsert(slice);
    console.log(`  batch ${i / 1000 + 1}:`, result);
  }

  console.log(`Writing ${RAG_DOCS.length} rows to D1.rag_docs…`);
  const insertStmt = env.DB.prepare(
    `INSERT INTO rag_docs (id, source, title, content, url, tags, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, unixepoch())
     ON CONFLICT(id) DO UPDATE SET
       source = excluded.source,
       title = excluded.title,
       content = excluded.content,
       url = excluded.url,
       tags = excluded.tags,
       updated_at = unixepoch()`
  );
  await env.DB.batch(
    RAG_DOCS.map((d) =>
      insertStmt.bind(
        d.id,
        d.source,
        d.title,
        d.content,
        d.url ?? null,
        d.tags ? d.tags.join(",") : null
      )
    )
  );

  console.log("✅ Seed complete.");
}

/* CLI entry: `tsx src/seed.ts` will run this block, talking to the
   REMOTE bindings via wrangler's `dev --test-scheduled` mode, or —
   more practically — by deploying a one-shot worker. See README. */
if (typeof process !== "undefined" && import.meta.url === `file://${process.argv[1]}`) {
  // Direct execution (no wrangler runtime). This branch is here so
  // the file can also be imported as a module by the route handler
  // if you ever wire a /__seed endpoint.
  console.log("This script is meant to be run via `wrangler dev --test-scheduled`");
  console.log("or by deploying a one-shot Worker. See worker/README.md.");
  process.exit(0);
}
