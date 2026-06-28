import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCart } from "../../context/CartContext.jsx";
import { Plus, Check } from "lucide-react";

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
  const { addItem, count } = useCart();
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
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
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
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <motion.img
          src={item.image}
          alt={item.name}
          loading="lazy"
          style={{
            x: finePointer ? imgX : 0,
            y: finePointer ? imgY : 0,
            scale: finePointer ? 1.06 : 1,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="h-full w-full object-cover"
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

        {/* Add to cart — ripple + checkmark micro-interaction */}
        <button
          onClick={handleAdd}
          data-cursor="hover"
          className="relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full
                     bg-gold-500/15 px-4 py-2 text-sm font-semibold text-gold-300
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
      </div>
    </motion.article>
  );
}
