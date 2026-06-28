import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Top-of-page scroll progress indicator.
 *
 * Implementation notes:
 *   - `useScroll()` returns a continuous 0..1 progress value (no `target`
 *     needed — the default tracks the whole document).
 *   - `useSpring` smooths that raw value so the bar doesn't jitter when
 *     the OS reports fractional scroll deltas (a real issue on
 *     high-DPI laptops with trackpad inertia).
 *   - Fixed to the very top, sits *above* the navbar (z-60 > navbar's
 *     z-50) so it never gets hidden.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left
                 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400
                 shadow-[0_0_10px_rgba(212,175,122,0.7)]"
      aria-hidden="true"
    />
  );
}