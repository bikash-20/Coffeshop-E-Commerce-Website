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

const item = (id, name, price, image, tag, description) => ({
  id,
  name,
  price,
  currency: "tk",
  image,
  tag,
  description,
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
    subtitle: "Signature coffees, frappes, milkshakes, and warm drinks — blended and brewed fresh to order.",
    items: [
      item("vanilla-milkshake", "Vanilla Milk Shakes", 275, pic("coffe1.jpg"), "Classic",
          "Cold, creamy, and blended with flavorful ingredients for a sweet and satisfying treat."),
      item("hot-chocolate", "Hot Chocolate", 290, pic("coffe art.jpg"), "Warm",
          "Steaming-rich cocoa with a smooth, velvety finish — perfect for a cozy break."),
      item("browic-frappe", "Browic Frappe", 410, pic("coffe scribble.jpg"), "Signature",
          "Indulgent chocolate-brownie blended frappe, sweet and thick with every sip."),
      item("espresso-frappe", "Espresso Frappe", 310, pic("pizza0.jpg"), "Bold",
          "Chilled espresso frappe for caffeine lovers — bold, cold, and refreshingly smooth."),
      item("oreo-frappe", "Oreo Frappe", 350, pic("pizza0.jpg"), "Crowd Favorite",
          "Crushed Oreo cookies blended into a creamy frappe — sweet, crunchy, and crowd-loved."),
      item("caramel-frappe", "Caramel Frappe", 350, pic("pizza0.jpg"), "Sweet",
          "Smooth caramel-blended frappe, balanced and easy-drinking with a sweet finish."),
      item("vanilla-frappe", "Vanilla Frappe", 330, pic("pizza0.jpg"), "Smooth",
          "Light and mellow vanilla-blended frappe — silky, sweet, and refreshingly cool."),
      item("french-vanilla-coffee", "French Vanilla Coffee", 285, pic("pizza0.jpg"), "Aromatic",
          "Freshly brewed coffee with rich aroma and smooth taste — a classic aromatic pick."),
    ],
  },
  {
    id: "pizza",
    title: "Pizza",
    subtitle: "Oven-baked with melty cheese, savory sauce, and your choice of delicious toppings — made to order, served hot.",
    items: [
      item("pizza-margherita", "Margherita Pizza", 320, pic("pizza-1.jpg"), "Classic",
          "Classic margherita — soft crust, tomato sauce, mozzarella, and fresh basil."),
      item("pizza-veggie", "Veggie Pizza", 380, pic("pizza-2.jpg"), "Veg",
          "Loaded with mixed vegetables on a soft crust, melted cheese, and rich tomato sauce."),
      item("pizza-chicken", "Chicken Pizza", 450, pic("pizza3.jpg"), "Popular",
          "Seasoned chicken and cheese over a soft crust — savory and satisfying."),
      item("pizza-beef", "Beef Pizza", 490, pic("pizza-4.jpg"), "Hearty",
          "Hearty beef toppings, melted cheese, and a soft crust — filling and flavorful."),
      item("pizza-supreme", "Supreme Pizza", 550, pic("pizz-5.jpg"), "Loaded",
          "Fully loaded with premium toppings and extra cheese — bold, rich, and shareable."),
    ],
  },
  {
    id: "pasta",
    title: "Pasta",
    subtitle: "Cooked al dente and tossed in creamy, saucy, or spiced sauces — comforting, filling, and full of flavor.",
    items: [
      item("pasta-white", "White Sauce Pasta", 350, pic("pasta.jpg"), "Creamy",
          "Al dente pasta in a creamy alfredo-style white sauce — smooth, rich comfort food."),
      item("pasta-red", "Red Sauce Pasta", 330, pic("pasta2.jpg"), "Classic",
          "Al dente pasta tossed in classic tomato sauce — simple, tangy, and filling."),
      item("pasta-alfredo", "Chicken Alfredo Pasta", 420, pic("pasta 4.jpg"), "Chef's Pick",
          "Creamy alfredo sauce over al dente pasta with seasoned chicken — the chef's pick."),
      item("pasta-beef", "Spicy Beef Pasta", 450, pic("pasta2.jpg"), "Spicy",
          "Al dente pasta with spiced beef in a rich, bold sauce — hearty and full of heat."),
      item("pasta-veg", "Mixed Veg Pasta", 300, pic("pasta 4.jpg"), "Veg",
          "Al dente pasta with a colorful mix of vegetables in a savory sauce — light and tasty."),
    ],
  },
  {
    id: "momo",
    title: "Chicken Momo",
    subtitle: "Soft dumplings filled with juicy chicken and lightly seasoned spices — best enjoyed with dipping sauce.",
    items: [
      item("momo-steamed-6", "Steamed Chicken Momo (6 pcs)", 180, pic("chicken momo.jpg"), "Steamed",
          "Soft steamed chicken dumplings served with dipping sauce — juicy and tender."),
      item("momo-steamed-10", "Steamed Chicken Momo (10 pcs)", 280, pic("chicken momo.jpg"), "Steamed",
          "Larger portion of soft steamed chicken dumplings with dipping sauce on the side."),
      item("momo-fried-6", "Fried Chicken Momo (6 pcs)", 200, pic("chicken momo2.jpg"), "Fried",
          "Crispy golden-fried chicken dumplings, juicy inside — served with tasty dip."),
      item("momo-fried-10", "Fried Chicken Momo (10 pcs)", 300, pic("chicken momo2.jpg"), "Fried",
          "Larger portion of crispy fried chicken momo with house dipping sauce."),
      item("momo-special", "Special Sauce Momo (10 pcs)", 320, pic("chicken momo2.jpg"), "Special",
          "Chicken momo tossed in our house-special sauce — bold, savory, and craveable."),
    ],
  },
  {
    id: "panipuri",
    title: "Panipuri",
    subtitle: "Crispy hollow puris filled with tangy water, mashed potato, chickpeas, and spicy chutney — a street-style favorite.",
    items: [
      item("panipuri-regular-6", "Regular Panipuri (6 pcs)", 80, pic("panipuri.jpg"), "Regular",
          "Crispy puris filled with tangy water and mashed potato — crunchy, tangy, refreshing."),
      item("panipuri-regular-10", "Regular Panipuri (10 pcs)", 120, pic("panipuri.jpg"), "Regular",
          "Larger portion of classic panipuri — crispy shells with tangy tamarind water."),
      item("panipuri-special-10", "Special Panipuri (10 pcs)", 150, pic("panipuri-2.jpg"), "Special",
          "Special filling, extra chutney, and a punchier spice level — fuller flavor in every bite."),
      item("panipuri-spicy-10", "Extra Spicy Panipuri (10 pcs)", 160, pic("panipuri-2.jpg"), "Spicy",
          "Bold, hot, and tangy — extra-spicy panipuri for those who like it fiery."),
    ],
  },
  {
    id: "noodles",
    title: "Noodles",
    subtitle: "Stir-fried noodles with fresh vegetables, sauces, and your choice of chicken, beef, or mixed toppings.",
    items: [
      item("noodles-veg", "Veg Noodles", 220, pic("noodles.jpg"), "Veg",
          "Stir-fried noodles tossed with mixed vegetables and savory sauce — light and tasty."),
      item("noodles-egg", "Egg Noodles", 240, pic("noodles.jpg"), "Egg",
          "Stir-fried noodles with scrambled egg and seasonings — simple, savory, filling."),
      item("noodles-chicken", "Chicken Noodles", 280, pic("noodles1.jpg"), "Chicken",
          "Stir-fried noodles with seasoned chicken and fresh vegetables — hearty and savory."),
      item("noodles-beef", "Beef Noodles", 300, pic("noodles1.jpg"), "Beef",
          "Stir-fried noodles with spiced beef and vegetables — bold, filling, and flavorful."),
      item("noodles-mixed", "Special Mixed Noodles", 340, pic("noodles1.jpg"), "Special",
          "Fully loaded stir-fried noodles — chicken, beef, egg, and vegetables together."),
    ],
  },
  {
    id: "fuchka",
    title: "Fuchka",
    subtitle: "Crunchy fuchka shells with tamarind water, mashed potato, and a balanced blend of spice and sourness — a classic Bangladeshi favorite.",
    items: [
      item("fuchka-regular-6", "Regular Fuchka (6 pcs)", 70, pic("fuchka.jpg"), "Regular",
          "Crunchy fuchka shells with tangy tamarind water and mashed potato — burst of flavor."),
      item("fuchka-regular-10", "Regular Fuchka (10 pcs)", 110, pic("fuchka.jpg"), "Regular",
          "Larger portion of classic fuchka — crunchy, tangy, and refreshingly sour."),
      item("fuchka-special-10", "Special Fuchka (10 pcs)", 140, pic("fuchka 2.jpg"), "Special",
          "Special filling with extra chutney and spice — fuller, more flavorful punch."),
      item("fuchka-spicy-10", "Hot & Spicy Fuchka (10 pcs)", 150, pic("fuchka 2.jpg"), "Spicy",
          "Bold, hot, and tangy — for spice lovers who like it fiery and sour."),
    ],
  },
];

/* Flat list for cart, RAG, and any code that just wants "all items". */
export const menuItems = menuCategories.flatMap((c) => c.items);

