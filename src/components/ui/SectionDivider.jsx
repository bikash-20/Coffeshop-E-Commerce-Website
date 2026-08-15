import { motion } from "framer-motion";

/**
 * SectionDivider — a thin gold gradient line that scales in from
 * the center when it enters the viewport. Used between major
 * sections to add visual rhythm and motion continuity.
 *
 * Sits outside the section's overflow-hidden so it's visible
 * during the transition.
 */
export default function SectionDivider({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center py-1 ${className}`}
    >
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-full max-w-4xl origin-center bg-gradient-to-r from-transparent via-gold-500/30 to-transparent"
      />
      {/* Center diamond accent */}
      <motion.span
        initial={{ scale: 0, rotate: 45 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute h-1.5 w-1.5 bg-gold-500 shadow-[0_0_8px_rgba(212,175,122,0.5)]"
      />
    </div>
  );
}
