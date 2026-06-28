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
];
