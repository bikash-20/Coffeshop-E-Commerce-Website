import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Single menu item card.
 *
 * Two motion layers stacked:
 *   1. Outer `motion.article` — handles whileHover lift + tap squish,
 *      AND the 3D tilt that follows the cursor (max ±8°). Uses spring
 *      smoothing so the tilt "follows" the cursor instead of
 *      snapping.
 *   2. Inner image div — a subtle parallax zoom so the photo appears
 *      to live inside the tilted card rather than flat on it.
 *
 * Tilt is disabled on touch devices (no pointermove), so mobile users
 * still get the simple lift/tap feedback from before.
 */
export default function MenuCard({ item }) {
  const ref = useRef(null);

  // Pointer-relative offsets in the range -1..1 (centered on the card).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  // Spring-smoothed versions used for the actual transform so the
  // tilt feels physical, not robotic.
  const sx = useSpring(px, { stiffness: 220, damping: 22, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 220, damping: 22, mass: 0.4 });

  // Tilt ±8° on each axis at the extremes of pointer travel.
  const rotateY = useTransform(sx, [-1, 1], [-8, 8]);
  const rotateX = useTransform(sy, [-1, 1], [8, -8]);

  // Subtle image parallax — moves opposite to the tilt so it feels
  // like the photo is recessed into the card surface.
  const imgX = useTransform(sx, [-1, 1], [-10, 10]);
  const imgY = useTransform(sy, [-1, 1], [-10, 10]);

  const [finePointer, setFinePointer] = useState(false);

  function onMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // Map 0..1 → -1..1
    px.set(x * 2 - 1);
    py.set(y * 2 - 1);
  }
  function onLeave() {
    px.set(0);
    py.set(0);
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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold-500/15
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
        {/* Gradient sheen that sweeps across on hover */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-tr
                     from-transparent via-cream-100/20 to-transparent opacity-0
                     transition-opacity duration-500 group-hover:opacity-100"
        />
        {item.tag && (
          <span
            className="absolute left-3 top-3 rounded-full bg-coffee-950/80 px-3 py-1
                       text-[11px] font-semibold uppercase tracking-wide text-gold-400
                       backdrop-blur-sm"
          >
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
      </div>
    </motion.article>
  );
}
