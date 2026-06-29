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
      "Coffee Luxe (display name: Luxing Conlecting) is a cozy, scroll-driven concept for a coffee shop serving fresh coffee, milkshakes, pizza, pasta, momo, noodles, panipuri, and fuchka. The visual style is warm amber, caramel, champagne gold, and dark coffee brown with Playfair Display headlines and scroll-driven parallax. It is a portfolio piece, not a live ordering platform. Built with React 19, Vite, Tailwind CSS v4, and Framer Motion.",
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
      "Welcome to Coffee Luxe. The menu is organized in 7 sections — Coffee & Drinks, Pizza, Pasta, Chicken Momo, Panipuri, Noodles, and Fuchka — each shown in its own block so you only see items from one category at a time. Prices are in Bangladeshi Taka (tk). Order via the on-site cart; the Send via WhatsApp button on checkout opens a pre-filled chat to the shop.",
    url: "#menu",
    tags: ["menu", "ordering", "categories"],
  },

  // Coffee / frappe drinks
  {
    id: "menu-coffee-overview",
    source: "menu",
    title: "Coffee & Drinks",
    content:
      "Coffee & Drinks — 8 handcrafted options, blended and brewed fresh to order. Vanilla Milk Shakes 275, Hot Chocolate 290, Browic Frappe 410 (signature), Espresso Frappe 310, Oreo Frappe 350 (crowd favorite), Caramel Frappe 350, Vanilla Frappe 330, French Vanilla Coffee 285. All priced in tk.",
    url: "#menu",
    tags: ["coffee", "frappe", "drinks", "category"],
  },
  {
    id: "menu-vanilla-milkshake",
    source: "menu",
    title: "Vanilla Milk Shakes — 275 tk",
    content:
      "Cold, creamy, and blended with flavorful ingredients for a sweet and satisfying treat.",
    url: "#menu",
    tags: ["milkshake", "cold", "sweet"],
  },
  {
    id: "menu-hot-chocolate",
    source: "menu",
    title: "Hot Chocolate — 290 tk",
    content:
      "Steaming-rich cocoa with a smooth, velvety finish — perfect for a cozy break.",
    url: "#menu",
    tags: ["hot", "chocolate", "warm"],
  },
  {
    id: "menu-browic-frappe",
    source: "menu",
    title: "Browic Frappe — 410 tk",
    content:
      "Indulgent chocolate-brownie blended frappe, sweet and thick with every sip.",
    url: "#menu",
    tags: ["frappe", "signature", "chocolate", "sweet"],
  },
  {
    id: "menu-espresso-frappe",
    source: "menu",
    title: "Espresso Frappe — 310 tk",
    content:
      "Chilled espresso frappe for caffeine lovers — bold, cold, and refreshingly smooth.",
    url: "#menu",
    tags: ["frappe", "coffee", "bold", "cold"],
  },
  {
    id: "menu-oreo-frappe",
    source: "menu",
    title: "Oreo Frappe — 350 tk",
    content:
      "Crushed Oreo cookies blended into a creamy frappe — sweet, crunchy, and crowd-loved.",
    url: "#menu",
    tags: ["frappe", "oreo", "sweet", "crowd-favorite"],
  },
  {
    id: "menu-caramel-frappe",
    source: "menu",
    title: "Caramel Frappe — 350 tk",
    content:
      "Smooth caramel-blended frappe, balanced and easy-drinking with a sweet finish.",
    url: "#menu",
    tags: ["frappe", "caramel", "sweet"],
  },
  {
    id: "menu-vanilla-frappe",
    source: "menu",
    title: "Vanilla Frappe — 330 tk",
    content:
      "Light and mellow vanilla-blended frappe — silky, sweet, and refreshingly cool.",
    url: "#menu",
    tags: ["frappe", "vanilla", "smooth"],
  },
  {
    id: "menu-french-vanilla-coffee",
    source: "menu",
    title: "French Vanilla Coffee — 285 tk",
    content:
      "Freshly brewed coffee with rich aroma and smooth taste — a classic aromatic pick.",
    url: "#menu",
    tags: ["coffee", "vanilla", "aromatic", "mellow"],
  },

  // Pizza
  {
    id: "menu-pizza-overview",
    source: "menu",
    title: "Pizza",
    content:
      "Pizza — 5 oven-baked options made to order and served hot. Margherita 320 (classic), Veggie 380 (vegetarian), Chicken 450 (popular), Beef 490 (hearty), Supreme 550 (loaded). Soft crust, rich tomato sauce, melted cheese, premium toppings.",
    url: "#menu",
    tags: ["pizza", "category", "baked"],
  },
  {
    id: "menu-margherita",
    source: "menu",
    title: "Margherita Pizza — 320 tk",
    content:
      "Classic margherita — soft crust, tomato sauce, mozzarella, and fresh basil.",
    url: "#menu",
    tags: ["pizza", "classic", "veg"],
  },
  {
    id: "menu-veggie-pizza",
    source: "menu",
    title: "Veggie Pizza — 380 tk",
    content:
      "Loaded with mixed vegetables on a soft crust, melted cheese, and rich tomato sauce.",
    url: "#menu",
    tags: ["pizza", "veg"],
  },
  {
    id: "menu-chicken-pizza",
    source: "menu",
    title: "Chicken Pizza — 450 tk",
    content:
      "Seasoned chicken and cheese over a soft crust — savory and satisfying.",
    url: "#menu",
    tags: ["pizza", "chicken", "popular"],
  },
  {
    id: "menu-beef-pizza",
    source: "menu",
    title: "Beef Pizza — 490 tk",
    content:
      "Hearty beef toppings, melted cheese, and a soft crust — filling and flavorful.",
    url: "#menu",
    tags: ["pizza", "beef", "hearty"],
  },
  {
    id: "menu-supreme-pizza",
    source: "menu",
    title: "Supreme Pizza — 550 tk",
    content:
      "Fully loaded with premium toppings and extra cheese — bold, rich, and shareable.",
    url: "#menu",
    tags: ["pizza", "supreme", "loaded"],
  },

  // Pasta
  {
    id: "menu-pasta-overview",
    source: "menu",
    title: "Pasta",
    content:
      "Pasta — cooked al dente and tossed in creamy, saucy, or spiced sauces. 5 options: White Sauce Pasta 350, Red Sauce Pasta 330, Chicken Alfredo 420 (chef's pick), Spicy Beef Pasta 450, Mixed Veg Pasta 300.",
    url: "#menu",
    tags: ["pasta", "category", "creamy"],
  },
  {
    id: "menu-white-sauce-pasta",
    source: "menu",
    title: "White Sauce Pasta — 350 tk",
    content:
      "Al dente pasta in a creamy alfredo-style white sauce — smooth, rich comfort food.",
    url: "#menu",
    tags: ["pasta", "creamy", "veg"],
  },
  {
    id: "menu-red-sauce-pasta",
    source: "menu",
    title: "Red Sauce Pasta — 330 tk",
    content:
      "Al dente pasta tossed in classic tomato sauce — simple, tangy, and filling.",
    url: "#menu",
    tags: ["pasta", "tomato", "classic"],
  },
  {
    id: "menu-chicken-alfredo",
    source: "menu",
    title: "Chicken Alfredo Pasta — 420 tk",
    content:
      "Creamy alfredo sauce over al dente pasta with seasoned chicken — the chef's pick.",
    url: "#menu",
    tags: ["pasta", "chicken", "chefs-pick"],
  },
  {
    id: "menu-spicy-beef-pasta",
    source: "menu",
    title: "Spicy Beef Pasta — 450 tk",
    content:
      "Al dente pasta with spiced beef in a rich, bold sauce — hearty and full of heat.",
    url: "#menu",
    tags: ["pasta", "beef", "spicy"],
  },
  {
    id: "menu-mixed-veg-pasta",
    source: "menu",
    title: "Mixed Veg Pasta — 300 tk",
    content:
      "Al dente pasta with a colorful mix of vegetables in a savory sauce — light and tasty.",
    url: "#menu",
    tags: ["pasta", "veg", "vegetarian"],
  },

  // Chicken Momo
  {
    id: "menu-momo-overview",
    source: "menu",
    title: "Chicken Momo",
    content:
      "Chicken Momo — soft dumplings filled with juicy chicken and lightly seasoned spices, best enjoyed with dipping sauce. Options: Steamed 6pc 180, Steamed 10pc 280, Fried 6pc 200, Fried 10pc 300, Special Sauce 10pc 320.",
    url: "#menu",
    tags: ["momo", "dumplings", "category"],
  },
  {
    id: "menu-steamed-momo-6",
    source: "menu",
    title: "Steamed Chicken Momo (6 pcs) — 180 tk",
    content:
      "Soft steamed chicken dumplings served with dipping sauce — juicy and tender.",
    url: "#menu",
    tags: ["momo", "steamed", "chicken"],
  },
  {
    id: "menu-steamed-momo-10",
    source: "menu",
    title: "Steamed Chicken Momo (10 pcs) — 280 tk",
    content:
      "Larger portion of soft steamed chicken dumplings with dipping sauce on the side.",
    url: "#menu",
    tags: ["momo", "steamed", "chicken"],
  },
  {
    id: "menu-fried-momo-6",
    source: "menu",
    title: "Fried Chicken Momo (6 pcs) — 200 tk",
    content:
      "Crispy golden-fried chicken dumplings, juicy inside — served with tasty dip.",
    url: "#menu",
    tags: ["momo", "fried", "chicken"],
  },
  {
    id: "menu-fried-momo-10",
    source: "menu",
    title: "Fried Chicken Momo (10 pcs) — 300 tk",
    content:
      "Larger portion of crispy fried chicken momo with house dipping sauce.",
    url: "#menu",
    tags: ["momo", "fried", "chicken"],
  },
  {
    id: "menu-special-momo",
    source: "menu",
    title: "Special Sauce Momo (10 pcs) — 320 tk",
    content:
      "Chicken momo tossed in our house-special sauce — bold, savory, and craveable.",
    url: "#menu",
    tags: ["momo", "special", "chicken"],
  },

  // Panipuri
  {
    id: "menu-panipuri-overview",
    source: "menu",
    title: "Panipuri",
    content:
      "Panipuri — crispy hollow puris filled with tangy tamarind water, mashed potato, chickpeas, and spicy chutney. A street-style favorite. Options: Regular 6pc 80, Regular 10pc 120, Special 10pc 150, Extra Spicy 10pc 160.",
    url: "#menu",
    tags: ["panipuri", "street-food", "category"],
  },
  {
    id: "menu-panipuri-regular-6",
    source: "menu",
    title: "Regular Panipuri (6 pcs) — 80 tk",
    content:
      "Crispy puris filled with tangy water and mashed potato — crunchy, tangy, refreshing.",
    url: "#menu",
    tags: ["panipuri", "regular", "street-food"],
  },
  {
    id: "menu-panipuri-regular-10",
    source: "menu",
    title: "Regular Panipuri (10 pcs) — 120 tk",
    content:
      "Larger portion of classic panipuri — crispy shells with tangy tamarind water.",
    url: "#menu",
    tags: ["panipuri", "regular", "street-food"],
  },
  {
    id: "menu-panipuri-special",
    source: "menu",
    title: "Special Panipuri (10 pcs) — 150 tk",
    content:
      "Special filling, extra chutney, and a punchier spice level — fuller flavor in every bite.",
    url: "#menu",
    tags: ["panipuri", "special", "street-food"],
  },
  {
    id: "menu-panipuri-extra-spicy",
    source: "menu",
    title: "Extra Spicy Panipuri (10 pcs) — 160 tk",
    content:
      "Bold, hot, and tangy — extra-spicy panipuri for those who like it fiery.",
    url: "#menu",
    tags: ["panipuri", "spicy", "street-food"],
  },

  // Noodles
  {
    id: "menu-noodles-overview",
    source: "menu",
    title: "Noodles",
    content:
      "Noodles — 5 stir-fried options with vegetables, sauces, and your choice of chicken, beef, or mixed toppings. Veg 220, Egg 240, Chicken 280, Beef 300, Special Mixed 340.",
    url: "#menu",
    tags: ["noodles", "category", "stir-fry"],
  },
  {
    id: "menu-veg-noodles",
    source: "menu",
    title: "Veg Noodles — 220 tk",
    content:
      "Stir-fried noodles tossed with mixed vegetables and savory sauce — light and tasty.",
    url: "#menu",
    tags: ["noodles", "veg", "vegetarian"],
  },
  {
    id: "menu-egg-noodles",
    source: "menu",
    title: "Egg Noodles — 240 tk",
    content:
      "Stir-fried noodles with scrambled egg and seasonings — simple, savory, filling.",
    url: "#menu",
    tags: ["noodles", "egg"],
  },
  {
    id: "menu-chicken-noodles",
    source: "menu",
    title: "Chicken Noodles — 280 tk",
    content:
      "Stir-fried noodles with seasoned chicken and fresh vegetables — hearty and savory.",
    url: "#menu",
    tags: ["noodles", "chicken"],
  },
  {
    id: "menu-beef-noodles",
    source: "menu",
    title: "Beef Noodles — 300 tk",
    content:
      "Stir-fried noodles with spiced beef and vegetables — bold, filling, and flavorful.",
    url: "#menu",
    tags: ["noodles", "beef"],
  },
  {
    id: "menu-mixed-noodles",
    source: "menu",
    title: "Special Mixed Noodles — 340 tk",
    content:
      "Fully loaded stir-fried noodles — chicken, beef, egg, and vegetables together.",
    url: "#menu",
    tags: ["noodles", "special", "mixed"],
  },

  // Fuchka
  {
    id: "menu-fuchka-overview",
    source: "menu",
    title: "Fuchka",
    content:
      "Fuchka — crunchy shells filled with tamarind water, mashed potato, and a balanced blend of spice and sourness. A classic Bangladeshi favorite. Options: Regular 6pc 70, Regular 10pc 110, Special 10pc 140, Hot & Spicy 10pc 150.",
    url: "#menu",
    tags: ["fuchka", "street-food", "category"],
  },
  {
    id: "menu-fuchka-regular-6",
    source: "menu",
    title: "Regular Fuchka (6 pcs) — 70 tk",
    content:
      "Crunchy fuchka shells with tangy tamarind water and mashed potato — burst of flavor.",
    url: "#menu",
    tags: ["fuchka", "regular", "street-food"],
  },
  {
    id: "menu-fuchka-regular-10",
    source: "menu",
    title: "Regular Fuchka (10 pcs) — 110 tk",
    content:
      "Larger portion of classic fuchka — crunchy, tangy, and refreshingly sour.",
    url: "#menu",
    tags: ["fuchka", "regular", "street-food"],
  },
  {
    id: "menu-fuchka-special",
    source: "menu",
    title: "Special Fuchka (10 pcs) — 140 tk",
    content:
      "Special filling with extra chutney and spice — fuller, more flavorful punch.",
    url: "#menu",
    tags: ["fuchka", "special", "street-food"],
  },
  {
    id: "menu-fuchka-spicy",
    source: "menu",
    title: "Hot & Spicy Fuchka (10 pcs) — 150 tk",
    content:
      "Bold, hot, and tangy — for spice lovers who like it fiery and sour.",
    url: "#menu",
    tags: ["fuchka", "spicy", "street-food"],
  },

  // ── Story / brand voice ─────────────────────────────────────
  {
    id: "story-overview",
    source: "story",
    title: "The Coffee Luxe story",
    content:
      "We started with a simple idea: serve fresh, flavorful food that brings comfort and joy to every customer. From cheesy pizzas and creamy milkshakes to spicy noodles and classic street-style snacks, every item is made with care and quality ingredients. We blend taste, freshness, and a cozy dining experience to make every visit special. Whether you're craving a quick snack or a full meal, we're here to serve food that feels satisfying and memorable.",
    url: "#story",
    tags: ["brand", "story", "identity"],
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
