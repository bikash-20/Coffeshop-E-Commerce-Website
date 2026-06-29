import { base, webp } from "../lib/image.js";

/**
 * Menu catalog — the single source of truth for everything we sell.
 * Grouped into categories so the Menu section can render them in
 * blocks (drinks, then food) with a small section heading per block.
 *
 * Image strategy:
 *   - All product photos live in /public. The pic() helper builds an
 *     object with both a WebP URL and the original JPG URL. The
 *     MenuCard renders a <picture> element that prefers WebP and
 *     falls back to JPG — every modern browser takes the WebP, which
 *     is ~30-60% smaller than the corresponding JPG at the same width.
 *   - Run `python3 scripts/build_images.py` to regenerate the WebPs
 *     after adding new photos. The script also caps long edges at
 *     800px so we never ship a 600KB hero shot to a 384px card slot.
 *   - Filenames must match what's in /public exactly (including
 *     spaces — yes, "fuchka .jpg" has a trailing space; keep it).
 *
 * Prices are in BDT (Bangladeshi Taka, "tk"). Keep this data-only;
 * components should never hardcode item info inline.
 */

const item = (id, name, price, image, tag) => ({
  id,
  name,
  price,
  currency: "tk",
  image,
  tag,
});

/* Build the two-URL shape consumed by <picture> elements.
   webp() is build-time; if the .webp file is missing, the browser
   still gets a graceful JPG fallback. */
const pic = (filename) => ({
  webp: webp(filename),
  original: `${base}${filename}`,
});

export const menuCategories = [
  {
    id: "coffee",
    title: "Coffee & Drinks",
    subtitle: "Signature coffees, frappes, and warm drinks.",
    items: [
      item("vanilla-milkshake", "Vanilla Milk Shakes", 275, pic("coffe1.jpg"), "Classic"),
      item("hot-chocolate", "Hot Chocolate", 290, pic("coffe art.jpg"), "Warm"),
      item("browic-frappe", "Browic Frappe", 410, pic("coffe scribble.jpg"), "Signature"),
      item("espresso-frappe", "Espresso Frappe", 310, pic("pizza0.jpg"), "Bold"),
      item("oreo-frappe", "Oreo Frappe", 350, pic("pizza0.jpg"), "Crowd Favorite"),
      item("caramel-frappe", "Caramel Frappe", 350, pic("pizza0.jpg"), "Sweet"),
      item("vanilla-frappe", "Vanilla Frappe", 330, pic("pizza0.jpg"), "Smooth"),
      item("french-vanilla-coffee", "French Vanilla Coffee", 285, pic("pizza0.jpg"), "Aromatic"),
    ],
  },
  {
    id: "pizza",
    title: "Pizza",
    subtitle: "Freshly baked with a soft crust, rich tomato sauce, melted cheese, and premium toppings. Made to order, served hot.",
    items: [
      item("pizza-margherita", "Margherita Pizza", 320, pic("pizza-1.jpg"), "Classic"),
      item("pizza-veggie", "Veggie Pizza", 380, pic("pizza-2.jpg"), "Veg"),
      item("pizza-chicken", "Chicken Pizza", 450, pic("pizza3.jpg"), "Popular"),
      item("pizza-beef", "Beef Pizza", 490, pic("pizza-4.jpg"), "Hearty"),
      item("pizza-supreme", "Supreme Pizza", 550, pic("pizz-5.jpg"), "Loaded"),
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    subtitle: "Creamy, saucy, and full of flavor — cooked with quality ingredients for a filling, comforting meal.",
    items: [
      item("pasta-white", "White Sauce Pasta", 350, pic("pasta.jpg"), "Creamy"),
      item("pasta-red", "Red Sauce Pasta", 330, pic("pasta2.jpg"), "Classic"),
      item("pasta-alfredo", "Chicken Alfredo Pasta", 420, pic("pasta 4.jpg"), "Chef's Pick"),
      item("pasta-beef", "Spicy Beef Pasta", 450, pic("pasta2.jpg"), "Spicy"),
      item("pasta-veg", "Mixed Veg Pasta", 300, pic("pasta 4.jpg"), "Veg"),
    ],
  },
  {
    id: "momo",
    title: "Chicken Momo",
    subtitle: "Soft dumplings filled with juicy chicken and lightly seasoned spices. Best enjoyed with dipping sauce.",
    items: [
      item("momo-steamed-6", "Steamed Chicken Momo (6 pcs)", 180, pic("chicken momo.jpg"), "Steamed"),
      item("momo-steamed-10", "Steamed Chicken Momo (10 pcs)", 280, pic("chicken momo.jpg"), "Steamed"),
      item("momo-fried-6", "Fried Chicken Momo (6 pcs)", 200, pic("chicken momo2.jpg"), "Fried"),
      item("momo-fried-10", "Fried Chicken Momo (10 pcs)", 300, pic("chicken momo2.jpg"), "Fried"),
      item("momo-special", "Special Sauce Momo (10 pcs)", 320, pic("chicken momo2.jpg"), "Special"),
    ],
  },
  {
    id: "panipuri",
    title: "Panipuri",
    subtitle: "Crispy puris filled with tangy water, mashed potato, chickpeas, and spicy flavors. A street-style favorite.",
    items: [
      item("panipuri-regular-6", "Regular Panipuri (6 pcs)", 80, pic("panipuri.jpg"), "Regular"),
      item("panipuri-regular-10", "Regular Panipuri (10 pcs)", 120, pic("panipuri.jpg"), "Regular"),
      item("panipuri-special-10", "Special Panipuri (10 pcs)", 150, pic("panipuri-2.jpg"), "Special"),
      item("panipuri-spicy-10", "Extra Spicy Panipuri (10 pcs)", 160, pic("panipuri-2.jpg"), "Spicy"),
    ],
  },
  {
    id: "noodles",
    title: "Noodles",
    subtitle: "Stir-fried noodles with vegetables, sauces, and your choice of chicken, beef, or mixed toppings.",
    items: [
      item("noodles-veg", "Veg Noodles", 220, pic("noodles.jpg"), "Veg"),
      item("noodles-egg", "Egg Noodles", 240, pic("noodles.jpg"), "Egg"),
      item("noodles-chicken", "Chicken Noodles", 280, pic("noodles1.jpg"), "Chicken"),
      item("noodles-beef", "Beef Noodles", 300, pic("noodles1.jpg"), "Beef"),
      item("noodles-mixed", "Special Mixed Noodles", 340, pic("noodles1.jpg"), "Special"),
    ],
  },
  {
    id: "fuchka",
    title: "Fuchka",
    subtitle: "Crunchy fuchka served with tamarind water, mashed potato, and a balanced blend of spice and sourness. A classic Bangladeshi favorite that brings a burst of flavor in every bite.",
    items: [
      item("fuchka-regular-6", "Regular Fuchka (6 pcs)", 70, pic("fuchka.jpg"), "Regular"),
      item("fuchka-regular-10", "Regular Fuchka (10 pcs)", 110, pic("fuchka.jpg"), "Regular"),
      item("fuchka-special-10", "Special Fuchka (10 pcs)", 140, pic("fuchka 2.jpg"), "Special"),
      item("fuchka-spicy-10", "Hot & Spicy Fuchka (10 pcs)", 150, pic("fuchka 2.jpg"), "Spicy"),
    ],
  },
];

/* Flat list for cart, RAG, and any code that just wants "all items". */
export const menuItems = menuCategories.flatMap((c) => c.items);

