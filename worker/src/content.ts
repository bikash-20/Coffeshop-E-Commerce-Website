/**
 * RAG corpus — the structured knowledge the assistant is grounded in.
 * Each entry becomes one Vectorize vector + one row in `rag_docs`.
 *
 * Keep this file the SINGLE SOURCE OF TRUTH for what the assistant
 * "knows" about Coffee Luxe. If you change a price, add a drink, or
 * rewrite the about copy, update the matching entry here, then run
 *   npm run seed
 * to re-embed.
 *
 * Hand-maintained on purpose: an LLM extracting from the React source
 * would be slower, more expensive, and more error-prone. With ~30
 * entries the manual cost is a couple of minutes per change.
 */

export interface RagDoc {
  id: string;
  source: "menu" | "story" | "faq" | "policy" | "site";
  title: string;
  content: string;
  url?: string;
  tags?: string[];
}

export const RAG_DOCS: RagDoc[] = [
  // ── Site overview ────────────────────────────────────────────
  {
    id: "site-overview",
    source: "site",
    title: "About Coffee Luxe",
    content:
      "Coffee Luxe (display name: Luxing Conlecting) is a cinematic coffee shop concept site — a Concept 1 recreation with warm amber, caramel, champagne gold, and dark coffee brown tones, Playfair Display headlines, and scroll-driven parallax. It is a portfolio piece, not a live ordering platform. The site is built with React 19, Vite, Tailwind CSS v4, and Framer Motion.",
    url: "#top",
    tags: ["about", "stack", "tech"],
  },
  {
    id: "site-author",
    source: "site",
    title: "Who built the site",
    content:
      "Coffee Luxe is a portfolio concept by Bikash Talukder, a web designer based in Bangladesh. The contact email listed on the site is bikashtalukder040@gmail.com and the Instagram handle is @talukder_20.",
    tags: ["author", "contact", "designer"],
  },

  // ── Menu ─────────────────────────────────────────────────────
  {
    id: "menu-overview",
    source: "menu",
    title: "Menu overview",
    content:
      "The Coffee Luxe menu has 10 drinks across frappes, milkshakes, macchiatos, and hot drinks. Prices are in Bangladeshi Taka (tk). All menu items can be ordered via the on-site cart — the Send via WhatsApp button on the checkout screen opens a pre-filled chat to the shop.",
    url: "#menu",
    tags: ["menu", "ordering"],
  },
  {
    id: "menu-vanilla-milkshake",
    source: "menu",
    title: "Vanilla Milk Shakes — 275 tk",
    content:
      "Vanilla Milk Shakes — Classic cold milkshake, 275 tk. A creamy, kid-friendly dessert drink.",
    url: "#menu",
    tags: ["milkshake", "cold", "sweet"],
  },
  {
    id: "menu-hot-chocolate",
    source: "menu",
    title: "Hot Chocolate — 290 tk",
    content:
      "Hot Chocolate — 290 tk. A warm, rich cocoa drink. Best for cold weather or a cozy break.",
    url: "#menu",
    tags: ["hot", "chocolate", "warm"],
  },
  {
    id: "menu-browic-frappe",
    source: "menu",
    title: "Browic Frappe — 410 tk",
    content:
      "Browic Frappe — 410 tk. The signature drink — a chocolate-brownie blended frappe, sweet and indulgent.",
    url: "#menu",
    tags: ["frappe", "signature", "chocolate", "sweet"],
  },
  {
    id: "menu-espresso-frappe",
    source: "menu",
    title: "Espresso Frappe — 310 tk",
    content:
      "Espresso Frappe — 310 tk. A bold, cold coffee pick for caffeine lovers who want a chilled drink.",
    url: "#menu",
    tags: ["frappe", "coffee", "bold", "cold"],
  },
  {
    id: "menu-oreo-frappe",
    source: "menu",
    title: "Oreo Frappe — 350 tk",
    content:
      "Oreo Frappe — 350 tk. Crowd-favorite blended frappe with crushed Oreo cookies.",
    url: "#menu",
    tags: ["frappe", "oreo", "sweet", "crowd-favorite"],
  },
  {
    id: "menu-caramel-frappe",
    source: "menu",
    title: "Caramel Frappe — 350 tk",
    content:
      "Caramel Frappe — 350 tk. A sweet caramel-blended frappe, balanced and easy-drinking.",
    url: "#menu",
    tags: ["frappe", "caramel", "sweet"],
  },
  {
    id: "menu-vanilla-frappe",
    source: "menu",
    title: "Vanilla Frappe — 330 tk",
    content:
      "Vanilla Frappe — 330 tk. A smooth, mellow vanilla-blended frappe.",
    url: "#menu",
    tags: ["frappe", "vanilla", "smooth"],
  },
  {
    id: "menu-salted-caramel-banana-macchiato",
    source: "menu",
    title: "Salted Caramel Banana Macchiato — 365 tk",
    content:
      "Salted Caramel Banana Macchiato — 365 tk. A new, layered macchiato that combines salted caramel, banana, and espresso.",
    url: "#menu",
    tags: ["macchiato", "new", "sweet", "caramel", "banana"],
  },
  {
    id: "menu-vanilla-coffee-greek-yogurt-smoothie",
    source: "menu",
    title: "Vanilla Coffee Greek Yogurt Smoothie — 395 tk",
    content:
      "Vanilla Coffee Greek Yogurt Smoothie — 395 tk. A protein-forward, power-blend smoothie with vanilla coffee and Greek yogurt.",
    url: "#menu",
    tags: ["smoothie", "yogurt", "protein", "power"],
  },
  {
    id: "menu-french-vanilla-coffee",
    source: "menu",
    title: "French Vanilla Coffee — 285 tk",
    content:
      "French Vanilla Coffee — 285 tk. An aromatic, mellow coffee with classic French vanilla flavoring.",
    url: "#menu",
    tags: ["coffee", "vanilla", "aromatic", "mellow"],
  },

  // ── Story / brand voice ─────────────────────────────────────
  {
    id: "story-overview",
    source: "story",
    title: "The Coffee Luxe story",
    content:
      "Coffee Luxe is presented as a cinematic, scroll-driven concept — a 'Concept 1' art direction. The design language is editorial magazine meets café: warm amber, caramel, champagne gold, and dark coffee brown, with Playfair Display for headlines and Inter for body. The whole site is one long scroll, with section folios (large outlined numbers), gradient glows, and a film grain overlay.",
    url: "#story",
    tags: ["brand", "design", "story"],
  },

  // ── Operations / policy ─────────────────────────────────────
  {
    id: "policy-hours",
    source: "policy",
    title: "Hours",
    content:
      "The site marquee advertises 'Open 7am — 10pm, Walk-ins welcome, Free WiFi, Brunch Saturdays, Live acoustic Fridays, Reserve via WhatsApp, Made in BD'.",
    tags: ["hours", "operations"],
  },
  {
    id: "policy-delivery",
    source: "policy",
    title: "Delivery",
    content:
      "Cart checkout shows a flat 30 tk delivery fee in Bangladesh. There is no online payment — orders are confirmed via WhatsApp and paid on delivery. The Send via WhatsApp button generates a pre-filled message with the full order summary and totals (4% VAT included).",
    tags: ["delivery", "payment", "policy"],
  },
  {
    id: "policy-vat",
    source: "policy",
    title: "Taxes and fees",
    content:
      "A 4% VAT is added to the cart subtotal, plus a 30 tk flat delivery fee when the cart is non-empty. Delivery is free if the cart is empty (no items = no fee).",
    tags: ["vat", "tax", "fees", "policy"],
  },
  {
    id: "policy-payment",
    source: "policy",
    title: "Payment methods",
    content:
      "No online payment gateway. Pay on delivery after WhatsApp confirmation. The order flow is: Add items → Cart drawer → Checkout → Send via WhatsApp → Shop confirms → Pay on delivery.",
    tags: ["payment", "policy", "whatsapp"],
  },
  {
    id: "policy-contact",
    source: "policy",
    title: "Contact channels",
    content:
      "WhatsApp, phone, email, and Instagram are listed in the Contact section. WhatsApp and the call link use the Bangladeshi mobile 01926240062 with the +880 country code. Email is bikashtalukder040@gmail.com and the Instagram handle is @talukder_20.",
    url: "#contact",
    tags: ["contact", "whatsapp", "phone", "email", "instagram"],
  },

  // ── FAQ ─────────────────────────────────────────────────────
  {
    id: "faq-order",
    source: "faq",
    title: "How do I order?",
    content:
      "Open the menu section, tap 'Add to order' on any drink, and use the + and − buttons to set the quantity. Open the cart (top-right pill or the menu's cart icon) and tap Checkout. The Send via WhatsApp button opens a chat with the shop, with your full order summary and totals pre-filled.",
    url: "#menu",
    tags: ["faq", "order", "how-to"],
  },
  {
    id: "faq-cancel",
    source: "faq",
    title: "Can I cancel or change an order?",
    content:
      "Orders are not committed until you tap Send via WhatsApp and the shop replies to confirm. Reply to that WhatsApp thread to change or cancel — the shop will see the same order summary you saw.",
    tags: ["faq", "cancel", "support"],
  },
  {
    id: "faq-source",
    source: "faq",
    title: "Where do the photos come from?",
    content:
      "The first six menu photos are processed once by a Python script and embedded as base64 inside the JS bundle, so the site makes zero external image requests for the editorial photos. The last four product photos are static files in /public, served directly by the host. Vite's BASE_URL is used to keep paths working on both GitHub Pages and Vercel.",
    tags: ["faq", "tech", "images"],
  },
  {
    id: "faq-stack",
    source: "faq",
    title: "What stack is the site built on?",
    content:
      "React 19 + Vite 8 + Tailwind CSS v4 + Framer Motion + Lenis smooth scroll. The new AI assistant is a Cloudflare Worker (TypeScript) that uses Workers AI (Llama 3.1 8B) for inference, Vectorize for RAG retrieval, and D1 (SQLite on the edge) for chat history and saved orders. The frontend is hosted on Vercel; the Worker is deployed via `wrangler deploy`.",
    tags: ["faq", "tech", "stack"],
  },
  {
    id: "faq-ai",
    source: "faq",
    title: "How does the AI assistant work?",
    content:
      "The assistant is grounded in a curated set of ~30 documents (menu, story, FAQ, policy) embedded with BGE-small and stored in Vectorize. When you ask a question, the Worker embeds your message, retrieves the top 5 most relevant chunks, and feeds them to Llama 3.1 8B as context. If the question is off-topic (e.g. weather, politics, recipes the shop doesn't serve), the assistant says so and redirects you to the menu or contact section. The full chat history is saved in D1 for the shop's analytics — you can ask it to forget the session at any time.",
    tags: ["faq", "ai", "rag"],
  },
];

/* Build the human-readable text we pass to the embedding model.
   Concatenating title + tags + content is the standard pattern —
   it nudges the retriever toward doc structure. */
export function docToEmbedText(doc: RagDoc): string {
  const tagPart = doc.tags?.length ? ` [tags: ${doc.tags.join(", ")}]` : "";
  return `${doc.title}.${tagPart}\n${doc.content}`;
}
