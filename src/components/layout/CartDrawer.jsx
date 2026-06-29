import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../../context/CartContext.jsx";
import {
  whatsappLinkWithMessage,
  telLink,
  mailtoLink,
} from "../../data/contact.js";

/* Build a human-friendly WhatsApp order message.
   - One line per item: "<qty>× <name> — <line subtotal>tk"
   - Then a blank line, then a totals block.
   - The helpers in contact.js will URL-encode the whole string so it
     can be appended to wa.me/?text= without manual escaping. */
function buildWhatsAppMessage(lines, totals) {
  const header = `Hi Coffee Luxe! I'd like to place an order:\n\n`;
  const body = lines
    .map((l) => {
      const lineTotal = l.item.price * l.qty;
      return `${l.qty}× ${l.item.name} — ${lineTotal}tk`;
    })
    .join("\n");
  const footer =
    `\n\nSubtotal: ${totals.subtotal}tk` +
    `\nVAT (4%): ${totals.tax}tk` +
    `\nDelivery: ${totals.delivery}tk` +
    `\nTotal: ${totals.total}tk` +
    `\n\nPlease confirm availability and delivery time. Thanks!`;
  return header + body + footer;
}

const formatTk = (n) => `${n.toLocaleString("en-IN")} tk`;

export default function CartDrawer() {
  const cart = useCart();
  const { lines, subtotal, tax, delivery, total, count, isOpen,
          closeCart, inc, dec, removeLine, clear } = cart;

  /* "cart" = line list; "checkout" = order summary + WhatsApp/call CTAs.
     Reset to "cart" whenever the drawer re-opens so the user always
     sees their basket first. */
  const [mode, setMode] = useState("cart");

  useEffect(() => {
    if (isOpen) setMode("cart");
  }, [isOpen]);

  /* Lock body scroll while the drawer is open — prevents the page
     underneath from scrolling on mobile when the user drags inside. */
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  /* Close on Escape — keyboard a11y win and feels polished. */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  const whatsappHref = useMemo(
    () =>
      whatsappLinkWithMessage(
        buildWhatsAppMessage(lines, { subtotal, tax, delivery, total })
      ),
    [lines, subtotal, tax, delivery, total]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80]">
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={closeCart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 h-full w-full cursor-default bg-coffee-950/70 backdrop-blur-sm"
          />

          {/* Panel — slide-in from right.
              On mobile takes full width; on sm+ becomes a 24rem sidebar. */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-full flex-col
                       bg-coffee-900 text-cream-100 shadow-2xl shadow-black/40
                       sm:max-w-md
                       border-l border-gold-500/20"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 border-b border-gold-500/15 bg-coffee-950/60 px-5 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500/15 text-gold-300">
                  <ShoppingBag className="h-4 w-4" />
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="font-display text-lg font-semibold text-cream-100">
                    {mode === "cart" ? "Your order" : "Checkout"}
                  </span>
                  <span className="text-xs text-cream-300">
                    {count > 0
                      ? `${count} item${count === 1 ? "" : "s"}`
                      : "Nothing here yet"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close"
                data-cursor="hover"
                className="grid h-9 w-9 place-items-center rounded-full text-cream-300 transition-colors hover:bg-coffee-800 hover:text-cream-100"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* Body — swaps between cart and checkout screens */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {lines.length === 0 ? (
                <EmptyState onClose={closeCart} />
              ) : mode === "cart" ? (
                <CartLines
                  lines={lines}
                  onInc={inc}
                  onDec={dec}
                  onRemove={removeLine}
                />
              ) : (
                <CheckoutSummary
                  lines={lines}
                  totals={{ subtotal, tax, delivery, total }}
                />
              )}
            </div>

            {/* Footer — totals + actions. Hidden when cart is empty. */}
            {lines.length > 0 && (
              <footer className="border-t border-gold-500/15 bg-coffee-950/70 px-5 py-4 backdrop-blur-md">
                {mode === "cart" ? (
                  <>
                    <Totals subtotal={subtotal} tax={tax} delivery={delivery} />
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={clear}
                        data-cursor="hover"
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-cream-300 transition-colors hover:text-cream-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setMode("checkout")}
                        data-cursor="hover"
                        className="ml-auto inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-coffee-950 shadow-lg shadow-gold-500/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Check className="h-4 w-4" />
                        Checkout
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-bold text-coffee-950 shadow-lg shadow-gold-500/20 transition-transform hover:scale-[1.01]"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                        <path d="M20.52 3.48A11.94 11.94 0 0 0 12.05 0C5.5 0 .12 5.37.12 11.92c0 2.1.55 4.15 1.6 5.96L0 24l6.27-1.65a11.92 11.92 0 0 0 5.78 1.47h.01c6.54 0 11.92-5.37 11.92-11.92 0-3.18-1.24-6.17-3.46-8.42zM12.06 21.8h-.01a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.72.98 1-3.62-.24-.37a9.86 9.86 0 0 1-1.52-5.27C2.18 6.61 6.61 2.18 12.05 2.18c2.63 0 5.1 1.03 6.96 2.88a9.78 9.78 0 0 1 2.89 6.96c0 5.45-4.43 9.78-9.84 9.78z" />
                        <path d="M17.47 14.38c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.8.37s-1.05 1.03-1.05 2.5 1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35z" />
                      </svg>
                      Send via WhatsApp
                    </a>
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${telLink()}`}
                        data-cursor="hover"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-500/40 px-4 py-2.5 text-sm font-semibold text-gold-200 transition-colors hover:bg-gold-500/10"
                      >
                        Call to order
                      </a>
                      <a
                        href={mailtoLink({ subject: "Coffee Luxe order" })}
                        data-cursor="hover"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-gold-500/40 px-4 py-2.5 text-sm font-semibold text-gold-200 transition-colors hover:bg-gold-500/10"
                      >
                        Email
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMode("cart")}
                      data-cursor="hover"
                      className="mt-1 text-center text-xs text-cream-300 transition-colors hover:text-cream-100"
                    >
                      ← Back to cart
                    </button>
                  </div>
                )}
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ───────────── Sub-views ───────────── */

function EmptyState({ onClose }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full border border-gold-500/20 bg-coffee-800 text-gold-300">
        <ShoppingBag className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-xl font-semibold text-cream-100">
          Your basket is empty
        </h3>
        <p className="max-w-[18rem] text-sm text-cream-300">
          Browse the menu and add a drink — your selections will appear here.
        </p>
      </div>
      <a
        href="#menu"
        onClick={onClose}
        data-cursor="hover"
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-coffee-950 transition-transform hover:scale-[1.02]"
      >
        <Coffee className="h-4 w-4" />
        Browse menu
      </a>
    </div>
  );
}

function CartLines({ lines, onInc, onDec, onRemove }) {
  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {lines.map((line) => (
          <motion.li
            key={line.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, height: 0, marginTop: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-3 rounded-2xl border border-gold-500/10 bg-coffee-800/60 p-3"
          >
            {/* Thumbnail */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-coffee-950">
              {line.item.image ? (
                <picture className="block h-full w-full">
                  <source srcSet={line.item.image.webp} type="image/webp" />
                  <img
                    src={line.item.image.original}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </picture>
              ) : (
                <div className="grid h-full w-full place-items-center text-gold-400">
                  <Coffee className="h-5 w-5" />
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="leading-tight">
                  <h4 className="font-display text-sm font-semibold text-cream-100 line-clamp-1">
                    {line.item.name}
                  </h4>
                  <p className="text-[11px] text-cream-300">
                    {line.item.price} {line.item.currency}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(line.id)}
                  aria-label={`Remove ${line.item.name}`}
                  data-cursor="hover"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-cream-400 transition-colors hover:bg-coffee-900 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between">
                {/* Stepper */}
                <div className="flex items-center overflow-hidden rounded-full border border-gold-500/30 bg-coffee-950/50 text-gold-200">
                  <button
                    type="button"
                    onClick={() => onDec(line.id)}
                    aria-label="Decrease"
                    data-cursor="hover"
                    className="grid h-8 w-8 place-items-center transition-colors hover:bg-gold-500/15"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <motion.span
                    key={line.qty}
                    initial={{ y: -4, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="min-w-[2ch] text-center text-sm font-bold text-cream-100"
                  >
                    {line.qty}
                  </motion.span>
                  <button
                    type="button"
                    onClick={() => onInc(line.id)}
                    aria-label="Increase"
                    data-cursor="hover"
                    className="grid h-8 w-8 place-items-center transition-colors hover:bg-gold-500/15"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                {/* Line subtotal */}
                <span className="font-display text-sm font-bold text-gold-300">
                  {formatTk(line.item.price * line.qty)}
                </span>
              </div>
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}

function Totals({ subtotal, tax, delivery }) {
  return (
    <dl className="flex flex-col gap-1.5 text-sm">
      <Row label="Subtotal" value={formatTk(subtotal)} />
      <Row label="VAT (4%)" value={formatTk(tax)} />
      <Row label="Delivery" value={delivery === 0 ? "—" : formatTk(delivery)} />
      <div className="my-1 h-px bg-gold-500/15" />
      <div className="flex items-baseline justify-between">
        <dt className="font-display text-base font-semibold text-cream-100">Total</dt>
        <dd className="font-display text-2xl font-bold text-gold-300">
          {formatTk(subtotal + tax + delivery)}
        </dd>
      </div>
    </dl>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-cream-300">{label}</dt>
      <dd className="font-medium text-cream-100">{value}</dd>
    </div>
  );
}

function CheckoutSummary({ lines, totals }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-gold-500/15 bg-coffee-800/60 p-4">
        <h3 className="mb-3 font-display text-base font-semibold text-cream-100">
          Order summary
        </h3>
        <ul className="flex flex-col gap-1.5">
          {lines.map((l) => (
            <li key={l.id} className="flex items-baseline justify-between text-sm">
              <span className="text-cream-200">
                <span className="font-semibold text-gold-300">{l.qty}×</span>{" "}
                {l.item.name}
              </span>
              <span className="text-cream-100">
                {formatTk(l.item.price * l.qty)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Totals
        subtotal={totals.subtotal}
        tax={totals.tax}
        delivery={totals.delivery}
      />

      <p className="text-xs text-cream-300">
        Tap <span className="font-semibold text-gold-300">Send via WhatsApp</span> to
        send this order to Coffee Luxe. We'll reply with availability, total
        confirmation, and your delivery time. No online payment — pay on
        delivery.
      </p>
    </div>
  );
}

/* Coffee icon is used in the empty-state CTA — keep it local so this
   file doesn't pull in extra icons from the parent. */
function Coffee(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 8h1a3 3 0 0 1 0 6h-1" />
      <path d="M3 8h14v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <path d="M7 4v2M11 4v2M15 4v2" />
    </svg>
  );
}