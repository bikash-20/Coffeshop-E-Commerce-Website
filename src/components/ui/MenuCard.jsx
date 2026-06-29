import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCart } from "../../context/CartContext.jsx";
import { Plus, Check, Minus } from "lucide-react";

/**
 * Menu item card — three layered motion details:
 *   1. Outer tilt + lift on hover (3D perspective tilt toward cursor).
 *   2. Image parallax that moves opposite to the tilt.
 *   3. "Add" affordance that ripples, swaps to a checkmark, and bumps
 *      the global cart badge via CartContext.
 *
 * Touch-device users still get the simple lift + tap feedback;
 * pointer-relative tilt is fine-pointer-only.
 */
export default function MenuCard({ item }) {
  const ref = useRef(null);
  // Read both the per-item quantity (if any) and the add handler.
  // The "+ / qty / -" controls on the card let users tweak quantity
  // inline without opening the drawer for every small adjustment.
  const cart = useCart();
  const line = cart.lines.find((l) => l.id === item.id);
  const qty = line ? line.qty : 0;
  const [added, setAdded] = useState(false);
  const [ripples, setRipples] = useState([]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 220, damping: 22, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 220, damping: 22, mass: 0.4 });

  const rotateY = useTransform(sx, [-1, 1], [-8, 8]);
  const rotateX = useTransform(sy, [-1, 1], [8, -8]);
  const imgX = useTransform(sx, [-1, 1], [-10, 10]);
  const imgY = useTransform(sy, [-1, 1], [-10, 10]);

  const [finePointer, setFinePointer] = useState(false);

  function onMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    px.set(x * 2 - 1);
    py.set(y * 2 - 1);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
  }

  function handleAdd(e) {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { id, x, y }]);
    setTimeout(() => setRipples((r) => r.filter((p) => p.id !== id)), 600);
    cart.addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  }

  function handleInc(e) {
    e.stopPropagation();
    cart.inc(item.id);
  }

  function handleDec(e) {
    e.stopPropagation();
    cart.dec(item.id);
  }

  function handleOpenCart(e) {
    e.stopPropagation();
    cart.openCart();
  }

  return (
    <motion.article
      ref={ref}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" || e.pointerType === "pen") {
          setFinePointer(true);
        }
      }}
      onPointerLeave={() => {
        setFinePointer(false);
        onLeave();
      }}
      onPointerMove={onMove}
      style={{
        rotateX: finePointer ? rotateX : 0,
        rotateY: finePointer ? rotateY : 0,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="conic-border group flex h-full flex-col overflow-hidden rounded-2xl border border-gold-500/15
                 bg-coffee-900/60 shadow-lg shadow-black/20 transition-colors duration-300
                 hover:border-gold-500/40 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Image area.
          - 4/5 portrait ratio (standard product photography) instead of
            1:1 so user-supplied product shots crop less aggressively.
          - Background is coffee-800 (dark) instead of cream-100 (light)
            so any momentary loading state reads as intentional, not broken.
          - Eager loading (no `loading="lazy"`): only ~10 images total and
            this section is below the fold, but lazy + slow connections
            produced visible white-blank placeholders that looked like
            missing images. Total payload is <1MB; eager is fine. */}
      <div className="relative aspect-[4/5] overflow-hidden bg-coffee-800">
        <motion.img
          src={item.image}
          alt={item.name}
          decoding="async"
          style={{
            x: finePointer ? imgX : 0,
            y: finePointer ? imgY : 0,
            scale: finePointer ? 1.06 : 1,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="h-full w-full object-cover"
          onError={(e) => {
            // If an image fails to decode, log + replace with a neutral
            // gradient so the card never shows a literal white square.
            console.error('[MenuCard] image failed to load:', item.image);
            e.currentTarget.style.background = 'linear-gradient(135deg, #523620, #2a1c12)';
            e.currentTarget.style.minHeight = '100%';
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr
                     from-transparent via-cream-100/20 to-transparent opacity-0
                     transition-opacity duration-500 group-hover:opacity-100"
        />
        {item.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-coffee-950/80 px-3 py-1
                          text-[11px] font-semibold uppercase tracking-wide text-gold-400
                          backdrop-blur-sm">
            {item.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-xl font-semibold text-cream-100">{item.name}</h3>
        <div className="h-px w-10 bg-gold-500/50" />
        <p className="font-display text-2xl font-bold text-gold-400">
          {item.price}
          <span className="ml-1 text-sm font-medium text-cream-300">{item.currency}</span>
        </p>

        {/* Order action area — switches between "Add" and a +/- stepper
            once the item is in the cart. The stepper also exposes a
            tiny cart icon that opens the full drawer for review. */}
        {qty === 0 ? (
          <button
            onClick={handleAdd}
            data-cursor="hover"
            className="relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full
                       bg-gold-500/15 px-4 py-2.5 text-sm font-semibold text-gold-300
                       transition-colors hover:bg-gold-500/25 hover:text-gold-200"
          >
            {/* Ripples — animated circle spawning from the click point */}
            <AnimatePresence>
              {ripples.map((r) => (
                <motion.span
                  key={r.id}
                  initial={{ scale: 0, opacity: 0.6 }}
                  animate={{ scale: 4, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ left: r.x, top: r.y, x: "-50%", y: "-50%" }}
                  className="pointer-events-none absolute h-6 w-6 rounded-full bg-gold-400"
                />
              ))}
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2"
                >
                  <Check className="h-4 w-4" /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add to order
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ) : (
          <div className="mt-2 flex items-stretch gap-2">
            {/* Stepper: − qty + */}
            <div className="flex flex-1 items-center justify-between overflow-hidden rounded-full border border-gold-500/40 bg-gold-500/10 text-sm font-semibold text-gold-200">
              <button
                onClick={handleDec}
                aria-label={`Remove one ${item.name}`}
                data-cursor="hover"
                className="touch-target flex h-10 w-10 items-center justify-center transition-colors hover:bg-gold-500/20"
              >
                <Minus className="h-4 w-4" />
              </button>
              <motion.span
                key={qty}
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.18 }}
                className="min-w-[2ch] text-center font-display text-base font-bold text-gold-100"
              >
                {qty}
              </motion.span>
              <button
                onClick={handleInc}
                aria-label={`Add one more ${item.name}`}
                data-cursor="hover"
                className="touch-target flex h-10 w-10 items-center justify-center transition-colors hover:bg-gold-500/20"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {/* View cart button — opens the drawer for review/checkout */}
            <button
              onClick={handleOpenCart}
              aria-label="Open cart"
              data-cursor="hover"
              className="touch-target flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                         border border-gold-500/40 bg-coffee-900/70 text-gold-300
                         transition-colors hover:bg-coffee-800 hover:text-gold-200"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="M5 7h14l-1.5 11.5a2 2 0 0 1-2 1.75H8.5a2 2 0 0 1-2-1.75L5 7z" />
                <path d="M9 7V5a3 3 0 0 1 6 0v2" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </motion.article>
  );
}
