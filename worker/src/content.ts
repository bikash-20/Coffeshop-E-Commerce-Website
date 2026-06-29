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
      "The Coffee Luxe menu is organized in 7 sections: Coffee drinks, Pizza, Pasta, Chicken Momo, Panipuri, Noodles, and Fuchka. Prices are in Bangladeshi Taka (tk). All menu items can be ordered via the on-site cart — the Send via WhatsApp button on the checkout screen opens a pre-filled chat to the shop. The site is sectioned so each category shows only its own items.",
    url: "#menu",
    tags: ["menu", "ordering", "categories"],
  },

  // Coffee / frappe drinks
  {
    id: "menu-coffee-overview",
    source: "menu",
    title: "Coffee & Frappe drinks",
    content:
      "Coffee and frappe section — 8 drinks. Vanilla Milk Shakes 275, Hot Chocolate 290, Browic Frappe 410 (signature), Espresso Frappe 310, Oreo Frappe 350 (crowd favorite), Caramel Frappe 350, Vanilla Frappe 330, French Vanilla Coffee 285. All priced in tk.",
    url: "#menu",
    tags: ["coffee", "frappe", "drinks", "category"],
  },
  {
    id: "menu-vanilla-milkshake",
    source: "menu",
    title: "Vanilla Milk Shakes — 275 tk",
    content:
      "Vanilla Milk Shakes — 275 tk. A creamy, kid-friendly dessert drink.",
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
    id: "menu-french-vanilla-coffee",
    source: "menu",
    title: "French Vanilla Coffee — 285 tk",
    content:
      "French Vanilla Coffee — 285 tk. An aromatic, mellow coffee with classic French vanilla flavoring.",
    url: "#menu",
    tags: ["coffee", "vanilla", "aromatic", "mellow"],
  },

  // Pizza
  {
    id: "menu-pizza-overview",
    source: "menu",
    title: "Pizza section",
    content:
      "Pizza — 5 freshly baked options. Margherita 320 (classic), Veggie 380 (vegetarian), Chicken 450 (popular), Beef 490 (hearty), Supreme 550 (loaded). Soft crust, rich tomato sauce, melted cheese, premium toppings.",
    url: "#menu",
    tags: ["pizza", "category", "baked"],
  },
  {
    id: "menu-margherita",
    source: "menu",
    title: "Margherita Pizza — 320 tk",
    content:
      "Margherita Pizza — 320 tk. Classic margherita with tomato sauce, mozzarella, and fresh basil.",
    url: "#menu",
    tags: ["pizza", "classic", "veg"],
  },
  {
    id: "menu-veggie-pizza",
    source: "menu",
    title: "Veggie Pizza — 380 tk",
    content:
      "Veggie Pizza — 380 tk. Loaded with mixed vegetables on a soft crust.",
    url: "#menu",
    tags: ["pizza", "veg"],
  },
  {
    id: "menu-chicken-pizza",
    source: "menu",
    title: "Chicken Pizza — 450 tk",
    content:
      "Chicken Pizza — 450 tk. Popular choice, topped with seasoned chicken and cheese.",
    url: "#menu",
    tags: ["pizza", "chicken", "popular"],
  },
  {
    id: "menu-beef-pizza",
    source: "menu",
    title: "Beef Pizza — 490 tk",
    content:
      "Beef Pizza — 490 tk. Hearty beef toppings on a soft crust — filling and flavorful.",
    url: "#menu",
    tags: ["pizza", "beef", "hearty"],
  },
  {
    id: "menu-supreme-pizza",
    source: "menu",
    title: "Supreme Pizza — 550 tk",
    content:
      "Supreme Pizza — 550 tk. The fully-loaded option with everything — premium toppings and extra cheese.",
    url: "#menu",
    tags: ["pizza", "supreme", "loaded"],
  },

  // Pasta
  {
    id: "menu-pasta-overview",
    source: "menu",
    title: "Pasta section",
    content:
      "Pasta — creamy, saucy, and full of flavor. 5 options: White Sauce Pasta 350, Red Sauce Pasta 330, Chicken Alfredo 420 (chef's pick), Spicy Beef Pasta 450, Mixed Veg Pasta 300.",
    url: "#menu",
    tags: ["pasta", "category", "creamy"],
  },
  {
    id: "menu-white-sauce-pasta",
    source: "menu",
    title: "White Sauce Pasta — 350 tk",
    content:
      "White Sauce Pasta — 350 tk. Creamy alfredo-style white sauce — comfort food.",
    url: "#menu",
    tags: ["pasta", "creamy", "veg"],
  },
  {
    id: "menu-red-sauce-pasta",
    source: "menu",
    title: "Red Sauce Pasta — 330 tk",
    content:
      "Red Sauce Pasta — 330 tk. Classic tomato-based sauce, simple and filling.",
    url: "#menu",
    tags: ["pasta", "tomato", "classic"],
  },
  {
    id: "menu-chicken-alfredo",
    source: "menu",
    title: "Chicken Alfredo Pasta — 420 tk",
    content:
      "Chicken Alfredo Pasta — 420 tk. Chef's pick — white sauce with seasoned chicken.",
    url: "#menu",
    tags: ["pasta", "chicken", "chefs-pick"],
  },
  {
    id: "menu-spicy-beef-pasta",
    source: "menu",
    title: "Spicy Beef Pasta — 450 tk",
    content:
      "Spicy Beef Pasta — 450 tk. Spiced beef in a rich sauce — filling and bold.",
    url: "#menu",
    tags: ["pasta", "beef", "spicy"],
  },
  {
    id: "menu-mixed-veg-pasta",
    source: "menu",
    title: "Mixed Veg Pasta — 300 tk",
    content:
      "Mixed Veg Pasta — 300 tk. Vegetarian pasta with a mix of vegetables.",
    url: "#menu",
    tags: ["pasta", "veg", "vegetarian"],
  },

  // Chicken Momo
  {
    id: "menu-momo-overview",
    source: "menu",
    title: "Chicken Momo section",
    content:
      "Chicken Momo — soft dumplings filled with juicy chicken and lightly seasoned spices. Best enjoyed with dipping sauce. Options: Steamed 6pc 180, Steamed 10pc 280, Fried 6pc 200, Fried 10pc 300, Special Sauce 10pc 320.",
    url: "#menu",
    tags: ["momo", "dumplings", "category"],
  },
  {
    id: "menu-steamed-momo-6",
    source: "menu",
    title: "Steamed Chicken Momo (6 pcs) — 180 tk",
    content:
      "Steamed Chicken Momo (6 pcs) — 180 tk. Soft steamed chicken dumplings, served with dipping sauce.",
    url: "#menu",
    tags: ["momo", "steamed", "chicken"],
  },
  {
    id: "menu-steamed-momo-10",
    source: "menu",
    title: "Steamed Chicken Momo (10 pcs) — 280 tk",
    content:
      "Steamed Chicken Momo (10 pcs) — 280 tk. Larger portion of steamed chicken momo.",
    url: "#menu",
    tags: ["momo", "steamed", "chicken"],
  },
  {
    id: "menu-fried-momo-6",
    source: "menu",
    title: "Fried Chicken Momo (6 pcs) — 200 tk",
    content:
      "Fried Chicken Momo (6 pcs) — 200 tk. Crispy fried chicken dumplings with dipping sauce.",
    url: "#menu",
    tags: ["momo", "fried", "chicken"],
  },
  {
    id: "menu-fried-momo-10",
    source: "menu",
    title: "Fried Chicken Momo (10 pcs) — 300 tk",
    content:
      "Fried Chicken Momo (10 pcs) — 300 tk. Larger portion of crispy fried momo.",
    url: "#menu",
    tags: ["momo", "fried", "chicken"],
  },
  {
    id: "menu-special-momo",
    source: "menu",
    title: "Special Sauce Momo (10 pcs) — 320 tk",
    content:
      "Special Sauce Momo (10 pcs) — 320 tk. House-special sauce with chicken momo — a customer favorite.",
    url: "#menu",
    tags: ["momo", "special", "chicken"],
  },

  // Panipuri
  {
    id: "menu-panipuri-overview",
    source: "menu",
    title: "Panipuri section",
    content:
      "Panipuri — crispy hollow puri filled with spiced mashed potato, tamarind water, and a balanced tangy-spicy kick. A Bangladeshi street-food classic. Options: Regular 6pc 80, Regular 10pc 120, Special 10pc 150, Extra Spicy 10pc 160.",
    url: "#menu",
    tags: ["panipuri", "street-food", "category"],
  },
  {
    id: "menu-panipuri-regular-6",
    source: "menu",
    title: "Regular Panipuri (6 pcs) — 80 tk",
    content:
      "Regular Panipuri (6 pcs) — 80 tk. Standard portion of crispy panipuri with classic filling.",
    url: "#menu",
    tags: ["panipuri", "regular", "street-food"],
  },
  {
    id: "menu-panipuri-regular-10",
    source: "menu",
    title: "Regular Panipuri (10 pcs) — 120 tk",
    content:
      "Regular Panipuri (10 pcs) — 120 tk. Larger portion of regular panipuri.",
    url: "#menu",
    tags: ["panipuri", "regular", "street-food"],
  },
  {
    id: "menu-panipuri-special",
    source: "menu",
    title: "Special Panipuri (10 pcs) — 150 tk",
    content:
      "Special Panipuri (10 pcs) — 150 tk. Special filling with extra chutney and spice.",
    url: "#menu",
    tags: ["panipuri", "special", "street-food"],
  },
  {
    id: "menu-panipuri-extra-spicy",
    source: "menu",
    title: "Extra Spicy Panipuri (10 pcs) — 160 tk",
    content:
      "Extra Spicy Panipuri (10 pcs) — 160 tk. For spice lovers — hot, tangy, and bold.",
    url: "#menu",
    tags: ["panipuri", "spicy", "street-food"],
  },

  // Noodles
  {
    id: "menu-noodles-overview",
    source: "menu",
    title: "Noodles section",
    content:
      "Noodles — 5 stir-fried options with quality ingredients and balanced seasoning. Veg Noodles 220, Egg Noodles 240, Chicken Noodles 280, Beef Noodles 300, Special Mixed Noodles 340.",
    url: "#menu",
    tags: ["noodles", "category", "stir-fry"],
  },
  {
    id: "menu-veg-noodles",
    source: "menu",
    title: "Veg Noodles — 220 tk",
    content:
      "Veg Noodles — 220 tk. Vegetarian stir-fried noodles with mixed vegetables.",
    url: "#menu",
    tags: ["noodles", "veg", "vegetarian"],
  },
  {
    id: "menu-egg-noodles",
    source: "menu",
    title: "Egg Noodles — 240 tk",
    content:
      "Egg Noodles — 240 tk. Noodles tossed with egg and seasonings.",
    url: "#menu",
    tags: ["noodles", "egg"],
  },
  {
    id: "menu-chicken-noodles",
    source: "menu",
    title: "Chicken Noodles — 280 tk",
    content:
      "Chicken Noodles — 280 tk. Stir-fried noodles with seasoned chicken.",
    url: "#menu",
    tags: ["noodles", "chicken"],
  },
  {
    id: "menu-beef-noodles",
    source: "menu",
    title: "Beef Noodles — 300 tk",
    content:
      "Beef Noodles — 300 tk. Stir-fried noodles with spiced beef.",
    url: "#menu",
    tags: ["noodles", "beef"],
  },
  {
    id: "menu-mixed-noodles",
    source: "menu",
    title: "Special Mixed Noodles — 340 tk",
    content:
      "Special Mixed Noodles — 340 tk. The fully-loaded option — chicken, beef, egg, and vegetables together.",
    url: "#menu",
    tags: ["noodles", "special", "mixed"],
  },

  // Fuchka
  {
    id: "menu-fuchka-overview",
    source: "menu",
    title: "Fuchka section",
    content:
      "Fuchka — crunchy shells with tamarind water, mashed potato, and a balanced blend of spice and sourness. A Bangladeshi classic. Options: Regular 6pc 70, Regular 10pc 110, Special 10pc 140, Hot & Spicy 10pc 150.",
    url: "#menu",
    tags: ["fuchka", "street-food", "category"],
  },
  {
    id: "menu-fuchka-regular-6",
    source: "menu",
    title: "Regular Fuchka (6 pcs) — 70 tk",
    content:
      "Regular Fuchka (6 pcs) — 70 tk. Standard portion of classic fuchka.",
    url: "#menu",
    tags: ["fuchka", "regular", "street-food"],
  },
  {
    id: "menu-fuchka-regular-10",
    source: "menu",
    title: "Regular Fuchka (10 pcs) — 110 tk",
    content:
      "Regular Fuchka (10 pcs) — 110 tk. Larger portion of regular fuchka.",
    url: "#menu",
    tags: ["fuchka", "regular", "street-food"],
  },
  {
    id: "menu-fuchka-special",
    source: "menu",
    title: "Special Fuchka (10 pcs) — 140 tk",
    content:
      "Special Fuchka (10 pcs) — 140 tk. Special filling, extra chutney.",
    url: "#menu",
    tags: ["fuchka", "special", "street-food"],
  },
  {
    id: "menu-fuchka-spicy",
    source: "menu",
    title: "Hot & Spicy Fuchka (10 pcs) — 150 tk",
    content:
      "Hot & Spicy Fuchka (10 pcs) — 150 tk. Bold, hot, and tangy — for spice lovers.",
    url: "#menu",
    tags: ["fuchka", "spicy", "street-food"],
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
