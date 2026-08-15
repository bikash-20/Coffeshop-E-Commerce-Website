import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PageTransition — intercepts clicks on internal anchor links
 * (#story, #menu, #gallery, #contact) and plays a quick gold
 * curtain transition:
 *
 *   1. Gold gradient slides down from the top (250ms)
 *   2. Lenis scrolls to the target section
 *   3. Gold gradient slides up and fades out (350ms)
 *
 * The whole sequence is ~600ms — fast enough to feel snappy but
 * slow enough to register as a deliberate transition.
 *
 * Respects prefers-reduced-motion (skips the overlay, just scrolls).
 * Works alongside Lenis smooth scroll.
 */

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Only intercept these section anchors
const SECTION_IDS = ["story", "menu", "gallery", "contact", "top"];

export default function PageTransition() {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Skip entirely for reduced-motion users
    if (REDUCED_MOTION) return;

    function onClick(e) {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const id = href.replace("#", "");

      // Only intercept section anchors we care about
      if (!SECTION_IDS.includes(id)) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      clearTimer();

      // Show the curtain
      setActive(true);

      // After curtain covers the viewport, scroll + dismiss
      timeoutRef.current = setTimeout(() => {
        // Use Lenis scrollTo if available, otherwise native
        if (window.__lenis) {
          window.__lenis.scrollTo(target, { offset: -64, immediate: false });
        } else {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Dismiss the curtain after a short settle
        timeoutRef.current = setTimeout(() => {
          setActive(false);
          // Close mobile nav if open
          anchor.click(); // let the default behavior finish
        }, 350);
      }, 250);
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      clearTimer();
    };
  }, [clearTimer]);

  // Don't render anything for reduced-motion
  if (REDUCED_MOTION) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="page-transition"
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{
            duration: 0.3,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="pointer-events-none fixed inset-0 z-[150]"
          aria-hidden="true"
        >
          {/* Gold gradient curtain */}
          <div className="h-full w-full bg-gradient-to-b from-gold-600 via-gold-500 to-coffee-900" />

          {/* Centered loading indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Spinning coffee cup icon */}
              <motion.svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-coffee-950"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              >
                <path d="M17 8h1a3 3 0 0 1 0 6h-1" />
                <path d="M3 8h14v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
                <path d="M7 4v2M11 4v2M15 4v2" />
              </motion.svg>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-coffee-950/70">
                Navigating
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
