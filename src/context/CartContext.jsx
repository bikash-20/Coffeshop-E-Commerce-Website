import { createContext, useCallback, useContext, useMemo, useReducer, useState } from "react";

/**
 * Real-feeling cart — tracks quantity per item, computes line subtotals
 * and a grand total in BDT, and exposes an open/close drawer flag.
 *
 * Data model: a `lines` array of { id, item, qty } entries. Using an
 * array (not a Map) keeps order stable — newest additions land at
 * the bottom of the drawer, and React keys stay trivial.
 *
 * The drawer is also owned here so any component can call openCart()
 * / closeCart() — Navbar pill, floating "Order Online" buttons,
 * MenuCard's "Add" affordance all funnel through the same UI.
 */

const CartContext = createContext(null);

const TAX_RATE = 0.05; // 5% VAT — realistic for BD cafés
const DELIVERY_FEE = 30; // tk — small delivery surcharge when cart has items

function reducer(state, action) {
  switch (action.type) {
    case "add": {
      const { item } = action;
      const existing = state.lines.find((l) => l.id === item.id);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            l.id === item.id ? { ...l, qty: l.qty + 1 } : l
          ),
        };
      }
      return { ...state, lines: [...state.lines, { id: item.id, item, qty: 1 }] };
    }
    case "inc": {
      return {
        ...state,
        lines: state.lines.map((l) =>
          l.id === action.id ? { ...l, qty: l.qty + 1 } : l
        ),
      };
    }
    case "dec": {
      return {
        ...state,
        lines: state.lines
          .map((l) => (l.id === action.id ? { ...l, qty: l.qty - 1 } : l))
          // Remove the line entirely if qty hits 0
          .filter((l) => l.qty > 0),
      };
    }
    case "remove": {
      return { ...state, lines: state.lines.filter((l) => l.id !== action.id) };
    }
    case "clear": {
      return { ...state, lines: [] };
    }
    default:
      return state;
  }
}

function computeTotals(lines) {
  const subtotal = lines.reduce((sum, l) => sum + l.item.price * l.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const delivery = lines.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + delivery;
  const count = lines.reduce((sum, l) => sum + l.qty, 0);
  return { subtotal, tax, delivery, total, count };
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { lines: [] });
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const addItem = useCallback((item) => dispatch({ type: "add", item }), []);
  const inc = useCallback((id) => dispatch({ type: "inc", id }), []);
  const dec = useCallback((id) => dispatch({ type: "dec", id }), []);
  const removeLine = useCallback((id) => dispatch({ type: "remove", id }), []);
  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const totals = useMemo(() => computeTotals(state.lines), [state.lines]);

  const value = useMemo(
    () => ({
      lines: state.lines,
      ...totals,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      inc,
      dec,
      removeLine,
      clear,
    }),
    [state.lines, totals, isOpen, openCart, closeCart, toggleCart, addItem, inc, dec, removeLine, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    // Safe fallback so MenuCard renders before the provider mounts
    // (e.g. in Storybook / isolated tests).
    return {
      lines: [],
      subtotal: 0,
      tax: 0,
      delivery: 0,
      total: 0,
      count: 0,
      isOpen: false,
      openCart: () => {},
      closeCart: () => {},
      toggleCart: () => {},
      addItem: () => {},
      inc: () => {},
      dec: () => {},
      removeLine: () => {},
      clear: () => {},
    };
  }
  return ctx;
}