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
  const inView = useInView(ref, { once: true, amount: 0.2 });

  // Anchor the folio outside the content's max-w-6xl container so it
  // never overlaps the heading copy. Vertically center it on the
  // section so it acts as a background watermark rather than
  // competing with the heading for the same vertical band.
  // - Desktop: pinned to viewport edge with a safe gutter.
  // - Mobile:  centered behind the heading (no room at edges) and
  //            pushed below it so it reads as part of the section
  //            chrome rather than colliding with the title.
  const sideClasses =
    side === "right"
      ? "right-[max(1rem,calc(50vw-43rem))] sm:right-[max(1.5rem,calc(50vw-40rem))] text-right items-end"
      : "left-[max(1rem,calc(50vw-43rem))] sm:left-[max(1.5rem,calc(50vw-40rem))] text-left items-start";

  return (
    <motion.aside
      ref={ref}
      aria-hidden="true"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      // Top is roughly aligned with the heading band so the folio
      // reads as a chapter number for THIS section (not a watermark
      // of the next one). It's vertically thin (no flex-1) so it
      // doesn't take over the whole section.
      className={`pointer-events-none absolute top-16 z-0 hidden flex-col
                  sm:flex ${sideClasses} ${className}`}
    >
      <span
        // Smaller + lighter stroke than before — used to be 11rem with
        // 0.15 alpha stroke which was loud enough to compete with the
        // heading. Now ~8rem and 0.08 alpha so it reads as a watermark.
        className="font-display text-[4rem] font-bold leading-none
                   text-coffee-100/[0.02] sm:text-[6rem] md:text-[8rem]"
        style={{ WebkitTextStroke: "1px rgba(212, 175, 122, 0.08)" }}
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