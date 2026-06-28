import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * CursorFollower — premium two-layer custom cursor that morphs its
 * shape based on what the user is hovering:
 *
 *   • default    → small gold ring + center dot
 *   • data-cursor="hover"  → ring scales up, dot disappears
 *   • data-cursor="view"   → ring contracts, dot becomes an eye glyph
 *   • data-cursor="drag"   → ring stretches wider, dot becomes a small bar
 *
 * Hidden on touch via `(pointer: fine)` — touch has no hover state.
 *
 * Compositor-friendly — uses `transform` only, no top/left, so the
 * cursor stays buttery even on lower-end devices.
 */
export default function CursorFollower() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("default");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const ringX = useSpring(x, { damping: 22, stiffness: 250, mass: 0.5 });
  const ringY = useSpring(y, { damping: 22, stiffness: 250, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia && window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);

    const style = document.createElement("style");
    style.textContent = `
      @media (pointer: fine) {
        a, button, [role="button"], [data-cursor="hover"],
        [data-cursor="view"], [data-cursor="drag"] {
          cursor: none;
        }
      }
    `;
    document.head.appendChild(style);

    function onMove(e) {
      x.set(e.clientX);
      y.set(e.clientY);

      const t = e.target;
      // Walk up the tree until we find a data-cursor attribute; if none,
      // check whether the immediate target is just a normal interactive.
      let n = t;
      let detected = "default";
      while (n && n !== document.body) {
        if (n.dataset && n.dataset.cursor) {
          detected = n.dataset.cursor;
          break;
        }
        if (n.tagName === "A" || n.tagName === "BUTTON" || n.getAttribute("role") === "button") {
          detected = "hover";
          break;
        }
        n = n.parentElement;
      }
      setMode(detected);
    }

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.head.removeChild(style);
    };
  }, [x, y]);

  if (!enabled) return null;

  // Per-mode transform/animation tweaks
  const ringAnim =
    mode === "view"
      ? { scaleX: 1.6, scaleY: 0.6 }
      : mode === "drag"
      ? { scaleX: 0.6, scaleY: 1.6 }
      : { scale: mode === "hover" ? 1.8 : 1 };
  const ringOpacity =
    mode === "view" || mode === "drag" ? 0.85 : mode === "hover" ? 0.7 : 0.9;

  // Inner glyph — eye, drag-line, or dot
  let inner;
  if (mode === "view") {
    inner = (
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gold-300">
        ●
      </span>
    );
  } else if (mode === "drag") {
    inner = (
      <span className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 bg-gold-300" />
    );
  }

  return (
    <>
      {/* Outer ring — trails the cursor and morphs per mode */}
      <motion.div
        aria-hidden="true"
        style={{
          translateX: ringX,
          translateY: ringY,
        }}
        animate={ringAnim}
        transition={{ type: "spring", damping: 20, stiffness: 250 }}
        className="pointer-events-none fixed left-0 top-0 z-[70] flex h-10 w-10
                   -translate-x-1/2 -translate-y-1/2 items-center justify-center
                   rounded-full border border-gold-400/70 mix-blend-difference"
        // apply opacity via style for the bar-mode case
        data-mode={mode}
      >
        {inner}
      </motion.div>
      {/* Inner dot — disappears on hover/morph modes */}
      <motion.div
        aria-hidden="true"
        style={{ translateX: x, translateY: y }}
        animate={{
          scale: mode === "default" ? 1 : 0,
          opacity: mode === "default" ? 1 : 0,
        }}
        transition={{ duration: 0.18 }}
        className="pointer-events-none fixed left-0 top-0 z-[70] h-2 w-2
                   -translate-x-1/2 -translate-y-1/2 rounded-full
                   bg-gold-400 mix-blend-difference"
      />
      <style>{`
        [data-mode="hover"] { opacity: 0.7; }
      `}</style>
    </>
  );
}