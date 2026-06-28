import { createContext, useContext, useMemo, useReducer } from "react";

/**
 * Tiny cart context — a demo of in-page commerce UX. The "Add" buttons
 * on each MenuCard call `addItem(item)`, the floating cart pill in the
 * navbar reads `count` from this. Items are kept in memory only; the
 * site is conceptual, not transactional, but the affordance makes
 * the page feel like a real product rather than a static deck.
 */

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return {
        ...state,
        items: [...state.items, action.item],
        count: state.count + 1,
      };
    case "remove":
      return {
        ...state,
        items: state.items.filter((_, i) => i !== action.index),
        count: Math.max(state.count - 1, 0),
      };
    case "clear":
      return { items: [], count: 0 };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [], count: 0 });
  const value = useMemo(
    () => ({
      items: state.items,
      count: state.count,
      addItem: (item) => dispatch({ type: "add", item }),
      removeAt: (i) => dispatch({ type: "remove", index: i }),
      clear: () => dispatch({ type: "clear" }),
    }),
    [state]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    // Safe fallback so components can render before the provider mounts.
    return { items: [], count: 0, addItem: () => {}, removeAt: () => {}, clear: () => {} };
  }
  return ctx;
}