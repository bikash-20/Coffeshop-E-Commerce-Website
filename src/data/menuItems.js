import {
  menuVanillaShake,
  menuHotChocolate,
  menuBrowicFrappe,
  menuEspressoFrappe,
  menuOreoFrappe,
  menuCaramelFrappe,
} from "../assets/images.js";

/**
 * Menu catalog — the single source of truth for drink items.
 * Prices are in BDT (Bangladeshi Taka, "tk") to match the source menu.
 * Keep this data-only; components should never hardcode item info inline.
 */
export const menuItems = [
  {
    id: "vanilla-milkshake",
    name: "Vanilla Milk Shakes",
    price: 275,
    currency: "tk",
    image: menuVanillaShake,
    tag: "Classic",
  },
  {
    id: "hot-chocolate",
    name: "Hot Chocolate",
    price: 290,
    currency: "tk",
    image: menuHotChocolate,
    tag: "Warm",
  },
  {
    id: "browic-frappe",
    name: "Browic Frappe",
    price: 410,
    currency: "tk",
    image: menuBrowicFrappe,
    tag: "Signature",
  },
  {
    id: "espresso-frappe",
    name: "Espresso Frappe",
    price: 310,
    currency: "tk",
    image: menuEspressoFrappe,
    tag: "Bold",
  },
  {
    id: "oreo-frappe",
    name: "Oreo Frappe",
    price: 350,
    currency: "tk",
    image: menuOreoFrappe,
    tag: "Crowd Favorite",
  },
  {
    id: "caramel-frappe",
    name: "Caramel Frappe",
    price: 350,
    currency: "tk",
    image: menuCaramelFrappe,
    tag: "Sweet",
  },
  // ── Sourced directly from /public — the inline-base64 pipeline is for
  // editorial/marketing shots only; user-supplied product photos live as
  // static files. Vite copies /public to the build root, so these resolve
  // to absolute URLs in production.
  {
    id: "vanilla-frappe",
    name: "Vanilla Frappe",
    price: 330,
    currency: "tk",
    image: "/vanilla-frappe.jpeg",
    tag: "Smooth",
  },
  {
    id: "salted-caramel-banana-macchiato",
    name: "Salted Caramel Banana Macchiato",
    price: 365,
    currency: "tk",
    image: "/salted-caramel-banana-macchiato.jpeg",
    tag: "New",
  },
  {
    id: "vanilla-coffee-greek-yogurt-smoothie",
    name: "Vanilla Coffee Greek Yogurt Smoothie",
    price: 395,
    currency: "tk",
    image: "/Vanilla_Coffee_Greek_Yogurt_Smoothie.jpg",
    tag: "Power",
  },
  {
    id: "french-vanilla-coffee",
    name: "French Vanilla Coffee",
    price: 285,
    currency: "tk",
    image: "/what-is-french-vanilla-coffee.webp",
    tag: "Aromatic",
  },
];
