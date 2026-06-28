import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * IntroVeil — full-screen gold gradient that washes up over the page
 * on first paint and slides off the top in 1.6s. Uses prefers-reduced-
 * motion to skip straight to the exit.
 *
 * The component renders its own cup loader centered while the veil is
 * visible, then unmounts entirely.
 */
export default function IntroVeil() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ms = reduced ? 250 : 1500;
    const t = setTimeout(() => setVisible(false), ms);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="veil"
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="intro-veil fixed inset-0 z-[200] flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          <motion.svg
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-coffee-950"
          >
            {/* Coffee cup silhouette */}
            <path
              d="M14 22h32v18a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10V22z"
              fill="currentColor"
            />
            <path
              d="M46 26h4a6 6 0 0 1 0 12h-4"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
            />
            {/* Steam wisps */}
            <motion.path
              d="M22 14c2 2 2 4 0 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M30 12c2 2 2 4 0 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />
            <motion.path
              d="M38 14c2 2 2 4 0 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ y: [0, -4, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            />
          </motion.svg>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 font-display text-sm uppercase tracking-[0.4em] text-coffee-950/80"
          >
            Brewing
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}