import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/**
 * Decorative editorial chapter number — rendered as a giant
 * outlined "01" or a thin label "01 — STORY" in the background of
 * a section. Animates in once on scroll-into-view.
 *
 * @param {string} number   e.g. "01"
 * @param {string} label    e.g. "STORY" — optional, shown in small caps
 * @param {"left"|"right"} side  which edge the folio anchors to
 * @param {string} className  additional positioning classes
 */
export default function SectionFolio({ number, label, side = "right", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const sideClasses =
    side === "right"
      ? "right-4 sm:right-8 md:right-12 text-right items-end"
      : "left-4 sm:left-8 md:left-12 text-left items-start";

  return (
    <motion.aside
      ref={ref}
      aria-hidden="true"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none absolute top-10 z-0 flex flex-col ${sideClasses} ${className}`}
    >
      <span
        className="font-display text-[5rem] font-bold leading-none
                   text-coffee-100/[0.04] sm:text-[7rem] md:text-[9rem] lg:text-[11rem]"
        style={{ WebkitTextStroke: "1px rgba(212, 175, 122, 0.15)" }}
      >
        {number}
      </span>
      {label && (
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-500/30 sm:text-xs">
          — {label}
        </span>
      )}
    </motion.aside>
  );
}