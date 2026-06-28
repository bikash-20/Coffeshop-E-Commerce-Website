import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CursorFollower — subtle two-layer custom cursor (gold ring + dot)
 * that snaps to interactive elements. The ring lags slightly behind
 * the dot via a spring, which gives the satisfying "drag" feel seen
 * on premium creator sites.
 *
 * Hidden on touch devices via `(pointer: coarse)` — touch has no
 * hover state and showing a fixed-position dot would be confusing.
 *
 * Implementation notes:
 *   - `motion.div` with `transform` only (no top/left) for compositor
 *     fast-path — the cursor stays buttery even on lower-end devices.
 *   - We use `pointermove` instead of `mousemove` so it also fires
 *     on pen/stylus input.
 *   - `data-cursor="hover"` on any element makes the ring expand.
 */
export default function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  // Slight lag on the ring vs. the dot — premium "trailing" feel.
  const ringX = useSpring(x, { damping: 22, stiffness: 250, mass: 0.5 });
  const ringY = useSpring(y, { damping: 22, stiffness: 250, mass: 0.5 });

  useEffect(() => {
    // Detect fine pointer (mouse/trackpad) and bail on touch devices.
    const fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    // Hide the native cursor over our interactive zones so the
    // follower is the only thing the user sees.
    const style = document.createElement("style");
    style.textContent = `
      @media (pointer: fine) {
        a, button, [role="button"], [data-cursor="hover"] {
          cursor: none;
        }
      }
    `;
    document.head.appendChild(style);

    function onMove(e) {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target;
      const isInteractive =
        target.closest("a, button, [role='button'], [data-cursor='hover']") ||
        target.tagName === "A" ||
        target.tagName === "BUTTON";
      setHovering(Boolean(isInteractive));
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.head.removeChild(style);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer ring — trails the cursor */}
      <motion.div
        aria-hidden="true"
        style={{
          translateX: ringX,
          translateY: ringY,
        }}
        animate={{
          scale: hovering ? 1.8 : 1,
          opacity: hovering ? 0.6 : 0.9,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 250 }}
        className="pointer-events-none fixed left-0 top-0 z-[70] h-10 w-10
                   -translate-x-1/2 -translate-y-1/2 rounded-full
                   border border-gold-400/70 mix-blend-difference"
      />
      {/* Inner dot — follows the cursor exactly */}
      <motion.div
        aria-hidden="true"
        style={{ translateX: x, translateY: y }}
        animate={{
          scale: hovering ? 0 : 1,
        }}
        transition={{ duration: 0.18 }}
        className="pointer-events-none fixed left-0 top-0 z-[70] h-2 w-2
                   -translate-x-1/2 -translate-y-1/2 rounded-full
                   bg-gold-400 mix-blend-difference"
      />
    </>
  );
}