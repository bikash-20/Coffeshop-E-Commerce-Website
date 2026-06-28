import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * Magnetic — wraps a child and pulls it up to `strength` (default 8px)
 * toward the cursor while hovered. Pure pointer math, no extra DOM.
 *
 * Disabled on coarse pointers so touch users get the normal
 * tap-and-go. The child must forward refs.
 */
export default function Magnetic({ children, strength = 8, className = "" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const sx = useSpring(x, { stiffness: 250, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 22, mass: 0.4 });

  function onMove(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    // Normalize to a fraction of half-width and scale to strength.
    x.set((px / (rect.width / 2)) * strength);
    y.set((py / (rect.height / 2)) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}